---
name: payments-security-review
description: Conduct a security review of PayFlow Network API routes and frontend components, focused on payments-domain threats. Use this skill when the user asks to "review for security", "audit transactions for vulnerabilities", "check for payment risks", "do a security review", "find vulnerabilities in this route", or mentions PCI, fraud, idempotency, risk-score tampering, or dispute manipulation in the context of PayFlow Network.
---

# Payments Security Review Skill

A multi-pass security review tailored to PayFlow Network's payment domain. This skill bundles deep reference material under `references/` — load only what you need for the file under review.

## When this skill activates

The model picks this skill up when the user expresses intent like:

- *"Review the transaction route for security issues"*
- *"Audit disputes for vulnerabilities"*
- *"Check the cards endpoint for fraud risks"*
- *"Do a security review of this route"*

## Workflow

### Step 1 — Identify the surface

Determine what's under review:

- **API route** (`api/src/routes/*.ts`) → load [`references/api-threat-catalog.md`](references/api-threat-catalog.md)
- **Frontend component** (`frontend/src/**/*.tsx`) → load [`references/frontend-threat-catalog.md`](references/frontend-threat-catalog.md)
- **Cross-cutting concern** (auth, CORS, logging) → load both

> Only load reference files relevant to the surface. Don't read every file under `references/` upfront.

### Step 2 — Run the threat catalog passes

For each finding, report:

```
[SEVERITY] [CATEGORY] short description
File: api/src/routes/transaction.ts:42
Threat: <PayFlow-specific impact>
OWASP: A01 / A03 / etc.
Fix: <minimal code change>
```

**Severity legend** (matches the `security-and-owasp` instruction file):
- **CRITICAL** — exploitable, must fix before merge
- **IMPORTANT** — significant risk, fix this sprint
- **SUGGESTION** — defense-in-depth

### Step 3 — Verify against the PayFlow-specific checklist

Load [`references/review-checklist.md`](references/review-checklist.md) and walk every item that applies. This catches domain-specific issues the generic OWASP catalog misses (amount overflow, risk-score tampering, dispute reopen abuse, settlement double-spend).

### Step 4 — Summarize

Produce a markdown report with:

1. **Critical findings** (count + bullet list with line numbers)
2. **Important findings** (count + bullet list)
3. **Suggestions** (count + bullet list)
4. **Quick-fix patch** (a single unified diff if there are <= 3 critical findings)
5. **Out of scope** — anything that needs deeper investigation (e.g., infrastructure, secrets management)

## Reference material

| File | Load when |
|---|---|
| [`references/api-threat-catalog.md`](references/api-threat-catalog.md) | Reviewing `api/src/routes/*.ts` |
| [`references/frontend-threat-catalog.md`](references/frontend-threat-catalog.md) | Reviewing `frontend/src/**/*.tsx` |
| [`references/payflow-domain-risks.md`](references/payflow-domain-risks.md) | Always — short, payments-specific risks |
| [`references/review-checklist.md`](references/review-checklist.md) | Step 3 — final verification |

## Demo guardrails

- Be specific: cite file paths and line numbers.
- Don't invent vulnerabilities. If the code is fine, say so.
- Prefer minimal patches over rewrites.
- Never propose changes that disable existing tests in `api/src/routes/*.test.ts`.
