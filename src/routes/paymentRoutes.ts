import { Router } from 'express';
import { checkout, webhook } from '../controllers/paymentController';

const router = Router();

/**
 * @swagger
 * /payments/checkout:
 *   post:
 *     summary: Process payment checkout
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - appointment_id
 *               - amount
 *               - payment_method
 *             properties:
 *               appointment_id:
 *                 type: integer
 *                 description: Appointment ID
 *               amount:
 *                 type: number
 *                 description: Payment amount
 *               payment_method:
 *                 type: string
 *                 enum: [cash, card, insurance]
 *                 description: Payment method
 *     responses:
 *       200:
 *         description: Payment processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       400:
 *         description: Invalid payment data
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Server error
 * /payments/webhook:
 *   post:
 *     summary: Payment webhook endpoint
 *     tags: [Payments]
 *     description: Webhook endpoint for payment gateway callbacks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Payment gateway webhook payload
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *       400:
 *         description: Invalid webhook data
 *       500:
 *         description: Server error
 */
router.post('/payments/checkout', checkout);
router.post('/payments/webhook', webhook);

export default router; 