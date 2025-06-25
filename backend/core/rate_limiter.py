"""
Advanced Rate Limiting System for Roominar API

This module provides flexible rate limiting with Redis backend,
supporting different rate limiting strategies and algorithms.
"""

import time
from typing import Dict, Optional, Tuple

from fastapi import HTTPException, Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

from backend.core.config import settings
from backend.core.redis_client import redis_client
from backend.utils.logger import logger


class RateLimitStrategy:
    """Rate limit strategy definitions"""

    # API endpoint strategies
    SEARCH_EVENTS = "search_events"
    CREATE_EVENT = "create_event"
    AUTH_LOGIN = "auth_login"
    UPLOAD_FILE = "upload_file"

    # User-based strategies
    USER_GENERAL = "user_general"
    USER_PREMIUM = "user_premium"
    ORGANIZATION = "organization"

    # IP-based strategies
    IP_GENERAL = "ip_general"
    IP_STRICT = "ip_strict"


class RateLimitConfig:
    """Rate limit configuration for different strategies"""

    STRATEGIES = {
        RateLimitStrategy.SEARCH_EVENTS: {
            "requests": 60,  # requests per window
            "window": 60,  # window size in seconds
            "burst": 10,  # burst allowance
        },
        RateLimitStrategy.CREATE_EVENT: {
            "requests": 10,
            "window": 60,
            "burst": 2,
        },
        RateLimitStrategy.AUTH_LOGIN: {
            "requests": 5,
            "window": 300,  # 5 minutes
            "burst": 2,
        },
        RateLimitStrategy.UPLOAD_FILE: {
            "requests": 20,
            "window": 60,
            "burst": 5,
        },
        RateLimitStrategy.USER_GENERAL: {
            "requests": settings.RATE_LIMIT_REQUESTS_PER_MINUTE,
            "window": 60,
            "burst": settings.RATE_LIMIT_BURST_SIZE,
        },
        RateLimitStrategy.USER_PREMIUM: {
            "requests": 200,
            "window": 60,
            "burst": 50,
        },
        RateLimitStrategy.ORGANIZATION: {
            "requests": 500,
            "window": 60,
            "burst": 100,
        },
        RateLimitStrategy.IP_GENERAL: {
            "requests": 100,
            "window": 60,
            "burst": 20,
        },
        RateLimitStrategy.IP_STRICT: {
            "requests": 30,
            "window": 60,
            "burst": 5,
        },
    }


class SlidingWindowRateLimiter:
    """Sliding window rate limiter with Redis backend"""

    def __init__(self):
        self.redis_client = redis_client
        self.stats = {
            "total_requests": 0,
            "blocked_requests": 0,
            "strategies_used": set(),
        }

    def _get_rate_limit_key(self, identifier: str, strategy: str) -> str:
        """Generate Redis key for rate limiting"""
        return f"rate_limit:{strategy}:{identifier}"

    def _get_current_window(self, window_size: int) -> int:
        """Get current time window"""
        return int(time.time() // window_size)

    def _cleanup_old_entries(self, key: str, current_time: int, window_size: int):
        """Clean up old entries outside the sliding window"""
        cutoff_time = current_time - window_size
        self.redis_client.zremrangebyscore(key, 0, cutoff_time)

    def is_allowed(
        self,
        identifier: str,
        strategy: str = RateLimitStrategy.USER_GENERAL,
        custom_config: Optional[Dict] = None,
    ) -> Tuple[bool, Dict[str, int]]:
        """
        Check if request is allowed under rate limit

        Args:
            identifier: Unique identifier (user_id, ip_address, etc.)
            strategy: Rate limiting strategy to use
            custom_config: Custom rate limit configuration

        Returns:
            Tuple of (is_allowed, rate_limit_info)
        """
        self.stats["total_requests"] += 1
        self.stats["strategies_used"].add(strategy)

        # Get rate limit configuration
        config = custom_config or RateLimitConfig.STRATEGIES.get(
            strategy, RateLimitConfig.STRATEGIES[RateLimitStrategy.USER_GENERAL]
        )

        requests_limit = config["requests"]
        window_size = config["window"]
        burst_limit = config.get("burst", requests_limit // 5)

        current_time = time.time()
        key = self._get_rate_limit_key(identifier, strategy)

        try:
            # Clean up old entries
            self._cleanup_old_entries(key, current_time, window_size)

            # Count current requests in the window
            window_start = current_time - window_size
            current_requests = self.redis_client.zcount(key, window_start, current_time)

            # Check burst limit (requests in last 10 seconds)
            burst_window_start = current_time - 10
            burst_requests = self.redis_client.zcount(
                key, burst_window_start, current_time
            )

            # Determine if request is allowed
            is_allowed = (
                current_requests < requests_limit and burst_requests < burst_limit
            )

            if is_allowed:
                # Add current request to the window
                self.redis_client.zadd(key, {str(current_time): current_time})
                # Set expiry for the key
                self.redis_client.expire(key, window_size + 60)
            else:
                self.stats["blocked_requests"] += 1
                logger.warning(
                    f"Rate limit exceeded for {identifier} using strategy {strategy}. "
                    f"Current: {current_requests}/{requests_limit}, Burst: {burst_requests}/{burst_limit}"
                )

            # Calculate time until reset
            if current_requests >= requests_limit:
                # Find the oldest request in the window
                oldest_requests = self.redis_client.zrange(key, 0, 0, withscores=True)
                if oldest_requests:
                    oldest_time = oldest_requests[0][1]
                    reset_time = int(oldest_time + window_size - current_time)
                else:
                    reset_time = window_size
            else:
                reset_time = window_size

            rate_limit_info = {
                "limit": requests_limit,
                "remaining": max(
                    0, requests_limit - current_requests - (1 if is_allowed else 0)
                ),
                "reset": int(current_time + reset_time),
                "window": window_size,
                "burst_limit": burst_limit,
                "burst_remaining": max(
                    0, burst_limit - burst_requests - (1 if is_allowed else 0)
                ),
            }

            return is_allowed, rate_limit_info

        except Exception as e:
            logger.error(f"Rate limiting error for {identifier}: {e}")
            # Fail open - allow the request if Redis is unavailable
            return True, {
                "limit": requests_limit,
                "remaining": requests_limit,
                "reset": int(current_time + window_size),
                "window": window_size,
                "burst_limit": burst_limit,
                "burst_remaining": burst_limit,
            }

    def get_rate_limit_status(self, identifier: str, strategy: str) -> Dict[str, int]:
        """Get current rate limit status without making a request"""
        config = RateLimitConfig.STRATEGIES.get(
            strategy, RateLimitConfig.STRATEGIES[RateLimitStrategy.USER_GENERAL]
        )

        requests_limit = config["requests"]
        window_size = config["window"]
        burst_limit = config.get("burst", requests_limit // 5)

        current_time = time.time()
        key = self._get_rate_limit_key(identifier, strategy)

        try:
            # Clean up old entries
            self._cleanup_old_entries(key, current_time, window_size)

            # Count current requests
            window_start = current_time - window_size
            current_requests = self.redis_client.zcount(key, window_start, current_time)

            burst_window_start = current_time - 10
            burst_requests = self.redis_client.zcount(
                key, burst_window_start, current_time
            )

            return {
                "limit": requests_limit,
                "remaining": max(0, requests_limit - current_requests),
                "reset": int(current_time + window_size),
                "window": window_size,
                "burst_limit": burst_limit,
                "burst_remaining": max(0, burst_limit - burst_requests),
            }

        except Exception as e:
            logger.error(f"Error getting rate limit status for {identifier}: {e}")
            return {
                "limit": requests_limit,
                "remaining": requests_limit,
                "reset": int(current_time + window_size),
                "window": window_size,
                "burst_limit": burst_limit,
                "burst_remaining": burst_limit,
            }

    def reset_rate_limit(self, identifier: str, strategy: str) -> bool:
        """Reset rate limit for a specific identifier and strategy"""
        try:
            key = self._get_rate_limit_key(identifier, strategy)
            self.redis_client.delete(key)
            logger.info(f"Rate limit reset for {identifier} using strategy {strategy}")
            return True
        except Exception as e:
            logger.error(f"Error resetting rate limit for {identifier}: {e}")
            return False

    def get_stats(self) -> Dict:
        """Get rate limiting statistics"""
        total_requests = self.stats["total_requests"]
        blocked_requests = self.stats["blocked_requests"]
        success_rate = (
            (total_requests - blocked_requests) / total_requests * 100
            if total_requests > 0
            else 100
        )

        return {
            "total_requests": total_requests,
            "blocked_requests": blocked_requests,
            "success_rate": f"{success_rate:.2f}%",
            "strategies_used": list(self.stats["strategies_used"]),
        }


# Global rate limiter instance
rate_limiter = SlidingWindowRateLimiter()


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Middleware for automatic rate limiting based on IP and user"""

    def __init__(self, app, rate_limiter: SlidingWindowRateLimiter):
        super().__init__(app)
        self.rate_limiter = rate_limiter

        # Define endpoint-specific rate limits
        self.endpoint_strategies = {
            "/api/v1/events": RateLimitStrategy.SEARCH_EVENTS,
            "/api/v1/auth/login": RateLimitStrategy.AUTH_LOGIN,
            "/api/v1/events/draft": RateLimitStrategy.CREATE_EVENT,
        }

    def _get_client_identifier(self, request: Request) -> str:
        """Get client identifier (IP address with optional user info)"""
        # Try to get real IP from headers (for reverse proxy setups)
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            client_ip = forwarded_for.split(",")[0].strip()
        else:
            client_ip = request.client.host if request.client else "unknown"

        # Add user ID if available (from auth token)
        user_info = getattr(request.state, "user", None)
        if user_info and hasattr(user_info, "id"):
            return f"user:{user_info.id}:{client_ip}"

        return f"ip:{client_ip}"

    def _get_strategy_for_path(self, path: str) -> str:
        """Get rate limiting strategy based on request path"""
        for endpoint_pattern, strategy in self.endpoint_strategies.items():
            if path.startswith(endpoint_pattern):
                return strategy

        return RateLimitStrategy.IP_GENERAL

    async def dispatch(self, request: Request, call_next):
        """Process rate limiting for incoming requests"""
        # Skip rate limiting for health checks and internal endpoints
        if request.url.path in [
            "/healthcheck",
            "/performance-stats",
            "/docs",
            "/openapi.json",
        ]:
            return await call_next(request)

        # Get client identifier and strategy
        identifier = self._get_client_identifier(request)
        strategy = self._get_strategy_for_path(request.url.path)

        # Check rate limit
        is_allowed, rate_limit_info = self.rate_limiter.is_allowed(identifier, strategy)

        if not is_allowed:
            # Return rate limit exceeded response
            return Response(
                content='{"error": "Rate limit exceeded", "message": "Too many requests"}',
                status_code=429,
                headers={
                    "Content-Type": "application/json",
                    "X-RateLimit-Limit": str(rate_limit_info["limit"]),
                    "X-RateLimit-Remaining": str(rate_limit_info["remaining"]),
                    "X-RateLimit-Reset": str(rate_limit_info["reset"]),
                    "X-RateLimit-Window": str(rate_limit_info["window"]),
                    "Retry-After": str(
                        max(1, rate_limit_info["reset"] - int(time.time()))
                    ),
                },
            )

        # Process the request
        response = await call_next(request)

        # Add rate limit headers to response
        response.headers["X-RateLimit-Limit"] = str(rate_limit_info["limit"])
        response.headers["X-RateLimit-Remaining"] = str(rate_limit_info["remaining"])
        response.headers["X-RateLimit-Reset"] = str(rate_limit_info["reset"])
        response.headers["X-RateLimit-Window"] = str(rate_limit_info["window"])

        return response


def rate_limit(
    strategy: str = RateLimitStrategy.USER_GENERAL,
    identifier_func: Optional[callable] = None,
    custom_config: Optional[Dict] = None,
):
    """
    Decorator for rate limiting specific functions/endpoints

    Args:
        strategy: Rate limiting strategy to use
        identifier_func: Function to extract identifier from function arguments
        custom_config: Custom rate limit configuration
    """

    def decorator(func):
        def wrapper(*args, **kwargs):
            # Get identifier
            if identifier_func:
                identifier = identifier_func(*args, **kwargs)
            else:
                # Try to extract from request or user
                request = kwargs.get("request")
                user = kwargs.get("user") or kwargs.get("current_user")

                if user and hasattr(user, "id"):
                    identifier = f"user:{user.id}"
                elif request and hasattr(request, "client"):
                    identifier = f"ip:{request.client.host}"
                else:
                    identifier = "anonymous"

            # Check rate limit
            is_allowed, rate_limit_info = rate_limiter.is_allowed(
                identifier, strategy, custom_config
            )

            if not is_allowed:
                raise HTTPException(
                    status_code=429,
                    detail="Rate limit exceeded",
                    headers={
                        "X-RateLimit-Limit": str(rate_limit_info["limit"]),
                        "X-RateLimit-Remaining": str(rate_limit_info["remaining"]),
                        "X-RateLimit-Reset": str(rate_limit_info["reset"]),
                        "Retry-After": str(
                            max(1, rate_limit_info["reset"] - int(time.time()))
                        ),
                    },
                )

            return func(*args, **kwargs)

        return wrapper

    return decorator
