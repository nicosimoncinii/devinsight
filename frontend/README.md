# DevInsight frontend

Interactive MVP for the DevInsight repository analytics workspace. The current milestone uses clearly labelled demo data while the FastAPI, GitHub App, and PostgreSQL services are introduced in later milestones.

## Included MVP flow

- repository switcher with public and private examples;
- 7-day, 30-day, 90-day, and yearly analytics ranges;
- compact repository overview with linked KPI summaries;
- expandable priority insights with evidence, impact, and recommended actions;
- progressive detail sections for pull requests, issue triage, contributors, and recent activity;
- accessible repository activity visualization with commit and merged-PR series, a scale, average, and textual table equivalent;
- visible data freshness and a simulated manual synchronization state;
- three-step GitHub App repository onboarding preview;
- responsive navigation and keyboard-visible focus states.

The hosted demo is publicly viewable and does not use ChatGPT authentication. Production authentication remains a backend-owned GitHub flow; the frontend does not store credentials or pretend that the demo establishes a real session.

## Local development

```bash
npm install
npm run dev
npm run build
npm test
```

The product UI lives in `app/page.tsx` and `app/globals.css`. Backend integrations must keep GitHub credentials and authoritative analytics calculations on the FastAPI side.
