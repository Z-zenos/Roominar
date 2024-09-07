import os
import time

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.api.v1.routes.router import api_router
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
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["content-disposition"],
)


@app.get("/healthcheck")
async def healthcheck():
    return {"status": "OK"}


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
