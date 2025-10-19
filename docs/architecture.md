# LaundroMart Platform Architecture

## Overview

The LaundroMart platform is a multi-tenant laundromat operating stack. It combines an event-driven backend (NestJS + PostgreSQL + BullMQ), a machine control channel over MQTT, and two web frontends: an Owner Portal (Next.js) and an offline-capable Staff PWA (Vite + React).

```
┌────────────┐     ┌────────────┐     ┌──────────────┐
│ Machines   │◀──▶│   EMQX     │◀──▶│  Backend API  │
│ (ESP32...) │     │   MQTT     │     │  NestJS      │
└────────────┘     └────────────┘     └──────────────┘
        ▲                  ▲                   ▲
        │                  │                   │
  OTA + Telemetry     Staff PWA           Owner Portal
```

## Core services

- **Backend (`apps/backend`)**
  - API + WebSocket gateway for portals and PWA.
  - Transactional outbox (`session_command_outbox`) guarantees once delivery of start/stop/restart commands.
  - Payment reconciliation module normalises Xendit QR callbacks and guards against duplicate matching.
  - Observability: Terminus health checks, structured logging (Pino), BullMQ metrics (TBD), audit streams.
- **Owner Portal (`apps/owner-portal`)**
  - Next.js App Router for owners and super admins.
  - React Query client hydrates dashboards with <1 second updates (via WebSocket once available).
  - Roadmap: branch management, tariff editor, promo scheduling, cross-tenant reporting.
- **Staff PWA (`apps/staff-pwa`)**
  - Vite + React + React Router with offline caching and install prompt.
  - Zustand store holds realtime machine presence; React Query caches API calls.
  - POS form captures manual starts, offline sessions, and provides scaffolding for QR reconciliation UX.

## Data model (initial sketch)

- **Tenancy**
  - `tenants` → organisations (owner companies)
  - `branches` → physical stores (belongs to one tenant)
  - `machines` → washers/dryers registered to a branch
- **Sessions & Payments**
  - `sessions` → lifecycle of a machine run; references machine, tariff, payment_id.
  - `session_command_outbox` → queue of commands awaiting MQTT delivery (see SessionsModule).
  - `payments` → cash / QRIS transactions with reconciliation metadata & audit trails.
- **Inventory & POS**
  - `products` + `stock_ledger` for detergent or upsell items.
  - `pos_orders` for additional POS features.

## Flows

1. **Start session**
   1. Staff selects machine via PWA (online or offline).
   2. PWA calls backend `POST /sessions` with payment reference and optional offline reason.
   3. Backend writes session + outbox entry in Postgres (transaction).
   4. Outbox worker publishes MQTT command to `machines/commands/{machineId}`; machine acknowledges via status topic.
   5. UI updates via WebSocket broadcast.

2. **QRIS static reconciliation**
   1. Customer scans branch QR, completes payment in Xendit.
   2. Xendit hits webhook (`/payments/webhooks/xendit/qris`) with callback token.
   3. Backend verifies token, builds fingerprint (amount + fields) and queued for matching.
   4. Matching engine resolves to pending session or flags for manual review if ambiguous.

3. **Offline operations**
   - Staff PWA stores commands in IndexedDB when offline.
   - Once back online, commands replay to backend with `payment_method=cash_offline`.
   - Reports mark offline cash sessions for manager audit.

## Security

- PostgreSQL 16 with Row-Level Security: policies scoped by `tenant_id`.
- JWT access tokens for portal + PWA; Argon2 hashed PINs for privileged staff actions.
- MQTT over TLS (mutual auth planned). ACL denies cross-machine publish/subscribe.
- Audit log (append-only) for staff actions, refunds, and config changes.

## Observability

- Structured JSON logs (Pino) with correlation IDs.
- Terminus health endpoint monitors Postgres + MQTT.
- BullMQ metrics (via queue events) for reconciliation jobs.
- Future: Prometheus exporter for machine uptime percentages.
