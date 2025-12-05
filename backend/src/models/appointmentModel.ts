/**
 * Appointment Model
 * Handles all database operations related to appointments
 */

import { execqry } from '../dbutils';
import {
  AppointmentRow,
  AppointmentCreateRequest,
  AppointmentUpdateRequest,
} from '../types';

/**
 * Creates a new appointment in the database
 * @param data - Appointment creation data
 * @returns The created appointment record
 */
export async function createAppointment(
  data: AppointmentCreateRequest
): Promise<AppointmentRow> {
  const { patient_id, doctor_id, appointment_time, notes } = data;

  const query = `
    INSERT INTO appointments (patient_id, doctor_id, appointment_time, notes)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;

  const result = await execqry(query, [
    patient_id,
    doctor_id,
    appointment_time,
    notes || null,
  ]);

  return result.rows[0];
}

/**
 * Retrieves all appointments from the database
 * @returns Array of all appointment records
 */
export async function getAllAppointments(): Promise<AppointmentRow[]> {
  const query = `
    SELECT
      a.*,
      p_user.full_name as patient_name,
      d_user.full_name as doctor_name
    FROM appointments a
    LEFT JOIN patients p ON a.patient_id = p.id
    LEFT JOIN users p_user ON p.user_id = p_user.id
    LEFT JOIN doctors d ON a.doctor_id = d.id
    LEFT JOIN users d_user ON d.user_id = d_user.id
    ORDER BY a.appointment_time DESC
  `;

  const result = await execqry(query, []);
  return result.rows;
}

/**
 * Retrieves a single appointment by ID
 * @param id - The appointment ID
 * @returns The appointment record or null if not found
 */
export async function getAppointmentById(
  id: string | number
): Promise<AppointmentRow | null> {
  const query = `
    SELECT
      a.*,
      p_user.full_name as patient_name,
      d_user.full_name as doctor_name
    FROM appointments a
    LEFT JOIN patients p ON a.patient_id = p.id
    LEFT JOIN users p_user ON p.user_id = p_user.id
    LEFT JOIN doctors d ON a.doctor_id = d.id
    LEFT JOIN users d_user ON d.user_id = d_user.id
    WHERE a.id = $1
  `;

  const result = await execqry(query, [id]);
  return result.rows[0] || null;
}

/**
 * Retrieves appointments for a specific patient
 * @param patientId - The patient ID
 * @returns Array of appointment records for the patient
 */
export async function getAppointmentsByPatientId(
  patientId: string | number
): Promise<AppointmentRow[]> {
  const query = `
    SELECT
      a.*,
      d_user.full_name as doctor_name
    FROM appointments a
    LEFT JOIN doctors d ON a.doctor_id = d.id
    LEFT JOIN users d_user ON d.user_id = d_user.id
    WHERE a.patient_id = $1
    ORDER BY a.appointment_time DESC
  `;

  const result = await execqry(query, [patientId]);
  return result.rows;
}

/**
 * Retrieves appointments for a specific doctor
 * @param doctorId - The doctor ID
 * @returns Array of appointment records for the doctor
 */
export async function getAppointmentsByDoctorId(
  doctorId: string | number
): Promise<AppointmentRow[]> {
  const query = `
    SELECT
      a.*,
      p_user.full_name as patient_name
    FROM appointments a
    LEFT JOIN patients p ON a.patient_id = p.id
    LEFT JOIN users p_user ON p.user_id = p_user.id
    WHERE a.doctor_id = $1
    ORDER BY a.appointment_time DESC
  `;

  const result = await execqry(query, [doctorId]);
  return result.rows;
}

/**
 * Updates an appointment by ID
 * @param id - The appointment ID
 * @param updates - Fields to update
 * @returns The updated appointment record or null if not found
 */
export async function updateAppointmentById(
  id: string | number,
  updates: AppointmentUpdateRequest
): Promise<AppointmentRow | null> {
  const { appointment_time, notes, status } = updates;

  const query = `
    UPDATE appointments
    SET
      appointment_time = COALESCE($1, appointment_time),
      notes = COALESCE($2, notes),
      status = COALESCE($3, status),
      updated_at = NOW()
    WHERE id = $4
    RETURNING *
  `;

  const result = await execqry(query, [appointment_time, notes, status, id]);
  return result.rows[0] || null;
}

/**
 * Cancels an appointment by ID
 * @param id - The appointment ID
 * @param reason - Optional cancellation reason
 * @returns The cancelled appointment record or null if not found
 */
export async function cancelAppointmentById(
  id: string | number,
  reason?: string
): Promise<AppointmentRow | null> {
  const query = `
    UPDATE appointments
    SET
      status = 'cancelled',
      cancellation_reason = $1,
      updated_at = NOW()
    WHERE id = $2
    RETURNING *
  `;

  const result = await execqry(query, [reason || null, id]);
  return result.rows[0] || null;
}

/**
 * Soft deletes an appointment by ID (marks as cancelled)
 * @param id - The appointment ID
 * @returns The deleted appointment record or null if not found
 * @deprecated Use cancelAppointmentById instead for soft delete
 */
export async function deleteAppointmentById(
  id: string | number
): Promise<AppointmentRow | null> {
  const query = `
    DELETE FROM appointments
    WHERE id = $1
    RETURNING *
  `;

  const result = await execqry(query, [id]);
  return result.rows[0] || null;
}
