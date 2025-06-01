import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs/promises';
import * as path from 'path';
import axios from 'axios';
import { fileTypeFromBuffer } from 'file-type';
import { extractSite } from './extract-site';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
import { createHash } from 'crypto';

// Carrega variáveis de ambiente
dotenv.config();

// Configuração do cliente Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://hcmrlpevcpkclqubnmmf.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjbXJscGV2Y3BrY2xxdWJubW1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NTk1MzksImV4cCI6MjA2NDEzNTUzOX0.zJj-0ovtg-c48VOMPBtS3lO_--gucNGRMs3sFndmsc0';

const supabase = createClient(supabaseUrl, supabaseKey);

// Diretório para armazenar mídia temporariamente
const TEMP_DIR = path.resolve('./temp-media');

// Função para criar hash de URL para nomes de arquivos únicos
const createHashFromUrl = (url: string): string => {
  return createHash('md5').update(url).digest('hex');
};

// Função para baixar uma mídia e salvar localmente
const downloadMedia = async (url: string): Promise<{ filePath: string, mimeType: string, size: number, width?: number, height?: number } | null> => {
  if (!url || url.startsWith('data:') || url === '#') return null;

  try {
    // Normaliza URL
    const fullUrl = url.startsWith('http') ? url : `http://localhost:5173${url.startsWith('/') ? url : `/${url}`}`;
    
    console.log(`Baixando mídia: ${fullUrl}`);
    
    // Cria diretório temporário se não existir
    await fs.mkdir(TEMP_DIR, { recursive: true });
    
    // Baixa o arquivo
    const response = await axios.get(fullUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);
    
    // Detecta o tipo de arquivo
    const fileType = await fileTypeFromBuffer(buffer);
    const mimeType = fileType?.mime || 'application/octet-stream';
    const extension = fileType?.ext || 'bin';
    
    // Cria nome de arquivo único baseado no hash da URL
    const fileName = `${createHashFromUrl(url)}.${extension}`;
    const filePath = path.join(TEMP_DIR, fileName);
    
    // Salva o arquivo
    await fs.writeFile(filePath, buffer);
    
    // Obtém tamanho do arquivo
    const stats = await fs.stat(filePath);
    
    // Para imagens, podemos obter dimensões (em uma implementação real, usaríamos uma biblioteca como sharp)
    let width, height;
    if (mimeType.startsWith('image/')) {
      // Aqui usaríamos algo como:
      // const dimensions = await sharp(filePath).metadata();
      // width = dimensions.width;
      // height = dimensions.height;
      
      // Por simplicidade, definimos valores padrão
      width = 800;
      height = 600;
    }
    
    return { filePath, mimeType, size: stats.size, width, height };
  } catch (error) {
    console.error(`Erro ao baixar mídia ${url}:`, error);
    return null;
  }
};

// Função para fazer upload de mídia para o Supabase Storage
const uploadMediaToSupabase = async (filePath: string, fileName: string, mimeType: string): Promise<string | null> => {
  try {
    console.log(`Fazendo upload de ${fileName} para o Supabase Storage`);
    
    // Lê o arquivo
    const fileBuffer = await fs.readFile(filePath);
    
    // Faz upload para o bucket 'media'
    const { data, error } = await supabase.storage
      .from('media')
      .upload(`uploads/${fileName}`, fileBuffer, {
        contentType: mimeType,
        upsert: true
      });
    
    if (error) {
      throw error;
    }
    
    // Retorna o caminho do arquivo no storage
    return data?.path || null;
  } catch (error) {
    console.error(`Erro ao fazer upload de ${fileName}:`, error);
    return null;
  }
};

// Função para registrar mídia na tabela media_library
const registerMediaInLibrary = async (
  path: string, 
  alt: string, 
  mimeType: string, 
  size: number,
  width?: number,
  height?: number
): Promise<string | null> => {
  try {
    console.log(`Registrando mídia na biblioteca: ${path}`);
    
    // Insere registro na tabela media_library
    const { data, error } = await supabase
      .from('media_library')
      .insert({
        id: uuidv4(),
        path,
        alt,
        mime_type: mimeType,
        size,
        width,
        height
      })
      .select('id')
      .single();
    
    if (error) {
      throw error;
    }
    
    return data?.id || null;
  } catch (error) {
    console.error(`Erro ao registrar mídia na biblioteca: ${path}`, error);
    return null;
  }
};

// Função para processar URLs de mídia em um objeto de bloco
const processMediaInBlock = async (block: any): Promise<any> => {
  // Cria uma cópia do bloco para não modificar o original
  const processedBlock = { ...block };
  
  // Processa mídia direta do bloco
  if (block.imageSrc) {
    const mediaInfo = await downloadMedia(block.imageSrc);
    if (mediaInfo) {
      const fileName = path.basename(mediaInfo.filePath);
      const storagePath = await uploadMediaToSupabase(mediaInfo.filePath, fileName, mediaInfo.mimeType);
      
      if (storagePath) {
        const alt = block.imageAlt || block.title || path.basename(block.imageSrc, path.extname(block.imageSrc));
        const mediaId = await registerMediaInLibrary(
          storagePath, 
          alt, 
          mediaInfo.mimeType, 
          mediaInfo.size,
          mediaInfo.width,
          mediaInfo.height
        );
        
        // Atualiza o bloco com referência à mídia
        processedBlock.imageSrc = storagePath;
        processedBlock.imageId = mediaId;
      }
    }
  }
  
  if (block.videoSrc) {
    const mediaInfo = await downloadMedia(block.videoSrc);
    if (mediaInfo) {
      const fileName = path.basename(mediaInfo.filePath);
      const storagePath = await uploadMediaToSupabase(mediaInfo.filePath, fileName, mediaInfo.mimeType);
      
      if (storagePath) {
        const alt = block.videoAlt || block.title || path.basename(block.videoSrc, path.extname(block.videoSrc));
        const mediaId = await registerMediaInLibrary(
          storagePath, 
          alt, 
          mediaInfo.mimeType, 
          mediaInfo.size
        );
        
        // Atualiza o bloco com referência à mídia
        processedBlock.videoSrc = storagePath;
        processedBlock.videoId = mediaId;
      }
    }
  }
  
  // Processa arrays de objetos que podem conter mídia
  const arrayKeys = ['features', 'images', 'testimonials', 'posts', 'stats', 'counters', 'items'];
  
  for (const key of arrayKeys) {
    if (Array.isArray(processedBlock[key])) {
      processedBlock[key] = await Promise.all(
        processedBlock[key].map(async (item: any) => {
          const processedItem = { ...item };
          
          // Processa campos de mídia em cada item
          for (const field of ['imageSrc', 'src', 'avatarSrc']) {
            if (item[field]) {
              const mediaInfo = await downloadMedia(item[field]);
              if (mediaInfo) {
                const fileName = path.basename(mediaInfo.filePath);
                const storagePath = await uploadMediaToSupabase(mediaInfo.filePath, fileName, mediaInfo.mimeType);
                
                if (storagePath) {
                  const alt = item.alt || item.title || path.basename(item[field], path.extname(item[field]));
                  const mediaId = await registerMediaInLibrary(
                    storagePath, 
                    alt, 
                    mediaInfo.mimeType, 
                    mediaInfo.size,
                    mediaInfo.width,
                    mediaInfo.height
                  );
                  
                  // Atualiza o item com referência à mídia
                  processedItem[field] = storagePath;
                  processedItem[`${field.replace('Src', '')}Id`] = mediaId;
                }
              }
            }
          }
          
          return processedItem;
        })
      );
    }
  }
  
  return processedBlock;
};

// Função para criar uma página no Supabase
const createPage = async (page: any): Promise<string | null> => {
  try {
    console.log(`Criando página: ${page.name} (${page.slug})`);
    
    // Gera UUID para a página
    const pageId = page.id || uuidv4();
    
    // Insere página no Supabase
    const { data, error } = await supabase
      .from('pages')
      .insert({
        id: pageId,
        slug: page.slug,
        name: page.name,
        template: page.template || 'default',
        priority: page.priority || 0
      })
      .select('id')
      .single();
    
    if (error) {
      throw error;
    }
    
    return data?.id || null;
  } catch (error) {
    console.error(`Erro ao criar página ${page.name}:`, error);
    return null;
  }
};

// Função para criar um bloco no Supabase
const createBlock = async (block: any, pageId: string): Promise<string | null> => {
  try {
    console.log(`Criando bloco tipo ${block.type} para página ${pageId}`);
    
    // Processa mídia no bloco
    const processedBlock = await processMediaInBlock(block);
    
    // Prepara payload
    const payload = { ...processedBlock };
    
    // Remove campos que não devem ir para o payload
    delete payload.id;
    delete payload.page_id;
    delete payload.type;
    delete payload.position;
    
    // Insere bloco no Supabase
    const { data, error } = await supabase
      .from('blocks')
      .insert({
        id: uuidv4(),
        page_id: pageId,
        type: block.type,
        position: block.position,
        payload: payload,
        published: payload, // Copia payload para published para disponibilizar imediatamente
        updated_at: new Date().toISOString()
      })
      .select('id')
      .single();
    
    if (error) {
      throw error;
    }
    
    return data?.id || null;
  } catch (error) {
    console.error(`Erro ao criar bloco tipo ${block.type}:`, error);
    return null;
  }
};

// Função principal para seed do Supabase
const seedSupabase = async () => {
  try {
    console.log('Iniciando seed do Supabase...');
    
    // Extrai dados do site ou carrega de arquivo se já extraído
    let siteData;
    const extractedDataPath = path.resolve('./extracted-content/site-data.json');
    
    try {
      const fileContent = await fs.readFile(extractedDataPath, 'utf-8');
      siteData = JSON.parse(fileContent);
      console.log('Dados extraídos carregados do arquivo.');
    } catch (error) {
      console.log('Arquivo de dados extraídos não encontrado, iniciando extração...');
      siteData = await extractSite();
    }
    
    // Cria páginas no Supabase
    const pageMap = new Map(); // Mapeia IDs antigos para novos
    
    for (const page of siteData.pages) {
      const pageId = await createPage(page);
      if (pageId) {
        pageMap.set(page.id, pageId);
      }
    }
    
    // Cria blocos no Supabase
    for (const block of siteData.blocks) {
      const pageId = pageMap.get(block.page_id);
      if (pageId) {
        await createBlock(block, pageId);
      } else {
        console.warn(`Página ${block.page_id} não encontrada para o bloco ${block.id}`);
      }
    }
    
    // Limpa arquivos temporários
    try {
      await fs.rm(TEMP_DIR, { recursive: true, force: true });
      console.log('Arquivos temporários removidos.');
    } catch (error) {
      console.warn('Erro ao remover arquivos temporários:', error);
    }
    
    console.log('Seed do Supabase concluído com sucesso!');
  } catch (error) {
    console.error('Erro durante o seed do Supabase:', error);
    throw error;
  }
};

// Executa a função principal se este arquivo for executado diretamente
if (require.main === module) {
  seedSupabase()
    .then(() => {
      console.log('Processo de seed concluído com sucesso!');
      process.exit(0);
    })
    .catch(error => {
      console.error('Falha no processo de seed:', error);
      process.exit(1);
    });
}

export { seedSupabase };
