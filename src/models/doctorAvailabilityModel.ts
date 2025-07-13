import { execqry } from '../dbutils';

export async function getAvailabilityByDoctorId(doctorId: string) {
  const query = `SELECT id, available_day, start_time, end_time FROM doctor_availability WHERE doctor_id = $1`;
  const result = await execqry(query, [doctorId]);
  return result.rows;
}

export async function setAvailabilityByDoctorId(doctorId: string, slots: { available_day: string, start_time: string, end_time: string }[]) {
  // Remove existing slots for doctor
  await execqry('DELETE FROM doctor_availability WHERE doctor_id = $1', [doctorId]);
  // Insert new slots
  const values = slots.map(slot => `('${doctorId}', '${slot.available_day}', '${slot.start_time}', '${slot.end_time}')`).join(',');
  const insertQuery = `INSERT INTO doctor_availability (doctor_id, available_day, start_time, end_time) VALUES ${values} RETURNING id, available_day, start_time, end_time`;
  const result = await execqry(insertQuery, []);
  return result.rows;
} 