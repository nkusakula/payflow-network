/**
 * @swagger
 * components:
 *   schemas:
 *     Settlement:
 *       type: object
 *       required:
 *         - id
 *         - issuerId
 *         - settlementDate
 *         - totalTransactions
 *         - totalAmount
 *         - currency
 *         - status
 *       properties:
 *         id:
 *           type: string
 *         issuerId:
 *           type: string
 *         settlementDate:
 *           type: string
 *           format: date
 *         totalTransactions:
 *           type: number
 *         totalAmount:
 *           type: number
 *           description: Total settled amount in minor currency units
 *         currency:
 *           type: string
 *         feesCharged:
 *           type: number
 *         netAmount:
 *           type: number
 *         status:
 *           type: string
 *           enum: [pending, processing, completed, failed]
 *         processedAt:
 *           type: string
 *           format: date-time
 */
export interface Settlement {
  id: string;
  issuerId: string;
  settlementDate: string;
  totalTransactions: number;
  totalAmount: number;
  currency: string;
  feesCharged: number;
  netAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  processedAt?: string;
}
