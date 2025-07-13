import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Patient Management System API',
      version: '1.0.0',
      description: 'A comprehensive API for managing patients, doctors, appointments, and medical records',
      contact: {
        name: 'API Support',
        email: 'support@patientmanagement.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'User ID' },
            full_name: { type: 'string', description: 'Full name of the user' },
            email: { type: 'string', format: 'email', description: 'User email address' },
            phone_number: { type: 'string', description: 'Phone number' },
            gender: { type: 'string', enum: ['male', 'female', 'other'], description: 'Gender' },
            dob: { type: 'string', format: 'date', description: 'Date of birth' },
            role: { type: 'string', enum: ['patient', 'doctor', 'admin'], description: 'User role' },
            created_at: { type: 'string', format: 'date-time', description: 'Creation timestamp' }
          }
        },
        Patient: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Patient ID' },
            user_id: { type: 'integer', description: 'Associated user ID' },
            medical_history: { type: 'string', description: 'Medical history notes' },
            allergies: { type: 'string', description: 'Known allergies' },
            emergency_contact: { type: 'string', description: 'Emergency contact information' }
          }
        },
        Doctor: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Doctor ID' },
            user_id: { type: 'integer', description: 'Associated user ID' },
            specialization: { type: 'string', description: 'Medical specialization' },
            license_number: { type: 'string', description: 'Medical license number' },
            experience_years: { type: 'integer', description: 'Years of experience' }
          }
        },
        Appointment: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Appointment ID' },
            patient_id: { type: 'integer', description: 'Patient ID' },
            doctor_id: { type: 'integer', description: 'Doctor ID' },
            appointment_time: { type: 'string', format: 'date-time', description: 'Appointment date and time' },
            status: { type: 'string', enum: ['scheduled', 'completed', 'cancelled'], description: 'Appointment status' },
            notes: { type: 'string', description: 'Appointment notes' },
            created_at: { type: 'string', format: 'date-time', description: 'Creation timestamp' }
          }
        },
        DoctorAvailability: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Availability ID' },
            doctor_id: { type: 'integer', description: 'Doctor ID' },
            day_of_week: { type: 'integer', minimum: 0, maximum: 6, description: 'Day of week (0=Sunday, 6=Saturday)' },
            start_time: { type: 'string', format: 'time', description: 'Start time' },
            end_time: { type: 'string', format: 'time', description: 'End time' },
            is_available: { type: 'boolean', description: 'Whether the doctor is available' }
          }
        },
        Payment: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Payment ID' },
            appointment_id: { type: 'integer', description: 'Associated appointment ID' },
            amount: { type: 'number', description: 'Payment amount' },
            payment_method: { type: 'string', enum: ['cash', 'card', 'insurance'], description: 'Payment method' },
            status: { type: 'string', enum: ['pending', 'completed', 'failed'], description: 'Payment status' },
            transaction_id: { type: 'string', description: 'Transaction ID' },
            created_at: { type: 'string', format: 'date-time', description: 'Creation timestamp' }
          }
        },
        File: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'File ID' },
            filename: { type: 'string', description: 'Original filename' },
            filepath: { type: 'string', description: 'File path on server' },
            mimetype: { type: 'string', description: 'File MIME type' },
            size: { type: 'integer', description: 'File size in bytes' },
            uploaded_by: { type: 'integer', description: 'User ID who uploaded the file' },
            created_at: { type: 'string', format: 'date-time', description: 'Upload timestamp' }
          }
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints'
      },
      {
        name: 'Patients',
        description: 'Patient management endpoints'
      },
      {
        name: 'Doctors',
        description: 'Doctor management endpoints'
      },
      {
        name: 'Appointments',
        description: 'Appointment scheduling and management'
      },
      {
        name: 'Doctor Availability',
        description: 'Doctor availability scheduling'
      },
      {
        name: 'Payments',
        description: 'Payment processing and management'
      },
      {
        name: 'Files',
        description: 'File upload and management'
      },
      {
        name: 'Users',
        description: 'User document upload'
      },
      {
        name: 'General',
        description: 'General system endpoints'
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts']
};

export const specs = swaggerJsdoc(options); 