# PayFlow Domain Risks

Payments-specific threats unique to PayFlow Network. Reference this for every review.

## D1 — Amount field overflow / float drift

**Severity**: CRITICAL · **OWASP**: A04 (Cryptographic / Data Integrity)

PayFlow stores `amount` as **integer minor currency units** (cents). Any code path that:

- Casts `amount` to `Number` from untrusted input without bounds check
- Performs floating-point math on `amount`
- Accepts `amount` larger than `Number.MAX_SAFE_INTEGER`

…can produce silent rounding or overflow.

```typescript
// BAD
const total = transactions.reduce((s, t) => s + t.amount, 0); // can drift

// GOOD — use BigInt for aggregations, validate input
const amount = Number(req.body.amount);
if (!Number.isInteger(amount) || amount < 0 || amount > 1_000_000_00) {
  return res.status(400).json({ error: 'Invalid amount' });
}
```

## D2 — Risk-score tampering

**Severity**: CRITICAL · **OWASP**: A04 (Mass Assignment)

`Transaction.riskScore` (0–100) gates green/yellow/red treatment. If a route accepts `req.body` directly into the transaction object, an attacker can submit `{ riskScore: 0 }` to bypass fraud controls.

```typescript
// BAD
transactions.push({ ...req.body, id: crypto.randomUUID() });

// GOOD — explicit allowlist; riskScore computed server-side
const { amount, cardId, merchantId } = req.body;
const riskScore = computeRiskScore({ amount, cardId, merchantId });
transactions.push({ id: crypto.randomUUID(), amount, cardId, merchantId, riskScore, status: 'pending' });
```

## D3 — Missing idempotency key on POST

**Severity**: IMPORTANT · **OWASP**: A04

Network retries on payment APIs cause **double charges** without an idempotency key. Every `POST /api/transactions`, `/api/disputes`, `/api/settlements` should accept and dedupe on an `Idempotency-Key` header.

## D4 — Dispute reopen / status-flow abuse

**Severity**: CRITICAL · **OWASP**: A01 (Broken Access Control)

`Dispute.status` should follow a state machine. Routes that accept an arbitrary `status` from `req.body` allow a settled dispute to be reopened or a rejected one approved.

```typescript
// GOOD — validate transition is allowed
const validTransitions: Record<string, string[]> = {
  open: ['under_review', 'rejected'],
  under_review: ['approved', 'rejected'],
  approved: [],
  rejected: [],
};
if (!validTransitions[current.status]?.includes(req.body.status)) {
  return res.status(409).json({ error: 'Invalid status transition' });
}
```

## D5 — Settlement double-spend

**Severity**: CRITICAL

A `Settlement` references a set of transactions. If the same transaction can be included in two settlements (no uniqueness check), funds are paid out twice.

## D6 — IDOR on cardholder / card / dispute lookups

**Severity**: CRITICAL · **OWASP**: A01

`GET /api/cards/:id` returns the card if it exists — but does not verify the caller's `issuerId` matches `card.issuerId`. Any authenticated user could enumerate any issuer's cards.

## D7 — PII leakage in logs

**Severity**: IMPORTANT · **OWASP**: A09

Card PAN, CVV, cardholder DOB, and full names must never appear in `console.log` / structured logs. Mask PAN to first6+last4.

## D8 — CORS too permissive in non-prod

**Severity**: IMPORTANT · **OWASP**: A05

`API_CORS_ORIGINS` accepting `*` or `*.app.github.dev` in production exposes the API to cross-origin abuse. Codespaces wildcard is OK for demos only.
