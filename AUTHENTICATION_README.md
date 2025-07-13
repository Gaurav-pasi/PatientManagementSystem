# Authentication System Implementation

This document explains the complete authentication system implemented in the Patient Management System.

## 🔐 Overview

The authentication system provides:
- **JWT Token Authentication** - Secure stateless authentication
- **Role-based Access Control** - Different permissions for patients, doctors, and admins
- **Session Management** - Token refresh and logout functionality
- **Security Features** - Rate limiting, password hashing, and audit logging

## 🏗️ Architecture

### Components

1. **Authentication Middleware** (`src/middleware/auth.ts`)
   - JWT token verification
   - User authentication
   - Optional authentication for public endpoints

2. **Role-based Access Control** (`src/middleware/roles.ts`)
   - Role verification
   - Resource ownership checking
   - Permission-based access control

3. **Rate Limiting** (`src/middleware/rateLimit.ts`)
   - API rate limiting
   - Login attempt limiting
   - Registration limiting

4. **Authentication Controller** (`src/controllers/authController.ts`)
   - User registration
   - User login/logout
   - Token refresh
   - Password management

## 🔑 Authentication Flow

### 1. User Registration
```
POST /auth/register
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "patient",
  "phone_number": "+1234567890",
  "gender": "male",
  "dob": "1990-01-01"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "full_name": "John Doe",
    "email": "john@example.com",
    "role": "patient"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. User Login
```
POST /auth/login
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "full_name": "John Doe",
    "email": "john@example.com",
    "role": "patient"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Using Access Token
```
GET /patients/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Token Refresh
```
POST /auth/refresh
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 5. Logout
```
POST /auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 👥 Role-based Access Control

### User Roles

1. **Patient** (`patient`)
   - Can access their own patient records
   - Can view their own appointments
   - Can upload documents

2. **Doctor** (`doctor`)
   - Can access patient records (for their patients)
   - Can manage appointments
   - Can set availability schedules
   - Can view all appointments

3. **Admin** (`admin`)
   - Full system access
   - Can manage all users
   - Can access all data
   - System administration

### Permission Matrix

| Endpoint | Patient | Doctor | Admin |
|----------|---------|--------|-------|
| `/auth/*` | ✅ | ✅ | ✅ |
| `/patients/*` | Own only | Own patients | All |
| `/doctors/*` | ❌ | Own profile | All |
| `/appointments/*` | Own only | All | All |
| `/doctors/*/availability` | ❌ | Own only | All |
| `/payments/*` | Own only | Own patients | All |
| `/users/upload` | Own only | Own only | All |

## 🔒 Security Features

### 1. Password Security
- **BCrypt Hashing** - Passwords are hashed with 12 salt rounds
- **Password Validation** - Minimum 6 characters required
- **Password Change** - Users can change passwords securely

### 2. Token Security
- **JWT Access Tokens** - Short-lived (1 hour by default)
- **JWT Refresh Tokens** - Long-lived (7 days by default)
- **Token Storage** - Refresh tokens stored in database
- **Token Invalidation** - Logout clears refresh tokens

### 3. Rate Limiting
- **General API** - 100 requests per 15 minutes
- **Login Attempts** - 5 attempts per 15 minutes
- **Registration** - 3 attempts per hour
- **File Uploads** - 10 uploads per hour

### 4. Account Security
- **Account Status** - Users can be deactivated
- **Failed Login Tracking** - Tracks failed attempts
- **Account Locking** - Temporary account locking
- **Audit Logging** - All auth events logged

## 🗄️ Database Schema

### New Columns in `users` Table
```sql
ALTER TABLE users 
ADD COLUMN password_hash VARCHAR(255),
ADD COLUMN refresh_token TEXT,
ADD COLUMN is_active BOOLEAN DEFAULT true,
ADD COLUMN last_login TIMESTAMP,
ADD COLUMN failed_login_attempts INTEGER DEFAULT 0,
ADD COLUMN account_locked_until TIMESTAMP;
```

### New Tables
1. **user_sessions** - Session management
2. **auth_audit_log** - Security audit logging
3. **password_reset_tokens** - Password reset functionality

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
npm install jsonwebtoken bcryptjs express-rate-limit helmet
npm install @types/jsonwebtoken @types/bcryptjs
```

### 2. Environment Configuration
Create `.env` file based on `env.example`:
```bash
cp env.example .env
```

Update the following variables:
- `JWT_SECRET` - Strong secret for JWT signing
- `JWT_REFRESH_SECRET` - Strong secret for refresh tokens
- Database credentials

### 3. Database Setup
Run the authentication schema update:
```bash
psql -d patient_management -f database_auth_update.sql
```

### 4. Start Server
```bash
npm run dev
```

## 📝 API Endpoints

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user info
- `PUT /auth/change-password` - Change password

### Protected Endpoints
All other endpoints require authentication via Bearer token.

## 🔧 Configuration

### JWT Configuration
```javascript
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
```

### Rate Limiting Configuration
```javascript
RATE_LIMIT_WINDOW_MS=900000  // 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
LOGIN_RATE_LIMIT_MAX=5
REGISTER_RATE_LIMIT_MAX=3
```

## 🛡️ Security Best Practices

1. **Environment Variables** - Never commit secrets to version control
2. **Strong Passwords** - Enforce password complexity
3. **HTTPS Only** - Use HTTPS in production
4. **Token Expiration** - Use short-lived access tokens
5. **Rate Limiting** - Prevent brute force attacks
6. **Audit Logging** - Log all authentication events
7. **Input Validation** - Validate all user inputs
8. **SQL Injection Prevention** - Use parameterized queries

## 🐛 Troubleshooting

### Common Issues

1. **Token Expired**
   - Use refresh token to get new access token
   - Re-login if refresh token expired

2. **Access Denied**
   - Check user role permissions
   - Verify resource ownership

3. **Rate Limited**
   - Wait for rate limit window to reset
   - Reduce request frequency

4. **Database Connection**
   - Verify database credentials
   - Check database server status

## 📚 Additional Resources

- [JWT Documentation](https://jwt.io/)
- [BCrypt Documentation](https://github.com/dcodeIO/bcrypt.js/)
- [Express Rate Limit](https://github.com/nfriedly/express-rate-limit)
- [Helmet Security](https://helmetjs.github.io/) 