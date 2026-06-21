import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../index';
import { resetDisputes } from '../seedData';

beforeEach(() => {
  resetDisputes();
});

describe('GET /api/disputes', () => {
  it('returns all disputes', async () => {
    const res = await request(app).get('/api/disputes');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe('GET /api/disputes/:id', () => {
  it('returns the dispute when found', async () => {
    const res = await request(app).get('/api/disputes/DSP001');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('DSP001');
  });

  it('returns 404 when not found', async () => {
    const res = await request(app).get('/api/disputes/INVALID');
    expect(res.status).toBe(404);
  });
});

describe('PUT /api/disputes/:id — legal transitions', () => {
  it('allows open -> under_review', async () => {
    const res = await request(app)
      .put('/api/disputes/DSP003')
      .send({ status: 'under_review' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('under_review');
  });

  it('allows under_review -> resolved_cardholder', async () => {
    const res = await request(app)
      .put('/api/disputes/DSP001')
      .send({ status: 'resolved_cardholder' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('resolved_cardholder');
  });

  it('allows under_review -> resolved_merchant', async () => {
    const res = await request(app)
      .put('/api/disputes/DSP007')
      .send({ status: 'resolved_merchant' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('resolved_merchant');
  });

  it('allows under_review -> closed', async () => {
    const res = await request(app)
      .put('/api/disputes/DSP001')
      .send({ status: 'closed' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('closed');
  });

  it('allows updating other fields without changing status', async () => {
    const res = await request(app)
      .put('/api/disputes/DSP003')
      .send({ description: 'Updated description' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('open');
    expect(res.body.description).toBe('Updated description');
  });
});

describe('PUT /api/disputes/:id — illegal transitions', () => {
  it('rejects open -> resolved_cardholder (skipping under_review) with 409', async () => {
    const res = await request(app)
      .put('/api/disputes/DSP003')
      .send({ status: 'resolved_cardholder' });
    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/illegal status transition/i);
  });

  it('rejects open -> closed (skipping under_review) with 409', async () => {
    const res = await request(app)
      .put('/api/disputes/DSP003')
      .send({ status: 'closed' });
    expect(res.status).toBe(409);
  });

  it('rejects transition out of a terminal state (closed -> open) with 409', async () => {
    const res = await request(app)
      .put('/api/disputes/DSP005')
      .send({ status: 'open' });
    expect(res.status).toBe(409);
  });

  it('rejects transition out of resolved_cardholder with 409', async () => {
    const res = await request(app)
      .put('/api/disputes/DSP002')
      .send({ status: 'under_review' });
    expect(res.status).toBe(409);
  });

  it('rejects an unknown status value with 400', async () => {
    const res = await request(app)
      .put('/api/disputes/DSP003')
      .send({ status: 'bogus_status' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/invalid dispute status/i);
  });

  it('returns 404 for unknown dispute', async () => {
    const res = await request(app)
      .put('/api/disputes/NOPE')
      .send({ status: 'under_review' });
    expect(res.status).toBe(404);
  });
});

describe('PUT /api/disputes/:id — resolvedAt behavior', () => {
  it('sets resolvedAt automatically when moving into a resolved state', async () => {
    const res = await request(app)
      .put('/api/disputes/DSP001')
      .send({ status: 'resolved_merchant' });
    expect(res.status).toBe(200);
    expect(res.body.resolvedAt).toBeDefined();
    expect(new Date(res.body.resolvedAt).toString()).not.toBe('Invalid Date');
  });

  it('sets resolvedAt automatically when moving into closed', async () => {
    const res = await request(app)
      .put('/api/disputes/DSP001')
      .send({ status: 'closed' });
    expect(res.status).toBe(200);
    expect(res.body.resolvedAt).toBeDefined();
  });

  it('does not overwrite a provided resolvedAt', async () => {
    const resolvedAt = '2024-06-01T00:00:00.000Z';
    const res = await request(app)
      .put('/api/disputes/DSP001')
      .send({ status: 'closed', resolvedAt });
    expect(res.status).toBe(200);
    expect(res.body.resolvedAt).toBe(resolvedAt);
  });

  it('does not set resolvedAt for non-terminal transitions', async () => {
    const res = await request(app)
      .put('/api/disputes/DSP003')
      .send({ status: 'under_review' });
    expect(res.status).toBe(200);
    expect(res.body.resolvedAt).toBeUndefined();
  });
});
