from fastapi import status


class BadRequestException(Exception):
    def __init__(
        self, error_code: str, message: str = None, debug_info: str = None
    ) -> None:
        self.status_code = status.HTTP_400_BAD_REQUEST
        self.error_code = error_code
        self.message = message
        self.debug_info = debug_info


class UnauthorizedException(Exception):
    def __init__(
        self, error_code: str, message: str = None, debug_info: str = None
    ) -> None:
        self.status_code = status.HTTP_401_UNAUTHORIZED
        self.error_code = error_code
        self.message = message
        self.debug_info = debug_info


class AccessDeniedException(Exception):
    def __init__(
        self, error_code: str, message: str = None, debug_info: str = None
    ) -> None:
        self.status_code = status.HTTP_403_FORBIDDEN
        self.error_code = error_code
        self.message = message
        self.debug_info = debug_info
