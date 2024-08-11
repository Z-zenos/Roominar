from pydantic import BaseModel


class ErrorResponse400(BaseModel):
    error_code: str
    message: str
    debug_info: str


class ErrorResponse401(BaseModel):
    error_code: str
    message: str
    debug_info: str


class ErrorResponse403(BaseModel):
    error_code: str
    message: str
    debug_info: str
