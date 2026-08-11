# DevInsight API

FastAPI service for DevInsight. The backend owns authentication, authorization, GitHub integration, synchronization, analytics, and PostgreSQL persistence.

## Development

The recommended local workflow uses Docker from the repository root:

```bash
docker compose up --build db api
```

The API is then available at:

- liveness: `http://localhost:8000/api/v1/health/live`
- readiness: `http://localhost:8000/api/v1/health/ready`
- OpenAPI UI: `http://localhost:8000/api/v1/docs`
- OpenAPI document: `http://localhost:8000/api/v1/openapi.json`

Run backend quality checks in the same containerized environment:

```bash
docker compose run --rm api ruff check .
docker compose run --rm api ruff format --check .
docker compose run --rm api mypy app
docker compose run --rm api sh -c "alembic upgrade head && pytest"
```

## Internal structure

```text
app/
├── api/            # HTTP routes and error responses
├── core/           # Settings, logging, middleware, exceptions
├── db/             # Engine, sessions, declarative base
├── models/         # SQLAlchemy persistence models
├── repositories/   # Database access (introduced with use cases)
├── schemas/        # Pydantic request/response models
├── services/       # Application use cases (introduced with features)
└── sync/           # Synchronization orchestration (introduced in M6)
```

Routes should remain thin. Business behavior belongs in services, and SQL queries belong in persistence repositories.

## Authentication foundation

The API uses revocable server-side sessions. Clients receive an opaque session cookie and a
double-submit CSRF cookie; only token hashes are stored in PostgreSQL. The GitHub callback planned
for M4 will create sessions through the existing session service.

Authenticated endpoints currently available:

- `GET /api/v1/auth/me`
- `GET /api/v1/auth/sessions`
- `POST /api/v1/auth/logout`
- `DELETE /api/v1/auth/sessions/{session_id}`

State-changing requests require the CSRF cookie value in the `X-CSRF-Token` header. Set
`SESSION_COOKIE_SECURE=true` in every HTTPS environment.
