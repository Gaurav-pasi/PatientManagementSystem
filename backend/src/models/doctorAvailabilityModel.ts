import { execqry } from '../dbutils';

export async function getAvailabilityByDoctorId(doctorId: string) {
  const query = `SELECT id, available_day, start_time, end_time FROM doctor_availability WHERE doctor_id = $1`;
  const result = await execqry(query, [doctorId]);
  return result.rows;
}

export async function setAvailabilityByDoctorId(doctorId: string, slots: { available_day: string, start_time: string, end_time: string }[]) {
  // Remove existing slots for doctor
  await execqry('DELETE FROM doctor_availability WHERE doctor_id = $1', [doctorId]);

  // If no slots provided, return empty array
  if (slots.length === 0) {
    return [];
  }

  // Build parameterized query to prevent SQL injection
  const params: (string | number)[] = [];
  const valuePlaceholders = slots.map((slot, index) => {
    const baseIndex = index * 4;
    params.push(doctorId, slot.available_day, slot.start_time, slot.end_time);
    return `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4})`;
  }).join(', ');

  const insertQuery = `INSERT INTO doctor_availability (doctor_id, available_day, start_time, end_time) VALUES ${valuePlaceholders} RETURNING id, available_day, start_time, end_time`;
  const result = await execqry(insertQuery, params);
  return result.rows;
} 