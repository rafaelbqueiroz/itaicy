import { Request, Response } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do multer para upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não suportado. Use JPEG, PNG, WebP ou AVIF.'));
    }
  }
});

// Configurações de otimização
const SIZES = {
  hero: [1920, 1280, 768],
  gallery: [1024, 768, 400],
  thumb: [400, 300],
  square: [300]
};

const QUALITY = {
  avif: 65,
  webp: 75,
  jpeg: 75
};

// Diretórios
const UPLOAD_DIR = path.join(__dirname, '../../../public/images/optimized');
const METADATA_FILE = path.join(UPLOAD_DIR, 'metadata.json');

// Criar diretório se não existir
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

/**
 * Detecta orientação da imagem
 */
async function getImageOrientation(buffer: Buffer) {
  const metadata = await sharp(buffer).metadata();
  return metadata.width! > metadata.height! ? 'landscape' : 'portrait';
}

/**
 * Gera placeholder blur em base64
 */
async function generateBlurPlaceholder(buffer: Buffer) {
  const blurBuffer = await sharp(buffer)
    .resize(40, 27, { fit: 'cover' })
    .jpeg({ quality: 20 })
    .toBuffer();
  
  return `data:image/jpeg;base64,${blurBuffer.toString('base64')}`;
}

/**
 * Processa uma imagem em múltiplos tamanhos e formatos
 */
async function processImage(buffer: Buffer, filename: string, options: {
  isThumb: boolean;
  forceSquare: boolean;
  alt: string;
}) {
  const basename = path.parse(filename).name;
  const orientation = await getImageOrientation(buffer);
  
  console.log(`Processando: ${filename} (${orientation})`);
  
  // Gerar placeholder blur
  const blurPlaceholder = await generateBlurPlaceholder(buffer);
  
  const results = {
    filename: basename,
    orientation,
    blurPlaceholder,
    alt: options.alt,
    variants: [] as any[]
  };

  // Determinar categorias a processar
  const categoriesToProcess = options.isThumb ? ['thumb'] : 
                             options.forceSquare ? ['square'] : 
                             ['hero', 'gallery', 'thumb'];

  // Processar cada categoria de tamanho
  for (const category of categoriesToProcess) {
    const sizes = SIZES[category as keyof typeof SIZES];
    
    for (const size of sizes) {
      // Calcular dimensões baseado na orientação
      let width, height;
      
      if (category === 'square' || options.forceSquare) {
        width = height = size;
      } else if (orientation === 'landscape') {
        width = size;
        height = Math.round(size * (2/3)); // Proporção 3:2
      } else {
        height = size;
        width = Math.round(size * (2/3)); // Proporção 2:3
      }

      // Gerar AVIF
      const avifPath = path.join(UPLOAD_DIR, `${basename}-${category}-${size}.avif`);
      await sharp(buffer)
        .resize(width, height, { 
          fit: (category === 'square' || options.forceSquare) ? 'cover' : 'inside',
          position: 'center'
        })
        .avif({ quality: QUALITY.avif })
        .toFile(avifPath);

      // Gerar WebP
      const webpPath = path.join(UPLOAD_DIR, `${basename}-${category}-${size}.webp`);
      await sharp(buffer)
        .resize(width, height, { 
          fit: (category === 'square' || options.forceSquare) ? 'cover' : 'inside',
          position: 'center'
        })
        .webp({ quality: QUALITY.webp })
        .toFile(webpPath);

      // Gerar JPEG (fallback)
      const jpegPath = path.join(UPLOAD_DIR, `${basename}-${category}-${size}.jpg`);
      await sharp(buffer)
        .resize(width, height, { 
          fit: (category === 'square' || options.forceSquare) ? 'cover' : 'inside',
          position: 'center'
        })
        .jpeg({ quality: QUALITY.jpeg, mozjpeg: true })
        .toFile(jpegPath);

      // Obter informações do arquivo gerado
      const stats = fs.statSync(avifPath);
      
      results.variants.push({
        category,
        size,
        width,
        height,
        formats: {
          avif: `/images/optimized/${basename}-${category}-${size}.avif`,
          webp: `/images/optimized/${basename}-${category}-${size}.webp`,
          jpeg: `/images/optimized/${basename}-${category}-${size}.jpg`
        },
        fileSize: stats.size
      });

      console.log(`  ✓ ${category}-${size}: ${width}x${height} (${Math.round(stats.size/1024)}KB)`);
    }
  }

  return results;
}

/**
 * Carrega metadados existentes
 */
function loadMetadata() {
  try {
    if (fs.existsSync(METADATA_FILE)) {
      const data = fs.readFileSync(METADATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.warn('Erro ao carregar metadados:', error);
  }
  return [];
}

/**
 * Salva metadados atualizados
 */
function saveMetadata(metadata: any[]) {
  fs.writeFileSync(METADATA_FILE, JSON.stringify(metadata, null, 2));
}

/**
 * Handler para upload de imagem
 */
export async function uploadImage(req: Request, res: Response) {
  try {
    // Usar multer middleware
    upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          error: err.message
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'Nenhum arquivo enviado'
        });
      }

      const { isThumb = 'false', forceSquare = 'false', alt = '' } = req.body;
      
      const options = {
        isThumb: isThumb === 'true',
        forceSquare: forceSquare === 'true',
        alt: alt || req.file.originalname.replace(/\.[^/.]+$/, '')
      };

      // Processar imagem
      const result = await processImage(req.file.buffer, req.file.originalname, options);

      // Atualizar metadados
      const metadata = loadMetadata();
      const existingIndex = metadata.findIndex((item: any) => item.filename === result.filename);
      
      if (existingIndex >= 0) {
        metadata[existingIndex] = result;
      } else {
        metadata.push(result);
      }
      
      saveMetadata(metadata);

      res.json({
        success: true,
        data: result,
        message: 'Imagem processada e otimizada com sucesso!'
      });
    });
  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}
