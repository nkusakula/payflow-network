# Demo Script

This guide walks through key GitHub Copilot demonstrations using the PayFlow Network codebase. Designed for advanced users wanting to see custom instructions, agents, and skills in action.

---

## Setup

1. Open the `PayFlow/` folder in VS Code
2. Run `npm install` then `npm run dev`
3. Open GitHub Copilot Chat (Ctrl+Shift+I)

---

## Demo 1: Custom Instructions in Action

**Scenario**: Ask Copilot to create a new route and observe how it follows project conventions automatically.

1. Open Copilot Chat
2. Type: `Create a new route for tracking fraud alerts`
3. Watch Copilot automatically:
   - Use the local mutable copy pattern (`let items = [...]`)
   - Export `resetFraudAlerts()` for test isolation
   - Add Swagger JSDoc annotations
   - Store amounts as integers in minor currency units

**Why it works**: `.github/instructions/api.instructions.md` is auto-applied to all `api/src/**` files.

---

## Demo 2: The `/add-entity` Skill

**Scenario**: Guided workflow to add a complete new entity end-to-end.

1. In Copilot Chat, type: `/add-entity`
2. The skill walks through 7 steps:
   - Define the model
   - Create seed data
   - Build the route
   - Register the route
   - Update frontend config
   - Create the React component
   - Add navigation link

**Try it with**: `Add a TokenVault entity to track card tokenization records`

---

## Demo 3: `/Unit-Test-Coverage` Prompt

**Scenario**: Generate comprehensive tests for an existing route.

1. Open `api/src/routes/dispute.ts`
2. In Copilot Chat: `/Unit-Test-Coverage`
3. Copilot generates full test suite with:
   - `beforeEach(() => resetDisputes())`
   - All CRUD endpoint tests
   - 404 handling

---

## Demo 4: `@API Architect` Agent

**Scenario**: Get expert guidance on extending the API with a complex feature.

1. In Copilot Chat: `@API Architect How should I add real-time authorization rules to the transaction processing flow?`
2. The agent provides:
   - Domain-aware guidance (knows about card networks, MCC codes, etc.)
   - Security considerations (PAN masking, audit logging)
   - Step-by-step implementation approach

---

## Demo 5: `@ImplementationIdeas` Agent

**Scenario**: Brainstorm new features for the platform.

1. In Copilot Chat: `@ImplementationIdeas What features would make the fraud detection system more realistic?`
2. The agent returns multiple ideas with:
   - API changes required
   - Frontend impact
   - Demo value assessment
   - Complexity rating

---

## Demo 6: `/plan` Prompt

**Scenario**: Plan a significant change before writing any code.

1. In Copilot Chat: `/plan Add a real-time notifications system when a transaction is declined or a dispute is filed`
2. Copilot produces a structured plan with:
   - Files to create/modify
   - Order of operations
   - Risks and considerations

---

## Key Talking Points

- **Custom instructions** eliminate repeated context-setting
- **Skills** guide complex multi-step workflows
- **Agents** bring domain expertise without extra prompting
- **In-memory store** makes demos safe — data always resets
- **Risk scores** on transactions show AI-ready data design
- **Swagger UI** at `/api-docs` is auto-generated from JSDoc annotations
