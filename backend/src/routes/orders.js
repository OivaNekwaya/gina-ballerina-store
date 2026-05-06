import express from 'express';
import { pool } from '../db/pool.js';
import crypto from 'crypto';

const router = express.Router();

router.post('/create-checkout', async (req, res) => {
  const { items, customerEmail, customerName } = req.body;
  if (!items || !items.length) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  try {
    const productIds = items.map(i => i.productId);
    const placeholders = productIds.map(() => '?').join(',');
    const productsRes = await pool.query(
      `SELECT id, title, price FROM products WHERE id IN (${placeholders})`,
      productIds
    );
    const productMap = new Map(productsRes.rows.map(p => [p.id, p]));

    let total = 0;
    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      total += product.price * item.quantity;
    }

    const orderUuid = crypto.randomBytes(16).toString('hex');
    await pool.query(
      `INSERT INTO orders (order_uuid, customer_email, customer_name, total_amount, currency, payment_status)
       VALUES (?, ?, ?, ?, 'USD', 'pending')`,
      [orderUuid, customerEmail, customerName, total]
    );
    const lastIdRes = await pool.query('SELECT last_insert_rowid() as id');
    const orderId = lastIdRes.rows[0].id;

    for (const item of items) {
      const product = productMap.get(item.productId);
      await pool.query(
        `INSERT INTO order_items (order_id, product_id, price_at_purchase, quantity) VALUES (?, ?, ?, ?)`,
        [orderId, product.id, product.price, item.quantity]
      );
    }

    // 🎭 MOCK PAYMENT: redirect to mock payment page (or directly to verify)
    const mockToken = crypto.randomBytes(32).toString('hex');
    const paymentUrl = `${process.env.FRONTEND_URL}/mock-payment?order=${orderUuid}`;
    await pool.query(`UPDATE orders SET gateway_transaction_id = ? WHERE order_uuid = ?`, [mockToken, orderUuid]);

    res.json({ success: true, paymentUrl, orderUuid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/lookup', async (req, res) => {
  const { email, orderUuid } = req.body;
  if (!email || !orderUuid) return res.status(400).json({ error: 'Email and order ID required' });
  try {
    const result = await pool.query(
      `SELECT dt.token, dt.expires_at, dt.remaining_downloads, p.title as product_title
       FROM download_tokens dt
       JOIN orders o ON dt.order_id = o.id
       JOIN products p ON dt.product_id = p.id
       WHERE o.customer_email = ? AND o.order_uuid = ? AND dt.expires_at > CURRENT_TIMESTAMP`,
      [email, orderUuid]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'No active downloads found' });
    res.json({ downloads: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;