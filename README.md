# PayFlow Network

A modern payment network operations platform built with GitHub Copilot. Manages issuers, cardholders, cards, merchants, transactions, disputes, and settlements across a global payment network.

> **Built as a GitHub Copilot demo** showcasing custom instructions, agent skills, and AI-assisted development for payment technology teams.

## Quick Start

```bash
npm install
npm run dev
```

- **API**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api-docs
- **Frontend**: http://localhost:5137

## Tech Stack

| Layer | Technology |
|---|---|
| API | Node.js + Express + TypeScript |
| Frontend | React + Vite + Tailwind CSS |
| Testing | Vitest |
| API Docs | Swagger / OpenAPI |
| Package Management | npm workspaces |

## Key Docs

- [Architecture](docs/architecture.md)
- [Build & Run](docs/build.md)
- [Demo Script](docs/demo-script.md)
- [Deployment](docs/deployment.md)

## Entities

| Entity | Description |
|---|---|
| **Issuers** | Banks and financial institutions that issue payment cards |
| **Cardholders** | End customers who hold payment cards |
| **Cards** | Credit and debit cards linked to issuers and cardholders |
| **Merchants** | Businesses and retailers accepting card payments |
| **Transactions** | Real-time payment transaction records |
| **Disputes** | Cardholder disputes and chargeback cases |
| **Settlements** | Daily batch settlement records between issuers and acquirers |

## GitHub Copilot Features

This repo is configured with:
- **Custom instructions** (`.github/instructions/`) for API and React conventions
- **Prompt files** (`.github/prompts/`) for test coverage and planning
- **Agent skills** (`.github/skills/`) for guided entity addition workflow
- **Custom agents** (`.github/agents/`) for specialized AI workflows
