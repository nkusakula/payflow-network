import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { issuers, resetIssuers } from '../seedData';
import { Issuer } from '../models/issuer';

export { resetIssuers };

const router = Router();

/**
 * @swagger
 * /api/issuers:
 *   get:
 *     summary: List all issuers
 *     tags: [Issuers]
 *     responses:
 *       200:
 *         description: Array of issuers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Issuer'
 */
router.get('/', (_req: Request, res: Response) => {
  res.json(issuers);
});

/**
 * @swagger
 * /api/issuers/{id}:
 *   get:
 *     summary: Get an issuer by ID
 *     tags: [Issuers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Issuer found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Issuer'
 *       404:
 *         description: Issuer not found
 */
router.get('/:id', (req: Request, res: Response) => {
  const issuer = issuers.find((i) => i.id === req.params.id);
  if (!issuer) return res.status(404).json({ error: 'Issuer not found' });
  res.json(issuer);
});

/**
 * @swagger
 * /api/issuers:
 *   post:
 *     summary: Create a new issuer
 *     tags: [Issuers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Issuer'
 *     responses:
 *       201:
 *         description: Issuer created
 */
router.post('/', (req: Request, res: Response) => {
  const issuer: Issuer = {
    ...req.body,
    id: req.body.id || uuidv4(),
    enrolledAt: req.body.enrolledAt || new Date().toISOString(),
  };
  issuers.push(issuer);
  res.status(201).json(issuer);
});

/**
 * @swagger
 * /api/issuers/{id}:
 *   put:
 *     summary: Update an issuer
 *     tags: [Issuers]
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
 *             $ref: '#/components/schemas/Issuer'
 *     responses:
 *       200:
 *         description: Issuer updated
 *       404:
 *         description: Issuer not found
 */
router.put('/:id', (req: Request, res: Response) => {
  const index = issuers.findIndex((i) => i.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Issuer not found' });
  issuers[index] = { ...issuers[index], ...req.body, id: req.params.id };
  res.json(issuers[index]);
});

/**
 * @swagger
 * /api/issuers/{id}:
 *   delete:
 *     summary: Delete an issuer
 *     tags: [Issuers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Issuer deleted
 *       404:
 *         description: Issuer not found
 */
router.delete('/:id', (req: Request, res: Response) => {
  const index = issuers.findIndex((i) => i.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Issuer not found' });
  issuers.splice(index, 1);
  res.status(204).send();
});

export default router;
