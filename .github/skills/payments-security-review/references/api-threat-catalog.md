# API Threat Catalog (Express + In-Memory Store)

Load this when reviewing files under `api/src/routes/*.ts`.

## A1 — Mass assignment via spread of `req.body`

**Severity**: CRITICAL · **OWASP**: A01

```typescript
// BAD
const created = { ...req.body, id: crypto.randomUUID() };

// GOOD
const { name, email } = req.body;
const created = { id: crypto.randomUUID(), name, email };
```

Audit every `POST` and `PUT` handler in `api/src/routes/`.

## A2 — Missing input validation

**Severity**: CRITICAL · **OWASP**: A03

Every route that accepts a body must validate types, lengths, and ranges. PayFlow uses no schema library yet — flag missing validation as a finding and recommend `zod`.

## A3 — Missing rate limiting on mutating endpoints

**Severity**: IMPORTANT · **OWASP**: A04

`POST /api/transactions`, `/api/disputes`, `/api/settlements`, and any login-like endpoint should have `express-rate-limit` applied.

## A4 — Verbose error responses

**Severity**: IMPORTANT · **OWASP**: A05

```typescript
// BAD
res.status(500).json({ error: err.stack });

// GOOD
logger.error({ err, path: req.path });
res.status(500).json({ error: 'Internal Server Error' });
```

## A5 — Missing auth middleware

**Severity**: CRITICAL · **OWASP**: A01

PayFlow demo routes are currently unauthenticated. Flag any *new* route that mutates payment state without an `authenticate` / `authorize` middleware.

## A6 — `body-parser` without size limit

**Severity**: IMPORTANT · **OWASP**: A04

Check `api/src/index.ts` — `express.json()` should specify `{ limit: '100kb' }`.

## A7 — CORS wildcard with credentials

**Severity**: CRITICAL · **OWASP**: A05

`Access-Control-Allow-Origin: *` combined with `credentials: true` is invalid and dangerous. Verify `API_CORS_ORIGINS` parsing.

## A8 — Unbounded array growth (in-memory store)

**Severity**: SUGGESTION

The seed-data arrays grow without bound. While the demo resets on restart, document this as a known limitation; do not add features that exacerbate it (e.g., bulk import without rate limit).

## A9 — Race conditions on shared mutable state

**Severity**: IMPORTANT

`transactions.push(...)` is fine in single-threaded Node, but read-modify-write patterns (e.g., update transaction status based on current value) can race across concurrent requests if any handler `await`s mid-update.

## A10 — Swagger schemas leaking internal fields

**Severity**: SUGGESTION · **OWASP**: A05

JSDoc `@swagger` annotations sometimes expose fields that shouldn't be in the public API response (e.g., `riskScore` raw values, internal IDs). Review schemas in `api/src/models/*.ts`.
