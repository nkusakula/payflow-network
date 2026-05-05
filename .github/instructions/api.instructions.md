---
applyTo: "api/src/**/*.{ts,js}"
---

# API Coding Instructions

## Route File Structure

Each route file in `api/src/routes/{entity}.ts` must follow this pattern:

```typescript
import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { entities } from '../seedData';
import { Entity } from '../models/entity';

const router = Router();

// Local mutable copy of seed data
let items: Entity[] = [...entities];

// Reset function for test isolation — MUST be exported
export const resetEntities = () => {
  items = [...entities];
};

// Routes: GET all, GET by ID, POST, PUT, DELETE
export default router;
```

## Naming Conventions

- **Route files**: `api/src/routes/{entity}.ts` (singular, camelCase)
- **Test files**: `api/src/routes/{entity}.test.ts` (same name + `.test`)
- **Model files**: `api/src/models/{entity}.ts` (singular, camelCase)
- **Route paths**: `/api/{entities}` (plural, kebab-case, e.g. `order-details`)
- **Reset function**: `reset{Entity}()` — exported named function, e.g. `resetIssuers()`
- **Local array**: `let items: Entity[]` — always a local mutable copy from seed data

## Test Pattern

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import entityRoutes, { resetEntities } from './entity';

const app = express();
app.use(express.json());
app.use('/api/entities', entityRoutes);

describe('Entity Routes', () => {
  beforeEach(() => {
    resetEntities(); // REQUIRED — prevents state leak between tests
  });

  it('GET /api/entities returns all entities', async () => {
    const res = await request(app).get('/api/entities');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  
  // ...additional tests for GET by ID, POST, PUT, DELETE
});
```

## Key Rules

1. **Always export `reset{Entity}()`** from every route file.
2. **Always call `reset{Entity}()` in `beforeEach`** in test files.
3. **Use `uuidv4()`** to generate IDs on POST when not provided by the client.
4. **Return 404** with `{ error: 'Not found' }` when an entity doesn't exist.
5. **Return 400** for invalid input at system boundaries only.
6. **Amount fields** are integers in minor currency units (cents). Never store floats.
7. **Swagger annotations** are required on all model interfaces and route handlers.

## Swagger Annotation Template

Model:
```typescript
/**
 * @swagger
 * components:
 *   schemas:
 *     Entity:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 */
```

Route:
```typescript
/**
 * @swagger
 * /api/entities:
 *   get:
 *     summary: Get all entities
 *     tags: [Entities]
 *     responses:
 *       200:
 *         description: List of entities
 */
```
