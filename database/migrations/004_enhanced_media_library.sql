-- Migração para biblioteca de mídia aprimorada com processamento automático

-- Atualizar tabela media_library
ALTER TABLE media_library 
ADD COLUMN IF NOT EXISTS original_url TEXT,
ADD COLUMN IF NOT EXISTS filename TEXT,
ADD COLUMN IF NOT EXISTS file_size INTEGER,
ADD COLUMN IF NOT EXISTS mime_type TEXT,
ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS processing_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS orientation TEXT CHECK (orientation IN ('landscape', 'portrait')),
ADD COLUMN IF NOT EXISTS is_thumb BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Renomear coluna path para manter compatibilidade
ALTER TABLE media_library 
RENAME COLUMN path TO legacy_path;

-- Adicionar índices para performance
CREATE INDEX IF NOT EXISTS idx_media_library_processing ON media_library(processing_completed);
CREATE INDEX IF NOT EXISTS idx_media_library_orientation ON media_library(orientation);
CREATE INDEX IF NOT EXISTS idx_media_library_is_thumb ON media_library(is_thumb);
CREATE INDEX IF NOT EXISTS idx_media_library_filename ON media_library(filename);
CREATE INDEX IF NOT EXISTS idx_media_library_variants ON media_library USING GIN(variants);

-- Função para extrair URLs de variantes por formato e tamanho
CREATE OR REPLACE FUNCTION get_variant_url(
  variants_json JSONB,
  format_type TEXT DEFAULT 'avif',
  size_type TEXT DEFAULT 'md'
) RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT (variant->>'url')::TEXT
    FROM jsonb_array_elements(variants_json) AS variant
    WHERE variant->>'format' = format_type 
    AND variant->>'size' = size_type
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Função para gerar srcset completo
CREATE OR REPLACE FUNCTION generate_srcset(
  variants_json JSONB,
  format_type TEXT DEFAULT 'avif'
) RETURNS TEXT AS $$
DECLARE
  srcset_parts TEXT[] := '{}';
  variant JSONB;
BEGIN
  FOR variant IN 
    SELECT value 
    FROM jsonb_array_elements(variants_json) 
    WHERE value->>'format' = format_type
    ORDER BY (value->>'width')::INTEGER
  LOOP
    srcset_parts := array_append(
      srcset_parts, 
      (variant->>'url') || ' ' || (variant->>'width') || 'w'
    );
  END LOOP;
  
  RETURN array_to_string(srcset_parts, ', ');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- View para facilitar consultas de mídia processada
CREATE OR REPLACE VIEW processed_media AS
SELECT 
  id,
  alt,
  filename,
  original_url,
  file_size,
  mime_type,
  orientation,
  is_thumb,
  variants,
  processing_completed,
  created_at,
  updated_at,
  -- URLs por formato (AVIF)
  get_variant_url(variants, 'avif', 'xl') as avif_xl,
  get_variant_url(variants, 'avif', 'lg') as avif_lg,
  get_variant_url(variants, 'avif', 'md') as avif_md,
  get_variant_url(variants, 'avif', 'sm') as avif_sm,
  get_variant_url(variants, 'avif', 'xs') as avif_xs,
  get_variant_url(variants, 'avif', 'thumb') as avif_thumb,
  -- URLs por formato (WebP)
  get_variant_url(variants, 'webp', 'xl') as webp_xl,
  get_variant_url(variants, 'webp', 'lg') as webp_lg,
  get_variant_url(variants, 'webp', 'md') as webp_md,
  get_variant_url(variants, 'webp', 'sm') as webp_sm,
  get_variant_url(variants, 'webp', 'xs') as webp_xs,
  get_variant_url(variants, 'webp', 'thumb') as webp_thumb,
  -- URLs por formato (JPEG)
  get_variant_url(variants, 'jpeg', 'xl') as jpeg_xl,
  get_variant_url(variants, 'jpeg', 'lg') as jpeg_lg,
  get_variant_url(variants, 'jpeg', 'md') as jpeg_md,
  get_variant_url(variants, 'jpeg', 'sm') as jpeg_sm,
  get_variant_url(variants, 'jpeg', 'xs') as jpeg_xs,
  get_variant_url(variants, 'jpeg', 'thumb') as jpeg_thumb,
  -- Srcsets
  generate_srcset(variants, 'avif') as avif_srcset,
  generate_srcset(variants, 'webp') as webp_srcset,
  generate_srcset(variants, 'jpeg') as jpeg_srcset
FROM media_library
WHERE processing_completed = true;

-- Política RLS para a view
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;

-- Política para leitura pública
CREATE POLICY "Public read access" ON media_library
  FOR SELECT USING (true);

-- Política para inserção autenticada
CREATE POLICY "Authenticated insert access" ON media_library
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política para atualização autenticada
CREATE POLICY "Authenticated update access" ON media_library
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Política para deleção autenticada
CREATE POLICY "Authenticated delete access" ON media_library
  FOR DELETE USING (auth.role() = 'authenticated');

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_media_library_updated_at 
  BEFORE UPDATE ON media_library 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Comentários para documentação
COMMENT ON TABLE media_library IS 'Biblioteca de mídia com processamento automático de imagens';
COMMENT ON COLUMN media_library.original_url IS 'URL da imagem original não processada';
COMMENT ON COLUMN media_library.variants IS 'Array JSON com todas as variantes processadas (AVIF, WebP, JPEG em múltiplos tamanhos)';
COMMENT ON COLUMN media_library.orientation IS 'Orientação detectada automaticamente (landscape/portrait)';
COMMENT ON COLUMN media_library.is_thumb IS 'Indica se foi gerada versão thumbnail quadrada';
COMMENT ON COLUMN media_library.processing_completed IS 'Indica se o processamento foi concluído com sucesso';

COMMENT ON FUNCTION get_variant_url(JSONB, TEXT, TEXT) IS 'Extrai URL de uma variante específica por formato e tamanho';
COMMENT ON FUNCTION generate_srcset(JSONB, TEXT) IS 'Gera string srcset completa para um formato específico';
COMMENT ON VIEW processed_media IS 'View com URLs organizadas e srcsets prontos para uso';
