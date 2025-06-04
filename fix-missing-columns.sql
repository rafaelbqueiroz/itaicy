-- Adicionar colunas faltantes na tabela media_library
-- Execute este SQL no Supabase Dashboard

-- 1. Adicionar todas as colunas que estão faltando
ALTER TABLE media_library 
ADD COLUMN IF NOT EXISTS original_url TEXT,
ADD COLUMN IF NOT EXISTS filename TEXT,
ADD COLUMN IF NOT EXISTS file_size INTEGER,
ADD COLUMN IF NOT EXISTS mime_type TEXT,
ADD COLUMN IF NOT EXISTS orientation TEXT DEFAULT 'landscape',
ADD COLUMN IF NOT EXISTS processing_completed BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_thumb BOOLEAN DEFAULT false;

-- 2. Verificar se created_at existe, se não, adicionar
ALTER TABLE media_library 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- 3. Atualizar registros existentes com valores padrão para as novas colunas
UPDATE media_library 
SET 
    orientation = COALESCE(orientation, 'landscape'),
    processing_completed = COALESCE(processing_completed, true),
    is_thumb = COALESCE(is_thumb, false),
    created_at = COALESCE(created_at, NOW()),
    mime_type = COALESCE(mime_type, 'image/jpeg'),
    file_size = COALESCE(file_size, 1000000)
WHERE orientation IS NULL 
   OR processing_completed IS NULL 
   OR is_thumb IS NULL 
   OR created_at IS NULL
   OR mime_type IS NULL
   OR file_size IS NULL;

-- 4. Garantir que RLS está habilitado
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;

-- 5. Remover políticas antigas e criar novas
DROP POLICY IF EXISTS "Permitir leitura pública" ON media_library;
DROP POLICY IF EXISTS "Permitir inserção pública" ON media_library;
DROP POLICY IF EXISTS "Permitir atualização pública" ON media_library;
DROP POLICY IF EXISTS "Permitir deleção pública" ON media_library;

-- Criar políticas MVP
CREATE POLICY "Permitir leitura pública" ON media_library
  FOR SELECT USING (true);

CREATE POLICY "Permitir inserção pública" ON media_library
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir atualização pública" ON media_library
  FOR UPDATE USING (true);

CREATE POLICY "Permitir deleção pública" ON media_library
  FOR DELETE USING (true);

-- 6. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_media_library_created_at ON media_library(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_library_mime_type ON media_library(mime_type);
CREATE INDEX IF NOT EXISTS idx_media_library_alt ON media_library(alt);
CREATE INDEX IF NOT EXISTS idx_media_library_filename ON media_library(filename);

-- 7. Verificar estrutura final
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'media_library' 
ORDER BY ordinal_position;

-- 8. Verificar dados
SELECT 
    'Migração concluída!' as status,
    COUNT(*) as total_items
FROM media_library;
