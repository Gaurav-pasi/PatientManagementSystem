import { Router } from 'express';
import { create, getAll, getById, updateById, deleteById } from '../controllers/appointmentController';
import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction, RequestHandler } from 'express';

const router = Router();

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Create a new appointment
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patient_id
 *               - doctor_id
 *               - appointment_time
 *             properties:
 *               patient_id:
 *                 type: integer
 *                 description: Patient ID
 *               doctor_id:
 *                 type: integer
 *                 description: Doctor ID
 *               appointment_time:
 *                 type: string
 *                 format: date-time
 *                 description: Appointment date and time
 *               status:
 *                 type: string
 *                 enum: [scheduled, completed, cancelled]
 *                 default: scheduled
 *                 description: Appointment status
 *               notes:
 *                 type: string
 *                 description: Appointment notes
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 *   get:
 *     summary: Get all appointments
 *     tags: [Appointments]
 *     parameters:
 *       - in: query
 *         name: patient_id
 *         schema:
 *           type: integer
 *         description: Filter by patient ID
 *       - in: query
 *         name: doctor_id
 *         schema:
 *           type: integer
 *         description: Filter by doctor ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [scheduled, completed, cancelled]
 *         description: Filter by appointment status
 *     responses:
 *       200:
 *         description: List of appointments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       500:
 *         description: Server error
 */

const validateAppointment: RequestHandler[] = [
  body('patient_id').optional(),
  body('doctor_id').optional(),
  body('appointment_time').optional().isISO8601().withMessage('Valid appointment_time is required'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    next();
  }
];

/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     summary: Get an appointment by ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Appointment ID
 *     responses:
 *       200:
 *         description: Appointment retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update an appointment by ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Appointment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patient_id:
 *                 type: integer
 *                 description: Patient ID
 *               doctor_id:
 *                 type: integer
 *                 description: Doctor ID
 *               appointment_time:
 *                 type: string
 *                 format: date-time
 *                 description: Appointment date and time
 *               status:
 *                 type: string
 *                 enum: [scheduled, completed, cancelled]
 *                 description: Appointment status
 *               notes:
 *                 type: string
 *                 description: Appointment notes
 *     responses:
 *       200:
 *         description: Appointment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete an appointment by ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Appointment ID
 *     responses:
 *       200:
 *         description: Appointment deleted successfully
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Server error
 */
router.post('/', ...validateAppointment, create);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', ...validateAppointment, updateById);
router.delete('/:id', deleteById);

export default router; 