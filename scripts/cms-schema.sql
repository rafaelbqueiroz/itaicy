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

-- Tabela de configurações globais do site
CREATE TABLE IF NOT EXISTS site_settings (
   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
   key text UNIQUE NOT NULL,
   value jsonb NOT NULL,
   description text,
   category text DEFAULT 'general',
   updated_at timestamptz DEFAULT now()
);

-- Tabela de experiências
CREATE TABLE IF NOT EXISTS experiences (
   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
   slug text UNIQUE NOT NULL,
   title text NOT NULL,
   description text,
   short_description text,
   price_from decimal(10,2),
   duration_hours integer,
   max_participants integer,
   difficulty_level text DEFAULT 'easy', -- easy, moderate, hard
   category text NOT NULL, -- safari, birdwatching, fishing, etc.
   featured_image_id uuid REFERENCES media_library(id),
   gallery_images uuid[],
   includes text[],
   requirements text[],
   best_season text[],
   available boolean DEFAULT true,
   featured boolean DEFAULT false,
   meta_title text,
   meta_description text,
   created_at timestamptz DEFAULT now(),
   updated_at timestamptz DEFAULT now()
);

-- Tabela de acomodações (expandindo suites)
CREATE TABLE IF NOT EXISTS accommodations (
   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
   slug text UNIQUE NOT NULL,
   name text NOT NULL,
   description text,
   short_description text,
   capacity integer NOT NULL,
   area_m2 integer,
   price_per_night decimal(10,2),
   room_type text NOT NULL, -- standard, superior, suite, etc.
   amenities text[],
   featured_image_id uuid REFERENCES media_library(id),
   gallery_images uuid[],
   floor_plan_image_id uuid REFERENCES media_library(id),
   available boolean DEFAULT true,
   featured boolean DEFAULT false,
   sort_order integer DEFAULT 0,
   meta_title text,
   meta_description text,
   created_at timestamptz DEFAULT now(),
   updated_at timestamptz DEFAULT now()
);

-- Tabela de itens gastronômicos
CREATE TABLE IF NOT EXISTS gastronomy_items (
   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
   slug text UNIQUE NOT NULL,
   name text NOT NULL,
   description text,
   category text NOT NULL, -- appetizer, main, dessert, beverage, etc.
   subcategory text, -- regional, international, vegetarian, etc.
   price decimal(10,2),
   ingredients text[],
   allergens text[],
   dietary_info text[], -- vegetarian, vegan, gluten-free, etc.
   featured_image_id uuid REFERENCES media_library(id),
   available boolean DEFAULT true,
   featured boolean DEFAULT false,
   sort_order integer DEFAULT 0,
   created_at timestamptz DEFAULT now(),
   updated_at timestamptz DEFAULT now()
);

-- Tabela de usuários do CMS
CREATE TABLE IF NOT EXISTS cms_users (
   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
   email text UNIQUE NOT NULL,
   name text NOT NULL,
   role text NOT NULL DEFAULT 'redator', -- admin, editor, redator
   supabase_user_id uuid UNIQUE, -- referência ao auth.users do Supabase
   active boolean DEFAULT true,
   last_login timestamptz,
   created_at timestamptz DEFAULT now(),
   updated_at timestamptz DEFAULT now()
);

-- Tabela de redirecionamentos
CREATE TABLE IF NOT EXISTS redirects (
   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
   from_path text UNIQUE NOT NULL,
   to_path text NOT NULL,
   status_code integer DEFAULT 301, -- 301, 302, etc.
   active boolean DEFAULT true,
   description text,
   created_at timestamptz DEFAULT now(),
   updated_at timestamptz DEFAULT now()
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_blocks_page_id ON blocks(page_id);
CREATE INDEX IF NOT EXISTS idx_blocks_type ON blocks(type);
CREATE INDEX IF NOT EXISTS idx_media_path ON media_library(path);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured);
CREATE INDEX IF NOT EXISTS idx_experiences_category ON experiences(category);
CREATE INDEX IF NOT EXISTS idx_experiences_featured ON experiences(featured);
CREATE INDEX IF NOT EXISTS idx_accommodations_room_type ON accommodations(room_type);
CREATE INDEX IF NOT EXISTS idx_gastronomy_category ON gastronomy_items(category);
CREATE INDEX IF NOT EXISTS idx_cms_users_role ON cms_users(role);
CREATE INDEX IF NOT EXISTS idx_redirects_from_path ON redirects(from_path);

-- Políticas RLS (Row Level Security)
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE accommodations ENABLE ROW LEVEL SECURITY;
ALTER TABLE gastronomy_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE redirects ENABLE ROW LEVEL SECURITY;

-- Políticas para leitura pública (site público)
CREATE POLICY "Permitir leitura pública de páginas" ON pages
  FOR SELECT USING (true);

CREATE POLICY "Permitir leitura de blocos publicados" ON blocks
  FOR SELECT USING (published IS NOT NULL);

CREATE POLICY "Permitir leitura de posts publicados" ON posts
  FOR SELECT USING (published = true);

CREATE POLICY "Permitir leitura pública de mídia" ON media_library
  FOR SELECT USING (true);

CREATE POLICY "Permitir leitura de experiências disponíveis" ON experiences
  FOR SELECT USING (available = true);

CREATE POLICY "Permitir leitura de acomodações disponíveis" ON accommodations
  FOR SELECT USING (available = true);

CREATE POLICY "Permitir leitura de itens gastronômicos disponíveis" ON gastronomy_items
  FOR SELECT USING (available = true);

CREATE POLICY "Permitir leitura de configurações do site" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "Permitir leitura de redirecionamentos ativos" ON redirects
  FOR SELECT USING (active = true);

-- Políticas para usuários autenticados do CMS
CREATE POLICY "CMS users podem ler tudo" ON pages
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "CMS users podem ler todos os blocos" ON blocks
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "CMS users podem ler todos os posts" ON posts
  FOR SELECT USING (auth.role() = 'authenticated');

-- Políticas para modificação (apenas usuários CMS)
CREATE POLICY "CMS users podem modificar páginas" ON pages
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "CMS users podem modificar blocos" ON blocks
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "CMS users podem modificar posts" ON posts
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "CMS users podem modificar mídia" ON media_library
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "CMS users podem modificar experiências" ON experiences
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "CMS users podem modificar acomodações" ON accommodations
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "CMS users podem modificar gastronomia" ON gastronomy_items
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "CMS users podem modificar configurações" ON site_settings
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "CMS users podem modificar redirecionamentos" ON redirects
  FOR ALL USING (auth.role() = 'authenticated');
