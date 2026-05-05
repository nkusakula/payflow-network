# Architecture

## Overview

PayFlow Network is a payment network operations platform demonstrating a full-stack TypeScript monorepo. It simulates the core data flows of a card payment network: issuing, authorization, dispute management, and settlement.

## Data Model (ERD)

```
Issuer ──────────────────────────────────────── Settlement
  │
  ├── Cardholder
  │     └── Card
  │           └── Transaction ── Dispute
  │
  └── (Settlement references issuerId)
```

### Entity Relationships

| Entity | Belongs To | Has Many |
|---|---|---|
| Issuer | — | Cardholders, Cards, Settlements |
| Cardholder | Issuer | Cards |
| Card | Cardholder, Issuer | Transactions |
| Merchant | — | Transactions |
| Transaction | Card, Merchant | Disputes |
| Dispute | Transaction, Cardholder | — |
| Settlement | Issuer | — |

## Key Directories

```
PayFlow/
├── api/
│   └── src/
│       ├── index.ts          # Express app, CORS, Swagger, route registration
│       ├── seedData.ts       # In-memory mock data + reset functions
│       ├── models/           # TypeScript interfaces + Swagger schemas
│       └── routes/           # Express route handlers + test files
├── frontend/
│   └── src/
│       ├── App.tsx           # React Router setup, ThemeProvider wrapper
│       ├── main.tsx          # React root + QueryClientProvider
│       ├── api/config.ts     # API base URL + endpoint registry
│       ├── components/
│       │   ├── Navigation.tsx
│       │   ├── Footer.tsx
│       │   ├── Welcome.tsx   # Dashboard with live stats
│       │   └── entity/       # Entity-specific table+form views
│       └── context/
│           └── ThemeContext.tsx  # Dark mode provider
├── docs/
└── .github/
    ├── copilot-instructions.md
    ├── instructions/         # Auto-applied coding rules
    ├── prompts/              # Reusable /prompt commands
    ├── agents/               # Custom @agent definitions
    └── skills/               # Guided workflow skills
```

## Technology Stack

| Layer | Technology |
|---|---|
| API Runtime | Node.js 22, TypeScript, Express.js |
| API Docs | swagger-jsdoc, swagger-ui-express |
| Testing | Vitest, supertest |
| Frontend | React 18, TypeScript, Vite 5 |
| Styling | Tailwind CSS 3, dark mode via CSS class |
| Data Fetching | react-query v3, axios |
| Routing | react-router-dom v6 |
| Data Store | In-memory (no database) |

## Domain Concepts

### Amount Fields
All monetary amounts are stored as **integers in minor currency units** (cents, pence, etc.). The value `12500` means $125.00 USD. Always format with `Intl.NumberFormat`.

### Risk Score
Transactions carry a `riskScore` from 0–100 indicating fraud likelihood:
- **0–39**: Low risk (green)
- **40–69**: Medium risk (yellow)
- **70–100**: High risk (red)

### Transaction Lifecycle
```
pending → approved → settled
         ↘ declined
approved → reversed
```

### Dispute Lifecycle
```
open → under_review → resolved_cardholder
                    → resolved_merchant
                    → closed
```

### Settlement Lifecycle
```
pending → processing → completed
                     → failed
```
