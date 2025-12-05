# Backend - Patient Management System API

Express.js REST API for the Patient Management System.

## Directory Structure

```
backend/
├── src/
│   ├── config/                 # Configuration
│   │   ├── constants.ts        # App constants, error codes, HTTP status
│   │   └── environment.ts      # Environment variable validation
│   │
│   ├── controllers/            # Request handlers (business logic)
│   │   ├── authController.ts   # Authentication endpoints
│   │   ├── appointmentController.ts
│   │   ├── doctorController.ts
│   │   ├── doctorAvailabilityController.ts
│   │   ├── fileController.ts
│   │   ├── patientController.ts
│   │   ├── paymentController.ts
│   │   └── userController.ts
│   │
│   ├── middleware/             # Express middleware
│   │   ├── index.ts            # Barrel export
│   │   ├── auth.ts             # JWT authentication
│   │   ├── roles.ts            # Role-based access control
│   │   ├── rateLimit.ts        # API rate limiting
│   │   ├── errorHandler.ts     # Global error handler
│   │   └── responseHandler.ts  # Standardized responses
│   │
│   ├── models/                 # Database access layer
│   │   ├── userModel.ts
│   │   ├── appointmentModel.ts
│   │   ├── doctorAvailabilityModel.ts
│   │   └── fileModel.ts
│   │
│   ├── routes/                 # API route definitions
│   │   ├── authRoutes.ts
│   │   ├── appointmentRoutes.ts
│   │   ├── doctorRoutes.ts
│   │   ├── doctorAvailabilityRoutes.ts
│   │   ├── fileRoutes.ts
│   │   ├── patientRoutes.ts
│   │   ├── paymentRoutes.ts
│   │   └── userRoutes.ts
│   │
│   ├── types/                  # TypeScript definitions
│   │   └── index.ts            # All shared types
│   │
│   ├── utils/                  # Utilities
│   │   └── errors.ts           # Custom error classes
│   │
│   ├── __tests__/              # Test files
│   │   └── api.test.ts
│   │
│   ├── index.ts                # Application entry point
│   ├── dbutils.ts              # Database utilities
│   └── swagger.ts              # Swagger configuration
│
├── package.json
├── tsconfig.json
├── jest.config.js
└── .env.example
```

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your database credentials

# Start development server
npm run dev

# Run tests
npm test
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start with hot reload (nodemon) |
| `npm run build` | Compile TypeScript |
| `npm test` | Run Jest tests |
| `npm run typecheck` | Type-check without emitting |

## Architecture

### Request Flow
```
Request → Rate Limiter → Response Handler → Routes → Controller → Model → Database
                                               ↓
                                    Error Handler (on error)
```

### Error Handling

Custom error classes in `src/utils/errors.ts`:
- `AppError` - Base error class
- `ValidationAppError` - Invalid request data (400)
- `AuthenticationError` - Auth failures (401)
- `AuthorizationError` - Permission denied (403)
- `NotFoundError` - Resource not found (404)
- `ConflictError` - Duplicate resource (409)
- `DatabaseError` - Database failures (500)

### Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Optional message",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Human readable message",
  "details": [{ "field": "email", "message": "Invalid email" }]
}
```

## API Documentation

Swagger docs available at: `http://localhost:3000/api-docs`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |
| `DB_HOST` | PostgreSQL host | localhost |
| `DB_PORT` | PostgreSQL port | 5432 |
| `DB_NAME` | Database name | - |
| `DB_USER` | Database user | - |
| `DB_PASSWORD` | Database password | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_REFRESH_SECRET` | Refresh token secret | - |
| `JWT_EXPIRES_IN` | Access token expiry | 1h |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry | 7d |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:5173 |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 |
