# HZ Base (Monorepo) — Foundation for HZ Projects

This repository serves as a starter foundation for internal HZ projects. It standardizes development structure, quality, security, and operations.

## Goals
- Unified monorepo structure and processes
- Fast onboarding for new services
- Reduced operational risk

## Repository Structure
- `services/` — applications and microservices
- `libs/` — shared libraries and utilities
- `docs/` — documentation (architecture, ADR, templates)
- `tools/` — scripts, hooks, generators

## Quickstart
1. Clone the repository
2. Copy `.env.example` (or `ENV_EXAMPLE.txt`) → `.env` and set values
3. Run (choose your stack):
   - Docker: `docker compose up -d`
   - Make: `make bootstrap && make up`
   - Node: `pnpm i && pnpm dev`

## Conventions
- Commits: Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`, `build:`)
- Branching: trunk-based (`main`) or GitFlow (`feature/`, `release/`, `hotfix/`) — choose per project
- Releases: SemVer, changelog required

## Quality
- Linters and formatter required (run in CI and pre-commit)
- Tests: unit/integration/e2e; minimum coverage defined by the project
- Mandatory PR checks (lint, tests, build)

## Config & Secrets
- 12-factor: environment variables for config
- Never commit secrets; use a Secret Manager/CI storage
- Example variables: `.env.example`

## Security
- Regular SCA dependency scans
- Vulnerability disclosure process — see `SECURITY.en.md`

## Architecture
- Overview — `docs/architecture.en.md`
- Significant decisions recorded as ADR — `docs/adr/`

## Service matrix & ownership
| Service | Purpose | Owner | README |
|--------|---------|-------|--------|
| sample-service | Example service | team-X | `services/sample-service/README.md` |

## Server module

See `server/README.md` for the PostgreSQL/Express server (authentication, HZid, 2FA, SMTP, tests). Quickstart: `cd server && npm install && npm run setup && npm run dev`.

### API and environment
- Frontend uses `NEXT_PUBLIC_API_BASE_URL` to reach the server (e.g., `http://localhost:3001`).
- Server uses `CORS_ORIGIN` to allow the frontend origin (e.g., `http://localhost:3000`).

### Local run (web + api + db)

```bash
docker compose -f docker-compose.full.yml up --build
```

## License
Internal proprietary HZ repository. See `LICENSE`.
