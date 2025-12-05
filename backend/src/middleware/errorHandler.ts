/**
 * Global Error Handler Middleware
 * Catches all errors and sends standardized error responses
 */

import { Request, Response, NextFunction } from 'express';
import { AppError, logError, formatErrorResponse } from '../utils/errors';
import { HTTP_STATUS, ERROR_CODES } from '../config/constants';

/**
 * Global error handling middleware
 * Should be added as the last middleware in the chain
 */
export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log the error
  logError(err, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userId: req.user?.id,
  });

  // Handle AppError instances
  if (err instanceof AppError) {
    const response = formatErrorResponse(err);
    res.status(err.statusCode).json(response);
    return;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: ERROR_CODES.INVALID_CREDENTIALS,
      message: 'Invalid authentication token',
    });
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: ERROR_CODES.TOKEN_EXPIRED,
      message: 'Authentication token has expired',
    });
    return;
  }

  // Handle validation errors from express-validator
  if (err.name === 'ValidationError') {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: ERROR_CODES.VALIDATION_ERROR,
      message: err.message,
    });
    return;
  }

  // Handle syntax errors (malformed JSON)
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: ERROR_CODES.VALIDATION_ERROR,
      message: 'Invalid JSON in request body',
    });
    return;
  }

  // Default to internal server error for unknown errors
  const isProduction = process.env.NODE_ENV === 'production';

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: ERROR_CODES.INTERNAL_ERROR,
    message: isProduction ? 'An unexpected error occurred' : err.message,
    ...(isProduction ? {} : { stack: err.stack }),
  });
}

/**
 * Not Found Handler Middleware
 * Catches requests to undefined routes
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    error: ERROR_CODES.NOT_FOUND,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
}

export default errorHandler;
