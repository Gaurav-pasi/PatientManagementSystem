# Documentation

This directory contains all project documentation.

## Contents

| File | Description |
|------|-------------|
| [API_TESTS.md](./API_TESTS.md) | API test cases and example requests |
| [AUTHENTICATION_README.md](./AUTHENTICATION_README.md) | JWT authentication system documentation |
| [SWAGGER_README.md](./SWAGGER_README.md) | Swagger/OpenAPI setup guide |
| [database_auth_update.sql](./database_auth_update.sql) | PostgreSQL database schema |

## Database Schema

The database schema includes the following tables:

- `users` - User accounts with role-based access
- `patients` - Patient medical information
- `doctors` - Doctor profiles and credentials
- `appointments` - Patient-doctor appointments
- `doctor_availability` - Doctor schedule slots
- `files` - File upload metadata

### Setting Up the Database

```bash
# Create the database
createdb patient_management

# Run the schema
psql -d patient_management -f database_auth_update.sql
```

## API Documentation

Interactive API documentation is available at:
- Development: http://localhost:3000/api-docs
- Production: https://your-domain.com/api-docs

## Authentication Flow

1. **Register**: `POST /auth/register` with user details
2. **Login**: `POST /auth/login` returns access + refresh tokens
3. **API Calls**: Include `Authorization: Bearer <access_token>` header
4. **Token Refresh**: `POST /auth/refresh` when access token expires
5. **Logout**: `POST /auth/logout` invalidates refresh token

## Role-Based Access

| Role | Description |
|------|-------------|
| `patient` | Can book appointments, view own records |
| `doctor` | Can manage patients, set availability |
| `admin` | Full system access |

See [AUTHENTICATION_README.md](./AUTHENTICATION_README.md) for detailed RBAC implementation.
