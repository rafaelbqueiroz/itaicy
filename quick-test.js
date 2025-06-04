// Teste rápido do upload
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();

// Configurar multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
    cb(null, allowedTypes.includes(file.mimetype));
  }
});

// Armazenamento em memória
let uploads = [];

// Upload endpoint
app.post('/api/media/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  }

  const { alt = '' } = req.body;
  const id = Date.now().toString();
  const imageBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

  const result = {
    id,
    filename: req.file.originalname.replace(/\.[^/.]+$/, ''),
    alt: alt || req.file.originalname.replace(/\.[^/.]+$/, ''),
    original_url: imageBase64,
    mime_type: req.file.mimetype,
    file_size: req.file.size,
    variants: [{
      category: 'thumb',
      size: 400,
      width: 400,
      height: 267,
      formats: { jpeg: imageBase64 }
    }],
    orientation: 'landscape',
    processing_completed: true,
    is_thumb: false,
    created_at: new Date().toISOString()
  };

  uploads.unshift(result);

  console.log(`✅ Upload: ${req.file.originalname} (${req.file.size} bytes)`);

  res.json({
    success: true,
    data: result,
    message: 'Upload realizado com sucesso!'
  });
});

// Library endpoint
app.get('/api/media/library', (req, res) => {
  res.json({
    success: true,
    data: uploads,
    pagination: { limit: 50, offset: 0, total: uploads.length }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uploads: uploads.length });
});

// Servir arquivos estáticos para teste
app.use(express.static('public'));

const port = 5002;
app.listen(port, () => {
  console.log(`🚀 Servidor de teste na porta ${port}`);
  console.log(`📊 Health: http://localhost:${port}/health`);
  console.log(`📁 Library: http://localhost:${port}/api/media/library`);
  console.log(`⬆️ Upload: http://localhost:${port}/api/media/upload`);
  console.log(`\n🧪 Teste com curl:`);
  console.log(`curl -X POST -F "image=@fishing-test.jpg" -F "alt=Teste" http://localhost:${port}/api/media/upload`);
});
