import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { pool } from '../db/pool.js';   // ✅ named import
import multer from 'multer';
import { uploadFile } from '../services/r2.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-me';

// Middleware to verify admin token
const verifyAdmin = (req, res, next) => {
  const token = req.cookies.adminToken || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Login (returns token in body)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@ginaballerina.com' && password === 'admin123') {
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '8h' });
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 8 * 60 * 60 * 1000,
    });
    res.json({ success: true, token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('adminToken');
  res.json({ success: true });
});

// Get all products (admin view)
router.get('/products', verifyAdmin, async (req, res) => {
  const products = await pool.query('SELECT * FROM products ORDER BY id');
  res.json(products.rows);
});

// Get single product
router.get('/products/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
  res.json(result.rows[0]);
});

// Add new product (with file and image upload)
const upload = multer({ storage: multer.memoryStorage() });
router.post('/products', verifyAdmin, upload.fields([{ name: 'file', maxCount: 1 }, { name: 'image', maxCount: 1 }]), async (req, res) => {
  const { slug, title, description, price, category, download_limit, is_bundle, tags } = req.body;
  if (!slug || !title || !price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  let file_key = null;
  if (req.files['file'] && req.files['file'][0]) {
    const fileExt = req.files['file'][0].originalname.split('.').pop();
    const folder = category === 'adult' ? 'adult' : category === 'printable' ? 'printables' : 'bundles';
    const fileName = `${folder}/${slug}.${fileExt}`;
    await uploadFile(fileName, req.files['file'][0].buffer);
    file_key = fileName;
  } else {
    file_key = req.body.file_key;
  }
  let image_url = null;
  if (req.files['image'] && req.files['image'][0]) {
    const imageExt = req.files['image'][0].originalname.split('.').pop();
    const imageFileName = `images/${slug}.${imageExt}`;
    await uploadFile(imageFileName, req.files['image'][0].buffer);
    image_url = `${process.env.BACKEND_URL}/uploads/${imageFileName}`;
  }
  const tagsArray = tags ? tags.split(',') : [];
  await pool.query(
    `INSERT INTO products (slug, title, description, price, file_key, file_name, download_limit, category, tags, is_bundle, image_url, currency)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'USD')`,
    [slug, title, description, parseFloat(price), file_key, req.files['file']?.[0]?.originalname || '', download_limit || 3, category, JSON.stringify(tagsArray), is_bundle === 'true' ? 1 : 0, image_url]
  );
  res.json({ success: true });
});

// Update product
router.put('/products/:id', verifyAdmin, upload.fields([{ name: 'file', maxCount: 1 }, { name: 'image', maxCount: 1 }]), async (req, res) => {
  const { id } = req.params;
  const { slug, title, description, price, category, download_limit, is_bundle, tags, image_url } = req.body;
  let file_key = req.body.file_key;
  if (req.files['file'] && req.files['file'][0]) {
    const fileExt = req.files['file'][0].originalname.split('.').pop();
    const folder = category === 'adult' ? 'adult' : category === 'printable' ? 'printables' : 'bundles';
    const fileName = `${folder}/${slug}.${fileExt}`;
    await uploadFile(fileName, req.files['file'][0].buffer);
    file_key = fileName;
  }
  let finalImageUrl = image_url;
  if (req.files['image'] && req.files['image'][0]) {
    const imageExt = req.files['image'][0].originalname.split('.').pop();
    const imageFileName = `images/${slug}.${imageExt}`;
    await uploadFile(imageFileName, req.files['image'][0].buffer);
    finalImageUrl = `${process.env.BACKEND_URL}/uploads/${imageFileName}`;
  }
  const tagsArray = tags ? tags.split(',') : [];
  await pool.query(
    `UPDATE products SET slug=?, title=?, description=?, price=?, file_key=?, download_limit=?, category=?, tags=?, is_bundle=?, image_url=?
     WHERE id=?`,
    [slug, title, description, parseFloat(price), file_key, download_limit || 3, category, JSON.stringify(tagsArray), is_bundle === 'true' ? 1 : 0, finalImageUrl, id]
  );
  res.json({ success: true });
});

// Delete product
router.delete('/products/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM products WHERE id = ?', [id]);
  res.json({ success: true });
});

// Get orders (admin) – SQLite JSON aggregation
router.get('/orders', verifyAdmin, async (req, res) => {
  const orders = await pool.query(`
    SELECT o.*, 
      (SELECT json_group_array(json_object('title', p.title, 'quantity', oi.quantity, 'price', oi.price_at_purchase)) 
       FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = o.id) as items
    FROM orders o ORDER BY o.created_at DESC
  `);
  res.json(orders.rows);
});

// Update order status
router.put('/orders/:id/status', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { payment_status, fulfillment_status } = req.body;
  try {
    const updates = [];
    const values = [];
    if (payment_status !== undefined) {
      updates.push('payment_status = ?');
      values.push(payment_status);
    }
    if (fulfillment_status !== undefined) {
      updates.push('fulfillment_status = ?');
      values.push(fulfillment_status);
    }
    if (updates.length === 0) {
      return res.status(400).json({ error: 'Nothing to update' });
    }
    const query = `UPDATE orders SET ${updates.join(', ')} WHERE id = ?`;
    values.push(id);
    await pool.query(query, values);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Resend download links for an order
router.post('/orders/:id/resend', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const orderRes = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (orderRes.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    const order = orderRes.rows[0];
    const itemsRes = await pool.query(`
      SELECT oi.product_id, p.title, p.file_key, p.download_limit, dt.token, dt.expires_at, dt.remaining_downloads
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      LEFT JOIN download_tokens dt ON dt.order_id = oi.order_id AND dt.product_id = oi.product_id
      WHERE oi.order_id = ?
    `, [id]);
    const downloadLinks = [];
    const { sendDownloadEmail } = await import('../services/email.js');
    for (const item of itemsRes.rows) {
      let token = item.token;
      let expiresAt = item.expires_at;
      if (!token || new Date(expiresAt) < new Date()) {
        token = crypto.randomBytes(32).toString('hex');
        expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        await pool.query(
          `INSERT INTO download_tokens (token, order_id, product_id, remaining_downloads, expires_at)
           VALUES (?, ?, ?, ?, ?)`,
          [token, id, item.product_id, item.download_limit, expiresAt]
        );
      }
      downloadLinks.push({
        url: `${process.env.FRONTEND_URL}/download/${token}`,
        productTitle: item.title,
        expiresHours: 24,
        remaining: item.remaining_downloads || item.download_limit
      });
    }
    await sendDownloadEmail(order.customer_email, order.customer_name || 'Customer', downloadLinks, order.order_uuid);
    res.json({ success: true, message: 'Download links resent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;