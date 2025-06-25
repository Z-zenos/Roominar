"""
Simplified Response Caching System for Roominar API

This module provides a working caching system using the existing Redis client.
"""

import hashlib
import json
from functools import wraps
from typing import Any, Callable, Dict, Optional

from backend.core.config import settings
from backend.core.redis_client import redis_client
from backend.utils.logger import logger


class SimpleCacheManager:
    """Simple cache manager using existing Redis client"""

    def __init__(self):
        self.redis = redis_client
        self.cache_stats = {"hits": 0, "misses": 0, "sets": 0, "errors": 0}

    def _generate_key(
        self,
        base_key: str,
        params: Optional[Dict[str, Any]] = None,
        user_id: Optional[int] = None,
    ) -> str:
        """Generate cache key with optional parameters and user ID"""
        key_parts = [base_key]

        if user_id:
            key_parts.append(f"user:{user_id}")

        if params:
            # Create consistent hash of parameters
            param_str = "&".join(
                f"{k}={v}" for k, v in sorted(params.items()) if v is not None
            )
            if param_str:
                param_hash = hashlib.md5(param_str.encode()).hexdigest()[:8]
                key_parts.append(f"params:{param_hash}")

        return ":".join(key_parts)

    def get(
        self,
        key: str,
        params: Optional[Dict[str, Any]] = None,
        user_id: Optional[int] = None,
    ) -> Optional[Any]:
        """Get cached data"""
        cache_key = self._generate_key(key, params, user_id)

        try:
            cached_data = self.redis.get(cache_key)
            if cached_data and isinstance(cached_data, (str, bytes, bytearray)):
                self.cache_stats["hits"] += 1
                logger.debug(f"Cache hit for key: {cache_key}")
                return json.loads(cached_data)

            self.cache_stats["misses"] += 1
            return None

        except Exception as e:
            self.cache_stats["errors"] += 1
            logger.error(f"Cache get error for key {cache_key}: {e}")
            return None

    def set(
        self,
        key: str,
        data: Any,
        ttl: Optional[int] = None,
        params: Optional[Dict[str, Any]] = None,
        user_id: Optional[int] = None,
    ) -> bool:
        """Set cached data"""
        cache_key = self._generate_key(key, params, user_id)
        ttl = ttl or settings.REDIS_CACHE_TTL_DEFAULT

        try:
            serialized_data = json.dumps(data, default=str)
            self.redis.setex(cache_key, ttl, serialized_data)
            self.cache_stats["sets"] += 1
            logger.debug(f"Cache set for key: {cache_key}, TTL: {ttl}")
            return True

        except Exception as e:
            self.cache_stats["errors"] += 1
            logger.error(f"Cache set error for key {cache_key}: {e}")
            return False

    def delete(
        self,
        key: str,
        params: Optional[Dict[str, Any]] = None,
        user_id: Optional[int] = None,
    ) -> bool:
        """Delete cached data"""
        cache_key = self._generate_key(key, params, user_id)

        try:
            self.redis.delete(cache_key)
            logger.debug(f"Cache deleted for key: {cache_key}")
            return True
        except Exception as e:
            logger.error(f"Cache delete error for key {cache_key}: {e}")
            return False

    def invalidate_pattern(self, pattern: str) -> int:
        """Invalidate cache entries matching pattern"""
        try:
            keys = list(self.redis.scan_iter(match=pattern))
            if keys:
                self.redis.delete(*keys)
                logger.info(
                    f"Invalidated {len(keys)} cache entries matching pattern: {pattern}"
                )
                return len(keys)
            return 0
        except Exception as e:
            logger.error(f"Cache pattern invalidation error for {pattern}: {e}")
            return 0

    def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        total_requests = self.cache_stats["hits"] + self.cache_stats["misses"]
        hit_rate = (
            (self.cache_stats["hits"] / total_requests * 100)
            if total_requests > 0
            else 0
        )

        return {
            "hits": self.cache_stats["hits"],
            "misses": self.cache_stats["misses"],
            "sets": self.cache_stats["sets"],
            "errors": self.cache_stats["errors"],
            "hit_rate": f"{hit_rate:.2f}%",
        }


# Global cache manager
cache = SimpleCacheManager()


def cached_response(
    cache_key: str,
    ttl: Optional[int] = None,
    include_user: bool = False,
    include_params: bool = True,
):
    """
    Decorator for caching function responses

    Args:
        cache_key: Base cache key
        ttl: Time to live in seconds
        include_user: Include user ID in cache key
        include_params: Include function parameters in cache key
    """

    def decorator(func: Callable[..., Any]) -> Callable[..., Any]:
        @wraps(func)
        def wrapper(*args: Any, **kwargs: Any) -> Any:
            # Extract user ID if needed
            user_id: Optional[int] = None
            if include_user:
                user = kwargs.get("user") or kwargs.get("current_user")
                if user and hasattr(user, "id"):
                    user_id = user.id

            # Extract parameters if needed
            params: Optional[Dict[str, Any]] = None
            if include_params:
                # Get query parameters if available
                query_params = kwargs.get("query_params")
                if query_params:
                    if hasattr(query_params, "dict"):
                        params = query_params.dict()
                    elif isinstance(query_params, dict):
                        params = query_params

                # Also include other relevant kwargs
                if not params:
                    params = {
                        k: v
                        for k, v in kwargs.items()
                        if k not in ["db", "user", "current_user"] and v is not None
                    }

            # Try to get from cache
            cached_result = cache.get(cache_key, params, user_id)
            if cached_result is not None:
                return cached_result

            # Execute function and cache result
            result = func(*args, **kwargs)
            cache.set(cache_key, result, ttl, params, user_id)

            return result

        return wrapper

    return decorator


# Cache key constants
class CacheKeys:
    """Cache key constants for consistent caching"""

    # Event-related cache keys
    EVENTS_SEARCH = "events:search"
    EVENTS_TRENDING = "events:trending"
    EVENTS_DETAIL = "events:detail"
    EVENTS_RANK = "events:rank"
    EVENTS_RELATED = "events:related"
    EVENT_OPTIONS = "events:options"
    EVENT_BOOKMARKS = "events:bookmarks"
    EVENT_DRAFT = "events:draft"

    # User-related cache keys
    USER_PROFILE = "user:profile"
    USER_EVENTS = "user:events"
    USER_BOOKMARKS = "user:bookmarks"
    USER_APPLICATIONS = "user:applications"
    USER_NOTIFICATIONS = "user:notifications"

    # Organization-related cache keys
    ORG_PROFILE = "org:profile"
    ORG_EVENTS = "org:events"
    ORG_STATS = "org:stats"
    ORG_LIST = "org:list"
    ORG_SEARCH = "org:search"

    # Static data cache keys
    TAGS_LIST = "tags:list"
    TAGS_EVENT = "tags:event"

    # Speaker cache keys
    SPEAKERS_RANDOM = "speakers:random"
    SPEAKER_DETAIL = "speakers:detail"

    # Ticket cache keys
    TICKETS_LIST = "tickets:list"
    TICKETS_STATS = "tickets:stats"


def invalidate_event_caches(event_id: Optional[int] = None):
    """Invalidate event-related caches"""
    patterns = [
        "events:search:*",
        "events:trending:*",
        "events:rank:*",
        "events:recommendations:*",
    ]

    if event_id:
        patterns.extend([f"events:detail:*{event_id}*", f"events:related:*{event_id}*"])

    total_invalidated = 0
    for pattern in patterns:
        total_invalidated += cache.invalidate_pattern(pattern)

    logger.info(f"Invalidated {total_invalidated} event cache entries")
    return total_invalidated


def invalidate_user_caches(user_id: int):
    """Invalidate user-related caches"""
    patterns = [
        f"*user:{user_id}*",
        f"user:profile:*{user_id}*",
        f"user:events:*{user_id}*",
    ]

    total_invalidated = 0
    for pattern in patterns:
        total_invalidated += cache.invalidate_pattern(pattern)

    logger.info(
        f"Invalidated {total_invalidated} user cache entries for user {user_id}"
    )
    return total_invalidated


def invalidate_user_auth_cache(
    user_id: int, email: Optional[str] = None, role: Optional[str] = None
):
    """
    Invalidate user authentication-related caches.

    Args:
        user_id: The ID of the user whose cache to invalidate
        email: Optional email to include in cache key patterns
        role: Optional role to include in cache key patterns
    """
    patterns = [
        f"user:auth:*:user:{user_id}",  # User auth tokens
        f"user:profile:*:user:{user_id}",  # User profile data
        f"user:session:*:user:{user_id}",  # User session data
    ]

    if email:
        patterns.append(f"user:auth:*:email:{email}")  # Email-specific caches

    if role:
        patterns.append(f"user:auth:*:role:{role}")  # Role-specific caches

    for pattern in patterns:
        cache.invalidate_pattern(pattern)
