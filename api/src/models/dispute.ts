/**
 * @swagger
 * components:
 *   schemas:
 *     Dispute:
 *       type: object
 *       required:
 *         - id
 *         - transactionId
 *         - cardholderId
 *         - reason
 *         - status
 *         - filedAt
 *       properties:
 *         id:
 *           type: string
 *         transactionId:
 *           type: string
 *         cardholderId:
 *           type: string
 *         reason:
 *           type: string
 *           enum: [fraud, not_received, incorrect_amount, duplicate, cancelled_subscription, other]
 *         status:
 *           type: string
 *           enum: [open, under_review, resolved_cardholder, resolved_merchant, closed]
 *         description:
 *           type: string
 *         amountDisputed:
 *           type: number
 *         resolution:
 *           type: string
 *         filedAt:
 *           type: string
 *           format: date-time
 *         resolvedAt:
 *           type: string
 *           format: date-time
 */
export interface Dispute {
  id: string;
  transactionId: string;
  cardholderId: string;
  reason: 'fraud' | 'not_received' | 'incorrect_amount' | 'duplicate' | 'cancelled_subscription' | 'other';
  status: 'open' | 'under_review' | 'resolved_cardholder' | 'resolved_merchant' | 'closed';
  description: string;
  amountDisputed: number;
  resolution?: string;
  filedAt: string;
  resolvedAt?: string;
}
