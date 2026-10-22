import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;
const MONGO_URI = process.env.MONGO_URI;

// 1. Conectar a MongoDB
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Conectado a MongoDB Atlas'))
    .catch((err) => console.error('❌ Error MongoDB:', err));
} else {
  console.warn('⚠️ MONGO_URI no definida. Los datos no se guardarán.');
}

// 2. Definir el esquema (estructura de datos)
// Usamos un solo documento "global" para simular tu archivo JSON anterior
const globalDataSchema = new mongoose.Schema({
  settings: { type: Object, default: {} },
  services: { type: Array, default: [] },
  gallery: { type: Array, default: [] },
  bookings: { type: Array, default: [] },
}, { timestamps: true });

const GlobalData = mongoose.model('GlobalData', globalDataSchema);

// Helper: Obtener o crear el documento principal
async function getGlobalData() {
  let data = await GlobalData.findOne();
  if (!data) {
    data = await GlobalData.create({ settings: {}, services: [], gallery: [], bookings: [] });
  }
  return data;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '25mb' }));

  // --- API ENDPOINTS ---

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: Date.now() });
  });

  // GET: Obtener todo
  app.get('/api/data', async (_req, res) => {
    try {
      const data = await getGlobalData();
      res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // POST: Actualizar todo (Sync)
  app.post('/api/sync', async (req, res) => {
    try {
      const data = await getGlobalData();
      if (req.body.settings) data.settings = req.body.settings;
      if (req.body.services) data.services = req.body.services;
      if (req.body.gallery) data.gallery = req.body.gallery;
      if (req.body.bookings) data.bookings = req.body.bookings;
      await data.save();
      res.json({ success: true, data });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // POST: Actualizar secciones específicas
  const updateSection = async (section: string, req: any, res: any) => {
    try {
      const data = await getGlobalData();
      (data as any)[section] = req.body;
      await data.save();
      res.json({ success: true, [section]: (data as any)[section] });
    } catch (err) { res.status(500).json({ error: err.message }); }
  };

  app.post('/api/settings', (req, res) => updateSection('settings', req, res));
  app.post('/api/services', (req, res) => updateSection('services', req, res));
  app.post('/api/gallery', (req, res) => updateSection('gallery', req, res));
  app.post('/api/bookings', (req, res) => updateSection('bookings', req, res));

  // --- VITE / STATIC FILES ---
  if (!isProduction) {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(` Server running on port ${PORT}`);
  });
}

startServer();