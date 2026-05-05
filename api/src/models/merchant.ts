/**
 * @swagger
 * components:
 *   schemas:
 *     Merchant:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - mcc
 *         - country
 *         - status
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         mcc:
 *           type: string
 *           description: Merchant Category Code (ISO 18245)
 *         category:
 *           type: string
 *           description: Human-readable MCC category
 *         country:
 *           type: string
 *         city:
 *           type: string
 *         acquirerId:
 *           type: string
 *           description: Acquiring bank identifier
 *         status:
 *           type: string
 *           enum: [active, suspended, terminated]
 *         acceptedCardTypes:
 *           type: array
 *           items:
 *             type: string
 *         enrolledAt:
 *           type: string
 *           format: date-time
 */
export interface Merchant {
  id: string;
  name: string;
  mcc: string;
  category: string;
  country: string;
  city: string;
  acquirerId: string;
  status: 'active' | 'suspended' | 'terminated';
  acceptedCardTypes: string[];
  enrolledAt: string;
}
