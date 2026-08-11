# Security Policy

DevInsight is under active development and has not reached a stable release.

## Reporting a vulnerability

Do not open a public issue for a suspected vulnerability or exposed credential. Use GitHub private vulnerability reporting when it is enabled for this repository. Until then, contact the repository owner privately through their GitHub profile.

Include the affected component, reproduction steps, impact, and any suggested mitigation. Please do not access data that does not belong to you or perform disruptive testing.

## Secret handling

- Local values belong in `.env`, which is ignored by Git.
- `.env.example` contains development-only placeholders.
- GitHub App keys and OAuth credentials must use deployment-platform or GitHub Actions secrets.
- Tokens, authorization codes, cookies, and private repository data must not appear in logs.
