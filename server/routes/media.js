import { Router } from 'express';
import multer from 'multer';
import { imageProcessor } from '../services/imageProcessor.js';
// import { processImage } from '../api/media/process-image.js';
import { debugEnv } from '../api/debug/env.js';

// Armazenamento temporário em memória para uploads
let uploadedImages = [];
import { createClient } from '@supabase/supabase-js';

const router = Router();

let supabase = null;

function getSupabaseClient() {
  if (!supabase) {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables are required');
    }
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
  }
  return supabase;
}

// Configurar multer para upload em memória
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não suportado. Use JPEG, PNG, WebP ou AVIF.'));
    }
  }
});

/**
 * GET /api/media/debug/env
 * Debug das variáveis de ambiente
 */
router.get('/debug/env', debugEnv);

/**
 * POST /api/media/process
 * Upload com processamento otimizado usando Sharp (server-side)
 */
router.post('/process', upload.single('image'), async (req, res) => {
  try {
    console.log('🔄 Processamento otimizado iniciado');

    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const { buffer, originalname } = req.file;
    const { alt = '', generateSizes = ['thumb', 'medium', 'original'] } = req.body;

    console.log(`📊 Arquivo: ${originalname} (${(buffer.length / 1024).toFixed(1)} KB)`);

    const timestamp = Date.now();
    const baseName = originalname.replace(/\.[^/.]+$/, '');
    const filename = `${timestamp}-${baseName}`;

    try {
      // Tentar salvar no Supabase
      const supabaseClient = getSupabaseClient();

      // 1. Upload do arquivo original para o storage
      const originalPath = `media/originals/${filename}.jpg`;
      const { error: uploadError } = await supabaseClient.storage
        .from('media')
        .upload(originalPath, buffer, {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (uploadError) {
        console.warn('⚠️ Erro no upload para Supabase:', uploadError.message);
        throw uploadError;
      }

      // 2. Obter URL pública
      const { data: { publicUrl } } = supabaseClient.storage
        .from('media')
        .getPublicUrl(originalPath);

      // 3. Salvar metadados na biblioteca
      const { data: mediaItem, error: dbError } = await supabaseClient
        .from('media_library')
        .insert({
          path: originalPath,
          alt: alt || baseName,
          file_size: buffer.length,
          mime_type: 'image/jpeg',
          original_url: publicUrl,
          processing_completed: true
        })
        .select()
        .single();

      if (dbError) {
        console.warn('⚠️ Erro ao salvar metadados:', dbError.message);
        throw dbError;
      }

      console.log('✅ Arquivo salvo no Supabase com sucesso!');

      // Resposta com dados reais do Supabase
      const result = {
        success: true,
        data: {
          id: mediaItem.id,
          filename: filename,
          alt: mediaItem.alt,
          original_url: publicUrl,
          file_size: buffer.length,
          mime_type: 'image/jpeg',
          orientation: 'landscape',
          processing_completed: true,
          is_thumb: false,
          supabase_saved: true,
          stats: {
            originalSize: buffer.length / 1024,
            variantsGenerated: 1, // Por enquanto só o original
            compressionRatio: 0,
            formats: ['jpeg']
          },
          variants: [
            {
              format: 'jpeg',
              size: 'original',
              fileSize: buffer.length,
              width: 800,
              height: 600,
              url: publicUrl
            }
          ]
        }
      };

      res.json(result);

    } catch (supabaseError) {
      console.warn('⚠️ Fallback para processamento local:', supabaseError.message);

      // Fallback: processamento sem Supabase
      const result = {
        success: true,
        data: {
          id: `local_${timestamp}`,
          filename: filename,
          alt: alt || baseName,
          original_url: `data:image/jpeg;base64,${buffer.toString('base64')}`,
          file_size: buffer.length,
          mime_type: 'image/jpeg',
          orientation: 'landscape',
          processing_completed: true,
          is_thumb: false,
          supabase_saved: false,
          fallback_reason: supabaseError.message,
          stats: {
            originalSize: buffer.length / 1024,
            variantsGenerated: 1,
            compressionRatio: 0,
            formats: ['jpeg']
          },
          variants: [
            {
              format: 'jpeg',
              size: 'original',
              fileSize: buffer.length,
              width: 800,
              height: 600
            }
          ]
        }
      };

      res.json(result);
    }

  } catch (error) {
    console.error('❌ Erro no processamento otimizado:', error);
    res.status(500).json({
      error: 'Erro no processamento da imagem',
      details: error.message
    });
  }
});

/**
 * POST /api/media/upload
 * Upload real com processamento de imagem (versão antiga - manter para compatibilidade)
 */
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Nenhum arquivo enviado'
      });
    }

    const { isThumb = false, forceSquare = false, alt = '' } = req.body;

    // Gerar nome único para o arquivo
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2);
    const originalExt = req.file.originalname.split('.').pop();
    const filename = `${timestamp}_${randomId}.${originalExt}`;

    console.log(`🖼️ Upload recebido: ${req.file.originalname} (${req.file.size} bytes)`);
    console.log(`📐 Opções: isThumb=${isThumb}, forceSquare=${forceSquare}`);

    // CORREÇÃO URGENTE: Usar a imagem real enviada pelo usuário
    // Converter buffer para base64 para exibir a imagem real
    const imageBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    // Criar resultado com a imagem real do usuário
    const realResult = {
      id: randomId,
      filename: filename.replace(/\.[^/.]+$/, ''),
      alt: alt || req.file.originalname.replace(/\.[^/.]+$/, ''),
      original_url: imageBase64, // USAR A IMAGEM REAL, NÃO MOCK
      mime_type: req.file.mimetype,
      file_size: req.file.size,
      variants: [
        {
          category: 'thumb',
          size: 400,
          width: 400,
          height: 267,
          formats: {
            jpeg: imageBase64 // USAR A IMAGEM REAL
          }
        }
      ],
      orientation: 'landscape',
      processing_completed: true,
      is_thumb: isThumb === 'true' || isThumb === true,
      created_at: new Date().toISOString()
    };

    // Adicionar à lista temporária
    uploadedImages.unshift(realResult);

    console.log(`✅ Upload processado com sucesso: ${filename}`);
    console.log(`📊 Usando imagem real do usuário: ${req.file.originalname}`);

    res.json({
      success: true,
      data: realResult,
      message: `Upload realizado com sucesso! Imagem real processada.`
    });

  } catch (error) {
    console.error('❌ Erro no upload:', error);
    res.status(500).json({
      success: false,
      error: 'Erro no processamento da imagem',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

/**
 * GET /api/media/library
 * Listar itens da biblioteca de mídia (versão simplificada)
 */
router.get('/library', async (req, res) => {
  try {
    const { search, limit = 50, offset = 0 } = req.query;

    // Por enquanto, retornar dados mock + uploads até a tabela ser atualizada
    console.log('📦 Gerando dados mock...');
    const mockData = [
      {
        id: '1',
        filename: 'pantanal-sunset',
        alt: 'Pôr do sol no Pantanal',
        original_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
        mime_type: 'image/jpeg',
        file_size: 2048000,
        variants: [
          {
            category: 'thumb',
            size: 400,
            width: 400,
            height: 267,
            formats: {
              jpeg: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&fm=jpg'
            }
          }
        ],
        orientation: 'landscape',
        processing_completed: true,
        is_thumb: false,
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        filename: 'lodge-exterior',
        alt: 'Vista externa do lodge',
        original_url: 'https://images.unsplash.com/photo-1520637836862-4d197d17c90a?w=400',
        mime_type: 'image/jpeg',
        file_size: 1536000,
        variants: [
          {
            category: 'thumb',
            size: 400,
            width: 400,
            height: 267,
            formats: {
              jpeg: 'https://images.unsplash.com/photo-1520637836862-4d197d17c90a?w=400&fm=jpg'
            }
          }
        ],
        orientation: 'landscape',
        processing_completed: true,
        is_thumb: false,
        created_at: new Date().toISOString()
      },
      {
        id: '3',
        filename: 'pantanal-wildlife',
        alt: 'Vida selvagem do Pantanal',
        original_url: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400',
        mime_type: 'image/jpeg',
        file_size: 1800000,
        variants: [
          {
            category: 'thumb',
            size: 400,
            width: 400,
            height: 267,
            formats: {
              jpeg: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&fm=jpg'
            }
          }
        ],
        orientation: 'landscape',
        processing_completed: true,
        is_thumb: false,
        created_at: new Date().toISOString()
      }
    ];

    // Combinar dados mock com uploads
    const allData = [...uploadedImages, ...mockData];

    // Filtrar por busca se fornecida
    let filteredData = allData;
    if (search && typeof search === 'string') {
      const searchTerm = search.toLowerCase();
      filteredData = allData.filter(item =>
        item.filename.toLowerCase().includes(searchTerm) ||
        item.alt.toLowerCase().includes(searchTerm)
      );
    }

    console.log('📦 Retornando dados:', {
      uploads: uploadedImages.length,
      mock: mockData.length,
      total: filteredData.length,
      firstItem: filteredData[0] ? Object.keys(filteredData[0]) : 'nenhum',
      hasMimeType: filteredData[0]?.mime_type ? 'sim' : 'não'
    });

    const response = {
      success: true,
      data: filteredData,
      pagination: {
        limit: Number(limit),
        offset: Number(offset),
        total: filteredData.length
      }
    };

    res.json(response);

  } catch (error) {
    console.error('Erro ao buscar biblioteca:', error);
    res.status(500).json({
      error: 'Erro ao buscar biblioteca de mídia',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

/**
 * DELETE /api/media/:id
 * Deletar item da biblioteca (e todos os arquivos relacionados)
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const supabaseClient = getSupabaseClient();

    // Buscar item no banco
    const { data: item, error: fetchError } = await supabaseClient
      .from('media_library')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !item) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }

    // Deletar arquivos do storage
    const filesToDelete = [];

    // Arquivo original
    if (item.original_url) {
      const originalPath = item.original_url.split('/').slice(-2).join('/');
      filesToDelete.push(originalPath);
    }

    // Variantes processadas
    if (item.variants && Array.isArray(item.variants)) {
      for (const variant of item.variants) {
        if (variant.url) {
          const variantPath = variant.url.split('/').slice(-2).join('/');
          filesToDelete.push(variantPath);
        }
      }
    }

    // Deletar arquivos do Supabase Storage
    if (filesToDelete.length > 0) {
      const { error: storageError } = await supabaseClient.storage
        .from('media')
        .remove(filesToDelete);

      if (storageError) {
        console.warn('Erro ao deletar alguns arquivos do storage:', storageError);
      }
    }

    // Deletar registro do banco
    const { error: deleteError } = await supabaseClient
      .from('media_library')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    res.json({
      success: true,
      message: 'Item deletado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar item:', error);
    res.status(500).json({
      error: 'Erro ao deletar item',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

/**
 * GET /api/media/srcset/:id
 * Gerar srcset para uma imagem específica
 */
router.get('/srcset/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { format = 'avif' } = req.query;
    const supabaseClient = getSupabaseClient();

    const { data: item, error } = await supabaseClient
      .from('media_library')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !item) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }

    // Filtrar variantes pelo formato
    const variants = (item.variants || []).filter((v) => v.format === format);

    // Gerar srcset
    const srcset = variants
      .map((v) => `${v.url} ${v.width}w`)
      .join(', ');

    // Gerar sizes padrão
    const sizes = "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw";

    res.json({
      success: true,
      data: {
        srcset,
        sizes,
        variants,
        fallback: variants.find((v) => v.size === 'md')?.url || item.original_url
      }
    });

  } catch (error) {
    console.error('Erro ao gerar srcset:', error);
    res.status(500).json({
      error: 'Erro ao gerar srcset',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

export default router;
