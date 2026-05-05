/**
 * @swagger
 * components:
 *   schemas:
 *     Card:
 *       type: object
 *       required:
 *         - id
 *         - cardholderId
 *         - issuerId
 *         - maskedPan
 *         - cardType
 *         - status
 *         - expiryDate
 *       properties:
 *         id:
 *           type: string
 *         cardholderId:
 *           type: string
 *         issuerId:
 *           type: string
 *         maskedPan:
 *           type: string
 *           description: Masked Primary Account Number (e.g. 5412 **** **** 3456)
 *         cardType:
 *           type: string
 *           enum: [credit, debit, prepaid]
 *         productTier:
 *           type: string
 *           enum: [standard, gold, platinum, world, world_elite]
 *         status:
 *           type: string
 *           enum: [active, blocked, expired, cancelled]
 *         expiryDate:
 *           type: string
 *           description: MM/YY format
 *         creditLimit:
 *           type: number
 *           description: Credit limit in minor currency units (cents)
 *         issuedAt:
 *           type: string
 *           format: date-time
 */
export interface Card {
  id: string;
  cardholderId: string;
  issuerId: string;
  maskedPan: string;
  cardType: 'credit' | 'debit' | 'prepaid';
  productTier: 'standard' | 'gold' | 'platinum' | 'world' | 'world_elite';
  status: 'active' | 'blocked' | 'expired' | 'cancelled';
  expiryDate: string;
  creditLimit: number;
  issuedAt: string;
}
