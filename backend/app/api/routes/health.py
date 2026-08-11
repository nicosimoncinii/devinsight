from fastapi import APIRouter, Request, status
from sqlalchemy.exc import SQLAlchemyError

from app import __version__
from app.core.exceptions import AppError
from app.schemas.common import ErrorResponse, HealthResponse, ReadinessResponse

router = APIRouter(prefix="/health", tags=["health"])


@router.get("/live", response_model=HealthResponse)
async def liveness(request: Request) -> HealthResponse:
    return HealthResponse(
        service=request.app.state.settings.app_name,
        version=__version__,
    )


@router.get(
    "/ready",
    response_model=ReadinessResponse,
    responses={status.HTTP_503_SERVICE_UNAVAILABLE: {"model": ErrorResponse}},
)
async def readiness(request: Request) -> ReadinessResponse:
    try:
        await request.app.state.database.ping()
    except SQLAlchemyError as exception:
        raise AppError(
            code="service_unavailable",
            message="The database is not reachable.",
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        ) from exception
    return ReadinessResponse()
