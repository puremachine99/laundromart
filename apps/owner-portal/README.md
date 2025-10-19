# LaundroMart Owner Portal

Next.js application for owners and super admins to manage branches, pricing, and telemetry.

## Getting started

```bash
pnpm install
pnpm dev:portal
```

The app uses the App Router and React Query to synchronise data in realtime. When the backend wiring is completed, replace the mocked data in `app/page.tsx` with calls to the GraphQL/REST endpoints.

## Planned features

- Multi-tenant view of branches, machines, and revenue.
- Configuration screens for tariffs, promotions, QR static/dynamic mappings.
- Audit & activity history viewer for regulatory compliance.
- Global telemetry heat-map for pitching and operational insights.
