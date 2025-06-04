-- Corrigir armazenamento de múltiplos formatos
-- Execute este SQL no Supabase Dashboard

-- 1. Adicionar colunas para armazenar paths de todos os formatos
ALTER TABLE media_library 
ADD COLUMN IF NOT EXISTS avif_path TEXT,
ADD COLUMN IF NOT EXISTS webp_path TEXT,
ADD COLUMN IF NOT EXISTS jpeg_path TEXT,
ADD COLUMN IF NOT EXISTS avif_url TEXT,
ADD COLUMN IF NOT EXISTS webp_url TEXT,
ADD COLUMN IF NOT EXISTS jpeg_url TEXT;

-- 2. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_media_library_avif_path ON media_library(avif_path);
CREATE INDEX IF NOT EXISTS idx_media_library_webp_path ON media_library(webp_path);
CREATE INDEX IF NOT EXISTS idx_media_library_jpeg_path ON media_library(jpeg_path);

-- 3. Comentários para documentação
COMMENT ON COLUMN media_library.avif_path IS 'Caminho do arquivo AVIF no storage';
COMMENT ON COLUMN media_library.webp_path IS 'Caminho do arquivo WebP no storage';
COMMENT ON COLUMN media_library.jpeg_path IS 'Caminho do arquivo JPEG no storage';
COMMENT ON COLUMN media_library.avif_url IS 'URL pública do arquivo AVIF';
COMMENT ON COLUMN media_library.webp_url IS 'URL pública do arquivo WebP';
COMMENT ON COLUMN media_library.jpeg_url IS 'URL pública do arquivo JPEG';

-- 4. Verificar estrutura atualizada
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'media_library' 
AND column_name LIKE '%_path' OR column_name LIKE '%_url'
ORDER BY column_name;
