-- Setup simples e seguro para media_library
-- Execute este SQL no Supabase Dashboard

-- 1. Criar nova tabela com nome temporário
DROP TABLE IF EXISTS media_library_new;

CREATE TABLE media_library_new (
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

-- 2. Copiar dados da tabela antiga se existir
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'media_library') THEN
        -- Tentar copiar dados compatíveis
        INSERT INTO media_library_new (path, alt, created_at)
        SELECT 
            COALESCE(path, url, '') as path,
            COALESCE(alt, '') as alt,
            COALESCE(created_at, NOW()) as created_at
        FROM media_library
        ON CONFLICT DO NOTHING;
        
        -- Remover tabela antiga
        DROP TABLE media_library;
    END IF;
END $$;

-- 3. Renomear nova tabela
ALTER TABLE media_library_new RENAME TO media_library;

-- 4. Configurar RLS
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;

-- 5. Criar políticas
CREATE POLICY "Permitir leitura pública" ON media_library
  FOR SELECT USING (true);

CREATE POLICY "Permitir inserção pública" ON media_library
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir atualização pública" ON media_library
  FOR UPDATE USING (true);

CREATE POLICY "Permitir deleção pública" ON media_library
  FOR DELETE USING (true);

-- 6. Criar índices
CREATE INDEX idx_media_library_created_at ON media_library(created_at DESC);
CREATE INDEX idx_media_library_mime_type ON media_library(mime_type);
CREATE INDEX idx_media_library_alt ON media_library(alt);

-- 7. Inserir dados de exemplo
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
);

-- 8. Verificar resultado
SELECT 
  'Setup concluído com sucesso!' as status,
  COUNT(*) as total_items
FROM media_library;

-- Mostrar estrutura final
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'media_library' 
ORDER BY ordinal_position;
