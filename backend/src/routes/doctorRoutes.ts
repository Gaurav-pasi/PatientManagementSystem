import { Router } from 'express';
import { createDoctor, getDoctorById, getDoctors, updateDoctorById } from '../controllers/doctorController';
import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { authenticateToken } from '../middleware/auth';
import { requireAdmin, requireDoctorOrAdmin } from '../middleware/roles';

const router = Router();

/**
 * @swagger
 * /doctors:
 *   post:
 *     summary: Create a new doctor
 *     tags: [Doctors]
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
 *                 description: Full name of the doctor
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
 *               specialization:
 *                 type: string
 *                 description: Medical specialization
 *               license_number:
 *                 type: string
 *                 description: Medical license number
 *               experience_years:
 *                 type: integer
 *                 description: Years of experience
 *     responses:
 *       201:
 *         description: Doctor created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Doctor'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 *   get:
 *     summary: Get all doctors
 *     tags: [Doctors]
 *     responses:
 *       200:
 *         description: List of doctors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Doctor'
 *       500:
 *         description: Server error
 */

const validateDoctor: RequestHandler[] = [
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
 * /doctors/{id}:
 *   get:
 *     summary: Get a doctor by ID
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Doctor ID
 *     responses:
 *       200:
 *         description: Doctor retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Doctor'
 *       404:
 *         description: Doctor not found
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update a doctor by ID
 *     tags: [Doctors]
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
 *             properties:
 *               full_name:
 *                 type: string
 *                 description: Full name of the doctor
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
 *               specialization:
 *                 type: string
 *                 description: Medical specialization
 *               license_number:
 *                 type: string
 *                 description: Medical license number
 *               experience_years:
 *                 type: integer
 *                 description: Years of experience
 *     responses:
 *       200:
 *         description: Doctor updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Doctor'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Doctor not found
 *       500:
 *         description: Server error
 */
// Public route - anyone can view doctors list
router.get('/', getDoctors);

// Public route - anyone can view doctor details
router.get('/:id', getDoctorById);

// Protected route - only admin can create doctors
router.post('/', authenticateToken, requireAdmin, ...validateDoctor, createDoctor);

// Protected route - only admin or the doctor themselves can update
router.put('/:id', authenticateToken, requireDoctorOrAdmin, ...validateDoctor, updateDoctorById);

export default router; 