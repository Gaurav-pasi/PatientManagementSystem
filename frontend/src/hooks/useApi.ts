/**
 * React Query hooks for API data fetching
 * Provides type-safe data fetching with caching and automatic refetching
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import {
  doctorsApi,
  appointmentsApi,
  patientsApi,
  authApi,
} from '../lib/api';
import {
  Doctor,
  Patient,
  Appointment,
  AvailabilitySlot,
  AppointmentCreateRequest,
  AppointmentUpdateRequest,
  PatientCreateRequest,
  PatientUpdateRequest,
  DoctorCreateRequest,
  DoctorUpdateRequest,
  User,
  ApiResponse,
} from '../types';

// Query keys for cache management
export const queryKeys = {
  doctors: ['doctors'] as const,
  doctor: (id: string | number) => ['doctors', id] as const,
  doctorAvailability: (id: string | number) => ['doctors', id, 'availability'] as const,
  patients: ['patients'] as const,
  patient: (id: string | number) => ['patients', id] as const,
  appointments: ['appointments'] as const,
  appointment: (id: string | number) => ['appointments', id] as const,
  currentUser: ['currentUser'] as const,
};

// Helper to extract error message
function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.response?.data?.error || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}

// ============================================
// DOCTOR HOOKS
// ============================================

export function useDoctors(
  options?: Omit<UseQueryOptions<Doctor[], AxiosError>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.doctors,
    queryFn: async () => {
      const response = await doctorsApi.getAll();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

export function useDoctor(
  id: string | number,
  options?: Omit<UseQueryOptions<Doctor, AxiosError>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.doctor(id),
    queryFn: async () => {
      const response = await doctorsApi.getById(id);
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
}

export function useDoctorAvailability(
  id: string | number,
  options?: Omit<UseQueryOptions<AvailabilitySlot[], AxiosError>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.doctorAvailability(id),
    queryFn: async () => {
      const response = await doctorsApi.getAvailability(id);
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
}

export function useCreateDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DoctorCreateRequest) => {
      const response = await doctorsApi.create(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.doctors });
      toast.success('Doctor created successfully');
    },
    onError: (error: AxiosError) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUpdateDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string | number; data: DoctorUpdateRequest }) => {
      const response = await doctorsApi.update(id, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.doctors });
      queryClient.invalidateQueries({ queryKey: queryKeys.doctor(variables.id) });
      toast.success('Doctor updated successfully');
    },
    onError: (error: AxiosError) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useSetDoctorAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      slots,
    }: {
      id: string | number;
      slots: Omit<AvailabilitySlot, 'id'>[];
    }) => {
      const response = await doctorsApi.setAvailability(id, slots);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.doctorAvailability(variables.id) });
      toast.success('Availability updated successfully');
    },
    onError: (error: AxiosError) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// ============================================
// PATIENT HOOKS
// ============================================

export function usePatient(
  id: string | number,
  options?: Omit<UseQueryOptions<ApiResponse<Patient>, AxiosError>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.patient(id),
    queryFn: async () => {
      const response = await patientsApi.getById(id);
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PatientCreateRequest) => {
      const response = await patientsApi.create(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.patients });
      toast.success('Patient created successfully');
    },
    onError: (error: AxiosError) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string | number; data: PatientUpdateRequest }) => {
      const response = await patientsApi.update(id, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.patients });
      queryClient.invalidateQueries({ queryKey: queryKeys.patient(variables.id) });
      toast.success('Patient updated successfully');
    },
    onError: (error: AxiosError) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// ============================================
// APPOINTMENT HOOKS
// ============================================

export function useAppointments(
  options?: Omit<UseQueryOptions<Appointment[], AxiosError>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.appointments,
    queryFn: async () => {
      const response = await appointmentsApi.getAll();
      return response.data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    ...options,
  });
}

export function useAppointment(
  id: string | number,
  options?: Omit<UseQueryOptions<Appointment, AxiosError>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.appointment(id),
    queryFn: async () => {
      const response = await appointmentsApi.getById(id);
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AppointmentCreateRequest) => {
      const response = await appointmentsApi.create(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments });
      toast.success('Appointment booked successfully');
    },
    onError: (error: AxiosError) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string | number; data: AppointmentUpdateRequest }) => {
      const response = await appointmentsApi.update(id, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments });
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment(variables.id) });
      toast.success('Appointment updated successfully');
    },
    onError: (error: AxiosError) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string | number; reason?: string }) => {
      const response = await appointmentsApi.cancel(id, reason);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments });
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment(variables.id) });
      toast.success('Appointment cancelled');
    },
    onError: (error: AxiosError) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// ============================================
// AUTH HOOKS
// ============================================

export function useCurrentUser(
  options?: Omit<UseQueryOptions<User, AxiosError>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: async () => {
      const response = await authApi.getCurrentUser();
      return response.data.user;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: false,
    ...options,
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => {
      const response = await authApi.changePassword(currentPassword, newPassword);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (error: AxiosError) => {
      toast.error(getErrorMessage(error));
    },
  });
}
