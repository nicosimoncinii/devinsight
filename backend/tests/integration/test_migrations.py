import pytest
from sqlalchemy import text

from app.core.config import get_settings
from app.db.session import Database

pytestmark = pytest.mark.integration


async def test_initial_migration_created_tenancy_tables() -> None:
    database = Database(get_settings())
    try:
        async with database.engine.connect() as connection:
            result = await connection.execute(
                text(
                    """
                    SELECT table_name
                    FROM information_schema.tables
                    WHERE table_schema = 'public'
                    """
                )
            )
            tables = set(result.scalars())
    finally:
        await database.dispose()

    assert {"alembic_version", "users", "workspaces", "workspace_memberships"} <= tables
