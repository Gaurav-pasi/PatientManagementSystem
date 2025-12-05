import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { execqry } from '../dbutils';
import { ROLES } from '../middleware/roles';
import { JwtPayload } from '../types';

/**
 * Authentication Controller
 * 
 * Handles user authentication, registration, and session management
 */

// JWT token generation
const generateTokens = (userId: number, email: string, role: string) => {
  const accessToken = jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' } as jwt.SignOptions
  );

  const refreshToken = jwt.sign(
    { userId, email, role },
    process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' } as jwt.SignOptions
  );

  return { accessToken, refreshToken };
};

/**
 * User Registration
 * POST /auth/register
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ 
        error: 'Validation failed',
        errors: errors.array() 
      });
      return;
    }

    const { 
      full_name, 
      email, 
      password, 
      phone_number, 
      gender, 
      dob, 
      role = 'patient' 
    } = req.body;

    // Check if user already exists
    const existingUser = await execqry(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      res.status(409).json({
        error: 'User already exists',
        message: 'A user with this email already exists'
      });
      return;
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const result = await execqry(
      `INSERT INTO users (full_name, email, password_hash, phone_number, gender, dob, role, is_active, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) 
       RETURNING id, full_name, email, role`,
      [full_name, email, hashedPassword, phone_number, gender, dob, role, true]
    );

    const user = result.rows[0];

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id, user.email, user.role);

    // Store refresh token in database
    await execqry(
      "UPDATE users SET refresh_token = $1 WHERE id = $2",
      [refreshToken, user.id]
    );

    // Create patient/doctor record if needed
    if (role === 'patient') {
      await execqry(
        "INSERT INTO patients (user_id, medical_history, allergies, emergency_contact) VALUES ($1, $2, $3, $4)",
        [user.id, req.body.medical_history || '', req.body.allergies || '', req.body.emergency_contact || '']
      );
    } else if (role === 'doctor') {
      await execqry(
        "INSERT INTO doctors (user_id, specialization, license_number, experience_years) VALUES ($1, $2, $3, $4)",
        [user.id, req.body.specialization || '', req.body.license_number || '', req.body.experience_years || 0]
      );
    }

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role
      },
      tokens: {
        accessToken,
        refreshToken
      }
    });
    return;

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: 'An error occurred during registration'
    });
  }
};

/**
 * User Login
 * POST /auth/login
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ 
        error: 'Validation failed',
        errors: errors.array() 
      });
      return;
    }

    const { email, password } = req.body;

    // Find user by email
    const result = await execqry(
      "SELECT id, full_name, email, password_hash, role, is_active FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
      return;
    }

    const user = result.rows[0];

    // Check if account is active
    if (!user.is_active) {
      res.status(401).json({
        error: 'Account deactivated',
        message: 'Your account has been deactivated. Please contact support.'
      });
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
      return;
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id, user.email, user.role);

    // Store refresh token and update last login
    await execqry(
      "UPDATE users SET refresh_token = $1, last_login = NOW() WHERE id = $2",
      [refreshToken, user.id]
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role
      },
      tokens: {
        accessToken,
        refreshToken
      }
    });
    return;

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: 'An error occurred during login'
    });
  }
};

/**
 * Refresh Token
 * POST /auth/refresh
 */
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        error: 'Refresh token required',
        message: 'Please provide a refresh token'
      });
      return;
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret'
    ) as JwtPayload;

    // Check if refresh token exists in database
    const result = await execqry(
      "SELECT id, email, role, refresh_token, is_active FROM users WHERE id = $1",
      [decoded.userId]
    );

    if (result.rows.length === 0 || result.rows[0].refresh_token !== refreshToken) {
      res.status(401).json({
        error: 'Invalid refresh token',
        message: 'Refresh token is invalid or expired'
      });
      return;
    }

    const user = result.rows[0];

    if (!user.is_active) {
      res.status(401).json({
        error: 'Account deactivated',
        message: 'Your account has been deactivated'
      });
      return;
    }

    // Generate new tokens
    const newTokens = generateTokens(user.id, user.email, user.role);

    // Update refresh token in database
    await execqry(
      "UPDATE users SET refresh_token = $1 WHERE id = $2",
      [newTokens.refreshToken, user.id]
    );

    res.json({
      message: 'Token refreshed successfully',
      tokens: newTokens
    });
    return;

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        error: 'Invalid refresh token',
        message: 'Refresh token is invalid or expired'
      });
      return;
    }

    console.error('Token refresh error:', error);
    res.status(500).json({
      error: 'Token refresh failed',
      message: 'An error occurred while refreshing the token'
    });
  }
};

/**
 * Logout
 * POST /auth/logout
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'You must be logged in to logout'
      });
      return;
    }

    // Clear refresh token from database
    await execqry(
      "UPDATE users SET refresh_token = NULL WHERE id = $1",
      [req.user.id]
    );

    res.json({
      message: 'Logout successful'
    });
    return;

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Logout failed',
      message: 'An error occurred during logout'
    });
  }
};

/**
 * Get Current User
 * GET /auth/me
 */
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'You must be logged in to access this resource'
      });
      return;
    }

    // Get detailed user information
    const result = await execqry(
      `SELECT u.id, u.full_name, u.email, u.phone_number, u.gender, u.dob, u.role, u.created_at, u.last_login
       FROM users u WHERE u.id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        error: 'User not found',
        message: 'User not found'
      });
      return;
    }

    const user = result.rows[0];

    res.json({
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone_number: user.phone_number,
        gender: user.gender,
        dob: user.dob,
        role: user.role,
        created_at: user.created_at,
        last_login: user.last_login
      }
    });
    return;

  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      error: 'Failed to get user information',
      message: 'An error occurred while fetching user information'
    });
  }
};

/**
 * Change Password
 * PUT /auth/change-password
 */
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'You must be logged in to change password'
      });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    // Validate new password
    if (!newPassword || newPassword.length < 6) {
      res.status(400).json({
        error: 'Invalid password',
        message: 'New password must be at least 6 characters long'
      });
      return;
    }

    // Get current password hash
    const result = await execqry(
      "SELECT password_hash FROM users WHERE id = $1",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        error: 'User not found',
        message: 'User not found'
      });
      return;
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, result.rows[0].password_hash);
    if (!isCurrentPasswordValid) {
      res.status(401).json({
        error: 'Invalid current password',
        message: 'Current password is incorrect'
      });
      return;
    }

    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await execqry(
      "UPDATE users SET password_hash = $1 WHERE id = $2",
      [newPasswordHash, req.user.id]
    );

    res.json({
      message: 'Password changed successfully'
    });
    return;

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      error: 'Password change failed',
      message: 'An error occurred while changing password'
    });
  }
}; 