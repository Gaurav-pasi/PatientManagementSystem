import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import helmet from 'helmet';
import { execqry } from './dbutils';
import { specs } from './swagger';
import authRoutes from './routes/authRoutes';
import patientRoutes from './routes/patientRoutes';
import doctorRoutes from './routes/doctorRoutes';
import userRoutes from './routes/userRoutes';
import doctorAvailabilityRoutes from './routes/doctorAvailabilityRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import fileRoutes from './routes/fileRoutes';
import paymentRoutes from './routes/paymentRoutes';
import { apiLimiter } from './middleware/rateLimit';
import { Request, Response, NextFunction } from 'express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting for all routes
app.use(apiLimiter);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Patient Management System API Documentation'
}));

// Authentication routes (public)
app.use('/auth', authRoutes);

// Protected routes (require authentication)
app.use('/patients', patientRoutes);
app.use('/doctors', doctorRoutes);
app.use('/users', userRoutes);
app.use(doctorAvailabilityRoutes);
app.use('/appointments', appointmentRoutes);
app.use(fileRoutes);
app.use(paymentRoutes);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome message
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Welcome message
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Welcome to Patient Management System"
 */
app.get('/', (req, res) => {
  res.send('Welcome to Patient Management System');
});

/**
 * @swagger
 * /doctors:
 *   get:
 *     summary: Get all doctors (basic info)
 *     tags: [Doctors]
 *     description: Get a list of all doctors with basic information
 *     responses:
 *       200:
 *         description: List of doctors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Doctor ID
 *                   full_name:
 *                     type: string
 *                     description: Doctor's full name
 *                   email:
 *                     type: string
 *                     description: Doctor's email
 *                   phone_number:
 *                     type: string
 *                     description: Doctor's phone number
 *                   gender:
 *                     type: string
 *                     description: Doctor's gender
 *                   dob:
 *                     type: string
 *                     format: date
 *                     description: Doctor's date of birth
 *       500:
 *         description: Server error
 */
app.get('/doctors', async (req, res) => {
  try {
    const result = await execqry("SELECT id, full_name, email, phone_number, gender, dob FROM users WHERE role = 'doctor'", []);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

// Centralized error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app; 