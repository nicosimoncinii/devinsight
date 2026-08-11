from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from dataclasses import dataclass
from uuid import UUID

import pytest
from fastapi import FastAPI
from httpx2 import ASGITransport, AsyncClient
from sqlalchemy import delete

from app.models.user import User
from app.services.session_service import SessionCredentials, SessionService


@dataclass(frozen=True)
class AuthenticatedUser:
    user: User
    session_id: UUID
    credentials: SessionCredentials


async def create_authenticated_user(app: FastAPI, name: str) -> AuthenticatedUser:
    async with app.state.database.session_factory() as database_session:
        user = User(display_name=name, email=f"{name.lower()}@example.com")
        database_session.add(user)
        await database_session.flush()
        user_session, credentials = await SessionService(
            database_session, app.state.settings
        ).create(user, user_agent="DevInsight integration test")
        return AuthenticatedUser(user, user_session.id, credentials)


async def remove_users(app: FastAPI, *user_ids: UUID) -> None:
    async with app.state.database.session_factory() as database_session:
        await database_session.execute(delete(User).where(User.id.in_(user_ids)))
        await database_session.commit()


@asynccontextmanager
async def api_client(
    app: FastAPI, authenticated_user: AuthenticatedUser | None = None
) -> AsyncIterator[AsyncClient]:
    cookies = None
    if authenticated_user is not None:
        cookies = {
            app.state.settings.session_cookie_name: authenticated_user.credentials.session_token,
            app.state.settings.csrf_cookie_name: authenticated_user.credentials.csrf_token,
        }
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://testserver", cookies=cookies
    ) as client:
        yield client


@pytest.mark.integration
async def test_me_requires_authentication(app: FastAPI) -> None:
    async with api_client(app) as client:
        response = await client.get("/api/v1/auth/me")

    assert response.status_code == 401
    assert response.json()["error"]["code"] == "authentication_required"


@pytest.mark.integration
async def test_authenticated_user_can_read_profile_and_sessions(app: FastAPI) -> None:
    authenticated_user = await create_authenticated_user(app, "Ada")
    try:
        async with api_client(app, authenticated_user) as client:
            profile_response = await client.get("/api/v1/auth/me")
            sessions_response = await client.get("/api/v1/auth/sessions")

        assert profile_response.status_code == 200
        assert profile_response.json() == {
            "id": str(authenticated_user.user.id),
            "email": "ada@example.com",
            "display_name": "Ada",
            "avatar_url": None,
        }
        assert sessions_response.status_code == 200
        assert sessions_response.json()["items"][0]["id"] == str(authenticated_user.session_id)
        assert sessions_response.json()["items"][0]["current"] is True
    finally:
        await remove_users(app, authenticated_user.user.id)


@pytest.mark.integration
async def test_logout_requires_csrf_and_revokes_the_session(app: FastAPI) -> None:
    authenticated_user = await create_authenticated_user(app, "Grace")
    try:
        async with api_client(app, authenticated_user) as client:
            rejected_response = await client.post("/api/v1/auth/logout")
            assert rejected_response.status_code == 403
            assert rejected_response.json()["error"]["code"] == "csrf_validation_failed"

            logout_response = await client.post(
                "/api/v1/auth/logout",
                headers={"X-CSRF-Token": authenticated_user.credentials.csrf_token},
            )
            profile_response = await client.get("/api/v1/auth/me")

        assert logout_response.status_code == 204
        assert profile_response.status_code == 401
    finally:
        await remove_users(app, authenticated_user.user.id)


@pytest.mark.integration
async def test_user_cannot_revoke_another_users_session(app: FastAPI) -> None:
    owner = await create_authenticated_user(app, "Linus")
    other_user = await create_authenticated_user(app, "Margaret")
    try:
        async with api_client(app, owner) as client:
            response = await client.delete(
                f"/api/v1/auth/sessions/{other_user.session_id}",
                headers={"X-CSRF-Token": owner.credentials.csrf_token},
            )

        assert response.status_code == 404
        assert response.json()["error"]["code"] == "session_not_found"
    finally:
        await remove_users(app, owner.user.id, other_user.user.id)
