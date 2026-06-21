import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { disputes, resetDisputes } from '../seedData';
import { Dispute } from '../models/dispute';

export { resetDisputes };

const router = Router();
type DisputeStatus = Dispute['status'];

const ALLOWED_DISPUTE_STATUS_TRANSITIONS: Record<DisputeStatus, DisputeStatus[]> = {
  open: ['under_review'],
  under_review: ['resolved_cardholder', 'resolved_merchant', 'closed'],
  resolved_cardholder: [],
  resolved_merchant: [],
  closed: [],
};
const DISPUTE_STATUSES_LIST = Object.keys(ALLOWED_DISPUTE_STATUS_TRANSITIONS).sort().join(', ');

const TERMINAL_DISPUTE_STATUSES: ReadonlySet<DisputeStatus> = new Set([
  'resolved_cardholder',
  'resolved_merchant',
  'closed',
]);

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
 *       404:
 *         description: Dispute not found
 */
router.put('/:id', (req: Request, res: Response) => {
  const index = disputes.findIndex((d) => d.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Dispute not found' });

  const currentDispute = disputes[index];
  const statusFromBody = req.body.status;
  if (typeof statusFromBody !== 'undefined' && typeof statusFromBody !== 'string') {
    return res.status(400).json({
      error: `Invalid dispute status payload type: expected string, received ${typeof statusFromBody}. Valid statuses are: ${DISPUTE_STATUSES_LIST}.`,
    });
  }
  const nextStatus = statusFromBody as DisputeStatus | undefined;

  if (typeof nextStatus !== 'undefined') {
    if (!(nextStatus in ALLOWED_DISPUTE_STATUS_TRANSITIONS)) {
      return res.status(400).json({
        error: `Invalid dispute status: ${nextStatus}. Valid statuses are: ${DISPUTE_STATUSES_LIST}.`,
      });
    }

    if (nextStatus !== currentDispute.status) {
      const allowedNextStatuses = ALLOWED_DISPUTE_STATUS_TRANSITIONS[currentDispute.status];
      if (!allowedNextStatuses.includes(nextStatus)) {
        return res.status(409).json({
          error: TERMINAL_DISPUTE_STATUSES.has(currentDispute.status)
            ? `Invalid dispute status transition from ${currentDispute.status} to ${nextStatus}. Terminal dispute states cannot transition.`
            : `Invalid dispute status transition from ${currentDispute.status} to ${nextStatus}. Valid transitions: ${allowedNextStatuses.join(', ')}.`,
        });
      }
    }
  }

  const shouldSetResolvedAt =
    typeof nextStatus !== 'undefined' &&
    nextStatus !== currentDispute.status &&
    TERMINAL_DISPUTE_STATUSES.has(nextStatus);
  const updatedDispute: Dispute = {
    ...currentDispute,
    ...req.body,
    id: req.params.id,
    ...(shouldSetResolvedAt ? { resolvedAt: new Date().toISOString() } : {}),
  };

  disputes[index] = updatedDispute;
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
