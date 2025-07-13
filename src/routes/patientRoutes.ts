import { Router } from 'express';
import { createPatient, updatePatientById, getPatientById } from '../controllers/patientController';
import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction, RequestHandler } from 'express';

const router = Router();

const validatePatient: RequestHandler[] = [
  body('full_name').notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    next();
  }
];

router.post('/', ...validatePatient, createPatient);
router.put('/:id', ...validatePatient, updatePatientById);
router.get('/:id', getPatientById);

export default router; 