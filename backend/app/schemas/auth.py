from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class CurrentUserResponse(BaseModel):
    id: UUID
    email: str | None
    display_name: str
    avatar_url: str | None


class SessionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_at: datetime
    expires_at: datetime
    user_agent: str | None
    current: bool = False


class SessionListResponse(BaseModel):
    items: list[SessionResponse]
