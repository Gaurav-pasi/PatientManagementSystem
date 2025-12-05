/**
 * Standardized API Response Handler Middleware
 * Provides consistent response format across all endpoints
 */

import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../config/constants';

/**
 * Standard success response structure
 */
export interface SuccessResponse<T = unknown> {
  success: true;
  message?: string;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

/**
 * Standard error response structure
 */
export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  details?: Array<{ field: string; message: string }>;
  stack?: string;
}

// Extend Express Response interface
declare global {
  namespace Express {
    interface Response {
      success: <T>(data: T, message?: string, statusCode?: number) => void;
      created: <T>(data: T, message?: string) => void;
      paginated: <T>(
        data: T[],
        pagination: { page: number; limit: number; total: number },
        message?: string
      ) => void;
      error: (message: string, error?: string, statusCode?: number) => void;
    }
  }
}

/**
 * Middleware that adds standardized response methods to the Response object
 */
export function responseHandler(req: Request, res: Response, next: NextFunction): void {
  /**
   * Send a success response
   * @param data - The data to send
   * @param message - Optional success message
   * @param statusCode - HTTP status code (default: 200)
   */
  res.success = function <T>(
    data: T,
    message?: string,
    statusCode: number = HTTP_STATUS.OK
  ): void {
    const response: SuccessResponse<T> = {
      success: true,
      data,
    };

    if (message) {
      response.message = message;
    }

    this.status(statusCode).json(response);
  };

  /**
   * Send a created response (201)
   * @param data - The created resource data
   * @param message - Optional success message
   */
  res.created = function <T>(data: T, message?: string): void {
    const response: SuccessResponse<T> = {
      success: true,
      data,
    };

    if (message) {
      response.message = message;
    }

    this.status(HTTP_STATUS.CREATED).json(response);
  };

  /**
   * Send a paginated response
   * @param data - Array of items
   * @param pagination - Pagination info
   * @param message - Optional success message
   */
  res.paginated = function <T>(
    data: T[],
    pagination: { page: number; limit: number; total: number },
    message?: string
  ): void {
    const totalPages = Math.ceil(pagination.total / pagination.limit);

    const response: SuccessResponse<T[]> = {
      success: true,
      data,
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        totalPages,
      },
    };

    if (message) {
      response.message = message;
    }

    this.status(HTTP_STATUS.OK).json(response);
  };

  /**
   * Send an error response
   * @param message - Error message for the user
   * @param error - Error code/type
   * @param statusCode - HTTP status code (default: 400)
   */
  res.error = function (
    message: string,
    error: string = 'BAD_REQUEST',
    statusCode: number = HTTP_STATUS.BAD_REQUEST
  ): void {
    const response: ErrorResponse = {
      success: false,
      error,
      message,
    };

    this.status(statusCode).json(response);
  };

  next();
}

/**
 * Helper function to create a success response object
 */
export function createSuccessResponse<T>(data: T, message?: string): SuccessResponse<T> {
  const response: SuccessResponse<T> = {
    success: true,
    data,
  };

  if (message) {
    response.message = message;
  }

  return response;
}

/**
 * Helper function to create an error response object
 */
export function createErrorResponse(
  message: string,
  error: string,
  details?: Array<{ field: string; message: string }>
): ErrorResponse {
  const response: ErrorResponse = {
    success: false,
    error,
    message,
  };

  if (details) {
    response.details = details;
  }

  return response;
}

export default responseHandler;
