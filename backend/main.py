from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from backend.api.v1.router import api_router

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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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


@app.exception_handler(ValueError)
async def value_error_exception_handler(request: Request, exc: ValueError):
    return BadRequestResponse(400, str(exc))
