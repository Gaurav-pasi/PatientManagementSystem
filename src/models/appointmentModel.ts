import { execqry } from '../dbutils';

export async function createAppointment(data: any) {
  const { patient_id, doctor_id, appointment_time, notes } = data;
  const query = `INSERT INTO appointments (patient_id, doctor_id, appointment_time, notes) VALUES ($1, $2, $3, $4) RETURNING *`;
  const result = await execqry(query, [patient_id, doctor_id, appointment_time, notes || null]);
  return result.rows[0];
}

export async function getAllAppointments() {
  const query = `SELECT * FROM appointments`;
  const result = await execqry(query, []);
  return result.rows;
}

export async function getAppointmentById(id: string) {
  const query = `SELECT * FROM appointments WHERE id = $1`;
  const result = await execqry(query, [id]);
  return result.rows[0] || null;
}

export async function updateAppointmentById(id: string, updates: any) {
  const { appointment_time, notes, status, cancellation_reason } = updates;
  const query = `UPDATE appointments SET appointment_time = COALESCE($1, appointment_time), notes = COALESCE($2, notes), status = COALESCE($3, status), cancellation_reason = COALESCE($4, cancellation_reason), updated_at = now() WHERE id = $5 RETURNING *`;
  const result = await execqry(query, [appointment_time, notes, status, cancellation_reason, id]);
  return result.rows[0] || null;
}

export async function deleteAppointmentById(id: string) {
  const query = `DELETE FROM appointments WHERE id = $1 RETURNING *`;
  const result = await execqry(query, [id]);
  return result.rows[0] || null;
} 