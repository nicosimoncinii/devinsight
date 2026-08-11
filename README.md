# DevInsight

[![Foundation CI](https://github.com/nicosimoncinii/devinsight/actions/workflows/foundation.yml/badge.svg)](https://github.com/nicosimoncinii/devinsight/actions/workflows/foundation.yml)

DevInsight is a portfolio-grade SaaS for developers and small teams who want useful, understandable analytics for their GitHub repositories. It will collect repository activity through the GitHub API and present commit, pull request, issue, contributor, and branch insights in a focused dashboard.

> **Project status:** M0 — engineering foundation. The application services are intentionally not implemented yet; development proceeds through small, working milestones.

## Product scope

The MVP will provide:

- GitHub-based user authentication;
- GitHub App installation and repository selection;
- manual import and synchronization of repository activity;
- commit, contributor, pull request, issue, and weekly activity analytics;
- repository-level dashboards and synchronization status;
- a deployment-ready frontend, API, and PostgreSQL stack.

## Architecture

DevInsight is a modular monolith maintained in a monorepo:

```text
Browser
  -> Next.js frontend
      -> FastAPI REST API
          -> PostgreSQL
          -> GitHub App / GitHub REST API
```

The frontend owns presentation and user interaction. FastAPI owns authentication, authorization, GitHub integration, synchronization, analytics, and persistence. See [the architecture overview](docs/architecture/overview.md) and [architecture decision records](docs/adr/README.md).

## Technology stack

| Area | Technology |
| --- | --- |
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Backend | Python 3.13, FastAPI, SQLAlchemy, Pydantic |
| Database | PostgreSQL 17 |
| Infrastructure | Docker, Docker Compose, GitHub Actions |
| Testing | pytest, frontend component tests, integration tests |

Node.js 24 LTS is the frontend runtime baseline. Runtime versions are recorded in `.nvmrc` and `.python-version`.

## Repository layout

```text
.
├── backend/              # FastAPI service (introduced in M1)
├── frontend/             # Next.js application (introduced in M2)
├── docs/                 # Architecture and decision records
├── .github/              # CI and collaboration configuration
├── docker-compose.yml    # Local infrastructure
└── DESIGN.md             # UI reference used by frontend work
```

## Local development

### Prerequisites

- Git
- Docker Desktop with Docker Compose
- Node.js 24 LTS (required from M2)
- Python 3.13 (required from M1)
- GNU Make is optional; equivalent Docker commands are shown below

### Start PostgreSQL

```bash
cp .env.example .env
docker compose up -d db
docker compose ps
```

On PowerShell:

```powershell
Copy-Item .env.example .env
docker compose up -d db
docker compose ps
```

Validate the Compose file without starting containers:

```bash
docker compose --env-file .env.example config --quiet
```

Stop the environment:

```bash
docker compose down
```

The local credentials in `.env.example` are development-only defaults. Production secrets must come from the deployment platform and must never be committed.

## Engineering standards

- `main` must remain deployable.
- Work is delivered through short-lived branches and focused pull requests.
- Important behavior requires tests in the same milestone.
- Configuration is supplied through environment variables.
- Secrets, generated files, and local database data are ignored by Git.
- Architectural choices are documented as ADRs.
- Commits follow the Conventional Commits style.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the working agreement and [SECURITY.md](SECURITY.md) for vulnerability reporting.

## Roadmap

- **M0:** repository and engineering foundation
- **M1:** FastAPI and PostgreSQL foundation
- **M2:** Next.js application shell
- **M3:** application authentication
- **M4:** GitHub App installation
- **M5:** repository import
- **M6:** repository data synchronization
- **M7:** analytics dashboard
- **M8:** production containerization
- **M9:** complete CI quality gates
- **M10:** public deployment
- **M11:** security and performance hardening

## Design direction

The interface is based on the principles recorded in `DESIGN.md`: a near-black data workspace, compact flat surfaces, a restrained yellow primary accent, and typography optimized for numerical information. DevInsight will adapt those principles to its own identity and will not reuse Binance trademarks or proprietary font assets.
