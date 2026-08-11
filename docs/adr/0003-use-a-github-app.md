# ADR-0003: Integrate through a GitHub App

- Status: Accepted
- Date: 2026-08-11

## Context

DevInsight needs GitHub identity, repository selection, read-only repository data, and a future path to automatic synchronization. A traditional OAuth App uses broad user scopes and remains tied to a user token.

## Decision

Use a GitHub App for sign-in and repository installation. Request only the repository permissions required by implemented features and generate short-lived installation tokens server-side.

## Consequences

- Users and organizations can grant access to selected repositories.
- Tokens and the GitHub App private key remain outside the browser.
- Built-in webhooks support a future event-driven synchronization path.
- Local and production environments require separate GitHub App configuration.
