# GitHub Copilot Instructions for PayFlow Network

## Project Overview
A TypeScript monorepo payment network operations platform with Express.js API backend and React frontend. Uses npm workspaces to manage `api/` and `frontend/` packages. Built as a demonstration project showcasing GitHub Copilot capabilities in a financial/payment processing domain.

> **Key docs**: [Architecture](../docs/architecture.md) · [Build & Run](../docs/build.md) · [Deployment](../docs/deployment.md) · [Demo Script](../docs/demo-script.md)

## Architecture

### Data Model (ERD)
```
Issuer → Cardholder → Card → Transaction → Dispute
Issuer → Settlement
```

### Key Directories
- `api/src/models/` - TypeScript interfaces with Swagger JSDoc annotations
- `api/src/routes/` - Express route handlers (one per entity)
- `api/src/seedData.ts` - In-memory mock data (no database; data resets on restart)
- `api/src/index.ts` - Express app setup: CORS, Swagger, route registration
- `frontend/src/components/entity/` - Entity-specific React components
- `frontend/src/api/config.ts` - API base URL configuration with Codespace auto-detection
- `.github/prompts/` - Reusable prompt files for common tasks
- `.github/agents/` - Custom chat agents for specialized workflows

### Entities & Seed Data
Seven entities with in-memory seed data in `api/src/seedData.ts`:
`Issuers` · `Cardholders` · `Cards` · `Merchants` · `Transactions` · `Disputes` · `Settlements`

Key domain concepts:
- **Amount fields** are stored as integers in minor currency units (cents). Always format with `Intl.NumberFormat`.
- **Risk score** (0–100) on transactions: green < 40, yellow 40–69, red ≥ 70.
- **Transaction status**: `pending` → `approved`/`declined` → `settled`/`reversed`

## Development Commands

```bash
# Install all dependencies (from root)
npm install

# Run both API (port 3000) and frontend (port 5137) concurrently
npm run dev

# Run individually
npm run dev:api      # API only at http://localhost:3000
npm run dev:frontend # Frontend only at http://localhost:5137

# Build all workspaces
npm run build

# Run tests
npm run test               # All tests
npm run test:api           # API tests only (vitest)
npm run test:api -- --coverage  # With coverage report (output: api/coverage/)

# Frontend linting
npm run lint
```

## API Conventions

### Route Pattern
Each entity follows the same REST pattern in `api/src/routes/{entity}.ts`:
- `GET /api/{entities}` - List all
- `GET /api/{entities}/:id` - Get by ID
- `POST /api/{entities}` - Create new
- `PUT /api/{entities}/:id` - Update
- `DELETE /api/{entities}/:id` - Delete

Registered routes in `api/src/index.ts`:
`/api/issuers` · `/api/cardholders` · `/api/cards` · `/api/merchants` · `/api/transactions` · `/api/disputes` · `/api/settlements`

### Swagger Documentation
- Models use JSDoc `@swagger` annotations in `api/src/models/*.ts`
- Routes use JSDoc `@swagger` annotations for endpoint docs
- View at http://localhost:3000/api-docs when API is running

### Test Pattern, Route Pattern & Naming Conventions
See [.github/instructions/api.instructions.md](.github/instructions/api.instructions.md) — auto-applied to all files in `api/src/`.

Reference implementations: [api/src/routes/issuer.ts](api/src/routes/issuer.ts) · [api/src/routes/issuer.test.ts](api/src/routes/issuer.test.ts)

### Adding New Entities
Use `/add-entity` skill (`.github/skills/add-entity/SKILL.md`) for a guided step-by-step workflow. Manual steps:
1. Model interface in `api/src/models/{entity}.ts` with Swagger schema
2. Seed array in `api/src/seedData.ts` — pluralized export (`export const widgets: Widget[]`)
3. Route file `api/src/routes/{entity}.ts` — local mutable copy + `reset{Entity}()` export
4. Register in `api/src/index.ts`: `app.use('/api/{entities}', {entity}Routes)`
5. Add to `frontend/src/api/config.ts`: `{entities}: '/api/{entities}'`

## Frontend Conventions

See [.github/instructions/reactjs.instructions.md](.github/instructions/reactjs.instructions.md) — auto-applied to all files in `frontend/src/`.

**Summary**: react-query v3 + axios for data fetching; Tailwind + `useTheme()` for dark mode; entity views under `frontend/src/components/entity/{name}/`. Always call `queryClient.invalidateQueries('{entity}')` after mutations.

## CORS Configuration
API accepts requests from:
- `http://localhost:5137` (frontend dev server)
- `http://localhost:3001`
- `*.app.github.dev` (Codespaces)
- Custom origins via `API_CORS_ORIGINS` env var (comma-separated)

## Copilot Coding Agent

The repo includes `.github/workflows/copilot-setup-steps.yml` which pre-installs dependencies for Copilot coding agents:
- Checks out code and sets up **Node.js 22**
- Runs `npm ci` to restore all workspace packages

Agents should run `npm install` from the workspace root if dependencies are missing before running build or test commands.

## Known Pitfalls
- **Data resets on restart**: In-memory store has no persistence — expected for demo
- **Tests must call `reset{Entity}()`** in `beforeEach` or state leaks between tests
- **Swagger docs are generated at startup**: Restart API to pick up annotation changes
- **`API_CORS_ORIGINS` must be set** when running in non-standard environments
- **react-query cache**: No automatic refetch after mutations; manually invalidate queries
- **Port conflicts**: Set `PORT` env var for API; Vite auto-increments frontend port
- **Amount fields**: Always integers in minor currency units; never store floats

## Custom Prompts & Agents

| Prompt/Agent | How to invoke | Purpose |
|---|---|---|
| [Unit-Test-Coverage](.github/prompts/Unit-Test-Coverage.prompt.md) | `/Unit-Test-Coverage` | Generate vitest tests for routes following project patterns |
| [plan](.github/prompts/plan.prompt.md) | `/plan` | Plan code changes without implementing; produces implementation plan doc |
| [ImplementationIdeas](.github/agents/ImplementationIdeas.agent.md) | `@ImplementationIdeas` | Creative feature exploration; searches code and external repos |
| [API Architect](.github/agents/api-architect.agent.md) | `@API Architect` | Guided API connectors with service/manager/resilience layers |

## Workspace Skills

Invoke with `/` prefix in chat:

| Skill | Trigger | Purpose |
|---|---|---|
| [add-entity](.github/skills/add-entity/SKILL.md) | `/add-entity` | Guided 7-step workflow to add a new payment entity (model, seed, route, frontend) |
