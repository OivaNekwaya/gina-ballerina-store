import express from 'express';
import pool from '../db/pool.js';
import { verifyDPOToken } from '../services/dpo.js';
import { sendDownloadEmail } from '../services/email.js';
import crypto from 'crypto';

const router = express.Router();

router.get('/verify', async (req, res) => {
  const { transactionToken, orderUuid } = req.query;
  if (!transactionToken || !orderUuid) {
    return res.redirect(`${process.env.FRONTEND_URL}/cart?error=missing_payment_info`);
  }
  try {
    const orderCheck = await pool.query('SELECT payment_status FROM orders WHERE order_uuid = $1', [orderUuid]);
    if (orderCheck.rows.length === 0) {
      return res.redirect(`${process.env.FRONTEND_URL}/cart?error=order_not_found`);
    }
    if (orderCheck.rows[0].payment_status === 'paid') {
      return res.redirect(`${process.env.FRONTEND_URL}/success`);
    }
    const verifyResult = await verifyDPOToken(transactionToken, orderUuid);
    if (!verifyResult.verified) {
      await pool.query(`UPDATE orders SET payment_status = 'failed' WHERE order_uuid = $1`, [orderUuid]);
      return res.redirect(`${process.env.FRONTEND_URL}/cart?error=payment_failed`);
    }
    const orderUpdate = await pool.query(
      `UPDATE orders SET payment_status = 'paid', paid_at = NOW() WHERE order_uuid = $1 RETURNING id, customer_email, customer_name`,
      [orderUuid]
    );
    const order = orderUpdate.rows[0];
    const orderId = order.id;
    const itemsRes = await pool.query(
      `SELECT oi.product_id, p.title, p.file_key, p.download_limit
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [orderId]
    );
    const downloadLinks = [];
    for (const item of itemsRes.rows) {
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      await pool.query(
        `INSERT INTO download_tokens (token, order_id, product_id, remaining_downloads, expires_at)
         VALUES ($1, $2, $3, $4, $5)`,
        [token, orderId, item.product_id, item.download_limit, expiresAt]
      );
      downloadLinks.push({
        url: `${process.env.FRONTEND_URL}/download/${token}`,
        productTitle: item.title,
        expiresHours: 24,
        remaining: item.download_limit
      });
    }
    await sendDownloadEmail(order.customer_email, order.customer_name || 'Customer', downloadLinks, orderUuid);
    res.redirect(`${process.env.FRONTEND_URL}/success`);
  } catch (err) {
    console.error('Payment verification error:', err);
    res.redirect(`${process.env.FRONTEND_URL}/cart?error=verification_failed`);
  }
});

export default router;