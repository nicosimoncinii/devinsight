from uuid import UUID

from fastapi import APIRouter, Request, Response, status

from app.api.cookies import clear_session_cookies
from app.api.dependencies import Authentication, CsrfAuthentication, DatabaseSession
from app.core.exceptions import AppError
from app.schemas.auth import CurrentUserResponse, SessionListResponse, SessionResponse
from app.schemas.common import ErrorResponse
from app.services.session_service import SessionService

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.get(
    "/me",
    response_model=CurrentUserResponse,
    responses={status.HTTP_401_UNAUTHORIZED: {"model": ErrorResponse}},
)
async def current_user(authentication: Authentication) -> CurrentUserResponse:
    return CurrentUserResponse.model_validate(authentication.user, from_attributes=True)


@router.get(
    "/sessions",
    response_model=SessionListResponse,
    responses={status.HTTP_401_UNAUTHORIZED: {"model": ErrorResponse}},
)
async def list_sessions(
    authentication: Authentication, database_session: DatabaseSession, request: Request
) -> SessionListResponse:
    sessions = await SessionService(database_session, request.app.state.settings).list_active(
        authentication.user.id
    )
    return SessionListResponse(
        items=[
            SessionResponse.model_validate(user_session, from_attributes=True).model_copy(
                update={"current": user_session.id == authentication.session.id}
            )
            for user_session in sessions
        ]
    )


@router.post(
    "/logout",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        status.HTTP_401_UNAUTHORIZED: {"model": ErrorResponse},
        status.HTTP_403_FORBIDDEN: {"model": ErrorResponse},
    },
)
async def logout(
    authentication: CsrfAuthentication,
    database_session: DatabaseSession,
    request: Request,
    response: Response,
) -> None:
    await SessionService(database_session, request.app.state.settings).revoke(
        authentication.session
    )
    clear_session_cookies(response, request.app.state.settings)


@router.delete(
    "/sessions/{session_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        status.HTTP_401_UNAUTHORIZED: {"model": ErrorResponse},
        status.HTTP_403_FORBIDDEN: {"model": ErrorResponse},
        status.HTTP_404_NOT_FOUND: {"model": ErrorResponse},
    },
)
async def revoke_session(
    session_id: UUID,
    authentication: CsrfAuthentication,
    database_session: DatabaseSession,
    request: Request,
    response: Response,
) -> None:
    revoked = await SessionService(database_session, request.app.state.settings).revoke_for_user(
        session_id, authentication.user.id
    )
    if revoked is None:
        raise AppError(
            code="session_not_found",
            message="The session was not found.",
            status_code=status.HTTP_404_NOT_FOUND,
        )
    if revoked.id == authentication.session.id:
        clear_session_cookies(response, request.app.state.settings)
