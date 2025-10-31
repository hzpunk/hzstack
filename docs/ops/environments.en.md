# Environments and Configuration

## Principles
- 12-factor: configuration via environment variables
- No secrets in VCS

## Variables
- See `.env.example` or `ENV_EXAMPLE.txt`
- Separate: dev / stage / prod
- Frontend: `NEXT_PUBLIC_API_BASE_URL` — server base URL (e.g., http://localhost:3001)
- Server: `CORS_ORIGIN` — allowed frontend origin (e.g., http://localhost:3000)

## Secret storage
- Secret Manager/CI Secrets
- Locally — placeholders only
