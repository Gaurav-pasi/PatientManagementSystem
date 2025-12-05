/**
 * Custom error classes and error handling utilities
 * Provides consistent error handling across the application
 */

import { Response, NextFunction } from 'express';
import { ERROR_CODES, HTTP_STATUS, ErrorCode } from '../config/constants';
import { ApiErrorResponse, ValidationError as ValidationErrorDetail, PG_ERROR_CODES } from '../types';

/**
 * Base application error class
 * All custom errors should extend this class
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode;
  public readonly isOperational: boolean;
  public readonly details?: ValidationErrorDetail[];

  constructor(
    message: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    code: ErrorCode = ERROR_CODES.INTERNAL_ERROR,
    details?: ValidationErrorDetail[]
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    this.details = details;

    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation error - thrown when request data is invalid
 */
export class ValidationAppError extends AppError {
  constructor(message: string, details?: ValidationErrorDetail[]) {
    super(message, HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR, details);
  }
}

/**
 * Authentication error - thrown when authentication fails
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed', code: ErrorCode = ERROR_CODES.INVALID_CREDENTIALS) {
    super(message, HTTP_STATUS.UNAUTHORIZED, code);
  }
}

/**
 * Authorization error - thrown when user lacks permission
 */
export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, HTTP_STATUS.FORBIDDEN, ERROR_CODES.FORBIDDEN);
  }
}

/**
 * Not found error - thrown when resource doesn't exist
 */
export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
  }
}

/**
 * Conflict error - thrown when resource already exists
 */
export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists') {
    super(message, HTTP_STATUS.CONFLICT, ERROR_CODES.ALREADY_EXISTS);
  }
}

/**
 * Database error - thrown when database operation fails
 */
export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed') {
    super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.DATABASE_ERROR);
  }
}

/**
 * Handles PostgreSQL-specific errors and converts them to AppErrors
 * @param error - The PostgreSQL error object
 * @returns AppError with appropriate status and message
 */
export function handleDatabaseError(error: unknown): AppError {
  // Type guard for PostgreSQL errors
  if (error && typeof error === 'object' && 'code' in error) {
    const pgError = error as { code: string; detail?: string; constraint?: string };

    switch (pgError.code) {
      case PG_ERROR_CODES.UNIQUE_VIOLATION:
        // Extract field name from constraint if possible
        const field = pgError.constraint?.replace(/_key$/, '').split('_').pop() || 'field';
        return new ConflictError(`A record with this ${field} already exists`);

      case PG_ERROR_CODES.FOREIGN_KEY_VIOLATION:
        return new AppError(
          'Referenced record does not exist',
          HTTP_STATUS.BAD_REQUEST,
          ERROR_CODES.FOREIGN_KEY_VIOLATION
        );

      case PG_ERROR_CODES.NOT_NULL_VIOLATION:
        return new AppError(
          'Required field is missing',
          HTTP_STATUS.BAD_REQUEST,
          ERROR_CODES.MISSING_REQUIRED_FIELD
        );

      case PG_ERROR_CODES.CHECK_VIOLATION:
        return new AppError(
          'Invalid data value',
          HTTP_STATUS.BAD_REQUEST,
          ERROR_CODES.VALIDATION_ERROR
        );

      default:
        return new DatabaseError('Database operation failed');
    }
  }

  return new DatabaseError('An unexpected database error occurred');
}

/**
 * Formats an error for API response
 * @param error - The error to format
 * @returns Formatted error response object
 */
export function formatErrorResponse(error: AppError | Error): ApiErrorResponse {
  if (error instanceof AppError) {
    return {
      success: false,
      error: error.code,
      message: error.message,
      details: error.details,
    };
  }

  // For non-AppError errors, return generic message
  return {
    success: false,
    error: ERROR_CODES.INTERNAL_ERROR,
    message: 'An unexpected error occurred',
  };
}

/**
 * Sends an error response to the client
 * @param res - Express response object
 * @param error - The error to send
 */
export function sendErrorResponse(res: Response, error: AppError | Error): void {
  const statusCode = error instanceof AppError ? error.statusCode : HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const response = formatErrorResponse(error);

  res.status(statusCode).json(response);
}

/**
 * Async handler wrapper to catch errors in async route handlers
 * Eliminates the need for try-catch in every route
 * @param fn - Async route handler function
 * @returns Wrapped function with error handling
 */
export function asyncHandler<T>(
  fn: (req: T, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: T, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Logs error details for debugging
 * In production, this should integrate with a logging service
 * @param error - The error to log
 * @param context - Additional context information
 */
export function logError(error: Error, context?: Record<string, unknown>): void {
  const timestamp = new Date().toISOString();
  const errorInfo = {
    timestamp,
    name: error.name,
    message: error.message,
    stack: error.stack,
    ...(error instanceof AppError && {
      statusCode: error.statusCode,
      code: error.code,
      isOperational: error.isOperational,
    }),
    ...context,
  };

  // In production, send to logging service (e.g., Winston, Sentry)
  if (process.env.NODE_ENV === 'production') {
    // TODO: Integrate with production logging service
    console.error(JSON.stringify(errorInfo));
  } else {
    console.error('Error:', errorInfo);
  }
}

/**
 * Determines if an error is operational (expected) or programming error
 * @param error - The error to check
 * @returns true if operational, false if programming error
 */
export function isOperationalError(error: Error): boolean {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
}
