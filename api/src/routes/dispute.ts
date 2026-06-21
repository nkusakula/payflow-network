import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { disputes, resetDisputes } from '../seedData';
import { Dispute } from '../models/dispute';

export { resetDisputes };

const router = Router();

type DisputeStatus = Dispute['status'];

/**
 * Allowed dispute status transitions, defined in one place for easy auditing.
 * Lifecycle: open -> under_review -> resolved_cardholder | resolved_merchant | closed
 * Resolved/closed states are terminal (no further transitions allowed).
 */
const allowedTransitions: Record<DisputeStatus, DisputeStatus[]> = {
  open: ['under_review'],
  under_review: ['resolved_cardholder', 'resolved_merchant', 'closed'],
  resolved_cardholder: [],
  resolved_merchant: [],
  closed: [],
};

const terminalStatuses: DisputeStatus[] = ['resolved_cardholder', 'resolved_merchant', 'closed'];

const isDisputeStatus = (value: unknown): value is DisputeStatus =>
  typeof value === 'string' && Object.prototype.hasOwnProperty.call(allowedTransitions, value);

const isValidTransition = (from: DisputeStatus, to: DisputeStatus): boolean =>
  from === to || allowedTransitions[from].includes(to);

/**
 * @swagger
 * /api/disputes:
 *   get:
 *     summary: List all disputes
 *     tags: [Disputes]
 *     responses:
 *       200:
 *         description: Array of disputes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Dispute'
 */
router.get('/', (_req: Request, res: Response) => {
  res.json(disputes);
});

/**
 * @swagger
 * /api/disputes/{id}:
 *   get:
 *     summary: Get a dispute by ID
 *     tags: [Disputes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dispute found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dispute'
 *       404:
 *         description: Dispute not found
 */
router.get('/:id', (req: Request, res: Response) => {
  const dispute = disputes.find((d) => d.id === req.params.id);
  if (!dispute) return res.status(404).json({ error: 'Dispute not found' });
  res.json(dispute);
});

/**
 * @swagger
 * /api/disputes:
 *   post:
 *     summary: File a new dispute
 *     tags: [Disputes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Dispute'
 *     responses:
 *       201:
 *         description: Dispute filed
 */
router.post('/', (req: Request, res: Response) => {
  const dispute: Dispute = {
    ...req.body,
    id: req.body.id || uuidv4(),
    status: req.body.status || 'open',
    filedAt: req.body.filedAt || new Date().toISOString(),
  };
  disputes.push(dispute);
  res.status(201).json(dispute);
});

/**
 * @swagger
 * /api/disputes/{id}:
 *   put:
 *     summary: Update a dispute
 *     tags: [Disputes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Dispute'
 *     responses:
 *       200:
 *         description: Dispute updated
 *       400:
 *         description: Invalid status value
 *       404:
 *         description: Dispute not found
 *       409:
 *         description: Illegal status transition
 */
router.put('/:id', (req: Request, res: Response) => {
  const index = disputes.findIndex((d) => d.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Dispute not found' });

  const current = disputes[index];
  const updates = { ...req.body };
  delete updates.id;

  if (updates.status !== undefined && updates.status !== current.status) {
    const nextStatus = updates.status;
    if (!isDisputeStatus(nextStatus)) {
      return res.status(400).json({ error: `Invalid dispute status: ${nextStatus}` });
    }
    if (!isValidTransition(current.status, nextStatus)) {
      return res.status(409).json({
        error: `Illegal status transition from '${current.status}' to '${nextStatus}'`,
      });
    }
    if (terminalStatuses.includes(nextStatus) && !updates.resolvedAt) {
      updates.resolvedAt = new Date().toISOString();
    }
  }

  disputes[index] = { ...current, ...updates, id: req.params.id };
  res.json(disputes[index]);
});

/**
 * @swagger
 * /api/disputes/{id}:
 *   delete:
 *     summary: Delete a dispute
 *     tags: [Disputes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Dispute deleted
 *       404:
 *         description: Dispute not found
 */
router.delete('/:id', (req: Request, res: Response) => {
  const index = disputes.findIndex((d) => d.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Dispute not found' });
  disputes.splice(index, 1);
  res.status(204).send();
});

export default router;
