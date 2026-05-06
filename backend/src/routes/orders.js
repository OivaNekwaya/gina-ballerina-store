import express from 'express';
import pool from '../db/pool.js';
import { createDPOToken } from '../services/dpo.js';
import crypto from 'crypto';

const router = express.Router();

router.post('/create-checkout', async (req, res) => {
  const { items, customerEmail, customerName } = req.body;
  if (!items || !items.length) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  try {
    const productIds = items.map(i => i.productId);
    const productsRes = await pool.query(
      'SELECT id, title, price FROM products WHERE id = ANY($1::int[])',
      [productIds]
    );
    const productMap = new Map(productsRes.rows.map(p => [p.id, p]));

    let total = 0;
    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      total += product.price * item.quantity;
    }

    const orderUuid = crypto.randomBytes(16).toString('hex');
    const insertResult = await pool.query(
      `INSERT INTO orders (order_uuid, customer_email, customer_name, total_amount, currency, payment_status)
       VALUES ($1, $2, $3, $4, 'USD', 'pending') RETURNING id`,
      [orderUuid, customerEmail, customerName, total]
    );
    const orderId = insertResult.rows[0].id;

    for (const item of items) {
      const product = productMap.get(item.productId);
      await pool.query(
        `INSERT INTO order_items (order_id, product_id, price_at_purchase, quantity)
         VALUES ($1, $2, $3, $4)`,
        [orderId, product.id, product.price, item.quantity]
      );
    }

    const redirectURL = `${process.env.FRONTEND_URL}/payment-verify?order=${orderUuid}`;
    const backURL = `${process.env.FRONTEND_URL}/cart`;
    const dpoResult = await createDPOToken({
      companyRef: orderUuid,
      amount: total,
      customerEmail,
      customerName,
      redirectURL,
      backURL,
    });

    if (!dpoResult.success) {
      await pool.query(`UPDATE orders SET payment_status = 'failed' WHERE order_uuid = $1`, [orderUuid]);
      return res.status(500).json({ error: 'Payment initiation failed: ' + (dpoResult.error || 'Unknown') });
    }

    await pool.query(`UPDATE orders SET gateway_transaction_id = $1 WHERE order_uuid = $2`, [dpoResult.token, orderUuid]);

    const paymentUrl = `${process.env.DPO_PAYMENT_URL}?ID=${dpoResult.token}`;
    res.json({ success: true, paymentUrl, orderUuid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Order lookup endpoint (for customers to re-download)
router.post('/lookup', async (req, res) => {
  const { email, orderUuid } = req.body;
  if (!email || !orderUuid) return res.status(400).json({ error: 'Email and order ID required' });
  try {
    const result = await pool.query(
      `SELECT dt.token, dt.expires_at, dt.remaining_downloads, p.title as product_title
       FROM download_tokens dt
       JOIN orders o ON dt.order_id = o.id
       JOIN products p ON dt.product_id = p.id
       WHERE o.customer_email = $1 AND o.order_uuid = $2 AND dt.expires_at > NOW()`,
      [email, orderUuid]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'No active downloads found' });
    res.json({ downloads: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;