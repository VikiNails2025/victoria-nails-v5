import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'studio_database.json');

// Ensure data dir exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helpers to read/write persistent database
function readDatabase(): any {
  if (!fs.existsSync(DB_FILE)) {
    return null;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading DB:', err);
    return null;
  }
}

function writeDatabase(data: any): boolean {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing DB:', err);
    return false;
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '25mb' }));

  // API endpoints
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: Date.now() });
  });

  // GET all studio data (settings, services, gallery, bookings)
  app.get('/api/data', (_req, res) => {
    const data = readDatabase();
    res.json(data || {});
  });

  // POST sync full studio data
  app.post('/api/sync', (req, res) => {
    const current = readDatabase() || {};
    const updated = {
      ...current,
      ...req.body,
      updatedAt: Date.now(),
    };
    writeDatabase(updated);
    res.json({ success: true, data: updated });
  });

  // Specific endpoints
  app.post('/api/settings', (req, res) => {
    const current = readDatabase() || {};
    current.settings = req.body;
    current.updatedAt = Date.now();
    writeDatabase(current);
    res.json({ success: true, settings: current.settings });
  });

  app.post('/api/services', (req, res) => {
    const current = readDatabase() || {};
    current.services = req.body;
    current.updatedAt = Date.now();
    writeDatabase(current);
    res.json({ success: true, services: current.services });
  });

  app.post('/api/gallery', (req, res) => {
    const current = readDatabase() || {};
    current.gallery = req.body;
    current.updatedAt = Date.now();
    writeDatabase(current);
    res.json({ success: true, gallery: current.gallery });
  });

  app.post('/api/bookings', (req, res) => {
    const current = readDatabase() || {};
    current.bookings = req.body;
    current.updatedAt = Date.now();
    writeDatabase(current);
    res.json({ success: true, bookings: current.bookings });
  });

  // Vite middleware in dev or static files in production
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Victoria Nails full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
