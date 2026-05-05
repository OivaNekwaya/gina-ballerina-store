import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productsRouter from './routes/products.js';
import ordersRouter from './routes/orders.js';
import webhooksRouter from './routes/webhooks.js';
import downloadsRouter from './routes/downloads.js';
import { rateLimit } from 'express-rate-limit';

dotenv.config();

const app = express();

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

// Webhooks need raw body
app.use('/api/webhooks', express.raw({ type: 'application/json' }), webhooksRouter);

app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL }));

app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/download', downloadsRouter);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));