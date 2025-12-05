/**
 * Frontend TypeScript type definitions
 * Mirrors backend types for API communication
 */

// ============================================
// USER TYPES
// ============================================

export type UserRole = 'patient' | 'doctor' | 'admin';
export type Gender = 'male' | 'female' | 'other';

export interface User {
  id: number;
  email: string;
  role: UserRole;
  full_name: string;
  phone_number?: string;
  gender?: Gender;
  dob?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  full_name: string;
  email: string;
  password: string;
  role: UserRole;
  phone_number?: string;
  gender?: Gender;
  dob?: string;
  // Patient fields
  medical_history?: string;
  allergies?: string;
  emergency_contact?: string;
  // Doctor fields
  specialization?: string;
  license_number?: string;
  experience_years?: number;
}

// ============================================
// PATIENT TYPES
// ============================================

export interface Patient {
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

export interface PatientCreateData {
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

export interface PatientUpdateData {
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

export interface Doctor {
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

export interface DoctorCreateData {
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

export interface DoctorUpdateData {
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

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';

export interface Appointment {
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

export interface AppointmentCreateData {
  patient_id: number;
  doctor_id: number;
  appointment_time: string;
  notes?: string;
}

export interface AppointmentUpdateData {
  patient_id?: number;
  doctor_id?: number;
  appointment_time?: string;
  status?: AppointmentStatus;
  notes?: string;
}

// ============================================
// AVAILABILITY TYPES
// ============================================

export type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export interface AvailabilitySlot {
  id?: number;
  available_day: DayOfWeek;
  start_time: string;
  end_time: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message?: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  message: string;
  details?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface AuthResponse {
  success: true;
  message: string;
  accessToken: string;
  refreshToken: string;
  user: User;
}

// Generic API response wrapper
export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
};

// ============================================
// AUTH API TYPES
// ============================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
  role?: UserRole;
  phone_number?: string;
  gender?: Gender;
  dob?: string;
  medical_history?: string;
  allergies?: string;
  emergency_contact?: string;
  specialization?: string;
  license_number?: string;
  experience_years?: number;
}

export interface RegisterResponse {
  message: string;
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

// ============================================
// REQUEST TYPES (for API calls)
// ============================================

export type PatientCreateRequest = PatientCreateData;
export type PatientUpdateRequest = PatientUpdateData;
export type DoctorCreateRequest = DoctorCreateData;
export type DoctorUpdateRequest = DoctorUpdateData;
export type AppointmentCreateRequest = AppointmentCreateData;
export type AppointmentUpdateRequest = AppointmentUpdateData;

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
// COMPONENT PROP TYPES
// ============================================

export interface SelectOption {
  value: string;
  label: string;
}

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

// ============================================
// FORM TYPES
// ============================================

export interface FormFieldError {
  message: string;
}

export interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, FormFieldError>>;
  isSubmitting: boolean;
  isValid: boolean;
}
