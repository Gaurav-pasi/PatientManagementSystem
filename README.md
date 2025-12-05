# Patient Management System

A comprehensive healthcare patient management system built with Express.js and React.

## Project Structure

```
PatientManagementSystem/
├── backend/                    # Express.js API server
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   │   ├── constants.ts   # App constants & error codes
│   │   │   └── environment.ts # Environment validation
│   │   ├── controllers/       # Request handlers
│   │   ├── middleware/        # Express middleware
│   │   │   ├── auth.ts        # JWT authentication
│   │   │   ├── roles.ts       # Role-based access control
│   │   │   ├── rateLimit.ts   # API rate limiting
│   │   │   ├── errorHandler.ts # Global error handling
│   │   │   └── responseHandler.ts # Standardized responses
│   │   ├── models/            # Database models
│   │   ├── routes/            # API route definitions
│   │   ├── types/             # TypeScript type definitions
│   │   ├── utils/             # Utility functions
│   │   │   └── errors.ts      # Custom error classes
│   │   ├── __tests__/         # Test files
│   │   ├── index.ts           # App entry point
│   │   ├── dbutils.ts         # Database utilities
│   │   └── swagger.ts         # API documentation config
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/                   # React application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── ui/           # Reusable UI components
│   │   │   └── layout/       # Layout components
│   │   ├── config/           # Frontend configuration
│   │   ├── context/          # React context providers
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utility libraries
│   │   ├── pages/            # Page components
│   │   ├── types/            # TypeScript types
│   │   ├── App.tsx           # Root component
│   │   └── main.tsx          # Entry point
│   ├── package.json
│   └── vite.config.ts
│
├── docs/                       # Documentation
│   ├── API_TESTS.md           # API test cases
│   ├── AUTHENTICATION_README.md # Auth system docs
│   ├── SWAGGER_README.md      # API documentation guide
│   └── database_auth_update.sql # Database schema
│
├── uploads/                    # File upload directory
├── package.json               # Root package.json
└── README.md                  # This file
```

## Tech Stack

### Backend
- **Framework**: Express.js 5.x
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT (Access + Refresh tokens)
- **Security**: Helmet, CORS, bcrypt, Rate limiting
- **API Docs**: Swagger/OpenAPI 3.0
- **Testing**: Jest + Supertest

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **State Management**: TanStack React Query
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Animations**: Framer Motion

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Gaurav-pasi/PatientManagementSystem.git
   cd PatientManagementSystem
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up the database**
   ```bash
   # Create PostgreSQL database
   createdb patient_management

   # Run the schema
   psql -d patient_management -f docs/database_auth_update.sql
   ```

4. **Configure environment variables**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   # Edit backend/.env with your database credentials

   # Frontend (optional)
   cp frontend/.env.example frontend/.env
   ```

5. **Start the development servers**
   ```bash
   npm run dev
   ```
   - Backend: http://localhost:3000
   - Frontend: http://localhost:5173
   - API Docs: http://localhost:3000/api-docs

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start both backend and frontend in development mode |
| `npm run dev:backend` | Start only the backend server |
| `npm run dev:frontend` | Start only the frontend dev server |
| `npm run build` | Build the frontend for production |
| `npm run test` | Run backend tests |
| `npm run typecheck` | Type-check both backend and frontend |
| `npm run install:all` | Install dependencies for all packages |

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh access token
- `GET /auth/me` - Get current user
- `PUT /auth/change-password` - Change password

### Patients
- `POST /patients` - Create patient
- `GET /patients/:id` - Get patient by ID
- `PUT /patients/:id` - Update patient

### Doctors
- `GET /doctors` - List all doctors
- `GET /doctors/:id` - Get doctor by ID
- `POST /doctors` - Create doctor (Admin only)
- `PUT /doctors/:id` - Update doctor
- `GET /doctors/:id/availability` - Get doctor availability
- `POST /doctors/:id/availability` - Set doctor availability

### Appointments
- `GET /appointments` - List appointments
- `GET /appointments/:id` - Get appointment by ID
- `POST /appointments` - Create appointment
- `PUT /appointments/:id` - Update appointment
- `DELETE /appointments/:id` - Cancel appointment

## User Roles

| Role | Permissions |
|------|-------------|
| `patient` | View doctors, book appointments, view own records |
| `doctor` | View patients, manage appointments, set availability |
| `admin` | Full access to all resources |

## Project Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Type Safety**: Full TypeScript coverage with strict mode
- **Error Handling**: Centralized error handling with custom error classes
- **API Documentation**: Interactive Swagger documentation
- **Rate Limiting**: Configurable API rate limiting
- **File Uploads**: Secure file upload handling with Multer
- **Responsive UI**: Modern, mobile-friendly interface
- **Animations**: Smooth page transitions and micro-interactions

## Environment Variables

### Backend (`backend/.env`)
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=patient_management
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:3000
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC License - see LICENSE file for details.

## Author

**Gaurav Pasi**
- Email: gauravpasi9594@gmail.com
- GitHub: [@Gaurav-pasi](https://github.com/Gaurav-pasi)

## Repository

https://github.com/Gaurav-pasi/PatientManagementSystem
