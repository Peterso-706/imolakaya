from fastapi import HTTPException, status


class AppException(HTTPException):
    code: str = "app_error"
    http_status: int = status.HTTP_500_INTERNAL_SERVER_ERROR

    def __init__(self, detail: str, *, headers: dict | None = None):
        super().__init__(
            status_code=self.http_status,
            detail={"code": self.code, "message": detail},
            headers=headers,
        )


class NotFoundError(AppException):
    code = "not_found"
    http_status = status.HTTP_404_NOT_FOUND


class ForbiddenError(AppException):
    code = "forbidden"
    http_status = status.HTTP_403_FORBIDDEN


class UnauthorizedError(AppException):
    code = "unauthorized"
    http_status = status.HTTP_401_UNAUTHORIZED


class ConflictError(AppException):
    code = "conflict"
    http_status = status.HTTP_409_CONFLICT


class BadRequestError(AppException):
    code = "bad_request"
    http_status = status.HTTP_400_BAD_REQUEST


class ValidationError(AppException):
    code = "validation_error"
    http_status = 422
    

class TooManyRequestsError(AppException):
    code = "too_many_requests"
    http_status = status.HTTP_429_TOO_MANY_REQUESTS