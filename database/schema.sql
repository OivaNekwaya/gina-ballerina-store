-- Create tables
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  file_key TEXT NOT NULL,
  file_name VARCHAR(255),
  file_size INT,
  download_limit INT DEFAULT 3,
  category VARCHAR(50),
  tags TEXT[],
  is_bundle BOOLEAN DEFAULT false,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_uuid UUID DEFAULT gen_random_uuid() UNIQUE,
  customer_email VARCHAR(200) NOT NULL,
  customer_name VARCHAR(200),
  total_amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  payment_status VARCHAR(20) DEFAULT 'pending',
  stripe_session_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  paid_at TIMESTAMP
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id),
  price_at_purchase DECIMAL(10,2) NOT NULL,
  quantity INT DEFAULT 1
);

CREATE TABLE download_tokens (
  id SERIAL PRIMARY KEY,
  token VARCHAR(64) UNIQUE NOT NULL,
  order_id INT REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id),
  remaining_downloads INT DEFAULT 3,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_orders_uuid ON orders(order_uuid);
CREATE INDEX idx_downloads_token ON download_tokens(token);
CREATE INDEX idx_downloads_expires ON download_tokens(expires_at);