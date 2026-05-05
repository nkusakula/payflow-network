import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { settlements, resetSettlements } from '../seedData';
import { Settlement } from '../models/settlement';

export { resetSettlements };

const router = Router();

/**
 * @swagger
 * /api/settlements:
 *   get:
 *     summary: List all settlements
 *     tags: [Settlements]
 *     responses:
 *       200:
 *         description: Array of settlements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Settlement'
 */
router.get('/', (_req: Request, res: Response) => {
  res.json(settlements);
});

/**
 * @swagger
 * /api/settlements/{id}:
 *   get:
 *     summary: Get a settlement by ID
 *     tags: [Settlements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Settlement found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Settlement'
 *       404:
 *         description: Settlement not found
 */
router.get('/:id', (req: Request, res: Response) => {
  const settlement = settlements.find((s) => s.id === req.params.id);
  if (!settlement) return res.status(404).json({ error: 'Settlement not found' });
  res.json(settlement);
});

/**
 * @swagger
 * /api/settlements:
 *   post:
 *     summary: Create a new settlement batch
 *     tags: [Settlements]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Settlement'
 *     responses:
 *       201:
 *         description: Settlement created
 */
router.post('/', (req: Request, res: Response) => {
  const settlement: Settlement = {
    ...req.body,
    id: req.body.id || uuidv4(),
  };
  settlements.push(settlement);
  res.status(201).json(settlement);
});

/**
 * @swagger
 * /api/settlements/{id}:
 *   put:
 *     summary: Update a settlement
 *     tags: [Settlements]
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
 *             $ref: '#/components/schemas/Settlement'
 *     responses:
 *       200:
 *         description: Settlement updated
 *       404:
 *         description: Settlement not found
 */
router.put('/:id', (req: Request, res: Response) => {
  const index = settlements.findIndex((s) => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Settlement not found' });
  settlements[index] = { ...settlements[index], ...req.body, id: req.params.id };
  res.json(settlements[index]);
});

/**
 * @swagger
 * /api/settlements/{id}:
 *   delete:
 *     summary: Delete a settlement
 *     tags: [Settlements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Settlement deleted
 *       404:
 *         description: Settlement not found
 */
router.delete('/:id', (req: Request, res: Response) => {
  const index = settlements.findIndex((s) => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Settlement not found' });
  settlements.splice(index, 1);
  res.status(204).send();
});

export default router;
