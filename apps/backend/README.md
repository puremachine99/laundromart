# LaundroMart Backend

NestJS service responsible for orchestration of laundromat sessions, payment reconciliation, telemetry, and multi-tenant access control.

## Local development

```bash
cp apps/backend/.env.example apps/backend/.env
pnpm install
pnpm dev:backend
```

By default the service expects Postgres, Redis, and an MQTT broker running locally. A `docker-compose` definition in the repository root can provision these for development.

## Key modules

- `HealthModule` – exposes `/health` covering Postgres and MQTT connectivity.
- `SessionsModule` – idempotent start/restart/stop commands using a transactional outbox plus MQTT delivery.
- `PaymentsModule` – handles Xendit QR callbacks, static QR heuristics, and exposes checksum helper for reconciliation.
- `MachinesModule` – placeholder for machine registry APIs (washer/dryer metadata, status, pricing).

## Next steps

1. Model tenants, branches, machines, sessions, and payments as TypeORM entities with RLS-aware constraints.
2. Implement transactional outbox processor to deliver MQTT commands and mark them processed.
3. Connect BullMQ workers for long-running tasks such as reconciliation retries and telemetry aggregation.
4. Harden payment callback verification and persist webhook payloads for auditability.
