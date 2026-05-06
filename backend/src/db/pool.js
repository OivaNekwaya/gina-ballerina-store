// backend/src/db/pool.js
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for Neon
  // Optionally set connection timeout, max clients, etc.
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 20,
});

// Log connection errors (optional)
pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
});

export default pool;