# LaundroMart Internal SLAs

| Capability | Metric | Target | Notes |
| --- | --- | --- | --- |
| API responsiveness | REST `p95` latency | ≤ 300 ms on-prem | Measured under nominal load (100 machines per branch). |
| Realtime updates | WebSocket fan-out delay | ≤ 1 s | Machine telemetry and session status updates. |
| Offline tolerance | Machine operations | ≥ 30 min | Devices must keep running with cached schedules. |
| Data durability | Recovery Point Objective | 15 min | Managed via WAL archiving + scheduled backups. |
| Service restoration | Recovery Time Objective | 60 min | Requires infra-as-code and automated database restore. |
| Payment reconciliation | Callback processing | ≤ 15 s | Includes retry backoff for transient Xendit failures. |
| Incident response | Acknowledgement | ≤ 10 min | Applicable during business hours for operations alerts. |

These SLAs guide backlog prioritisation and observability instrumentation. Update this document whenever constraints or targets shift.
