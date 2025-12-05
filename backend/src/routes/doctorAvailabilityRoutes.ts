import { Router } from 'express';
import { getAvailability, setAvailability } from '../controllers/doctorAvailabilityController';

const router = Router();

/**
 * @swagger
 * /doctors/{id}/availability:
 *   get:
 *     summary: Get doctor availability
 *     tags: [Doctor Availability]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Doctor ID
 *     responses:
 *       200:
 *         description: Doctor availability retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DoctorAvailability'
 *       404:
 *         description: Doctor not found
 *       500:
 *         description: Server error
 *   post:
 *     summary: Set doctor availability
 *     tags: [Doctor Availability]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Doctor ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - day_of_week
 *               - start_time
 *               - end_time
 *               - is_available
 *             properties:
 *               day_of_week:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 6
 *                 description: Day of week (0=Sunday, 6=Saturday)
 *               start_time:
 *                 type: string
 *                 format: time
 *                 description: Start time (HH:MM format)
 *               end_time:
 *                 type: string
 *                 format: time
 *                 description: End time (HH:MM format)
 *               is_available:
 *                 type: boolean
 *                 description: Whether the doctor is available
 *     responses:
 *       201:
 *         description: Doctor availability set successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DoctorAvailability'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Doctor not found
 *       500:
 *         description: Server error
 */
router.get('/doctors/:id/availability', getAvailability);
router.post('/doctors/:id/availability', setAvailability);

export default router; 