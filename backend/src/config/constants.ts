/**
 * Application constants and configuration values
 * All magic numbers and strings should be defined here
 */

// ============================================
// AUTHENTICATION CONSTANTS
// ============================================

/** Password hashing configuration */
export const AUTH_CONFIG = {
  /** Number of salt rounds for bcrypt */
  BCRYPT_SALT_ROUNDS: 12,
  /** Minimum password length */
  MIN_PASSWORD_LENGTH: 8,
  /** Maximum password length */
  MAX_PASSWORD_LENGTH: 128,
  /** JWT access token expiry */
  JWT_ACCESS_TOKEN_EXPIRY: '1h',
  /** JWT refresh token expiry */
  JWT_REFRESH_TOKEN_EXPIRY: '7d',
  /** Maximum failed login attempts before lockout */
  MAX_FAILED_LOGIN_ATTEMPTS: 5,
  /** Account lockout duration in minutes */
  ACCOUNT_LOCKOUT_DURATION_MINUTES: 30,
} as const;

// ============================================
// RATE LIMITING CONSTANTS
// ============================================

/** Rate limiting configuration */
export const RATE_LIMIT_CONFIG = {
  /** Window size in milliseconds (15 minutes) */
  WINDOW_MS: 15 * 60 * 1000,
  /** Maximum requests per window for general API */
  API_MAX_REQUESTS: 100,
  /** Maximum login attempts per window */
  LOGIN_MAX_ATTEMPTS: 5,
  /** Maximum registration attempts per hour */
  REGISTER_MAX_ATTEMPTS: 3,
  /** Maximum password reset requests per hour */
  PASSWORD_RESET_MAX_ATTEMPTS: 3,
  /** Maximum file uploads per hour */
  FILE_UPLOAD_MAX_ATTEMPTS: 10,
} as const;

// ============================================
// FILE UPLOAD CONSTANTS
// ============================================

/** File upload configuration */
export const FILE_UPLOAD_CONFIG = {
  /** Maximum file size in bytes (5MB) */
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  /** Allowed file extensions for documents */
  ALLOWED_DOCUMENT_EXTENSIONS: ['.pdf', '.doc', '.docx', '.txt'],
  /** Allowed file extensions for images */
  ALLOWED_IMAGE_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  /** Upload directory path */
  UPLOAD_PATH: './uploads',
} as const;

// ============================================
// PAGINATION CONSTANTS
// ============================================

/** Pagination defaults */
export const PAGINATION_CONFIG = {
  /** Default page number */
  DEFAULT_PAGE: 1,
  /** Default items per page */
  DEFAULT_LIMIT: 20,
  /** Maximum items per page */
  MAX_LIMIT: 100,
} as const;

// ============================================
// USER ROLES
// ============================================

/** Available user roles */
export const USER_ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  ADMIN: 'admin',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// ============================================
// APPOINTMENT STATUS
// ============================================

/** Appointment status values */
export const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export type AppointmentStatus = typeof APPOINTMENT_STATUS[keyof typeof APPOINTMENT_STATUS];

// ============================================
// DAYS OF WEEK
// ============================================

/** Days of the week */
export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

export type DayOfWeek = typeof DAYS_OF_WEEK[number];

// ============================================
// ERROR CODES
// ============================================

/** Application error codes for consistent error handling */
export const ERROR_CODES = {
  // Authentication errors
  INVALID_CREDENTIALS: 'AUTH_001',
  TOKEN_EXPIRED: 'AUTH_002',
  TOKEN_INVALID: 'AUTH_003',
  ACCOUNT_LOCKED: 'AUTH_004',
  ACCOUNT_DEACTIVATED: 'AUTH_005',
  UNAUTHORIZED: 'AUTH_006',
  FORBIDDEN: 'AUTH_007',

  // Validation errors
  VALIDATION_ERROR: 'VAL_001',
  MISSING_REQUIRED_FIELD: 'VAL_002',
  INVALID_FORMAT: 'VAL_003',

  // Resource errors
  NOT_FOUND: 'RES_001',
  ALREADY_EXISTS: 'RES_002',
  CONFLICT: 'RES_003',

  // Database errors
  DATABASE_ERROR: 'DB_001',
  UNIQUE_VIOLATION: 'DB_002',
  FOREIGN_KEY_VIOLATION: 'DB_003',

  // Server errors
  INTERNAL_ERROR: 'SRV_001',
  SERVICE_UNAVAILABLE: 'SRV_002',
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

// ============================================
// HTTP STATUS CODES
// ============================================

/** Common HTTP status codes */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// ============================================
// VALIDATION PATTERNS
// ============================================

/** Regular expression patterns for validation */
export const VALIDATION_PATTERNS = {
  /** Email validation pattern */
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  /** Phone number pattern (international format) */
  PHONE: /^\+?[\d\s-()]{10,}$/,
  /** Time format (HH:MM) */
  TIME_24H: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
  /** Date format (YYYY-MM-DD) */
  DATE_ISO: /^\d{4}-\d{2}-\d{2}$/,
  /** License number pattern (alphanumeric) */
  LICENSE_NUMBER: /^[A-Z0-9-]{5,20}$/i,
} as const;

// ============================================
// DEFAULT VALUES
// ============================================

/** Default values for optional fields */
export const DEFAULTS = {
  /** Default user role for registration */
  USER_ROLE: USER_ROLES.PATIENT,
  /** Default appointment status */
  APPOINTMENT_STATUS: APPOINTMENT_STATUS.SCHEDULED,
  /** Default active status for users */
  USER_IS_ACTIVE: true,
} as const;
