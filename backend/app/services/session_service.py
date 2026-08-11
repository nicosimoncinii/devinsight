from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import Settings
from app.core.security import generate_token, hash_token
from app.models.session import UserSession
from app.models.user import User
from app.repositories.session_repository import SessionRepository


@dataclass(frozen=True)
class SessionCredentials:
    session_token: str
    csrf_token: str
    expires_at: datetime


@dataclass(frozen=True)
class AuthContext:
    session: UserSession
    user: User


class SessionService:
    def __init__(self, database_session: AsyncSession, settings: Settings) -> None:
        self.database_session = database_session
        self.settings = settings
        self.repository = SessionRepository(database_session)

    async def create(
        self, user: User, *, user_agent: str | None = None
    ) -> tuple[UserSession, SessionCredentials]:
        session_token = generate_token()
        csrf_token = generate_token()
        expires_at = datetime.now(UTC) + timedelta(seconds=self.settings.session_ttl_seconds)
        user_session = UserSession(
            user_id=user.id,
            token_hash=hash_token(session_token),
            csrf_token_hash=hash_token(csrf_token),
            expires_at=expires_at,
            user_agent=user_agent,
        )
        await self.repository.add(user_session)
        await self.database_session.commit()
        return user_session, SessionCredentials(session_token, csrf_token, expires_at)

    async def authenticate(self, session_token: str) -> AuthContext | None:
        result = await self.repository.find_active_with_user(
            hash_token(session_token), datetime.now(UTC)
        )
        return None if result is None else AuthContext(session=result[0], user=result[1])

    async def list_active(self, user_id: UUID) -> list[UserSession]:
        return await self.repository.list_active_for_user(user_id, datetime.now(UTC))

    async def revoke(self, user_session: UserSession) -> None:
        user_session.revoked_at = datetime.now(UTC)
        await self.database_session.commit()

    async def revoke_for_user(self, session_id: UUID, user_id: UUID) -> UserSession | None:
        user_session = await self.repository.find_for_user(session_id, user_id)
        if user_session is None or user_session.revoked_at is not None:
            return None
        await self.revoke(user_session)
        return user_session
