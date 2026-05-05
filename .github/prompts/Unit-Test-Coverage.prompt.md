# Generate Unit Test Coverage

Generate comprehensive vitest tests for the specified route file, following the project test patterns.

## Instructions

Look at the target route file and generate a complete test file that covers:

1. **GET all** — returns 200 + array
2. **GET by ID** — returns 200 + correct item; returns 404 for unknown ID
3. **POST** — creates new item, returns 201 + created object with generated ID
4. **PUT** — updates existing item, returns 200 + updated object; returns 404 for unknown ID
5. **DELETE** — removes item, returns 204; returns 404 for unknown ID

## Requirements

- Import `{ describe, it, expect, beforeEach }` from `vitest`
- Import `request` from `supertest`
- Import the router as default + the `reset{Entity}()` named export
- Call `reset{Entity}()` in `beforeEach` to prevent state leak between tests
- Set up a minimal express app with `express.json()` middleware
- Use realistic test data matching the entity's interface

## Example Pattern

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import issuerRoutes, { resetIssuers } from './issuer';

const app = express();
app.use(express.json());
app.use('/api/issuers', issuerRoutes);

describe('Issuer Routes', () => {
  beforeEach(() => {
    resetIssuers();
  });

  it('GET /api/issuers returns all issuers', async () => {
    const res = await request(app).get('/api/issuers');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /api/issuers/:id returns issuer by ID', async () => {
    const res = await request(app).get('/api/issuers/ISS001');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('ISS001');
  });

  it('GET /api/issuers/:id returns 404 for unknown ID', async () => {
    const res = await request(app).get('/api/issuers/UNKNOWN');
    expect(res.status).toBe(404);
  });

  // ... POST, PUT, DELETE tests
});
```

## Target

Generate tests for: [specify route file here]
