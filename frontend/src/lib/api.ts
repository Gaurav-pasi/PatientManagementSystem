import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG, AUTH_CONFIG } from '../config/constants';
import {
  User,
  Doctor,
  Patient,
  Appointment,
  AvailabilitySlot,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ApiResponse,
  AppointmentCreateRequest,
  AppointmentUpdateRequest,
  PatientCreateRequest,
  PatientUpdateRequest,
  DoctorCreateRequest,
  DoctorUpdateRequest,
} from '../types';

// Extend axios config to include retry flag
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_CONFIG.ACCESS_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
        if (refreshToken) {
          const response = await axios.post<{ accessToken: string }>(
            `${API_CONFIG.BASE_URL}/auth/refresh`,
            { refreshToken }
          );

          const { accessToken } = response.data;
          localStorage.setItem(AUTH_CONFIG.ACCESS_TOKEN_KEY, accessToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem(AUTH_CONFIG.ACCESS_TOKEN_KEY);
        localStorage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ============================================
// AUTH API
// ============================================

export const authApi = {
  login: (data: LoginRequest): Promise<AxiosResponse<LoginResponse>> =>
    api.post('/auth/login', data),

  register: (data: RegisterRequest): Promise<AxiosResponse<RegisterResponse>> =>
    api.post('/auth/register', data),

  logout: (): Promise<AxiosResponse<ApiResponse<null>>> =>
    api.post('/auth/logout'),

  getCurrentUser: (): Promise<AxiosResponse<ApiResponse<{ user: User }>>> =>
    api.get('/auth/me'),

  changePassword: (
    currentPassword: string,
    newPassword: string
  ): Promise<AxiosResponse<ApiResponse<null>>> =>
    api.put('/auth/change-password', { currentPassword, newPassword }),

  refreshToken: (
    refreshToken: string
  ): Promise<AxiosResponse<{ accessToken: string; refreshToken: string }>> =>
    api.post('/auth/refresh', { refreshToken }),
};

// ============================================
// PATIENTS API
// ============================================

export const patientsApi = {
  create: (data: PatientCreateRequest): Promise<AxiosResponse<ApiResponse<Patient>>> =>
    api.post('/patients', data),

  getById: (id: string | number): Promise<AxiosResponse<ApiResponse<Patient>>> =>
    api.get(`/patients/${id}`),

  update: (
    id: string | number,
    data: PatientUpdateRequest
  ): Promise<AxiosResponse<ApiResponse<Patient>>> =>
    api.put(`/patients/${id}`, data),
};

// ============================================
// DOCTORS API
// ============================================

export const doctorsApi = {
  getAll: (): Promise<AxiosResponse<Doctor[]>> =>
    api.get('/doctors'),

  getById: (id: string | number): Promise<AxiosResponse<Doctor>> =>
    api.get(`/doctors/${id}`),

  create: (data: DoctorCreateRequest): Promise<AxiosResponse<ApiResponse<Doctor>>> =>
    api.post('/doctors', data),

  update: (
    id: string | number,
    data: DoctorUpdateRequest
  ): Promise<AxiosResponse<ApiResponse<Doctor>>> =>
    api.put(`/doctors/${id}`, data),

  getAvailability: (
    id: string | number
  ): Promise<AxiosResponse<AvailabilitySlot[]>> =>
    api.get(`/doctors/${id}/availability`),

  setAvailability: (
    id: string | number,
    slots: Omit<AvailabilitySlot, 'id'>[]
  ): Promise<AxiosResponse<ApiResponse<AvailabilitySlot[]>>> =>
    api.post(`/doctors/${id}/availability`, { slots }),
};

// ============================================
// APPOINTMENTS API
// ============================================

export const appointmentsApi = {
  getAll: (): Promise<AxiosResponse<Appointment[]>> =>
    api.get('/appointments'),

  getById: (id: string | number): Promise<AxiosResponse<Appointment>> =>
    api.get(`/appointments/${id}`),

  create: (
    data: AppointmentCreateRequest
  ): Promise<AxiosResponse<ApiResponse<Appointment>>> =>
    api.post('/appointments', data),

  update: (
    id: string | number,
    data: AppointmentUpdateRequest
  ): Promise<AxiosResponse<ApiResponse<Appointment>>> =>
    api.put(`/appointments/${id}`, data),

  cancel: (
    id: string | number,
    reason?: string
  ): Promise<AxiosResponse<ApiResponse<Appointment>>> =>
    api.delete(`/appointments/${id}`, { data: { cancellation_reason: reason } }),
};

// ============================================
// PAYMENTS API
// ============================================

export interface CheckoutRequest {
  appointmentId: number;
  amount: number;
  currency?: string;
}

export interface CheckoutResponse {
  checkoutUrl: string;
  sessionId: string;
}

export const paymentsApi = {
  createCheckout: (
    data: CheckoutRequest
  ): Promise<AxiosResponse<ApiResponse<CheckoutResponse>>> =>
    api.post('/payments/checkout', data),
};
