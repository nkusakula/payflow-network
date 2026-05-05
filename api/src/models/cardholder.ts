/**
 * @swagger
 * components:
 *   schemas:
 *     Cardholder:
 *       type: object
 *       required:
 *         - id
 *         - firstName
 *         - lastName
 *         - email
 *         - issuerId
 *         - status
 *       properties:
 *         id:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *         country:
 *           type: string
 *         issuerId:
 *           type: string
 *           description: Reference to the issuing bank
 *         status:
 *           type: string
 *           enum: [active, blocked, closed]
 *         createdAt:
 *           type: string
 *           format: date-time
 */
export interface Cardholder {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  issuerId: string;
  status: 'active' | 'blocked' | 'closed';
  createdAt: string;
}
