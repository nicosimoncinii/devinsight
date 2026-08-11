# ADR-0004: Use revocable server-side sessions

- Status: Accepted
- Date: 2026-08-11

## Context

DevInsight is a browser-based SaaS that will authenticate users through GitHub. Sessions must be
revocable, must not expose GitHub credentials to the frontend, and should remain simple to audit for
an MVP. Self-contained access tokens make immediate revocation and device-level session management
more complex.

## Decision

Use opaque, server-side sessions stored in PostgreSQL. The browser receives a random session token
in an `HttpOnly`, `SameSite=Lax` cookie. Only a SHA-256 hash of that token is stored. State-changing
requests also require a double-submit CSRF token sent in both a readable cookie and the
`X-CSRF-Token` header. Sessions expire after 14 days by default and can be individually revoked.

The GitHub OAuth callback introduced in M4 will create these sessions; M3 intentionally provides no
temporary password or development-login endpoint.

## Consequences

- A leaked database does not directly reveal usable browser session tokens.
- Logout and device-level revocation take effect immediately.
- Authentication requires a PostgreSQL lookup per request; this is acceptable for the MVP and can
  later be supported by a short-lived cache without changing the public API.
- Production deployments must enable secure cookies and terminate TLS.
