import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { rateLimit } from 'express-rate-limit';
import cookieParser from 'cookie-parser';

import productsRouter from './routes/products.js';
import ordersRouter from './routes/orders.js';
import downloadsRouter from './routes/downloads.js';
import adminRouter from './routes/admin.js';
import verifyPaymentRouter from './routes/verify-payment.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

// Body parser
app.use(express.json());

// Dynamic CORS – allow multiple origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://gina-ballerina-store.vercel.app',
  'https://ginaballerina.com',
  'https://www.ginaballerina.com'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Static files
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// Public API routes
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/download', downloadsRouter);

// Cookie parser
app.use(cookieParser());

// Admin routes
app.use('/api/admin', express.json());
app.use('/api/admin', adminRouter);

// Payment verification (DPO)
app.use('/api/verify-payment', verifyPaymentRouter);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Root
app.get('/', (req, res) => res.send('Gina Ballerina Backend is running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});