import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { execqry } from '../dbutils';
import { JwtPayload } from '../types';

// Extend Request interface to include user information
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: string;
        full_name: string;
      };
    }
  }
}

/**
 * JWT Authentication Middleware
 * 
 * This middleware:
 * 1. Extracts the JWT token from the Authorization header
 * 2. Verifies the token using the JWT_SECRET
 * 3. Fetches user information from the database
 * 4. Attaches user data to the request object
 * 5. Handles various authentication errors
 */
export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get the authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ 
        error: 'Access token required',
        message: 'Please provide a valid authentication token' 
      });
      return;
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as JwtPayload;
    
    // Fetch user information from database
    const result = await execqry(
      "SELECT id, email, role, full_name, is_active FROM users WHERE id = $1",
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      res.status(401).json({ 
        error: 'Invalid token',
        message: 'User not found' 
      });
      return;
    }

    const user = result.rows[0];

    // Check if user account is active
    if (!user.is_active) {
      res.status(401).json({ 
        error: 'Account deactivated',
        message: 'Your account has been deactivated. Please contact support.' 
      });
      return;
    }

    // Attach user information to request object
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ 
        error: 'Invalid token',
        message: 'The provided token is invalid or expired' 
      });
      return;
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ 
        error: 'Token expired',
        message: 'Your session has expired. Please login again.' 
      });
      return;
    }

    console.error('Authentication error:', error);
    res.status(500).json({ 
      error: 'Authentication failed',
      message: 'An error occurred during authentication' 
    });
    return;
  }
};

/**
 * Optional Authentication Middleware
 * 
 * Similar to authenticateToken but doesn't require authentication.
 * Useful for endpoints that can work with or without authentication.
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return next(); // Continue without authentication
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as JwtPayload;

    const result = await execqry(
      "SELECT id, email, role, full_name, is_active FROM users WHERE id = $1",
      [decoded.userId]
    );

    if (result.rows.length > 0 && result.rows[0].is_active) {
      req.user = {
        id: result.rows[0].id,
        email: result.rows[0].email,
        role: result.rows[0].role,
        full_name: result.rows[0].full_name
      };
    }

    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
}; 