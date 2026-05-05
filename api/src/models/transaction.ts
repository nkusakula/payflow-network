/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       required:
 *         - id
 *         - cardId
 *         - merchantId
 *         - amount
 *         - currency
 *         - status
 *         - type
 *         - transactedAt
 *       properties:
 *         id:
 *           type: string
 *         cardId:
 *           type: string
 *         merchantId:
 *           type: string
 *         amount:
 *           type: number
 *           description: Transaction amount in minor currency units (cents)
 *         currency:
 *           type: string
 *           description: ISO 4217 currency code
 *         status:
 *           type: string
 *           enum: [pending, approved, declined, reversed, settled]
 *         type:
 *           type: string
 *           enum: [purchase, refund, cash_advance, balance_inquiry]
 *         authCode:
 *           type: string
 *           description: 6-character authorization code
 *         declineReason:
 *           type: string
 *         riskScore:
 *           type: number
 *           description: Fraud risk score 0-100
 *         transactedAt:
 *           type: string
 *           format: date-time
 *         settledAt:
 *           type: string
 *           format: date-time
 */
export interface Transaction {
  id: string;
  cardId: string;
  merchantId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'declined' | 'reversed' | 'settled';
  type: 'purchase' | 'refund' | 'cash_advance' | 'balance_inquiry';
  authCode: string;
  declineReason?: string;
  riskScore: number;
  transactedAt: string;
  settledAt?: string;
}
