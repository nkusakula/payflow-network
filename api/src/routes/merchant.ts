import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { merchants, resetMerchants } from '../seedData';
import { Merchant } from '../models/merchant';

export { resetMerchants };

const router = Router();

/**
 * @swagger
 * /api/merchants:
 *   get:
 *     summary: List all merchants
 *     tags: [Merchants]
 *     responses:
 *       200:
 *         description: Array of merchants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Merchant'
 */
router.get('/', (_req: Request, res: Response) => {
  res.json(merchants);
});

/**
 * @swagger
 * /api/merchants/{id}:
 *   get:
 *     summary: Get a merchant by ID
 *     tags: [Merchants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Merchant found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Merchant'
 *       404:
 *         description: Merchant not found
 */
router.get('/:id', (req: Request, res: Response) => {
  const merchant = merchants.find((m) => m.id === req.params.id);
  if (!merchant) return res.status(404).json({ error: 'Merchant not found' });
  res.json(merchant);
});

/**
 * @swagger
 * /api/merchants:
 *   post:
 *     summary: Create a new merchant
 *     tags: [Merchants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Merchant'
 *     responses:
 *       201:
 *         description: Merchant created
 */
router.post('/', (req: Request, res: Response) => {
  const merchant: Merchant = {
    ...req.body,
    id: req.body.id || uuidv4(),
    enrolledAt: req.body.enrolledAt || new Date().toISOString(),
  };
  merchants.push(merchant);
  res.status(201).json(merchant);
});

/**
 * @swagger
 * /api/merchants/{id}:
 *   put:
 *     summary: Update a merchant
 *     tags: [Merchants]
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
 *             $ref: '#/components/schemas/Merchant'
 *     responses:
 *       200:
 *         description: Merchant updated
 *       404:
 *         description: Merchant not found
 */
router.put('/:id', (req: Request, res: Response) => {
  const index = merchants.findIndex((m) => m.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Merchant not found' });
  merchants[index] = { ...merchants[index], ...req.body, id: req.params.id };
  res.json(merchants[index]);
});

/**
 * @swagger
 * /api/merchants/{id}:
 *   delete:
 *     summary: Delete a merchant
 *     tags: [Merchants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Merchant deleted
 *       404:
 *         description: Merchant not found
 */
router.delete('/:id', (req: Request, res: Response) => {
  const index = merchants.findIndex((m) => m.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Merchant not found' });
  merchants.splice(index, 1);
  res.status(204).send();
});

export default router;
