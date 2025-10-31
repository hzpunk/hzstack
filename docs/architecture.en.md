# Architecture (Overview)

This document describes architectural principles for projects based on HZ Base (monorepo).

## Goals and Quality Attributes
- Service/team scalability
- Reliability and observability
- Security by default
- Domain autonomy and loose coupling

## Context (C4 — System/Container Level)
- The system consists of services under `services/` and shared libraries under `libs/`
- Integrations via HTTP/gRPC/messages (events)
- Data stores owned by services (private schemas, migrations)

## Domains and Boundaries
- Each domain is a separate service or module
- Contracts between domains are explicit (APIs/events)

## Data and Migrations
- Migrations live in the service repository
- Least-privilege access

## Observability
- Logs, metrics, traces — standardized
- Mandatory alerts for key SLOs

## Security
- No secrets in VCS, dependency scanning, design reviews

## Authentication and user
- Frontend obtains JWT from the server (`/api/auth/*`) and stores it in localStorage.
- Profile is fetched from `/api/users/me`; requests use `NEXT_PUBLIC_API_BASE_URL`.

## Architecture Evolution
- Significant decisions are recorded via ADR (`docs/adr/`)
