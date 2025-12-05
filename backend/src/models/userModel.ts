import { execqry } from '../dbutils';

interface UserInput {
  full_name: string;
  email: string;
  password_hash: string;
  phone_number?: string;
  gender?: string;
  dob?: string;
  role: string;
}

export async function createUser(user: UserInput) {
  const insertQuery = `INSERT INTO users (full_name, email, password_hash, phone_number, gender, dob, role)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, full_name, email, phone_number, gender, dob, role, created_at`;
  const values = [
    user.full_name,
    user.email,
    user.password_hash,
    user.phone_number || null,
    user.gender || null,
    user.dob || null,
    user.role
  ];
  const result = await execqry(insertQuery, values);
  return result.rows[0];
}

export async function getDoctors() {
  const query = `SELECT id, full_name, email, phone_number, gender, dob, role, created_at FROM users WHERE role = 'doctor'`;
  const result = await execqry(query, []);
  return result.rows;
}

export async function getDoctorById(id: string) {
  const query = `SELECT id, full_name, email, phone_number, gender, dob, role, created_at FROM users WHERE id = $1 AND role = 'doctor'`;
  const result = await execqry(query, [id]);
  return result.rows[0] || null;
}

export async function updateDoctorById(id: string, updates: Partial<UserInput>) {
  const { full_name, email, phone_number, gender, dob } = updates;
  const query = `UPDATE users SET full_name = COALESCE($1, full_name), email = COALESCE($2, email), phone_number = COALESCE($3, phone_number), gender = COALESCE($4, gender), dob = COALESCE($5, dob), updated_at = now() WHERE id = $6 AND role = 'doctor' RETURNING id, full_name, email, phone_number, gender, dob, role, created_at, updated_at`;
  const result = await execqry(query, [full_name, email, phone_number, gender, dob, id]);
  return result.rows[0] || null;
}

export async function updatePatientById(id: string, updates: Partial<UserInput>) {
  const { full_name, email, phone_number, gender, dob } = updates;
  const query = `UPDATE users SET full_name = COALESCE($1, full_name), email = COALESCE($2, email), phone_number = COALESCE($3, phone_number), gender = COALESCE($4, gender), dob = COALESCE($5, dob), updated_at = now() WHERE id = $6 AND role = 'patient' RETURNING id, full_name, email, phone_number, gender, dob, role, created_at, updated_at`;
  const result = await execqry(query, [full_name, email, phone_number, gender, dob, id]);
  return result.rows[0] || null;
}

export async function getPatientById(id: string) {
  const query = `SELECT id, full_name, email, phone_number, gender, dob, role, created_at FROM users WHERE id = $1 AND role = 'patient'`;
  const result = await execqry(query, [id]);
  return result.rows[0] || null;
} 