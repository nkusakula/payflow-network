import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { transactions, resetTransactions } from '../seedData';
import { Transaction } from '../models/transaction';

export { resetTransactions };

const router = Router();

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: List all transactions
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: Array of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 */
router.get('/', (_req: Request, res: Response) => {
  res.json(transactions);
});

/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     summary: Get a transaction by ID
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Transaction not found
 */
router.get('/:id', (req: Request, res: Response) => {
  const transaction = transactions.find((t) => t.id === req.params.id);
  if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
  res.json(transaction);
});

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transaction'
 *     responses:
 *       201:
 *         description: Transaction created
 */
router.post('/', (req: Request, res: Response) => {
  const transaction: Transaction = {
    ...req.body,
    id: req.body.id || uuidv4(),
    transactedAt: req.body.transactedAt || new Date().toISOString(),
  };
  transactions.push(transaction);
  res.status(201).json(transaction);
});

/**
 * @swagger
 * /api/transactions/{id}:
 *   put:
 *     summary: Update a transaction
 *     tags: [Transactions]
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
 *             $ref: '#/components/schemas/Transaction'
 *     responses:
 *       200:
 *         description: Transaction updated
 *       404:
 *         description: Transaction not found
 */
router.put('/:id', (req: Request, res: Response) => {
  const index = transactions.findIndex((t) => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Transaction not found' });
  transactions[index] = { ...transactions[index], ...req.body, id: req.params.id };
  res.json(transactions[index]);
});

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     summary: Delete a transaction
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Transaction deleted
 *       404:
 *         description: Transaction not found
 */
router.delete('/:id', (req: Request, res: Response) => {
  const index = transactions.findIndex((t) => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Transaction not found' });
  transactions.splice(index, 1);
  res.status(204).send();
});

export default router;
