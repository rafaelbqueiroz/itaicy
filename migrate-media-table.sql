-- Migração da tabela media_library existente para MVP
-- Execute este SQL no Supabase Dashboard > SQL Editor

-- 1. Verificar estrutura atual da tabela
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'media_library' 
ORDER BY ordinal_position;

-- 2. Adicionar colunas que podem estar faltando
ALTER TABLE media_library 
ADD COLUMN IF NOT EXISTS original_url TEXT,
ADD COLUMN IF NOT EXISTS filename TEXT,
ADD COLUMN IF NOT EXISTS file_size INTEGER,
ADD COLUMN IF NOT EXISTS mime_type TEXT,
ADD COLUMN IF NOT EXISTS orientation TEXT DEFAULT 'landscape',
ADD COLUMN IF NOT EXISTS processing_completed BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_thumb BOOLEAN DEFAULT false;

-- 3. Atualizar colunas existentes se necessário
-- Se a coluna path não existir, mas existe outra similar
DO $$
BEGIN
    -- Verificar se existe coluna 'url' e não existe 'path'
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'media_library' AND column_name = 'url') 
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'media_library' AND column_name = 'path') THEN
        ALTER TABLE media_library RENAME COLUMN url TO path;
    END IF;
    
    -- Se não existe nem path nem url, adicionar path
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'media_library' AND column_name = 'path') THEN
        ALTER TABLE media_library ADD COLUMN path TEXT;
    END IF;
END $$;

-- 4. Garantir que created_at existe
ALTER TABLE media_library 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- 5. Atualizar registros existentes com valores padrão
UPDATE media_library 
SET 
    orientation = COALESCE(orientation, 'landscape'),
    processing_completed = COALESCE(processing_completed, true),
    is_thumb = COALESCE(is_thumb, false),
    created_at = COALESCE(created_at, NOW())
WHERE orientation IS NULL 
   OR processing_completed IS NULL 
   OR is_thumb IS NULL 
   OR created_at IS NULL;

-- 6. Habilitar RLS se não estiver habilitado
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;

-- 7. Remover políticas antigas se existirem e criar novas
DROP POLICY IF EXISTS "Permitir leitura pública" ON media_library;
DROP POLICY IF EXISTS "Permitir inserção pública" ON media_library;
DROP POLICY IF EXISTS "Permitir atualização pública" ON media_library;
DROP POLICY IF EXISTS "Permitir deleção pública" ON media_library;

-- Políticas MVP (públicas por enquanto)
CREATE POLICY "Permitir leitura pública" ON media_library
  FOR SELECT USING (true);

CREATE POLICY "Permitir inserção pública" ON media_library
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir atualização pública" ON media_library
  FOR UPDATE USING (true);

CREATE POLICY "Permitir deleção pública" ON media_library
  FOR DELETE USING (true);

-- 8. Criar índices se não existirem
CREATE INDEX IF NOT EXISTS idx_media_library_created_at ON media_library(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_library_mime_type ON media_library(mime_type);
CREATE INDEX IF NOT EXISTS idx_media_library_alt ON media_library(alt);
CREATE INDEX IF NOT EXISTS idx_media_library_filename ON media_library(filename);

-- 9. Limpar dados de exemplo antigos e inserir novos
DELETE FROM media_library WHERE path LIKE 'media/exemplo-%';

-- Inserir dados de exemplo atualizados
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

-- 10. Verificar estrutura final e dados
SELECT 
  'Migração concluída!' as status,
  COUNT(*) as total_items
FROM media_library;

-- Mostrar estrutura final da tabela
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'media_library' 
ORDER BY ordinal_position;
