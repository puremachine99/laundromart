# Payment Reconciliation Runbook

## Scope

Static QRIS via Xendit with 90s match window. Each callback must map to a pending session or be flagged for manual review.

## Callback path

1. Xendit sends webhook to `POST /payments/webhooks/xendit/qris` with `X-CALLBACK-TOKEN`.
2. Backend validates token (HMAC) and normalises payload into a fingerprint string.
3. Fingerprint (`amount + payment_method + issuer_reference + reference_id`) is hashed and compared against outstanding POS entries.
4. If a unique match is found, session is marked as paid and the command queue is released.
5. Ambiguous matches (same amount within window) are stored for manual reconciliation.

## Manual reconciliation checklist

- Check staff portal for duplicate POS entries with the same amount.
- Verify `issuer_reference` or `channel_code` to differentiate customers.
- Confirm payment receipt screenshot if ambiguity persists.
- Use `PATCH /payments/{id}` endpoint (TBD) to bind the callback to the correct session.

## Retrying callbacks

- Callback failures are requeued with exponential backoff (initial 5s, cap 5 min).
- After 10 retries, raise an incident to operations and contact Xendit support if necessary.

## Escalation

- **Ops on-call**: verify callback delivery and database state.
- **Payments lead**: adjust fingerprint strategy or temporary lock window if fraud suspected.
