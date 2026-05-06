import dotenv from 'dotenv';
dotenv.config();
import pool from './pool.js';

const createTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      slug VARCHAR(100) UNIQUE NOT NULL,
      title VARCHAR(200) NOT NULL,
      description TEXT,
      price DECIMAL(10,2) NOT NULL,
      currency VARCHAR(3) DEFAULT 'USD',
      file_key TEXT NOT NULL,
      file_name VARCHAR(255),
      file_size INTEGER,
      download_limit INTEGER DEFAULT 3,
      category VARCHAR(50),
      tags JSONB,
      is_bundle BOOLEAN DEFAULT false,
      image_url TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      order_uuid UUID DEFAULT gen_random_uuid() UNIQUE,
      customer_email VARCHAR(200) NOT NULL,
      customer_name VARCHAR(200),
      total_amount DECIMAL(10,2) NOT NULL,
      currency VARCHAR(3) DEFAULT 'NAD',
      payment_status VARCHAR(20) DEFAULT 'pending',
      gateway_transaction_id VARCHAR(255),
      stripe_session_id VARCHAR(255),
      created_at TIMESTAMP DEFAULT NOW(),
      paid_at TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER REFERENCES products(id),
      price_at_purchase DECIMAL(10,2) NOT NULL,
      quantity INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS download_tokens (
      id SERIAL PRIMARY KEY,
      token VARCHAR(64) UNIQUE NOT NULL,
      order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER REFERENCES products(id),
      remaining_downloads INTEGER DEFAULT 3,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log('✅ Tables created');
  process.exit();
};

createTables().catch(console.error);