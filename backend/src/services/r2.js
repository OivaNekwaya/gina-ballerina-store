import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, '../../uploads');

export async function generateSignedUrl(key, expiresIn = 300) {
  const fullPath = path.join(UPLOADS_DIR, key);
  if (!fs.existsSync(fullPath)) {
    throw new Error('File not found: ' + key);
  }
  const port = process.env.PORT || 5000;
  return `http://localhost:${port}/uploads/${key}`;
}

export async function uploadFile(key, fileBuffer) {
  const fullPath = path.join(UPLOADS_DIR, key);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, fileBuffer);
  return { key, location: `/uploads/${key}` };
}