import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../index';
import { resetDisputes } from './dispute';

beforeEach(() => {
  resetDisputes();
});

describe('PUT /api/disputes/:id status transitions', () => {
  it('allows a legal transition from open to under_review', async () => {
    const res = await request(app)
      .put('/api/disputes/DSP003')
      .send({ status: 'under_review' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('under_review');
    expect(res.body.resolvedAt).toBeUndefined();
  });

  it('allows a legal transition from under_review to resolved_cardholder and sets resolvedAt', async () => {
    const res = await request(app)
      .put('/api/disputes/DSP001')
      .send({ status: 'resolved_cardholder' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('resolved_cardholder');
    expect(res.body.resolvedAt).toBeTruthy();
  });

  it('rejects skipping required lifecycle steps', async () => {
    const res = await request(app)
      .put('/api/disputes/DSP006')
      .send({ status: 'resolved_cardholder' });

    expect(res.status).toBe(409);
    expect(res.body.error).toContain('Invalid dispute status transition');
  });

  it('rejects transitions from a terminal state', async () => {
    const res = await request(app)
      .put('/api/disputes/DSP005')
      .send({ status: 'open' });

    expect(res.status).toBe(409);
    expect(res.body.error).toContain('Terminal dispute states cannot transition');
  });

  it('rejects invalid status values', async () => {
    const res = await request(app)
      .put('/api/disputes/DSP003')
      .send({ status: 'invalid_status' });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Invalid dispute status');
  });
});
