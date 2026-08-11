# ADR-0002: Build a modular monolith

- Status: Accepted
- Date: 2026-08-11

## Context

The MVP has meaningful domains but does not require independently scaled services. Microservices would introduce distributed failure modes, deployment coordination, and duplicated infrastructure.

## Decision

Implement the FastAPI backend as a modular monolith. API routes call application services; services coordinate persistence repositories and the GitHub client. Business rules do not live in route handlers.

## Consequences

- Local development and deployment stay straightforward.
- Module boundaries remain explicit and testable.
- Background work can reuse the same services through a separate process.
- Boundaries must be maintained through code review rather than network isolation.
