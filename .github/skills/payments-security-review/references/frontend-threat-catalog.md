# Frontend Threat Catalog (React + react-query + Tailwind)

Load this when reviewing files under `frontend/src/**/*.tsx`.

## F1 — `dangerouslySetInnerHTML` with API data

**Severity**: CRITICAL · **OWASP**: A05

PayFlow's API is currently unauthenticated and trusts client input. Any component that renders raw HTML from a transaction description, dispute reason, or merchant name is a stored-XSS sink.

## F2 — Sensitive data in `localStorage`

**Severity**: IMPORTANT · **OWASP**: A07

Tokens, card PANs, and cardholder PII should never be in `localStorage`. Use httpOnly cookies for session tokens.

## F3 — Open redirect via query param

**Severity**: IMPORTANT · **OWASP**: A01

If any component reads a `redirect` / `next` query param and assigns it to `window.location`, validate it is a relative path (`startsWith('/') && !startsWith('//')`).

## F4 — Amount displayed without `Intl.NumberFormat`

**Severity**: SUGGESTION

PayFlow stores amounts as integer cents. Direct division (`amount / 100`) introduces floating-point display errors. Always use `Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount / 100)` — or better, pass minor units to the formatter.

## F5 — Unsanitized user input in error toasts

**Severity**: IMPORTANT

If the API returns an error message that includes user input, displaying it via `toast(error.message)` without escaping can create reflected XSS.

## F6 — Risk-score color-only conveyance

**Severity**: IMPORTANT · **WCAG**: 1.4.1 (A) — accessibility, but security-relevant for fraud workflows

If risk is conveyed only via background color (green/yellow/red), colorblind reviewers can miss high-risk transactions. Pair color with text/icon.

## F7 — react-query cache leaking across users

**Severity**: IMPORTANT

When auth lands, ensure `queryClient.clear()` runs on logout. Otherwise the previous user's cached transactions remain in memory.

## F8 — `axios` without timeout

**Severity**: SUGGESTION

`frontend/src/api/config.ts` should set a `timeout` on the axios instance so a hung API can't hang the UI indefinitely.
