import logging
from typing import Any

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.exceptions import AppError

logger = logging.getLogger("devinsight.errors")


def _request_id(request: Request) -> str:
    return getattr(request.state, "request_id", "unknown")


def _response(
    request: Request,
    *,
    status_code: int,
    code: str,
    message: str,
    details: dict[str, Any] | None = None,
) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={
            "error": {
                "code": code,
                "message": message,
                "details": details or {},
                "request_id": _request_id(request),
            }
        },
    )


def install_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(AppError)
    async def handle_app_error(request: Request, exception: AppError) -> JSONResponse:
        return _response(
            request,
            status_code=exception.status_code,
            code=exception.code,
            message=exception.message,
            details=exception.details,
        )

    @app.exception_handler(RequestValidationError)
    async def handle_validation_error(
        request: Request, exception: RequestValidationError
    ) -> JSONResponse:
        safe_errors = [
            {key: value for key, value in error.items() if key not in {"input", "ctx"}}
            for error in exception.errors()
        ]
        return _response(
            request,
            status_code=422,
            code="validation_error",
            message="The request could not be validated.",
            details={"errors": safe_errors},
        )

    @app.exception_handler(StarletteHTTPException)
    async def handle_http_error(
        request: Request, exception: StarletteHTTPException
    ) -> JSONResponse:
        code = "not_found" if exception.status_code == 404 else "http_error"
        message = exception.detail if isinstance(exception.detail, str) else "Request failed."
        return _response(
            request,
            status_code=exception.status_code,
            code=code,
            message=message,
        )

    @app.exception_handler(Exception)
    async def handle_unexpected_error(request: Request, exception: Exception) -> JSONResponse:
        logger.exception(
            "unhandled_exception",
            extra={"event_data": {"request_id": _request_id(request)}},
        )
        return _response(
            request,
            status_code=500,
            code="internal_error",
            message="An unexpected error occurred.",
        )
