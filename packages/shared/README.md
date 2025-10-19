# LaundroMart Shared Library

Cross-cutting TypeScript utilities and schemas shared by the backend and frontend applications.

## Contents

- `schemas/payments.ts` – Zod schemas for payment reconciliation payloads.
- `schemas/sessions.ts` – Zod schemas for MQTT/outbox session commands.

As the domain model stabilises, move DTOs and guards that must be reused across services into this package.
