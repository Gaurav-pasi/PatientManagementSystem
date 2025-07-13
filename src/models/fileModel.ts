import { execqry } from '../dbutils';

export async function getFileById(id: string) {
  const query = `SELECT * FROM files WHERE id = $1`;
  const result = await execqry(query, [id]);
  return result.rows[0] || null;
} 