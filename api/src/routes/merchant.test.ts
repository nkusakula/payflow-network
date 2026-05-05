import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../index';
import { resetMerchants } from '../seedData';

beforeEach(() => {
  resetMerchants();
});

describe('GET /api/merchants', () => {
  it('returns all merchants', async () => {
    const res = await request(app).get('/api/merchants');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe('GET /api/merchants/:id', () => {
  it('returns the merchant when found', async () => {
    const res = await request(app).get('/api/merchants/MER001');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('MER001');
    expect(res.body.name).toBe('TechMart Electronics');
  });

  it('returns 404 when not found', async () => {
    const res = await request(app).get('/api/merchants/INVALID');
    expect(res.status).toBe(404);
  });
});

describe('POST /api/merchants', () => {
  it('creates a new merchant', async () => {
    const newMerchant = {
      name: 'Test Shop',
      mcc: '5999',
      category: 'Miscellaneous Retail',
      country: 'US',
      city: 'Austin',
      acquirerId: 'ACQ001',
      status: 'active',
      acceptedCardTypes: ['credit', 'debit'],
    };
    const res = await request(app).post('/api/merchants').send(newMerchant);
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Test Shop');
    expect(res.body.id).toBeDefined();
  });
});

describe('PUT /api/merchants/:id', () => {
  it('updates an existing merchant', async () => {
    const res = await request(app)
      .put('/api/merchants/MER008')
      .send({ status: 'active' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('active');
  });

  it('returns 404 for unknown merchant', async () => {
    const res = await request(app).put('/api/merchants/NOPE').send({ status: 'active' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/merchants/:id', () => {
  it('deletes a merchant', async () => {
    const res = await request(app).delete('/api/merchants/MER001');
    expect(res.status).toBe(204);
    const check = await request(app).get('/api/merchants/MER001');
    expect(check.status).toBe(404);
  });

  it('returns 404 for unknown merchant', async () => {
    const res = await request(app).delete('/api/merchants/NOPE');
    expect(res.status).toBe(404);
  });
});
