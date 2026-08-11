from collections.abc import AsyncIterator
from typing import Annotated

from fastapi import Depends, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import AppError
from app.core.security import hash_token, tokens_match
from app.services.session_service import AuthContext, SessionService


async def get_database_session(request: Request) -> AsyncIterator[AsyncSession]:
    async for database_session in request.app.state.database.session():
        yield database_session


DatabaseSession = Annotated[AsyncSession, Depends(get_database_session)]


async def require_authentication(
    request: Request, database_session: DatabaseSession
) -> AuthContext:
    settings = request.app.state.settings
    session_token = request.cookies.get(settings.session_cookie_name)
    if not session_token:
        raise AppError(
            code="authentication_required",
            message="Authentication is required.",
            status_code=status.HTTP_401_UNAUTHORIZED,
        )
    context = await SessionService(database_session, settings).authenticate(session_token)
    if context is None:
        raise AppError(
            code="invalid_session",
            message="The session is invalid or has expired.",
            status_code=status.HTTP_401_UNAUTHORIZED,
        )
    return context


Authentication = Annotated[AuthContext, Depends(require_authentication)]


async def require_csrf(request: Request, authentication: Authentication) -> AuthContext:
    settings = request.app.state.settings
    header_token = request.headers.get("X-CSRF-Token")
    cookie_token = request.cookies.get(settings.csrf_cookie_name)
    if (
        not header_token
        or not cookie_token
        or not tokens_match(header_token, cookie_token)
        or not tokens_match(hash_token(header_token), authentication.session.csrf_token_hash)
    ):
        raise AppError(
            code="csrf_validation_failed",
            message="CSRF token validation failed.",
            status_code=status.HTTP_403_FORBIDDEN,
        )
    return authentication


CsrfAuthentication = Annotated[AuthContext, Depends(require_csrf)]
