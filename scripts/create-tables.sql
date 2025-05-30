-- Criação das tabelas do CMS no Supabase
-- Executar no SQL Editor do Supabase

-- Remover tabelas existentes se houver conflito
DROP TABLE IF EXISTS blocks CASCADE;
DROP TABLE IF EXISTS pages CASCADE;
DROP TABLE IF EXISTS media_library CASCADE;
DROP TABLE IF EXISTS suites CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;

-- Páginas publicáveis
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  template TEXT NOT NULL DEFAULT 'default',
  priority INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blocos flexíveis (draft / published)
CREATE TABLE blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  position INTEGER NOT NULL,
  payload JSONB NOT NULL,
  published JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT blocks_unique UNIQUE(page_id, position)
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

-- RLS (Row Level Security) policies
alter table pages enable row level security;
alter table blocks enable row level security;
alter table media_library enable row level security;
alter table suites enable row level security;
alter table testimonials enable row level security;

-- Políticas para admin (assumindo que role = 'admin' ou authenticated)
create policy "Admin can manage pages" on pages
  for all using (auth.role() = 'authenticated');

create policy "Admin can manage blocks" on blocks
  for all using (auth.role() = 'authenticated');

create policy "Admin can manage media" on media_library
  for all using (auth.role() = 'authenticated');

create policy "Admin can manage suites" on suites
  for all using (auth.role() = 'authenticated');

create policy "Admin can manage testimonials" on testimonials
  for all using (auth.role() = 'authenticated');

-- Políticas públicas para leitura (apenas published content)
create policy "Public can read published pages" on pages
  for select using (true);

create policy "Public can read published blocks" on blocks
  for select using (published is not null);

-- Criar bucket para mídia (se não existir)
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Política para bucket de mídia
create policy "Public can view media" on storage.objects
  for select using (bucket_id = 'media');

create policy "Admin can manage media files" on storage.objects
  for all using (auth.role() = 'authenticated' and bucket_id = 'media');