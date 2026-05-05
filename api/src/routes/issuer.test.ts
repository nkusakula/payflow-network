import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../index';
import { issuers, resetIssuers } from '../seedData';

beforeEach(() => {
  resetIssuers();
});

describe('GET /api/issuers', () => {
  it('returns all issuers', async () => {
    const res = await request(app).get('/api/issuers');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe('GET /api/issuers/:id', () => {
  it('returns the issuer when found', async () => {
    const res = await request(app).get('/api/issuers/ISS001');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('ISS001');
    expect(res.body.name).toBe('First National Bank');
  });

  it('returns 404 when not found', async () => {
    const res = await request(app).get('/api/issuers/INVALID');
    expect(res.status).toBe(404);
  });
});

describe('POST /api/issuers', () => {
  it('creates a new issuer', async () => {
    const newIssuer = {
      name: 'Test Bank',
      country: 'US',
      bankCode: '999999',
      currency: 'USD',
      status: 'active',
      contactEmail: 'test@testbank.com',
    };
    const res = await request(app).post('/api/issuers').send(newIssuer);
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Test Bank');
    expect(res.body.id).toBeDefined();
  });
});

describe('PUT /api/issuers/:id', () => {
  it('updates an existing issuer', async () => {
    const res = await request(app)
      .put('/api/issuers/ISS002')
      .send({ status: 'suspended' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('suspended');
  });

  it('returns 404 for unknown issuer', async () => {
    const res = await request(app).put('/api/issuers/NOPE').send({ status: 'active' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/issuers/:id', () => {
  it('deletes an issuer', async () => {
    const res = await request(app).delete('/api/issuers/ISS001');
    expect(res.status).toBe(204);
    const check = await request(app).get('/api/issuers/ISS001');
    expect(check.status).toBe(404);
  });

  it('returns 404 for unknown issuer', async () => {
    const res = await request(app).delete('/api/issuers/NOPE');
    expect(res.status).toBe(404);
  });
});
