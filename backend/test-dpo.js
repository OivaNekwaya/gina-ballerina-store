import dotenv from 'dotenv';
dotenv.config();
import { createDPOToken } from './src/services/dpo.js';

(async () => {
  const result = await createDPOToken({
    companyRef: 'TEST' + Date.now(),
    amount: 10.00,
    customerEmail: 'test@example.com',
    customerName: 'Test User',
    redirectURL: 'http://localhost:3000/success',
    backURL: 'http://localhost:3000/cart'
  });
  console.log('DPO result:', result);
})();