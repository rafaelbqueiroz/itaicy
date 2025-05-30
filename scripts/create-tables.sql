-- Criação das tabelas do CMS no Supabase
-- Executar no SQL Editor do Supabase

-- Remover tabelas existentes se houver conflito
DROP TABLE IF EXISTS block_revisions CASCADE;
DROP TABLE IF EXISTS blocks CASCADE;
DROP TABLE IF EXISTS pages CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS global_settings CASCADE;

-- Páginas publicáveis
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  template TEXT NOT NULL DEFAULT 'default',
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blocos flexíveis (draft / published)
CREATE TABLE blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  position INTEGER NOT NULL,
  data JSONB NOT NULL,
  draft JSONB,
  published BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT blocks_unique UNIQUE(page_id, position)
);

-- Versionamento de blocos
CREATE TABLE block_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  block_id UUID REFERENCES blocks(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts do blog
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  cover_url TEXT,
  content_md TEXT,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Configurações globais
CREATE TABLE global_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL
);

-- Mídia (metadados)
CREATE TABLE media_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path TEXT NOT NULL,
  alt TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Suítes (inventário específico)
CREATE TABLE suites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  capacity INTEGER,
  area_m2 INTEGER,
  price NUMERIC(10,2),
  description TEXT,
  images UUID[]
);

-- Testemunhos
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author TEXT,
  city TEXT,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  quote TEXT,
  is_featured BOOLEAN DEFAULT FALSE
);

-- Trigger para versionamento automático
CREATE OR REPLACE FUNCTION create_block_revision()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.data IS DISTINCT FROM NEW.data THEN
    INSERT INTO block_revisions (block_id, data)
    VALUES (NEW.id, OLD.data);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER block_revision_trigger
  BEFORE UPDATE ON blocks
  FOR EACH ROW
  EXECUTE FUNCTION create_block_revision();

-- RLS (Row Level Security) policies
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE block_revisions ENABLE ROW LEVEL SECURITY;

-- Políticas para admin (authenticated users)
CREATE POLICY "Admin can manage pages" ON pages
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage blocks" ON blocks
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage posts" ON posts
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage settings" ON global_settings
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage media" ON media_library
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can view revisions" ON block_revisions
  FOR SELECT USING (auth.role() = 'authenticated');

-- Políticas públicas para leitura
CREATE POLICY "Public can read pages" ON pages
  FOR SELECT USING (TRUE);

CREATE POLICY "Public can read published blocks" ON blocks
  FOR SELECT USING (published = TRUE);

CREATE POLICY "Public can read published posts" ON posts
  FOR SELECT USING (published = TRUE);

-- Criar bucket para mídia (se não existir)
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Políticas para bucket de mídia
CREATE POLICY "Public can view media" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "Authenticated can upload media" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete own media" ON storage.objects
  FOR DELETE USING (bucket_id = 'media' AND auth.role() = 'authenticated');

-- Popular configurações globais iniciais
INSERT INTO global_settings (key, value) VALUES
  ('header_logo', '{"url": "/logos/itaicy-wordmark-primary.png", "alt": "Itaicy Pantanal Eco Lodge"}'),
  ('footer_logo', '{"url": "/logos/itaicy-wordmark-secondary.png", "alt": "Itaicy Pantanal Eco Lodge"}'),
  ('contact_phone', '{"number": "+55 65 99999-9999", "display": "(65) 99999-9999"}'),
  ('contact_email', '{"address": "contato@itaicy.com.br", "display": "contato@itaicy.com.br"}'),
  ('social_media', '{"instagram": "@itaicypantanal", "facebook": "itaicypantanal", "youtube": "itaicypantanal"}')
ON CONFLICT (key) DO NOTHING;