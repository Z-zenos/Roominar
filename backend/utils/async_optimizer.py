"""
Async Query Optimization and Connection Pooling for Roominar API

This module provides advanced async query optimization, batch processing,
and connection pooling management for improved API performance.
"""

import asyncio
import time
from concurrent.futures import ThreadPoolExecutor
from contextlib import asynccontextmanager
from functools import wraps
from typing import Any, Callable, Dict, List, TypeVar

from sqlalchemy import text
from sqlalchemy.orm import joinedload, selectinload
from sqlalchemy.pool import QueuePool
from sqlmodel import Session, select

from backend.core.config import settings
from backend.db.database import get_master_db, get_read_db, master_engine, read_engine
from backend.utils.logger import logger

T = TypeVar("T")


class AsyncQueryOptimizer:
    """Advanced async query optimizer with connection pooling and batch processing"""

    def __init__(self):
        self.executor = ThreadPoolExecutor(
            max_workers=settings.ASYNC_WORKER_COUNT, thread_name_prefix="async_query_"
        )
        self.batch_cache: Dict[str, List] = {}
        self.stats = {
            "queries_executed": 0,
            "batch_queries": 0,
            "cache_hits": 0,
            "optimization_time_saved": 0.0,
        }

    async def execute_async_query(
        self,
        query_func: Callable[[Session], T],
        use_read_db: bool = True,
        timeout: int = settings.API_RESPONSE_TIMEOUT,
    ) -> T:
        """
        Execute a database query asynchronously

        Args:
            query_func: Function that takes a Session and returns query result
            use_read_db: Whether to use read replica (True) or master DB (False)
            timeout: Query timeout in seconds

        Returns:
            Query result
        """
        start_time = time.time()

        def _execute_query():
            db_generator = get_read_db() if use_read_db else get_master_db()
            db = next(db_generator)
            try:
                result = query_func(db)
                self.stats["queries_executed"] += 1
                return result
            finally:
                db_generator.close()

        try:
            # Execute query in thread pool
            result = await asyncio.wait_for(
                asyncio.get_event_loop().run_in_executor(self.executor, _execute_query),
                timeout=timeout,
            )

            execution_time = time.time() - start_time
            logger.debug(f"Async query executed in {execution_time:.3f}s")

            return result

        except asyncio.TimeoutError:
            logger.error(f"Query timeout after {timeout}s")
            raise
        except Exception as e:
            logger.error(f"Async query error: {e}")
            raise

    async def execute_batch_queries(
        self,
        query_batch: List[Callable[[Session], Any]],
        use_read_db: bool = True,
        max_concurrent: int = None,
    ) -> List[Any]:
        """
        Execute multiple queries concurrently with connection pooling

        Args:
            query_batch: List of query functions
            use_read_db: Whether to use read replica
            max_concurrent: Maximum concurrent queries (defaults to worker count)

        Returns:
            List of query results in the same order
        """
        if not query_batch:
            return []

        max_concurrent = max_concurrent or settings.ASYNC_WORKER_COUNT
        start_time = time.time()

        # Create semaphore to limit concurrent connections
        semaphore = asyncio.Semaphore(max_concurrent)

        async def _execute_with_semaphore(query_func):
            async with semaphore:
                return await self.execute_async_query(query_func, use_read_db)

        # Execute all queries concurrently
        tasks = [_execute_with_semaphore(query_func) for query_func in query_batch]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        # Handle any exceptions
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                logger.error(f"Batch query {i} failed: {result}")
                results[i] = None

        execution_time = time.time() - start_time
        self.stats["batch_queries"] += len(query_batch)

        logger.info(f"Executed {len(query_batch)} queries in {execution_time:.3f}s")

        return results

    async def optimize_with_prefetch(
        self,
        primary_query: Callable[[Session], List[Any]],
        related_queries: Dict[str, Callable[[Any], Callable[[Session], Any]]],
        use_read_db: bool = True,
    ) -> Dict[str, Any]:
        """
        Optimize queries with intelligent prefetching of related data

        Args:
            primary_query: Main query function
            related_queries: Dict of related query generators keyed by name
            use_read_db: Whether to use read replica

        Returns:
            Dict with primary results and related data
        """
        start_time = time.time()

        # Execute primary query first
        primary_results = await self.execute_async_query(primary_query, use_read_db)

        if not primary_results:
            return {"primary": primary_results, "related": {}}

        # Generate related queries based on primary results
        related_query_batch = []
        related_keys = []

        for key, query_generator in related_queries.items():
            for item in primary_results:
                try:
                    related_query = query_generator(item)
                    related_query_batch.append(related_query)
                    related_keys.append(
                        f"{key}_{getattr(item, 'id', len(related_keys))}"
                    )
                except Exception as e:
                    logger.error(f"Error generating related query for {key}: {e}")

        # Execute related queries concurrently
        if related_query_batch:
            related_results = await self.execute_batch_queries(
                related_query_batch, use_read_db
            )

            # Organize results by key
            related_data = {}
            for i, key in enumerate(related_keys):
                base_key = key.split("_")[0]
                if base_key not in related_data:
                    related_data[base_key] = []
                related_data[base_key].append(related_results[i])
        else:
            related_data = {}

        execution_time = time.time() - start_time
        self.stats["optimization_time_saved"] += max(
            0, len(related_queries) * 0.1 - execution_time
        )

        logger.debug(f"Optimized query with prefetch in {execution_time:.3f}s")

        return {"primary": primary_results, "related": related_data}

    async def execute_paginated_query(
        self,
        base_query_func: Callable[[Session, int, int], List[Any]],
        count_query_func: Callable[[Session], int],
        page: int = 1,
        per_page: int = 20,
        use_read_db: bool = True,
    ) -> Dict[str, Any]:
        """
        Execute paginated queries efficiently with concurrent count

        Args:
            base_query_func: Function that takes (session, offset, limit) and returns results
            count_query_func: Function that returns total count
            page: Page number (1-based)
            per_page: Items per page
            use_read_db: Whether to use read replica

        Returns:
            Dict with data, total count, and pagination info
        """
        offset = (page - 1) * per_page

        # Execute data query and count query concurrently
        data_query = lambda db: base_query_func(db, offset, per_page)
        count_query = count_query_func

        results = await self.execute_batch_queries(
            [data_query, count_query], use_read_db
        )

        data, total = results[0], results[1]

        return {
            "data": data or [],
            "total": total or 0,
            "page": page,
            "per_page": per_page,
            "pages": (total + per_page - 1) // per_page if total else 0,
        }

    def get_stats(self) -> Dict[str, Any]:
        """Get async query optimization statistics"""
        return {
            "queries_executed": self.stats["queries_executed"],
            "batch_queries": self.stats["batch_queries"],
            "cache_hits": self.stats["cache_hits"],
            "optimization_time_saved": f"{self.stats['optimization_time_saved']:.3f}s",
            "active_workers": self.executor._threads,
            "pending_tasks": (
                self.executor._work_queue.qsize()
                if hasattr(self.executor._work_queue, "qsize")
                else 0
            ),
        }


class ConnectionPoolManager:
    """Advanced connection pool manager with monitoring and optimization"""

    def __init__(self):
        self.pool_stats = {
            "master_pool": {},
            "read_pool": {},
            "connections_created": 0,
            "connections_closed": 0,
            "pool_overflows": 0,
        }

    def get_pool_status(self, engine_name: str = "all") -> Dict[str, Any]:
        """Get detailed connection pool status"""
        pool_info = {}

        engines = {"master": master_engine, "read": read_engine}

        if engine_name != "all":
            engines = {engine_name: engines.get(engine_name)}

        for name, engine in engines.items():
            if engine and hasattr(engine.pool, "status"):
                pool = engine.pool
                pool_info[name] = {
                    "size": pool.size(),
                    "checked_in": pool.checkedin(),
                    "checked_out": pool.checkedout(),
                    "overflow": pool.overflow(),
                    "total_connections": pool.size() + pool.overflow(),
                    "utilization": (
                        f"{(pool.checkedout() / (pool.size() + pool.overflow()) * 100):.1f}%"
                        if (pool.size() + pool.overflow()) > 0
                        else "0%"
                    ),
                }

        return pool_info

    def optimize_pool_size(self, target_utilization: float = 0.7) -> Dict[str, str]:
        """Optimize pool sizes based on utilization metrics"""
        recommendations = {}
        pool_status = self.get_pool_status()

        for pool_name, stats in pool_status.items():
            current_utilization = float(stats["utilization"].rstrip("%")) / 100

            if current_utilization > target_utilization * 1.2:
                recommendations[
                    pool_name
                ] = "Consider increasing pool size - high utilization"
            elif current_utilization < target_utilization * 0.5:
                recommendations[
                    pool_name
                ] = "Consider decreasing pool size - low utilization"
            else:
                recommendations[pool_name] = "Pool size is optimal"

        return recommendations

    @asynccontextmanager
    async def get_optimized_connection(self, use_read_db: bool = True):
        """Get an optimized database connection with automatic cleanup"""
        db_generator = get_read_db() if use_read_db else get_master_db()
        db = next(db_generator)

        try:
            # Set optimized connection parameters
            db.execute(text("SET statement_timeout = '30s'"))
            db.execute(text("SET lock_timeout = '10s'"))

            yield db

        except Exception as e:
            logger.error(f"Connection error: {e}")
            db.rollback()
            raise
        finally:
            db.close()


# Global instances
async_optimizer = AsyncQueryOptimizer()
pool_manager = ConnectionPoolManager()


def async_query(use_read_db: bool = True, timeout: int = None, cache_key: str = None):
    """
    Decorator for async query execution with optional caching

    Args:
        use_read_db: Whether to use read replica
        timeout: Query timeout in seconds
        cache_key: Optional cache key for result caching
    """

    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Create query function
            def query_func(db: Session):
                return func(db, *args, **kwargs)

            # Execute async query
            return await async_optimizer.execute_async_query(
                query_func, use_read_db, timeout or settings.API_RESPONSE_TIMEOUT
            )

        return wrapper

    return decorator


def batch_query(batch_size: int = None, use_read_db: bool = True):
    """
    Decorator for batch query execution

    Args:
        batch_size: Maximum batch size
        use_read_db: Whether to use read replica
    """

    def decorator(func):
        @wraps(func)
        async def wrapper(query_list: List[Any], *args, **kwargs):
            batch_size_limit = batch_size or settings.QUERY_BATCH_SIZE

            # Split into batches if needed
            batches = [
                query_list[i : i + batch_size_limit]
                for i in range(0, len(query_list), batch_size_limit)
            ]

            all_results = []
            for batch in batches:
                # Create query functions for this batch
                query_batch = [
                    lambda db, item=item: func(db, item, *args, **kwargs)
                    for item in batch
                ]

                # Execute batch
                batch_results = await async_optimizer.execute_batch_queries(
                    query_batch, use_read_db
                )
                all_results.extend(batch_results)

            return all_results

        return wrapper

    return decorator


async def optimize_query_joins(query, relationships: List[str]):
    """
    Optimize query with eager loading of specified relationships

    Args:
        query: SQLAlchemy query object
        relationships: List of relationship names to eager load

    Returns:
        Optimized query with joins
    """
    for relationship in relationships:
        if hasattr(query.column_descriptions[0]["type"], relationship):
            query = query.options(
                selectinload(
                    getattr(query.column_descriptions[0]["type"], relationship)
                )
            )

    return query


async def batch_process_with_optimization(
    items: List[Any],
    processor_func: Callable[[Any], Any],
    batch_size: int = None,
    max_concurrent: int = None,
) -> List[Any]:
    """
    Process items in optimized batches with concurrency control

    Args:
        items: List of items to process
        processor_func: Function to process each item
        batch_size: Size of each batch
        max_concurrent: Maximum concurrent batches

    Returns:
        List of processed results
    """
    if not items:
        return []

    batch_size = batch_size or settings.REQUEST_BATCH_SIZE
    max_concurrent = max_concurrent or settings.ASYNC_WORKER_COUNT

    # Split into batches
    batches = [items[i : i + batch_size] for i in range(0, len(items), batch_size)]

    # Process batches concurrently
    semaphore = asyncio.Semaphore(max_concurrent)

    async def process_batch(batch):
        async with semaphore:
            return [processor_func(item) for item in batch]

    batch_results = await asyncio.gather(*[process_batch(batch) for batch in batches])

    # Flatten results
    results = []
    for batch_result in batch_results:
        results.extend(batch_result)

    return results
