import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const METADATA_FILE = path.join(__dirname, '../../../public/images/optimized/metadata.json');

/**
 * Carrega metadados da biblioteca de mídia
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
 * Handler para listar biblioteca de mídia
 */
export async function getMediaLibrary(req: Request, res: Response) {
  try {
    const { search, limit = '50', offset = '0' } = req.query;
    
    let metadata = loadMetadata();
    
    // Filtrar por busca se fornecida
    if (search && typeof search === 'string') {
      const searchTerm = search.toLowerCase();
      metadata = metadata.filter((item: any) => 
        item.filename.toLowerCase().includes(searchTerm) ||
        item.alt.toLowerCase().includes(searchTerm)
      );
    }
    
    // Ordenar por data de criação (mais recentes primeiro)
    metadata.sort((a: any, b: any) => {
      // Se não tiver timestamp, usar ordem alfabética
      if (!a.createdAt && !b.createdAt) {
        return a.filename.localeCompare(b.filename);
      }
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    // Aplicar paginação
    const limitNum = parseInt(limit as string);
    const offsetNum = parseInt(offset as string);
    const paginatedData = metadata.slice(offsetNum, offsetNum + limitNum);
    
    // Adicionar informações de estatísticas
    const stats = {
      total: metadata.length,
      totalSize: metadata.reduce((sum: number, item: any) => {
        return sum + item.variants.reduce((variantSum: number, variant: any) => {
          return variantSum + (variant.fileSize || 0);
        }, 0);
      }, 0),
      formats: {
        landscape: metadata.filter((item: any) => item.orientation === 'landscape').length,
        portrait: metadata.filter((item: any) => item.orientation === 'portrait').length
      }
    };
    
    res.json({
      success: true,
      data: paginatedData,
      pagination: {
        total: metadata.length,
        limit: limitNum,
        offset: offsetNum,
        hasMore: offsetNum + limitNum < metadata.length
      },
      stats
    });
  } catch (error) {
    console.error('Erro ao buscar biblioteca:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}

/**
 * Handler para obter uma imagem específica
 */
export async function getMediaItem(req: Request, res: Response) {
  try {
    const { filename } = req.params;
    
    const metadata = loadMetadata();
    const item = metadata.find((item: any) => item.filename === filename);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Imagem não encontrada'
      });
    }
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Erro ao buscar imagem:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}

/**
 * Handler para deletar uma imagem
 */
export async function deleteMediaItem(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    const metadata = loadMetadata();
    const itemIndex = metadata.findIndex((item: any) => item.filename === id);
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Imagem não encontrada'
      });
    }
    
    const item = metadata[itemIndex];
    
    // Deletar arquivos físicos
    const uploadDir = path.join(__dirname, '../../../public/images/optimized');
    
    for (const variant of item.variants) {
      try {
        // Deletar cada formato
        const avifFile = path.join(uploadDir, path.basename(variant.formats.avif));
        const webpFile = path.join(uploadDir, path.basename(variant.formats.webp));
        const jpegFile = path.join(uploadDir, path.basename(variant.formats.jpeg));
        
        if (fs.existsSync(avifFile)) fs.unlinkSync(avifFile);
        if (fs.existsSync(webpFile)) fs.unlinkSync(webpFile);
        if (fs.existsSync(jpegFile)) fs.unlinkSync(jpegFile);
      } catch (fileError) {
        console.warn(`Erro ao deletar arquivo de variante:`, fileError);
      }
    }
    
    // Remover do metadata
    metadata.splice(itemIndex, 1);
    
    // Salvar metadata atualizado
    fs.writeFileSync(METADATA_FILE, JSON.stringify(metadata, null, 2));
    
    res.json({
      success: true,
      message: 'Imagem deletada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar imagem:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}

/**
 * Handler para atualizar metadados de uma imagem
 */
export async function updateMediaItem(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { alt } = req.body;
    
    const metadata = loadMetadata();
    const itemIndex = metadata.findIndex((item: any) => item.filename === id);
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Imagem não encontrada'
      });
    }
    
    // Atualizar campos permitidos
    if (alt !== undefined) {
      metadata[itemIndex].alt = alt;
    }
    
    metadata[itemIndex].updatedAt = new Date().toISOString();
    
    // Salvar metadata atualizado
    fs.writeFileSync(METADATA_FILE, JSON.stringify(metadata, null, 2));
    
    res.json({
      success: true,
      data: metadata[itemIndex],
      message: 'Metadados atualizados com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar imagem:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}
