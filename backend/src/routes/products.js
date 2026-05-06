import express from 'express';
import {pool} from '../db/pool.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, slug, title, description, price, currency, category, tags, image_url 
       FROM products ORDER BY id`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const result = await pool.query('SELECT * FROM products WHERE slug = $1', [slug]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;