import { Router } from 'express';
import { checkout, webhook } from '../controllers/paymentController';

const router = Router();

router.post('/payments/checkout', checkout);
router.post('/payments/webhook', webhook);

export default router; 