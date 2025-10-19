# LaundroMart Staff PWA

Offline-first React PWA used by branch staff to start sessions, reconcile QRIS payments, and print receipts.

## Getting started

```bash
pnpm install
pnpm dev:staff
```

The app is bootstrapped with Vite, React Router, and React Query. A service worker (via `vite-plugin-pwa`) enables offline caching, while IndexedDB (`idb`) is reserved for session queues and stock data once the API is wired.

## Next steps

- Replace mocked Zustand store with live data from the backend WebSocket/MQTT bridge.
- Integrate BullMQ-backed offline queue for start/restart commands and reconciliation retries.
- Connect to thermal printers using WebUSB / WebBluetooth once the hardware pattern is confirmed.
