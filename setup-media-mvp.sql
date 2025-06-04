-- Setup MVP para Biblioteca de Mídia - Itaicy Eco Lodge
-- Execute este SQL no Supabase Dashboard > SQL Editor

-- 1. Criar tabela media_library se não existir
CREATE TABLE IF NOT EXISTS media_library (
  id SERIAL PRIMARY KEY,
  path TEXT NOT NULL,
  alt TEXT,
  original_url TEXT,
  filename TEXT,
  file_size INTEGER,
  mime_type TEXT,
  orientation TEXT DEFAULT 'landscape',
  processing_completed BOOLEAN DEFAULT true,
  is_thumb BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Habilitar RLS (Row Level Security)
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;

-- 3. Políticas RLS para MVP (permissões públicas por enquanto)
-- NOTA: Em produção, ajustar para autenticação adequada

-- Política para leitura pública
DROP POLICY IF EXISTS "Permitir leitura pública" ON media_library;
CREATE POLICY "Permitir leitura pública" ON media_library
  FOR SELECT USING (true);

-- Política para inserção pública (MVP)
DROP POLICY IF EXISTS "Permitir inserção pública" ON media_library;
CREATE POLICY "Permitir inserção pública" ON media_library
  FOR INSERT WITH CHECK (true);

-- Política para atualização pública (MVP)
DROP POLICY IF EXISTS "Permitir atualização pública" ON media_library;
CREATE POLICY "Permitir atualização pública" ON media_library
  FOR UPDATE USING (true);

-- Política para deleção pública (MVP)
DROP POLICY IF EXISTS "Permitir deleção pública" ON media_library;
CREATE POLICY "Permitir deleção pública" ON media_library
  FOR DELETE USING (true);

-- 4. Índices para performance
CREATE INDEX IF NOT EXISTS idx_media_library_created_at ON media_library(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_library_mime_type ON media_library(mime_type);
CREATE INDEX IF NOT EXISTS idx_media_library_alt ON media_library(alt);
CREATE INDEX IF NOT EXISTS idx_media_library_filename ON media_library(filename);

-- 5. Comentários para documentação
COMMENT ON TABLE media_library IS 'Biblioteca de mídia do CMS - versão MVP';
COMMENT ON COLUMN media_library.path IS 'Caminho do arquivo no Supabase Storage';
COMMENT ON COLUMN media_library.alt IS 'Texto alternativo para acessibilidade';
COMMENT ON COLUMN media_library.original_url IS 'URL pública do arquivo original';
COMMENT ON COLUMN media_library.filename IS 'Nome do arquivo sem extensão';
COMMENT ON COLUMN media_library.file_size IS 'Tamanho do arquivo em bytes';
COMMENT ON COLUMN media_library.mime_type IS 'Tipo MIME do arquivo';
COMMENT ON COLUMN media_library.orientation IS 'Orientação da imagem (landscape/portrait)';
COMMENT ON COLUMN media_library.processing_completed IS 'Se o processamento foi concluído';
COMMENT ON COLUMN media_library.is_thumb IS 'Se é uma thumbnail';

-- 6. Inserir alguns dados de exemplo (opcional)
INSERT INTO media_library (
  path, 
  alt, 
  original_url, 
  filename, 
  file_size, 
  mime_type, 
  orientation, 
  processing_completed, 
  is_thumb
) VALUES 
(
  'media/exemplo-pantanal.jpg',
  'Vista do Pantanal ao pôr do sol',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  'exemplo-pantanal',
  1024000,
  'image/jpeg',
  'landscape',
  true,
  false
),
(
  'media/exemplo-lodge.jpg',
  'Vista externa do Itaicy Eco Lodge',
  'https://images.unsplash.com/photo-1520637836862-4d197d17c90a?w=800',
  'exemplo-lodge',
  856000,
  'image/jpeg',
  'landscape',
  true,
  false
)
ON CONFLICT DO NOTHING;

-- 7. Verificar se tudo foi criado corretamente
SELECT 
  'Tabela criada com sucesso!' as status,
  COUNT(*) as total_items
FROM media_library;
