from fastapi import status
from fastapi.responses import JSONResponse
from backend.schemas.error import ErrorResponse400, ErrorResponse401, ErrorResponse403

public_api_responses = {
    400: {"model": ErrorResponse400},
    401: {"model": ErrorResponse401},
    403: {"model": ErrorResponse403},
}


authenticated_api_responses = {
    400: {"model": ErrorResponse400},
    401: {"model": ErrorResponse401},
    403: {"model": ErrorResponse403},
}


class BadRequestResponse(JSONResponse):
    def __init__(
        self, error_code=status.HTTP_400_BAD_REQUEST, message=None, debug_info=None
    ):
        custom_content = {
            "error_code": error_code,
            "message": message,
            "debug_info": debug_info,
        }
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST, content=custom_content
        )


class UnauthorizedResponse(JSONResponse):
    def __init__(self, message=None, debug_info=None):
        custom_content = {
            "error_code": status.HTTP_401_UNAUTHORIZED,
            "message": message,
            "debug_info": debug_info,
        }
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED, content=custom_content
        )


class AccessDeniedResponse(JSONResponse):
    def __init__(self, message=None, debug_info=None):
        custom_content = {
            "error_code": status.HTTP_403_FORBIDDEN,
            "message": message,
            "debug_info": debug_info,
        }
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, content=custom_content)
