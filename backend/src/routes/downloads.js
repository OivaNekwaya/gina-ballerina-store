import express from 'express';
import pool from '../db/pool.js';
import { generateSignedUrl } from '../services/r2.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();
const downloadLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, keyGenerator: (req) => req.ip });

router.get('/:token', downloadLimiter, async (req, res) => {
  const { token } = req.params;
  try {
    const tokenRes = await pool.query(
      `SELECT dt.*, p.file_key, p.file_name, p.title
       FROM download_tokens dt
       JOIN products p ON dt.product_id = p.id
       WHERE dt.token = $1 AND dt.expires_at > NOW() AND dt.remaining_downloads > 0`,
      [token]
    );
    if (tokenRes.rows.length === 0) {
      return res.status(404).json({ error: 'Invalid or expired download link' });
    }
    const record = tokenRes.rows[0];
    await pool.query(`UPDATE download_tokens SET remaining_downloads = remaining_downloads - 1 WHERE token = $1`, [token]);
    const signedUrl = await generateSignedUrl(record.file_key, 300);
    res.redirect(signedUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Download failed' });
  }
});

export default router;