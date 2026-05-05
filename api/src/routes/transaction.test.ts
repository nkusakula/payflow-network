import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../index';
import { resetTransactions } from '../seedData';

beforeEach(() => {
  resetTransactions();
});

describe('GET /api/transactions', () => {
  it('returns all transactions', async () => {
    const res = await request(app).get('/api/transactions');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe('GET /api/transactions/:id', () => {
  it('returns the transaction when found', async () => {
    const res = await request(app).get('/api/transactions/TXN001');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('TXN001');
    expect(res.body.status).toBe('settled');
  });

  it('returns 404 when not found', async () => {
    const res = await request(app).get('/api/transactions/INVALID');
    expect(res.status).toBe(404);
  });
});

describe('POST /api/transactions', () => {
  it('creates a new transaction', async () => {
    const newTxn = {
      cardId: 'CRD001',
      merchantId: 'MER004',
      amount: 5000,
      currency: 'USD',
      status: 'approved',
      type: 'purchase',
      authCode: 'Z99999',
      riskScore: 10,
    };
    const res = await request(app).post('/api/transactions').send(newTxn);
    expect(res.status).toBe(201);
    expect(res.body.amount).toBe(5000);
    expect(res.body.id).toBeDefined();
  });
});

describe('PUT /api/transactions/:id', () => {
  it('updates a transaction status', async () => {
    const res = await request(app)
      .put('/api/transactions/TXN012')
      .send({ status: 'approved' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('approved');
  });

  it('returns 404 for unknown transaction', async () => {
    const res = await request(app).put('/api/transactions/NOPE').send({ status: 'settled' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/transactions/:id', () => {
  it('deletes a transaction', async () => {
    const res = await request(app).delete('/api/transactions/TXN001');
    expect(res.status).toBe(204);
    const check = await request(app).get('/api/transactions/TXN001');
    expect(check.status).toBe(404);
  });

  it('returns 404 for unknown transaction', async () => {
    const res = await request(app).delete('/api/transactions/NOPE');
    expect(res.status).toBe(404);
  });
});
