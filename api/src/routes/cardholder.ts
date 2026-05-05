import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { cardholders, resetCardholders } from '../seedData';
import { Cardholder } from '../models/cardholder';

export { resetCardholders };

const router = Router();

/**
 * @swagger
 * /api/cardholders:
 *   get:
 *     summary: List all cardholders
 *     tags: [Cardholders]
 *     responses:
 *       200:
 *         description: Array of cardholders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cardholder'
 */
router.get('/', (_req: Request, res: Response) => {
  res.json(cardholders);
});

/**
 * @swagger
 * /api/cardholders/{id}:
 *   get:
 *     summary: Get a cardholder by ID
 *     tags: [Cardholders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cardholder found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cardholder'
 *       404:
 *         description: Cardholder not found
 */
router.get('/:id', (req: Request, res: Response) => {
  const cardholder = cardholders.find((c) => c.id === req.params.id);
  if (!cardholder) return res.status(404).json({ error: 'Cardholder not found' });
  res.json(cardholder);
});

/**
 * @swagger
 * /api/cardholders:
 *   post:
 *     summary: Create a new cardholder
 *     tags: [Cardholders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cardholder'
 *     responses:
 *       201:
 *         description: Cardholder created
 */
router.post('/', (req: Request, res: Response) => {
  const cardholder: Cardholder = {
    ...req.body,
    id: req.body.id || uuidv4(),
    createdAt: req.body.createdAt || new Date().toISOString(),
  };
  cardholders.push(cardholder);
  res.status(201).json(cardholder);
});

/**
 * @swagger
 * /api/cardholders/{id}:
 *   put:
 *     summary: Update a cardholder
 *     tags: [Cardholders]
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
 *             $ref: '#/components/schemas/Cardholder'
 *     responses:
 *       200:
 *         description: Cardholder updated
 *       404:
 *         description: Cardholder not found
 */
router.put('/:id', (req: Request, res: Response) => {
  const index = cardholders.findIndex((c) => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Cardholder not found' });
  cardholders[index] = { ...cardholders[index], ...req.body, id: req.params.id };
  res.json(cardholders[index]);
});

/**
 * @swagger
 * /api/cardholders/{id}:
 *   delete:
 *     summary: Delete a cardholder
 *     tags: [Cardholders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Cardholder deleted
 *       404:
 *         description: Cardholder not found
 */
router.delete('/:id', (req: Request, res: Response) => {
  const index = cardholders.findIndex((c) => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Cardholder not found' });
  cardholders.splice(index, 1);
  res.status(204).send();
});

export default router;
