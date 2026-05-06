import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../../store.db');

const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE,
    title TEXT,
    description TEXT,
    price REAL,
    currency TEXT DEFAULT 'USD',
    file_key TEXT,
    file_name TEXT,
    file_size INTEGER,
    download_limit INTEGER DEFAULT 3,
    category TEXT,
    tags TEXT,
    is_bundle INTEGER DEFAULT 0,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_uuid TEXT UNIQUE,
    customer_email TEXT,
    customer_name TEXT,
    total_amount REAL,
    currency TEXT DEFAULT 'NAD',
    payment_status TEXT DEFAULT 'pending',
    gateway_transaction_id TEXT,
    stripe_session_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    paid_at DATETIME
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_id INTEGER,
    price_at_purchase REAL,
    quantity INTEGER DEFAULT 1,
    FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS download_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    token TEXT UNIQUE,
    order_id INTEGER,
    product_id INTEGER,
    remaining_downloads INTEGER DEFAULT 3,
    expires_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
  );
`);

// Seed products if table is empty
const count = db.prepare('SELECT COUNT(*) as count FROM products').get();
if (count.count === 0) {
  const insert = db.prepare(`
    INSERT INTO products (slug, title, description, price, file_key, file_name, download_limit, category, tags, is_bundle, image_url, currency)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'USD')
  `);
  const products = [
    ['gina-ballerina-eats-a-rainbow-bundle', 'Gina Ballerina Eats A Rainbow Bundle', 'A colourful bundle of dance activities for kids.', 149.00, 'bundles/rainbow-bundle.zip', 'rainbow-bundle.zip', 5, 'kids', '["pink","purple","rainbow"]', 1, '/images/rainbow.jpg'],
    ['gina-ballerina-easter-bundle', 'Gina Ballerina Easter Bundle', 'Easter themed dance fun', 149.00, 'bundles/easter-bundle.zip', 'easter-bundle.zip', 5, 'kids', '["pink","purple","easter"]', 1, '/images/easter.jpg'],
    ['gina-ballerina-and-the-easter-bunny-story', 'Gina Ballerina and the Easter Bunny Story', 'PDF storybook', 49.00, 'stories/easter-story.pdf', 'easter-story.pdf', 3, 'kids', '["pink","easter"]', 0, '/images/story.jpg'],
    ['gina-ballerina-and-the-easter-bunny-coloring-book', 'Gina Ballerina Easter Bunny Coloring Book', 'Printable coloring pages', 39.00, 'coloring/easter-coloring.pdf', 'easter-coloring.pdf', 3, 'kids', '["purple","easter"]', 0, '/images/coloring.jpg'],
    ['gina-ballerina-goes-to-the-beach-dance-bundle', 'Gina Ballerina Beach Dance Bundle', 'Summer beach dance pack', 149.00, 'bundles/beach-bundle.zip', 'beach-bundle.zip', 5, 'kids', '["pink","blue","beach"]', 1, '/images/beach.jpg'],
    ['gina-ballerina-and-mom-bundle', 'Gina Ballerina and Mom Bundle', 'Mother-child activities', 129.00, 'bundles/mom-bundle.zip', 'mom-bundle.zip', 5, 'kids', '["pink","purple","mom"]', 1, '/images/mom.jpg'],
    ['adult-relaxing-dance-themed-mandala-coloring-book', 'Adult Relaxing Dance Themed Mandala Coloring Book', 'Intricate mandala designs', 79.00, 'adult/mandala-coloring.pdf', 'mandala-coloring.pdf', 3, 'adult', '["purple","grey","mandala"]', 0, '/images/mandala.jpg'],
    ['dance-themed-birthday-calendar', 'Dance Themed Birthday Calendar', 'Printable monthly calendar', 29.00, 'printables/birthday-calendar.pdf', 'birthday-calendar.pdf', 3, 'printable', '["pink","purple","calendar"]', 0, '/images/calendar.jpg'],
    ['elegant-dance-themed-planner-page', 'Elegant Dance Themed Planner Page', 'Weekly planner insert', 19.00, 'printables/planner-page.pdf', 'planner-page.pdf', 3, 'printable', '["purple","grey","planner"]', 0, '/images/planner.jpg'],
    ['dance-wall-poster-calendar', 'Dance Wall Poster Calendar', 'Large wall calendar', 49.00, 'printables/wall-calendar.pdf', 'wall-calendar.pdf', 3, 'printable', '["pink","calendar"]', 0, '/images/wall-calendar.jpg'],
    ['mothersday-bundle', 'Mothersday Bundle', 'Special bundle for Mother\'s Day', 149.00, 'bundles/mothersday.zip', 'mothersday.zip', 5, 'kids', '["pink","purple","mothersday"]', 1, '/images/mothersday.jpg']
  ];
  for (const p of products) {
    insert.run(p);
  }
}

export const pool = {
  query: (text, params) => {
    try {
      if (text.toLowerCase().includes('select')) {
        const stmt = db.prepare(text);
        const rows = params ? stmt.all(...params) : stmt.all();
        return { rows };
      } else {
        const stmt = db.prepare(text);
        const info = params ? stmt.run(...params) : stmt.run();
        return { rows: [], lastID: info.lastInsertRowid };
      }
    } catch (err) {
      throw err;
    }
  },
  connect: () => ({
    query: (text, params) => pool.query(text, params),
    release: () => {},
  })
};

export default db;