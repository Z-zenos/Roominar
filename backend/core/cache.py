"""
Advanced Response Caching System for Roominar API

This module provides a multi-level caching strategy with Redis backend,
supporting different cache patterns and automatic invalidation.
"""

import asyncio
import hashlib
import json
import time
from datetime import datetime, timedelta
from functools import wraps
from typing import Any, Callable, Dict, List, Optional, Union

import redis.asyncio as aioredis
from fastapi import Request, Response
from fastapi.responses import JSONResponse

from backend.core.config import settings
from backend.core.redis_client import redis_client
from backend.utils.logger import logger


class CacheStrategy:
    """Cache strategy definitions for different types of data"""

    # Event-related caching
    EVENTS_LIST = "events:list"
    EVENTS_DETAIL = "events:detail"
    EVENTS_TRENDING = "events:trending"
    EVENTS_RECOMMENDATIONS = "events:recommendations"

    # User-related caching
    USER_PROFILE = "user:profile"
    USER_EVENTS = "user:events"
    USER_BOOKMARKS = "user:bookmarks"

    # Organization-related caching
    ORG_PROFILE = "org:profile"
    ORG_EVENTS = "org:events"
    ORG_ANALYTICS = "org:analytics"

    # Static data caching
    TAGS = "static:tags"
    SPEAKERS = "static:speakers"
    LOCATIONS = "static:locations"

    # API response caching
    API_SEARCH = "api:search"
    API_LISTING = "api:listing"


class CacheConfig:
    """Cache configuration for different strategies"""

    STRATEGIES = {
        CacheStrategy.EVENTS_LIST: {
            "ttl": settings.REDIS_CACHE_TTL_EVENTS,
            "tags": ["events"],
            "invalidate_on": ["event_create", "event_update", "event_delete"],
        },
        CacheStrategy.EVENTS_DETAIL: {
            "ttl": settings.REDIS_CACHE_TTL_EVENTS,
            "tags": ["events", "event_detail"],
            "invalidate_on": ["event_update", "event_delete", "ticket_update"],
        },
        CacheStrategy.EVENTS_TRENDING: {
            "ttl": settings.REDIS_CACHE_TTL_TRENDING,
            "tags": ["events", "trending"],
            "invalidate_on": ["user_action", "event_stats_update"],
        },
        CacheStrategy.USER_PROFILE: {
            "ttl": settings.REDIS_CACHE_TTL_USER_DATA,
            "tags": ["user"],
            "invalidate_on": ["user_update", "profile_update"],
        },
        CacheStrategy.TAGS: {
            "ttl": settings.REDIS_CACHE_TTL_STATIC,
            "tags": ["static", "tags"],
            "invalidate_on": ["tag_create", "tag_update", "tag_delete"],
        },
        CacheStrategy.API_SEARCH: {
            "ttl": settings.REDIS_CACHE_TTL_DEFAULT,
            "tags": ["api", "search"],
            "invalidate_on": ["event_create", "event_update", "event_delete"],
        },
    }


class AsyncCacheManager:
    """Async cache manager with Redis backend and advanced features"""

    def __init__(self):
        self.redis_client = redis_client
        self.local_cache: Dict[str, Any] = {}
        self.cache_stats = {"hits": 0, "misses": 0, "invalidations": 0, "errors": 0}

    def _generate_cache_key(
        self,
        strategy: str,
        key_parts: List[str],
        user_id: Optional[int] = None,
        additional_params: Optional[Dict[str, Any]] = None,
    ) -> str:
        """Generate a unique cache key with strategy prefix"""
        key_components = [strategy] + key_parts

        if user_id:
            key_components.append(f"user:{user_id}")

        if additional_params:
            # Sort params for consistent key generation
            sorted_params = sorted(additional_params.items())
            param_string = "&".join([f"{k}={v}" for k, v in sorted_params])
            param_hash = hashlib.md5(param_string.encode()).hexdigest()[:8]
            key_components.append(f"params:{param_hash}")

        cache_key = ":".join(key_components)
        return cache_key

    async def get(
        self,
        strategy: str,
        key_parts: List[str],
        user_id: Optional[int] = None,
        additional_params: Optional[Dict[str, Any]] = None,
    ) -> Optional[Any]:
        """Get cached data with fallback to local cache"""
        cache_key = self._generate_cache_key(
            strategy, key_parts, user_id, additional_params
        )

        try:
            # Try Redis first
            cached_data = self.redis_client.get(cache_key)
            if cached_data:
                self.cache_stats["hits"] += 1
                logger.debug(f"Cache hit for key: {cache_key}")
                return json.loads(cached_data)

            # Fallback to local cache
            if cache_key in self.local_cache:
                cache_item = self.local_cache[cache_key]
                if cache_item["expires_at"] > time.time():
                    self.cache_stats["hits"] += 1
                    logger.debug(f"Local cache hit for key: {cache_key}")
                    return cache_item["data"]
                else:
                    # Remove expired item
                    del self.local_cache[cache_key]

            self.cache_stats["misses"] += 1
            return None

        except Exception as e:
            self.cache_stats["errors"] += 1
            logger.error(f"Cache get error for key {cache_key}: {e}")
            return None

    async def set(
        self,
        strategy: str,
        key_parts: List[str],
        data: Any,
        user_id: Optional[int] = None,
        additional_params: Optional[Dict[str, Any]] = None,
        ttl: Optional[int] = None,
    ) -> bool:
        """Set cache data with automatic TTL from strategy config"""
        cache_key = self._generate_cache_key(
            strategy, key_parts, user_id, additional_params
        )

        # Get TTL from strategy config or use provided TTL
        if ttl is None:
            ttl = CacheConfig.STRATEGIES.get(strategy, {}).get(
                "ttl", settings.REDIS_CACHE_TTL_DEFAULT
            )

        try:
            # Set in Redis
            serialized_data = json.dumps(data, default=str)
            self.redis_client.setex(cache_key, ttl, serialized_data)

            # Set in local cache as backup
            self.local_cache[cache_key] = {
                "data": data,
                "expires_at": time.time() + ttl,
                "strategy": strategy,
            }

            # Add to strategy tags for invalidation
            tags = CacheConfig.STRATEGIES.get(strategy, {}).get("tags", [])
            for tag in tags:
                tag_key = f"cache_tag:{tag}"
                self.redis_client.sadd(tag_key, cache_key)
                self.redis_client.expire(
                    tag_key, ttl + 300
                )  # Tag expires slightly later

            logger.debug(f"Cache set for key: {cache_key}, TTL: {ttl}")
            return True

        except Exception as e:
            self.cache_stats["errors"] += 1
            logger.error(f"Cache set error for key {cache_key}: {e}")
            return False

    async def invalidate_by_strategy(self, strategy: str) -> int:
        """Invalidate all cache entries for a specific strategy"""
        try:
            pattern = f"{strategy}:*"
            keys = []

            # Get keys matching the pattern
            for key in self.redis_client.scan_iter(match=pattern):
                keys.append(key)

            # Delete from Redis
            if keys:
                self.redis_client.delete(*keys)

            # Delete from local cache
            local_keys_to_delete = [
                key for key in self.local_cache.keys() if key.startswith(f"{strategy}:")
            ]
            for key in local_keys_to_delete:
                del self.local_cache[key]

            invalidated_count = len(keys) + len(local_keys_to_delete)
            self.cache_stats["invalidations"] += invalidated_count

            logger.info(
                f"Invalidated {invalidated_count} cache entries for strategy: {strategy}"
            )
            return invalidated_count

        except Exception as e:
            self.cache_stats["errors"] += 1
            logger.error(f"Cache invalidation error for strategy {strategy}: {e}")
            return 0

    async def invalidate_by_tags(self, tags: List[str]) -> int:
        """Invalidate cache entries by tags"""
        total_invalidated = 0

                 try:
             for tag in tags:
                 tag_key = f"cache_tag:{tag}"
                 cache_keys = list(self.redis_client.smembers(tag_key))

                 if cache_keys:
                     # Delete cache entries
                     self.redis_client.delete(*cache_keys)

                     # Delete from local cache
                     for cache_key in cache_keys:
                         if cache_key in self.local_cache:
                             del self.local_cache[cache_key]

                     # Clean up tag
                     self.redis_client.delete(tag_key)

                     total_invalidated += len(cache_keys)

            self.cache_stats["invalidations"] += total_invalidated
            logger.info(
                f"Invalidated {total_invalidated} cache entries by tags: {tags}"
            )
            return total_invalidated

        except Exception as e:
            self.cache_stats["errors"] += 1
            logger.error(f"Cache invalidation error for tags {tags}: {e}")
            return 0

    async def invalidate_by_action(self, action: str) -> int:
        """Invalidate cache based on action type"""
        total_invalidated = 0

        try:
            # Find strategies that should be invalidated by this action
            strategies_to_invalidate = []
            for strategy, config in CacheConfig.STRATEGIES.items():
                if action in config.get("invalidate_on", []):
                    strategies_to_invalidate.append(strategy)

            # Invalidate each strategy
            for strategy in strategies_to_invalidate:
                count = await self.invalidate_by_strategy(strategy)
                total_invalidated += count

            logger.info(
                f"Invalidated {total_invalidated} cache entries for action: {action}"
            )
            return total_invalidated

        except Exception as e:
            self.cache_stats["errors"] += 1
            logger.error(f"Cache invalidation error for action {action}: {e}")
            return 0

    def get_stats(self) -> Dict[str, Any]:
        """Get cache performance statistics"""
        total_requests = self.cache_stats["hits"] + self.cache_stats["misses"]
        hit_rate = (
            (self.cache_stats["hits"] / total_requests * 100)
            if total_requests > 0
            else 0
        )

        return {
            "hits": self.cache_stats["hits"],
            "misses": self.cache_stats["misses"],
            "hit_rate": f"{hit_rate:.2f}%",
            "invalidations": self.cache_stats["invalidations"],
            "errors": self.cache_stats["errors"],
            "local_cache_size": len(self.local_cache),
        }

    async def cleanup_expired_local_cache(self):
        """Clean up expired entries from local cache"""
        current_time = time.time()
        expired_keys = [
            key
            for key, item in self.local_cache.items()
            if item["expires_at"] <= current_time
        ]

        for key in expired_keys:
            del self.local_cache[key]

        if expired_keys:
            logger.debug(f"Cleaned up {len(expired_keys)} expired local cache entries")


# Global cache manager instance
cache_manager = AsyncCacheManager()


def cache_response(
    strategy: str,
    key_generator: Callable[..., List[str]],
    ttl: Optional[int] = None,
    include_user: bool = False,
    include_params: bool = False,
):
    """
    Decorator for caching API responses

    Args:
        strategy: Cache strategy to use
        key_generator: Function to generate cache key parts from function arguments
        ttl: Custom TTL (overrides strategy default)
        include_user: Whether to include user ID in cache key
        include_params: Whether to include query parameters in cache key
    """

    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Generate cache key
            key_parts = key_generator(*args, **kwargs)

            # Extract user ID if needed
            user_id = None
            if include_user:
                # Look for user in kwargs or args
                user = kwargs.get("user") or kwargs.get("current_user")
                if user:
                    user_id = getattr(user, "id", None)

            # Extract query parameters if needed
            additional_params = None
            if include_params:
                # Look for query_params or request parameters
                query_params = kwargs.get("query_params")
                if query_params:
                    additional_params = (
                        query_params.dict()
                        if hasattr(query_params, "dict")
                        else query_params
                    )

            # Try to get from cache
            cached_result = await cache_manager.get(
                strategy, key_parts, user_id, additional_params
            )

            if cached_result is not None:
                logger.debug(f"Returning cached result for {func.__name__}")
                return cached_result

            # Execute function and cache result
            result = await func(*args, **kwargs)

            # Cache the result
            await cache_manager.set(
                strategy, key_parts, result, user_id, additional_params, ttl
            )

            return result

        return wrapper

    return decorator


async def warm_up_cache():
    """Warm up cache with frequently accessed data"""
    logger.info("Starting cache warm-up process...")

    try:
        # This would typically involve pre-loading frequently accessed data
        # For now, we'll just initialize the cache manager
        await cache_manager.cleanup_expired_local_cache()
        logger.info("Cache warm-up completed successfully")

    except Exception as e:
        logger.error(f"Cache warm-up failed: {e}")


# Background task for cache maintenance
async def cache_maintenance_task():
    """Background task for cache maintenance"""
    while True:
        try:
            await cache_manager.cleanup_expired_local_cache()
            await asyncio.sleep(300)  # Run every 5 minutes
        except Exception as e:
            logger.error(f"Cache maintenance error: {e}")
            await asyncio.sleep(60)  # Retry after 1 minute on error
