# LaundroMart Monorepo

Multi-tenant laundromat platform with machine control over MQTT, QRIS payments, and multi-role dashboards. The repository is organised as a pnpm workspace:

- `apps/backend` – NestJS API + MQTT orchestrator + payment reconciliation.
- `apps/owner-portal` – Next.js 15 (canary) portal for owners/super admins.
- `apps/staff-pwa` – Offline-capable React PWA for branch staff.
- `packages/shared` – Shared Zod schemas / utilities across apps.

## Quick start

```bash
pnpm install
docker compose up -d
pnpm dev:backend
pnpm dev:portal
pnpm dev:staff
```

> Copy `.env.example` from each app before running the dev servers.

## Documentation

- [Architecture overview](docs/architecture.md)
- [Internal SLAs](docs/arch/SLAs.md)

## Tooling decisions

- **Node 20 + pnpm** keep dependency graphs deterministic across apps.
- **PostgreSQL 16 + RLS** for multi-tenant data isolation.
- **EMQX 5** as the MQTT broker for machine sessions & telemetry.
- **BullMQ + Redis** for background processing (payment reconciliation, retries, OTA rollouts).

Refer to each application README for specific instructions and next steps.
# laundromart
