from fastapi import Response

from app.core.config import Settings
from app.services.session_service import SessionCredentials


def set_session_cookies(
    response: Response, credentials: SessionCredentials, settings: Settings
) -> None:
    response.set_cookie(
        settings.session_cookie_name,
        credentials.session_token,
        max_age=settings.session_ttl_seconds,
        expires=credentials.expires_at,
        secure=settings.session_cookie_secure,
        samesite="lax",
        domain=settings.session_cookie_domain,
        path="/",
        httponly=True,
    )
    response.set_cookie(
        settings.csrf_cookie_name,
        credentials.csrf_token,
        max_age=settings.session_ttl_seconds,
        expires=credentials.expires_at,
        secure=settings.session_cookie_secure,
        samesite="lax",
        domain=settings.session_cookie_domain,
        path="/",
        httponly=False,
    )


def clear_session_cookies(response: Response, settings: Settings) -> None:
    response.delete_cookie(
        settings.session_cookie_name,
        domain=settings.session_cookie_domain,
        path="/",
        secure=settings.session_cookie_secure,
        httponly=True,
        samesite="lax",
    )
    response.delete_cookie(
        settings.csrf_cookie_name,
        domain=settings.session_cookie_domain,
        path="/",
        secure=settings.session_cookie_secure,
        httponly=False,
        samesite="lax",
    )
