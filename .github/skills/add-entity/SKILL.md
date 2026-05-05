name: add-entity
description: Guided 7-step workflow to add a new payment entity to the PayFlow Network API and frontend.

# Add Entity Skill

Use this skill when asked to add a new entity, resource type, or data model to the PayFlow Network system.

## Step 1: Define the Entity

Ask (or infer from context):
- Entity name (singular, e.g. `Token`, `AuthLog`)
- Fields and their types
- Status values if applicable
- Relationships to existing entities (Issuer, Card, Transaction, etc.)

## Step 2: Create the Model

Create `api/src/models/{entity}.ts`:

```typescript
export interface Entity {
  id: string;
  // ... fields
}
```

Add Swagger JSDoc `@swagger` component schema annotation above the interface.

## Step 3: Add Seed Data

In `api/src/seedData.ts`:
1. Import the new interface
2. Add 3–5 realistic seed objects as a `const` array
3. Export with plural name: `export const entities: Entity[] = [...]`
4. Export a reset function: `export const reset{Entity}Data = () => [...entities]`

## Step 4: Create the Route

Create `api/src/routes/{entity}.ts`:
1. Import router, uuidv4, seed data, and interface
2. Create `let items = [...entities]` local mutable copy
3. Export `reset{Entity}()` that resets items
4. Implement GET all, GET by ID, POST (with uuidv4), PUT, DELETE
5. Add Swagger JSDoc annotations on each route

## Step 5: Register the Route

In `api/src/index.ts`:
1. Import the new route: `import {entity}Routes from './routes/{entity}';`
2. Register: `app.use('/api/{entities}', {entity}Routes);`

## Step 6: Update Frontend Config

In `frontend/src/api/config.ts`:
Add to `API_ENDPOINTS`: `{entities}: '/api/{entities}'`

## Step 7: Create Frontend Component

Create `frontend/src/components/entity/{entity}/{Entities}.tsx`:
- Use react-query to fetch data
- Display in a table with search filter
- Add status badges if applicable
- Add to `App.tsx` Routes: `<Route path="/{entities}" element={<Entities />} />`
- Add nav link to `Navigation.tsx`

## Reference Files

- Model: `api/src/models/issuer.ts`
- Route: `api/src/routes/issuer.ts`
- Test: `api/src/routes/issuer.test.ts`
- Frontend: `frontend/src/components/entity/issuer/Issuers.tsx`
