/**
 * @swagger
 * components:
 *   schemas:
 *     Issuer:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - country
 *         - bankCode
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: Unique issuer identifier
 *         name:
 *           type: string
 *           description: Bank or financial institution name
 *         country:
 *           type: string
 *           description: ISO 3166-1 alpha-2 country code
 *         bankCode:
 *           type: string
 *           description: BIN/IIN bank identification number prefix
 *         currency:
 *           type: string
 *           description: Primary currency (ISO 4217)
 *         status:
 *           type: string
 *           enum: [active, suspended, terminated]
 *         contactEmail:
 *           type: string
 *         enrolledAt:
 *           type: string
 *           format: date-time
 */
export interface Issuer {
  id: string;
  name: string;
  country: string;
  bankCode: string;
  currency: string;
  status: 'active' | 'suspended' | 'terminated';
  contactEmail: string;
  enrolledAt: string;
}
