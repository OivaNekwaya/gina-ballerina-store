import express from 'express';
import { pool } from '../db/pool.js';
import { stripe } from '../services/stripe.js';
import crypto from 'crypto'; // if needed for UUID

const router = express.Router();

router.post('/create-checkout', async (req, res) => {
  const { items, customerEmail, customerName } = req.body;
  if (!items || !items.length) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  try {
    // Get product details
    const productIds = items.map(i => i.productId);
    const productsRes = await pool.query('SELECT id, title, price FROM products WHERE id IN (' + productIds.map(() => '?').join(',') + ')', productIds);
    const productMap = new Map(productsRes.rows.map(p => [p.id, p]));

    let total = 0;
    const lineItems = [];
    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      const itemTotal = product.price * item.quantity;
      total += itemTotal;
      lineItems.push({
        price_data: {
          currency: 'usd',        // <-- USD only
          product_data: { name: product.title },
          unit_amount: Math.round(itemTotal * 100), // in cents
        },
        quantity: 1,
      });
    }

    // Create order in pending state
    const orderUuid = crypto.randomBytes(16).toString('hex');
    const orderRes = await pool.query(
      `INSERT INTO orders (order_uuid, customer_email, customer_name, total_amount, currency, payment_status)
       VALUES (?, ?, ?, ?, 'USD', 'pending')`,
      [orderUuid, customerEmail, customerName, total]
    );
    const orderId = orderRes.lastID || orderRes.insertId; // adjust for SQLite

    // Insert order items
    for (const item of items) {
      const product = productMap.get(item.productId);
      await pool.query(
        `INSERT INTO order_items (order_id, product_id, price_at_purchase, quantity) VALUES (?, ?, ?, ?)`,
        [orderId, item.productId, product.price, item.quantity]
      );
    }

    // Create Stripe Checkout Session – force USD & card only
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],        // <-- only card
      line_items: lineItems,
      mode: 'payment',
      customer_email: customerEmail,
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      metadata: { order_uuid: orderUuid },
      // Disable automatic tax & currency conversion
      automatic_tax: { enabled: false },
      // Do NOT set `currency` at session level – it's defined per line item
    });

    await pool.query(`UPDATE orders SET stripe_session_id = ? WHERE id = ?`, [session.id, orderId]);
    res.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;