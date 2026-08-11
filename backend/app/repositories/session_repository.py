from datetime import datetime
from uuid import UUID

from sqlalchemy import Select, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.session import UserSession
from app.models.user import User


class SessionRepository:
    def __init__(self, database_session: AsyncSession) -> None:
        self.database_session = database_session

    async def add(self, user_session: UserSession) -> UserSession:
        self.database_session.add(user_session)
        await self.database_session.flush()
        return user_session

    async def find_active_with_user(
        self, token_hash: str, now: datetime
    ) -> tuple[UserSession, User] | None:
        statement: Select[tuple[UserSession, User]] = (
            select(UserSession, User)
            .join(User, User.id == UserSession.user_id)
            .where(
                UserSession.token_hash == token_hash,
                UserSession.revoked_at.is_(None),
                UserSession.expires_at > now,
                User.is_active.is_(True),
            )
        )
        row = (await self.database_session.execute(statement)).one_or_none()
        return None if row is None else (row[0], row[1])

    async def list_active_for_user(self, user_id: UUID, now: datetime) -> list[UserSession]:
        statement = (
            select(UserSession)
            .where(
                UserSession.user_id == user_id,
                UserSession.revoked_at.is_(None),
                UserSession.expires_at > now,
            )
            .order_by(UserSession.created_at.desc())
        )
        return list((await self.database_session.scalars(statement)).all())

    async def find_for_user(self, session_id: UUID, user_id: UUID) -> UserSession | None:
        statement: Select[tuple[UserSession]] = select(UserSession).where(
            UserSession.id == session_id,
            UserSession.user_id == user_id,
        )
        return (await self.database_session.execute(statement)).scalar_one_or_none()
