import { Router } from 'express';
import { getAvailability, setAvailability } from '../controllers/doctorAvailabilityController';

const router = Router();

router.get('/doctors/:id/availability', getAvailability);
router.post('/doctors/:id/availability', setAvailability);

export default router; 