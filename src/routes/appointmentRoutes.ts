import { Router } from 'express';
import { create, getAll, getById, updateById, deleteById } from '../controllers/appointmentController';
import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction, RequestHandler } from 'express';

const router = Router();

const validateAppointment: RequestHandler[] = [
  body('patient_id').optional(),
  body('doctor_id').optional(),
  body('appointment_time').optional().isISO8601().withMessage('Valid appointment_time is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    next();
  }
];

router.post('/', ...validateAppointment, create);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', ...validateAppointment, updateById);
router.delete('/:id', deleteById);

export default router; 