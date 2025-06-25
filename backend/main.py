import asyncio
import os

# import ssl
import time

import uvicorn
from celery import Celery
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.core import redis_client
from backend.core.config import settings
from backend.core.exception import (
    AccessDeniedException,
    BadRequestException,
    UnauthorizedException,
)
from backend.core.rate_limiter import RateLimitMiddleware, rate_limiter
from backend.core.response import (
    AccessDeniedResponse,
    BadRequestResponse,
    UnauthorizedResponse,
)
from backend.core.simple_cache import cache
from backend.db.database import check_database_health
from backend.routes.router import api_router
from backend.utils.async_optimizer import async_optimizer, pool_manager

app = FastAPI(
    title="Roominar",
    openapi_url="/api/v1/openapi.json",
    description="Optimized Event Management API with advanced caching and rate limiting",
)

# ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
# ssl_context.load_cert_chain(
#     "backend/certs/server.crt", keyfile="backend/certs/server.key"
# )

os.environ["TZ"] = "Asia/Ho_Chi_Minh"
time.tzset()

# Add rate limiting middleware
app.add_middleware(RateLimitMiddleware, rate_limiter=rate_limiter)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://192.168.1.6:3000",
        "http://192.168.80.62:3000",
        "http://192.168.88.151:3000",
        "http://192.168.0.111:3000",
        "http://dungct.navistar.io:2002",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["content-disposition"],
)

celery = Celery(
    __name__,
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
)


@app.get("/healthcheck")
async def healthcheck():
    db_health = check_database_health()
    overall_status = (
        "OK"
        if all(db["status"] == "healthy" for db in db_health.values())
        else "DEGRADED"
    )

    return {"status": overall_status, "database": db_health, "timestamp": time.time()}


@app.get("/performance-stats")
async def get_performance_stats():
    """Get comprehensive performance statistics."""
    try:
        from backend.utils.query_optimizer import get_performance_stats

        db_stats = get_performance_stats()
    except ImportError:
        db_stats = {"error": "Query optimizer not available"}

    return {
        "database": db_stats,
        "cache": cache.get_stats(),
        "rate_limiter": rate_limiter.get_stats(),
        "async_optimizer": async_optimizer.get_stats(),
        "connection_pools": pool_manager.get_pool_status(),
        "timestamp": time.time(),
    }


clients = {}


@app.websocket("/ws/payment/{session_token}")
async def payment_websocket_endpoint(websocket: WebSocket, session_token: str):
    session_data = redis_client.redis_client.hgetall(f"session:{session_token}")
    if not session_data:
        await websocket.close(reason="Invalid session token")
        return

    transaction_id = session_data.get("transaction_id")
    stored_user_id = session_data.get("user_id")
    if not transaction_id or not stored_user_id:
        await websocket.close(reason="Unauthorized session token")
        return

    await websocket.accept()
    clients[session_token] = websocket

    try:
        while True:
            await asyncio.sleep(1)
            status = redis_client.redis_client.get(f"session_status:{session_token}")
            if status:
                await websocket.send_json({"status": status})

    except WebSocketDisconnect:
        clients.pop(session_token, None)


app.include_router(api_router, prefix="/api/v1")


@app.exception_handler(BadRequestException)
def bad_request_exception_handler(request: Request, exc: BadRequestException):
    return BadRequestResponse(exc.error_code, exc.message, exc.debug_info)


@app.exception_handler(UnauthorizedException)
def unauthorized_exception_handler(request: Request, exc: UnauthorizedException):
    return UnauthorizedResponse(exc.message, exc.debug_info)


@app.exception_handler(AccessDeniedException)
def access_denied_exception_handler(request: Request, exc: UnauthorizedException):
    return AccessDeniedResponse(exc.message, exc.debug_info)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": exc.body},
    )


if __name__ == "__main__":
    # Check if certificates exist
    cert_path = os.path.join(os.path.dirname(__file__), "certs", "server.crt")
    key_path = os.path.join(os.path.dirname(__file__), "certs", "server.key")

    # Use HTTPS if certificates exist
    if os.path.exists(cert_path) and os.path.exists(key_path):
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=8000,
            # ssl=ssl_context,
            ssl_keyfile=key_path,
            ssl_certfile=cert_path,
            reload=True,
        )
    else:
        # Fallback to HTTP
        uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
