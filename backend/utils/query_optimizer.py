"""
Query optimization utilities for database performance monitoring and optimization.
"""

import functools
import time
from contextlib import contextmanager
from typing import Any, Callable, Dict, List, Optional, TypeVar

from sqlmodel import Session, func, select, text

from backend.utils.logger import logger

F = TypeVar("F", bound=Callable[..., Any])


class QueryPerformanceMonitor:
    """Monitor and log database query performance."""

    def __init__(self, slow_query_threshold: float = 1.0):
        """
        Initialize performance monitor.

        Args:
            slow_query_threshold: Threshold in seconds for slow query logging
        """
        self.slow_query_threshold = slow_query_threshold
        self.query_stats: Dict[str, List[float]] = {}

    @contextmanager
    def monitor_query(self, query_name: str):
        """Context manager to monitor query execution time."""
        start_time = time.time()
        try:
            yield
        finally:
            execution_time = time.time() - start_time
            self._record_query_time(query_name, execution_time)

            if execution_time > self.slow_query_threshold:
                logger.warning(
                    f"Slow query detected: {query_name} took {execution_time:.3f}s"
                )

    def _record_query_time(self, query_name: str, execution_time: float):
        """Record query execution time."""
        if query_name not in self.query_stats:
            self.query_stats[query_name] = []

        self.query_stats[query_name].append(execution_time)

        # Keep only last 100 executions to avoid memory bloat
        if len(self.query_stats[query_name]) > 100:
            self.query_stats[query_name] = self.query_stats[query_name][-100:]

    def get_query_stats(self, query_name: str) -> Optional[Dict[str, float]]:
        """Get statistics for a specific query."""
        if query_name not in self.query_stats:
            return None

        times = self.query_stats[query_name]
        return {
            "count": len(times),
            "min_time": min(times),
            "max_time": max(times),
            "avg_time": sum(times) / len(times),
            "total_time": sum(times),
        }

    def get_all_stats(self) -> Dict[str, Dict[str, float]]:
        """Get statistics for all monitored queries."""
        return {
            query_name: self.get_query_stats(query_name)
            for query_name in self.query_stats.keys()
        }


# Global performance monitor instance
performance_monitor = QueryPerformanceMonitor()


def monitor_query_performance(query_name: str):
    """Decorator to monitor query performance."""

    def decorator(func: F) -> F:
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            with performance_monitor.monitor_query(query_name):
                return func(*args, **kwargs)

        return wrapper

    return decorator


class QueryOptimizer:
    """Query optimization utilities and helpers."""

    @staticmethod
    def analyze_query_plan(db: Session, query: str) -> Dict[str, Any]:
        """
        Analyze query execution plan.

        Args:
            db: Database session
            query: SQL query string

        Returns:
            Query execution plan information
        """
        try:
            # Get query execution plan
            explain_query = f"EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) {query}"
            result = db.exec(text(explain_query)).first()

            if result:
                plan = result[0] if isinstance(result, tuple) else result
                return {
                    "plan": plan,
                    "total_cost": plan[0]["Plan"]["Total Cost"] if plan else None,
                    "execution_time": plan[0]["Execution Time"] if plan else None,
                }
        except Exception as e:
            logger.error(f"Failed to analyze query plan: {e}")
            return {"error": str(e)}

        return {}

    @staticmethod
    def check_table_stats(db: Session, table_name: str) -> Dict[str, Any]:
        """
        Check table statistics for optimization insights.

        Args:
            db: Database session
            table_name: Name of the table to check

        Returns:
            Table statistics
        """
        try:
            # Get table size and row count
            stats_query = text(
                """
                SELECT
                    schemaname,
                    tablename,
                    attname as column_name,
                    n_distinct,
                    correlation
                FROM pg_stats
                WHERE tablename = :table_name
            """
            )

            size_query = text(
                """
                SELECT
                    pg_size_pretty(pg_total_relation_size(:table_name)) as total_size,
                    pg_size_pretty(pg_relation_size(:table_name)) as table_size,
                    (SELECT count(*) FROM """
                + table_name
                + """) as row_count
            """
            )

            stats_result = db.exec(stats_query, {"table_name": table_name}).all()
            size_result = db.exec(size_query, {"table_name": table_name}).first()

            return {
                "table_name": table_name,
                "size_info": dict(size_result._mapping) if size_result else {},
                "column_stats": [dict(row._mapping) for row in stats_result],
            }

        except Exception as e:
            logger.error(f"Failed to get table stats for {table_name}: {e}")
            return {"error": str(e)}

    @staticmethod
    def suggest_indexes(db: Session, table_name: str) -> List[str]:
        """
        Suggest missing indexes based on query patterns.

        Args:
            db: Database session
            table_name: Name of the table to analyze

        Returns:
            List of suggested index creation statements
        """
        try:
            # Query to find missing indexes based on pg_stat_user_tables
            missing_indexes_query = text(
                """
                SELECT
                    schemaname,
                    tablename,
                    attname,
                    n_distinct,
                    correlation,
                    most_common_vals,
                    most_common_freqs
                FROM pg_stats
                WHERE tablename = :table_name
                    AND n_distinct > 10  -- Columns with good selectivity
                    AND correlation < 0.1  -- Low correlation indicates good index candidate
            """
            )

            result = db.exec(missing_indexes_query, {"table_name": table_name}).all()

            suggestions = []
            for row in result:
                column_name = row.attname
                suggestions.append(
                    f"CREATE INDEX idx_{table_name}_{column_name} ON {table_name} ({column_name});"
                )

            return suggestions

        except Exception as e:
            logger.error(f"Failed to suggest indexes for {table_name}: {e}")
            return []

    @staticmethod
    def check_index_usage(db: Session) -> List[Dict[str, Any]]:
        """
        Check index usage statistics.

        Returns:
            List of index usage information
        """
        try:
            index_usage_query = text(
                """
                SELECT
                    schemaname,
                    tablename,
                    indexname,
                    idx_tup_read,
                    idx_tup_fetch,
                    idx_scan,
                    idx_tup_read::float / GREATEST(idx_scan, 1) as avg_tuples_per_scan
                FROM pg_stat_user_indexes
                ORDER BY idx_scan DESC, idx_tup_read DESC
            """
            )

            result = db.exec(index_usage_query).all()
            return [dict(row._mapping) for row in result]

        except Exception as e:
            logger.error(f"Failed to check index usage: {e}")
            return []

    @staticmethod
    def get_slow_queries(db: Session, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Get slow queries from pg_stat_statements if available.

        Args:
            db: Database session
            limit: Number of slow queries to return

        Returns:
            List of slow query information
        """
        try:
            # Check if pg_stat_statements extension is available
            extension_check = text(
                """
                SELECT EXISTS(
                    SELECT 1 FROM pg_extension WHERE extname = 'pg_stat_statements'
                ) as has_extension
            """
            )

            has_extension = db.exec(extension_check).first()

            if not has_extension or not has_extension.has_extension:
                logger.warning("pg_stat_statements extension not available")
                return []

            slow_queries_query = text(
                """
                SELECT
                    query,
                    calls,
                    total_exec_time,
                    mean_exec_time,
                    max_exec_time,
                    rows,
                    shared_blks_hit,
                    shared_blks_read
                FROM pg_stat_statements
                ORDER BY mean_exec_time DESC
                LIMIT :limit
            """
            )

            result = db.exec(slow_queries_query, {"limit": limit}).all()
            return [dict(row._mapping) for row in result]

        except Exception as e:
            logger.error(f"Failed to get slow queries: {e}")
            return []


class BatchQueryOptimizer:
    """Optimize batch operations and bulk inserts."""

    @staticmethod
    def bulk_insert_with_conflict_handling(
        db: Session,
        table_name: str,
        data: List[Dict[str, Any]],
        conflict_columns: List[str],
        update_columns: Optional[List[str]] = None,
    ):
        """
        Perform bulk insert with conflict resolution.

        Args:
            db: Database session
            table_name: Target table name
            data: List of dictionaries containing row data
            conflict_columns: Columns to check for conflicts
            update_columns: Columns to update on conflict (if None, ignore conflicts)
        """
        if not data:
            return

        # Build column list
        columns = list(data[0].keys())
        column_list = ", ".join(columns)
        value_placeholders = ", ".join([f":{col}" for col in columns])

        # Build conflict resolution clause
        conflict_clause = f"ON CONFLICT ({', '.join(conflict_columns)})"
        if update_columns:
            update_clause = ", ".join(
                [f"{col} = EXCLUDED.{col}" for col in update_columns]
            )
            conflict_clause += f" DO UPDATE SET {update_clause}"
        else:
            conflict_clause += " DO NOTHING"

        # Build final query
        query = text(
            f"""
            INSERT INTO {table_name} ({column_list})
            VALUES ({value_placeholders})
            {conflict_clause}
        """
        )

        # Execute batch insert
        try:
            db.execute(query, data)
            db.commit()
            logger.info(f"Bulk inserted {len(data)} rows into {table_name}")
        except Exception as e:
            db.rollback()
            logger.error(f"Bulk insert failed for {table_name}: {e}")
            raise

    @staticmethod
    def paginated_query_processor(
        db: Session,
        base_query,
        batch_size: int = 1000,
        processor_func: Optional[Callable] = None,
    ):
        """
        Process large result sets in batches to avoid memory issues.

        Args:
            db: Database session
            base_query: Base SQLModel query
            batch_size: Number of records to process at once
            processor_func: Function to process each batch
        """
        offset = 0
        total_processed = 0

        while True:
            # Get batch
            batch_query = base_query.offset(offset).limit(batch_size)
            batch_results = db.exec(batch_query).all()

            if not batch_results:
                break

            # Process batch
            if processor_func:
                processor_func(batch_results)

            total_processed += len(batch_results)
            offset += batch_size

            logger.info(f"Processed {total_processed} records so far...")

            # If we got fewer results than batch_size, we're done
            if len(batch_results) < batch_size:
                break

        logger.info(f"Finished processing {total_processed} total records")
        return total_processed


# Convenience functions for common optimizations
def get_performance_stats() -> Dict[str, Any]:
    """Get current performance monitoring statistics."""
    return {
        "query_stats": performance_monitor.get_all_stats(),
        "slow_query_threshold": performance_monitor.slow_query_threshold,
    }


def reset_performance_stats():
    """Reset performance monitoring statistics."""
    performance_monitor.query_stats.clear()
    logger.info("Performance stats reset")


# Query optimization decorators for service methods
def optimize_events_query(func: F) -> F:
    """Decorator specifically for optimizing events-related queries."""
    return monitor_query_performance(f"events_{func.__name__}")(func)


def optimize_user_query(func: F) -> F:
    """Decorator specifically for optimizing user-related queries."""
    return monitor_query_performance(f"users_{func.__name__}")(func)


def optimize_notification_query(func: F) -> F:
    """Decorator specifically for optimizing notification-related queries."""
    return monitor_query_performance(f"notifications_{func.__name__}")(func)
