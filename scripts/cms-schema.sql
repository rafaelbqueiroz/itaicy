-- CMS Schema para Itaicy Pantanal Eco Lodge
-- Criado para ser um espelho em tempo real do site

-- Tabela de páginas
CREATE TABLE IF NOT EXISTS pages (
   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
   slug text UNIQUE NOT NULL,
   name text NOT NULL,
   template text NOT NULL DEFAULT 'default',
   priority int NOT NULL DEFAULT 0,
   created_at timestamptz DEFAULT now()
);

-- Tipo enum para os tipos de blocos
CREATE TYPE block_type AS ENUM (
   'hero-video',
   'hero-image',
   'split-block',
   'stats-ribbon',
   'counters-ribbon',
   'feature-blocks',
   'testimonials',
   'newsletter',
   'gallery',
   'blog-grid',
   'hero-simple',
   'contact-form',
   'lodge-overview',
   'highlights'
);

-- Tabela de blocos
CREATE TABLE IF NOT EXISTS blocks (
   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
   page_id uuid REFERENCES pages(id) ON DELETE CASCADE,
   type block_type NOT NULL,
   position int NOT NULL,
   payload jsonb NOT NULL,
   published jsonb,
   updated_at timestamptz DEFAULT now(),
   UNIQUE(page_id, position)
);

-- Tabela de biblioteca de mídia
CREATE TABLE IF NOT EXISTS media_library (
   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
   path text NOT NULL,
   alt text,
   mime_type text,
   size int,
   width int,
   height int,
   created_at timestamptz DEFAULT now()
);

-- Tabela de acomodações
CREATE TABLE IF NOT EXISTS suites (
   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
   name text NOT NULL,
   capacity int,
   area_m2 int,
   price numeric(10,2),
   description text,
   amenities text[],
   images uuid[],
   is_active boolean DEFAULT true,
   created_at timestamptz DEFAULT now(),
   updated_at timestamptz DEFAULT now()
);

-- Tabela de depoimentos
CREATE TABLE IF NOT EXISTS testimonials (
   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
   author text NOT NULL,
   city text,
   country text,
   rating int CHECK (rating BETWEEN 1 AND 5),
   quote text NOT NULL,
   is_featured boolean DEFAULT false,
   avatar_id uuid REFERENCES media_library(id),
   stay_date date,
   created_at timestamptz DEFAULT now()
);

-- Tabela de posts do blog
CREATE TABLE IF NOT EXISTS posts (
   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
   title text NOT NULL,
   slug text UNIQUE NOT NULL,
   excerpt text,
   content_md text,
   author text NOT NULL,
   cover_id uuid REFERENCES media_library(id),
   category text,
   tags text[],
   published boolean DEFAULT false,
   published_at timestamptz,
   meta_title text,
   meta_description text,
   reading_time int,
   created_at timestamptz DEFAULT now(),
   updated_at timestamptz DEFAULT now()
);

-- Tabela de configurações globais
CREATE TABLE IF NOT EXISTS global_settings (
   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
   key text UNIQUE NOT NULL,
   value jsonb NOT NULL,
   updated_at timestamptz DEFAULT now()
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_blocks_page_id ON blocks(page_id);
CREATE INDEX IF NOT EXISTS idx_blocks_type ON blocks(type);
CREATE INDEX IF NOT EXISTS idx_media_path ON media_library(path);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured);
