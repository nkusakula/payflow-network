# PayFlow Security Review Checklist

Walk this list as Step 3 of the review. Mark each ✅ / ❌ / N/A.

## Input handling
- [ ] No `...req.body` spread into entity (mass assignment)
- [ ] All numeric fields validated with `Number.isInteger` + bounds
- [ ] All string fields length-bounded
- [ ] Status / enum fields validated against allowed set
- [ ] `amount` always an integer in minor currency units

## Authorization
- [ ] Route has authentication middleware (or documented as public)
- [ ] Resource ownership checked (issuerId match for cards, etc.)
- [ ] State transitions validated (dispute, transaction, settlement)
- [ ] No client-supplied `riskScore`, `role`, `isAdmin`, or `status` accepted

## Idempotency & integrity
- [ ] `POST` mutations support `Idempotency-Key` header
- [ ] Settlement uniqueness: a transaction cannot be in two settlements
- [ ] Dispute lifecycle is monotonic (no reopening of `approved` / `rejected`)

## Errors & logging
- [ ] No stack traces in 5xx response bodies
- [ ] No PAN, CVV, full name, DOB, or token in logs
- [ ] PAN masked to first6 + last4 if logged
- [ ] Correlation IDs propagated to downstream calls

## Configuration
- [ ] `express.json({ limit: '100kb' })`
- [ ] `helmet()` applied at app level
- [ ] CORS origin allowlist explicit; no `*` with credentials
- [ ] `x-powered-by` header disabled

## Frontend
- [ ] No `dangerouslySetInnerHTML` with API data
- [ ] No tokens / PII in `localStorage`
- [ ] react-query cache cleared on logout (when auth lands)
- [ ] Risk score conveyed via text + color, not color alone
- [ ] Currency formatted via `Intl.NumberFormat`

## Tests
- [ ] Existing tests in `api/src/routes/*.test.ts` still pass after fixes
- [ ] New tests added for security-relevant changes (bounds, IDOR, transitions)
- [ ] `reset{Entity}()` called in `beforeEach` to prevent state leak
