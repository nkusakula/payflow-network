import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { cards, resetCards } from '../seedData';
import { Card } from '../models/card';

export { resetCards };

const router = Router();

/**
 * @swagger
 * /api/cards:
 *   get:
 *     summary: List all cards
 *     tags: [Cards]
 *     responses:
 *       200:
 *         description: Array of cards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Card'
 */
router.get('/', (_req: Request, res: Response) => {
  res.json(cards);
});

/**
 * @swagger
 * /api/cards/{id}:
 *   get:
 *     summary: Get a card by ID
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Card found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       404:
 *         description: Card not found
 */
router.get('/:id', (req: Request, res: Response) => {
  const card = cards.find((c) => c.id === req.params.id);
  if (!card) return res.status(404).json({ error: 'Card not found' });
  res.json(card);
});

/**
 * @swagger
 * /api/cards:
 *   post:
 *     summary: Issue a new card
 *     tags: [Cards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Card'
 *     responses:
 *       201:
 *         description: Card issued
 */
router.post('/', (req: Request, res: Response) => {
  const card: Card = {
    ...req.body,
    id: req.body.id || uuidv4(),
    issuedAt: req.body.issuedAt || new Date().toISOString(),
  };
  cards.push(card);
  res.status(201).json(card);
});

/**
 * @swagger
 * /api/cards/{id}:
 *   put:
 *     summary: Update a card
 *     tags: [Cards]
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
 *             $ref: '#/components/schemas/Card'
 *     responses:
 *       200:
 *         description: Card updated
 *       404:
 *         description: Card not found
 */
router.put('/:id', (req: Request, res: Response) => {
  const index = cards.findIndex((c) => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Card not found' });
  cards[index] = { ...cards[index], ...req.body, id: req.params.id };
  res.json(cards[index]);
});

/**
 * @swagger
 * /api/cards/{id}:
 *   delete:
 *     summary: Cancel a card
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Card cancelled
 *       404:
 *         description: Card not found
 */
router.delete('/:id', (req: Request, res: Response) => {
  const index = cards.findIndex((c) => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Card not found' });
  cards.splice(index, 1);
  res.status(204).send();
});

export default router;
