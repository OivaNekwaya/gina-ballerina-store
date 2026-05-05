import express from 'express';
import { pool } from '../db/pool.js';
import { stripe } from '../services/stripe.js';
import { generateSignedUrl } from '../services/r2.js';
import { sendDownloadEmail } from '../services/email.js';
import crypto from 'crypto';

const router = express.Router();

router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderUuid = session.metadata.order_uuid;

    try {
      // Update order status
      const orderUpdate = await pool.query(
        `UPDATE orders SET payment_status = 'paid', paid_at = CURRENT_TIMESTAMP WHERE order_uuid = ? RETURNING id, customer_email, customer_name`,
        [orderUuid]
      );
      // SQLite doesn't support RETURNING, so fetch the row
      const orderRow = await pool.query(`SELECT id, customer_email, customer_name FROM orders WHERE order_uuid = ?`, [orderUuid]);
      if (orderRow.rows.length === 0) throw new Error('Order not found');
      const order = orderRow.rows[0];
      const orderId = order.id;

      // Get order items with product details
      const itemsRes = await pool.query(`
        SELECT oi.product_id, p.title, p.file_key, p.download_limit
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `, [orderId]);

      const downloadLinks = [];
      for (const item of itemsRes.rows) {
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        await pool.query(
          `INSERT INTO download_tokens (token, order_id, product_id, remaining_downloads, expires_at)
           VALUES (?, ?, ?, ?, ?)`,
          [token, orderId, item.product_id, item.download_limit, expiresAt]
        );
        const signedUrl = await generateSignedUrl(item.file_key, 3600);
        downloadLinks.push({
          url: `${process.env.FRONTEND_URL}/download/${token}`,
          productTitle: item.title,
          expiresHours: 24,
          remaining: item.download_limit,
        });
      }

      await sendDownloadEmail(order.customer_email, order.customer_name || 'Customer', downloadLinks, orderUuid);
    } catch (err) {
      console.error(err);
      return res.status(500).send('Webhook processing failed');
    }
  }

  res.json({ received: true });
});

export default router;