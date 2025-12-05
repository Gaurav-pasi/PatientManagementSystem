/**
 * Frontend application constants
 * Centralized configuration for the React application
 */

// ============================================
// API CONFIGURATION
// ============================================

export const API_CONFIG = {
  /** Base URL for API requests */
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  /** Request timeout in milliseconds */
  TIMEOUT: 30000,
  /** Number of retry attempts for failed requests */
  RETRY_ATTEMPTS: 3,
} as const;

// ============================================
// AUTHENTICATION
// ============================================

export const AUTH_CONFIG = {
  /** Local storage key for access token */
  ACCESS_TOKEN_KEY: 'accessToken',
  /** Local storage key for refresh token */
  REFRESH_TOKEN_KEY: 'refreshToken',
  /** Minimum password length */
  MIN_PASSWORD_LENGTH: 8,
} as const;

// ============================================
// UI CONFIGURATION
// ============================================

export const UI_CONFIG = {
  /** Toast notification duration in milliseconds */
  TOAST_DURATION: 4000,
  /** Default page size for paginated lists */
  DEFAULT_PAGE_SIZE: 20,
  /** Animation duration in milliseconds */
  ANIMATION_DURATION: 300,
  /** Debounce delay for search inputs */
  SEARCH_DEBOUNCE_MS: 300,
} as const;

// ============================================
// COLORS
// ============================================

export const COLORS = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
} as const;

// ============================================
// ROUTES
// ============================================

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  APPOINTMENTS: '/appointments',
  DOCTORS: '/doctors',
  PATIENTS: '/patients',
  AVAILABILITY: '/availability',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

// ============================================
// USER ROLES
// ============================================

export const USER_ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  ADMIN: 'admin',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// ============================================
// APPOINTMENT STATUS
// ============================================

export const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export type AppointmentStatus = typeof APPOINTMENT_STATUS[keyof typeof APPOINTMENT_STATUS];

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  [APPOINTMENT_STATUS.SCHEDULED]: 'Scheduled',
  [APPOINTMENT_STATUS.COMPLETED]: 'Completed',
  [APPOINTMENT_STATUS.CANCELLED]: 'Cancelled',
};

export const APPOINTMENT_STATUS_COLORS: Record<AppointmentStatus, string> = {
  [APPOINTMENT_STATUS.SCHEDULED]: 'blue',
  [APPOINTMENT_STATUS.COMPLETED]: 'green',
  [APPOINTMENT_STATUS.CANCELLED]: 'red',
};

// ============================================
// DAYS OF WEEK
// ============================================

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
// GENDER OPTIONS
// ============================================

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
] as const;

// ============================================
// TIME SLOTS
// ============================================

export const TIME_SLOTS = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
] as const;

// ============================================
// VALIDATION MESSAGES
// ============================================

export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_TOO_SHORT: `Password must be at least ${AUTH_CONFIG.MIN_PASSWORD_LENGTH} characters`,
  PASSWORDS_DONT_MATCH: "Passwords don't match",
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_DATE: 'Please enter a valid date',
} as const;

// ============================================
// ERROR MESSAGES
// ============================================

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Please log in to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  GENERIC: 'An unexpected error occurred. Please try again.',
} as const;

// ============================================
// SUCCESS MESSAGES
// ============================================

export const SUCCESS_MESSAGES = {
  LOGIN: 'Welcome back!',
  REGISTER: 'Account created successfully!',
  LOGOUT: 'Logged out successfully.',
  APPOINTMENT_CREATED: 'Appointment booked successfully!',
  APPOINTMENT_UPDATED: 'Appointment updated successfully!',
  APPOINTMENT_CANCELLED: 'Appointment cancelled.',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
} as const;
