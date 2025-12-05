/**
 * Core TypeScript type definitions for the Patient Management System
 * All interfaces follow naming conventions:
 * - Interfaces for data structures use PascalCase with descriptive names
 * - Database row types end with 'Row'
 * - API request types end with 'Request'
 * - API response types end with 'Response'
 */

// ============================================
// USER TYPES
// ============================================

/** User roles available in the system */
export type UserRole = 'patient' | 'doctor' | 'admin';

/** Gender options */
export type Gender = 'male' | 'female' | 'other';

/** Base user information stored in database */
export interface UserRow {
  id: number;
  full_name: string;
  email: string;
  password_hash: string;
  phone_number: string | null;
  gender: Gender | null;
  dob: string | null;
  role: UserRole;
  is_active: boolean;
  refresh_token: string | null;
  last_login: Date | null;
  failed_login_attempts: number;
  account_locked_until: Date | null;
  created_at: Date;
  updated_at: Date;
}

/** User data for API responses (excludes sensitive fields) */
export interface UserResponse {
  id: number;
  email: string;
  role: UserRole;
  full_name: string;
  phone_number?: string;
  gender?: Gender;
  dob?: string;
}

/** Data required for user registration */
export interface UserRegistrationRequest {
  full_name: string;
  email: string;
  password: string;
  role: UserRole;
  phone_number?: string;
  gender?: Gender;
  dob?: string;
  // Patient-specific fields
  medical_history?: string;
  allergies?: string;
  emergency_contact?: string;
  // Doctor-specific fields
  specialization?: string;
  license_number?: string;
  experience_years?: number;
}

/** Data for user login */
export interface UserLoginRequest {
  email: string;
  password: string;
}

/** JWT payload structure */
export interface JwtPayload {
  userId: number;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

/** Authenticated user attached to request */
export interface AuthenticatedUser {
  id: number;
  email: string;
  role: UserRole;
  full_name: string;
}

// ============================================
// PATIENT TYPES
// ============================================

/** Patient record from database */
export interface PatientRow {
  id: number;
  user_id: number;
  medical_history: string | null;
  allergies: string | null;
  emergency_contact: string | null;
  created_at: Date;
  updated_at: Date;
}

/** Patient data for API responses */
export interface PatientResponse {
  id: number;
  user_id: number;
  full_name: string;
  email: string;
  phone_number?: string;
  gender?: Gender;
  dob?: string;
  medical_history?: string;
  allergies?: string;
  emergency_contact?: string;
}

/** Data for creating a patient */
export interface PatientCreateRequest {
  full_name: string;
  email: string;
  password: string;
  phone_number?: string;
  gender?: Gender;
  dob?: string;
  medical_history?: string;
  allergies?: string;
  emergency_contact?: string;
}

/** Data for updating a patient */
export interface PatientUpdateRequest {
  full_name?: string;
  email?: string;
  phone_number?: string;
  gender?: Gender;
  dob?: string;
  medical_history?: string;
  allergies?: string;
  emergency_contact?: string;
}

// ============================================
// DOCTOR TYPES
// ============================================

/** Doctor record from database */
export interface DoctorRow {
  id: number;
  user_id: number;
  specialization: string | null;
  license_number: string | null;
  experience_years: number | null;
  created_at: Date;
  updated_at: Date;
}

/** Doctor data for API responses */
export interface DoctorResponse {
  id: number;
  user_id: number;
  full_name: string;
  email: string;
  phone_number?: string;
  gender?: Gender;
  specialization?: string;
  license_number?: string;
  experience_years?: number;
}

/** Data for creating a doctor */
export interface DoctorCreateRequest {
  full_name: string;
  email: string;
  password?: string;
  phone_number?: string;
  gender?: Gender;
  dob?: string;
  specialization?: string;
  license_number?: string;
  experience_years?: number;
}

/** Data for updating a doctor */
export interface DoctorUpdateRequest {
  full_name?: string;
  email?: string;
  phone_number?: string;
  gender?: Gender;
  dob?: string;
  specialization?: string;
  license_number?: string;
  experience_years?: number;
}

// ============================================
// APPOINTMENT TYPES
// ============================================

/** Appointment status options */
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';

/** Appointment record from database */
export interface AppointmentRow {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_time: Date;
  status: AppointmentStatus;
  notes: string | null;
  cancellation_reason: string | null;
  created_at: Date;
  updated_at: Date;
}

/** Appointment data for API responses */
export interface AppointmentResponse {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_time: string;
  status: AppointmentStatus;
  notes?: string;
  cancellation_reason?: string;
  patient_name?: string;
  doctor_name?: string;
  created_at: string;
  updated_at: string;
}

/** Data for creating an appointment */
export interface AppointmentCreateRequest {
  patient_id: number;
  doctor_id: number;
  appointment_time: string;
  notes?: string;
}

/** Data for updating an appointment */
export interface AppointmentUpdateRequest {
  patient_id?: number;
  doctor_id?: number;
  appointment_time?: string;
  status?: AppointmentStatus;
  notes?: string;
}

/** Data for cancelling an appointment */
export interface AppointmentCancelRequest {
  cancellation_reason?: string;
}

// ============================================
// DOCTOR AVAILABILITY TYPES
// ============================================

/** Days of the week */
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

/** Availability slot from database */
export interface AvailabilitySlotRow {
  id: number;
  doctor_id: number;
  available_day: DayOfWeek;
  start_time: string;
  end_time: string;
}

/** Availability slot for API responses */
export interface AvailabilitySlotResponse {
  id: number;
  available_day: DayOfWeek;
  start_time: string;
  end_time: string;
}

/** Data for setting availability */
export interface AvailabilitySlotRequest {
  available_day: DayOfWeek;
  start_time: string;
  end_time: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

/** Standard API success response */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message?: string;
  data: T;
}

/** Standard API error response */
export interface ApiErrorResponse {
  success: false;
  error: string;
  message: string;
  details?: ValidationError[];
  code?: string;
}

/** Validation error detail */
export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

/** Paginated response wrapper */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================
// AUTH RESPONSE TYPES
// ============================================

/** Login/Register response */
export interface AuthResponse {
  success: true;
  message: string;
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
}

/** Token refresh response */
export interface TokenRefreshResponse {
  success: true;
  accessToken: string;
}

// ============================================
// FILE UPLOAD TYPES
// ============================================

/** File metadata */
export interface FileMetadata {
  id: number;
  filename: string;
  filepath: string;
  mimetype: string;
  size: number;
  uploaded_by: number;
  created_at: Date;
}

// ============================================
// DATABASE ERROR CODES
// ============================================

/** PostgreSQL error codes */
export const PG_ERROR_CODES = {
  UNIQUE_VIOLATION: '23505',
  FOREIGN_KEY_VIOLATION: '23503',
  NOT_NULL_VIOLATION: '23502',
  CHECK_VIOLATION: '23514',
} as const;

export type PgErrorCode = typeof PG_ERROR_CODES[keyof typeof PG_ERROR_CODES];
