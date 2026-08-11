# Architecture Overview

## Context

DevInsight imports GitHub repository activity and turns it into useful project analytics. The initial audience is an individual developer or a small team. The architecture must be easy to understand and operate while preserving clear growth paths for background synchronization and team features.

## System boundaries

```text
User browser
  -> Next.js frontend
      -> FastAPI REST API
          -> PostgreSQL
          -> GitHub App
              -> GitHub REST API and future webhooks
```

### Frontend

The frontend owns rendering, navigation, form interaction, chart presentation, and display formatting. It does not receive GitHub access tokens, query PostgreSQL, or define authoritative analytics calculations.

### Backend

The backend owns application sessions, workspace authorization, GitHub App flows, repository synchronization, analytics definitions, persistence, error handling, and structured logging.

### Database

PostgreSQL stores product identities, workspace relationships, imported GitHub data, synchronization state, and future job metadata. Integration tests use PostgreSQL rather than substituting SQLite.

## Deployment shape

The initial deployment consists of independently deployable frontend and backend services plus managed PostgreSQL. Development uses Docker Compose for infrastructure. A background worker can later reuse the backend service layer without splitting the product into microservices.

## Quality attributes

- **Security:** least-privilege GitHub App permissions, server-side secrets, revocable sessions, and workspace-scoped authorization.
- **Reliability:** idempotent synchronization, explicit sync runs, bounded retries, and visible data freshness.
- **Maintainability:** modular monolith, typed boundaries, migrations, tests, and ADRs.
- **Observability:** structured logs, request identifiers, health endpoints, and sync status.
- **Accessibility:** keyboard-visible focus, semantic status indicators, and charts with textual equivalents.
