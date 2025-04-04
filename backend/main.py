import asyncio
import os
import time

from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.api.v1.routes.router import api_router
from backend.core import redis_client
from backend.core.exception import (
    AccessDeniedException,
    BadRequestException,
    UnauthorizedException,
)
from backend.core.response import (
    AccessDeniedResponse,
    BadRequestResponse,
    UnauthorizedResponse,
)

app = FastAPI(title="Roominar", openapi_url="/api/v1/openapi.json")

os.environ["TZ"] = "Asia/Ho_Chi_Minh"
time.tzset()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["content-disposition"],
)


@app.get("/healthcheck")
async def healthcheck():
    return {"status": "OK"}


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
