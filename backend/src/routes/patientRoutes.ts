import { Router } from 'express';
import { createPatient, updatePatientById, getPatientById } from '../controllers/patientController';
import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { authenticateToken } from '../middleware/auth';
import { requirePatientOrAdmin, requireOwnershipOrAdmin } from '../middleware/roles';

const router = Router();

/**
 * @swagger
 * /patients:
 *   post:
 *     summary: Create a new patient
 *     tags: [Patients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - full_name
 *               - email
 *             properties:
 *               full_name:
 *                 type: string
 *                 description: Full name of the patient
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: Password (optional)
 *               phone_number:
 *                 type: string
 *                 description: Phone number
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 description: Gender
 *               dob:
 *                 type: string
 *                 format: date
 *                 description: Date of birth
 *               medical_history:
 *                 type: string
 *                 description: Medical history notes
 *               allergies:
 *                 type: string
 *                 description: Known allergies
 *               emergency_contact:
 *                 type: string
 *                 description: Emergency contact information
 *     responses:
 *       201:
 *         description: Patient created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */

const validatePatient: RequestHandler[] = [
  body('full_name').notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
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
 * /patients/{id}:
 *   put:
 *     summary: Update a patient by ID
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Patient ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *                 description: Full name of the patient
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: Password (optional)
 *               phone_number:
 *                 type: string
 *                 description: Phone number
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 description: Gender
 *               dob:
 *                 type: string
 *                 format: date
 *                 description: Date of birth
 *               medical_history:
 *                 type: string
 *                 description: Medical history notes
 *               allergies:
 *                 type: string
 *                 description: Known allergies
 *               emergency_contact:
 *                 type: string
 *                 description: Emergency contact information
 *     responses:
 *       200:
 *         description: Patient updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Patient not found
 *       500:
 *         description: Server error
 *   get:
 *     summary: Get a patient by ID
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Patient ID
 *     responses:
 *       200:
 *         description: Patient retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       404:
 *         description: Patient not found
 *       500:
 *         description: Server error
 */
router.post('/', authenticateToken, requirePatientOrAdmin, ...validatePatient, createPatient);
router.put('/:id', authenticateToken, requireOwnershipOrAdmin('user_id'), ...validatePatient, updatePatientById);
router.get('/:id', authenticateToken, requireOwnershipOrAdmin('user_id'), getPatientById);

export default router; 