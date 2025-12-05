import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT ? parseInt(process.env.PG_PORT) : 5432,
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    ssl: process.env.PG_SSL === 'true' ? { rejectUnauthorized: false } : false
  });
  
  // Test the connection
  pool.connect((err: Error | undefined, client: import('pg').PoolClient | undefined, release: (release?: any) => void) => {
    if (err) {
      console.error('Error connecting to PostgreSQL:', err.stack);
    } else {
      console.log('Connected to PostgreSQL database!');
      release();
    }
  });


async function execqry(text: string, params: any[]) {
    const result = await pool.query(text, params);
    return result;
}

export { execqry };