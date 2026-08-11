# ADR-0001: Use a monorepo

- Status: Accepted
- Date: 2026-08-11

## Context

Frontend, backend, infrastructure, documentation, and integration tests evolve together. Splitting them would add coordination and versioning overhead before independent release cycles are useful.

## Decision

Maintain DevInsight in one repository with top-level `frontend` and `backend` applications plus shared documentation and infrastructure configuration.

## Consequences

- Cross-stack changes can be reviewed and tested in one pull request.
- Repository setup and contributor onboarding remain simple.
- CI must use path-aware jobs as the codebase grows.
- A future service can still be extracted when deployment or ownership boundaries justify it.
