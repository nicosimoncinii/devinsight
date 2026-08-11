# Contributing to DevInsight

DevInsight is developed as a professional team-style portfolio project. Changes should be understandable to a junior developer while meeting production-minded engineering standards.

## Workflow

1. Start from an up-to-date `main` branch.
2. Create a short-lived branch such as `feat/repository-import` or `fix/sync-pagination`.
3. Keep the change focused and include relevant tests.
4. Run the milestone's validation commands locally.
5. Open a pull request and explain the problem, solution, trade-offs, and verification.
6. Prefer squash merging after required checks and review conversations pass.

Automated Codex branches use the `codex/` prefix.

## Commit messages

Use Conventional Commits with a useful scope:

```text
feat(api): add repository import endpoint
fix(sync): prevent duplicate commits
test(analytics): cover pull request closing time
docs(architecture): record session strategy
chore(ci): add backend type checking
```

## Pull request expectations

- Do not mix unrelated refactors with a feature or fix.
- Document migrations and environment-variable changes.
- Include screenshots for visible UI changes.
- Never commit credentials, tokens, private keys, or production data.
- Update an ADR when a change alters an important architectural decision.
