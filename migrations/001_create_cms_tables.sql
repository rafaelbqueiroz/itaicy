-- Itaicy CMS Tables Migration
-- Execute this script in your Supabase SQL Editor

-- Files/Media storage table
CREATE TABLE IF NOT EXISTS files (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  alt TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  blurhash TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Pages table for site structure and template control
CREATE TABLE IF NOT EXISTS pages (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  template TEXT NOT NULL DEFAULT 'sticky', -- 'transparent' or 'sticky'
  title TEXT NOT NULL,
  hero_media_id INTEGER REFERENCES files(id),
  summary TEXT,
  status TEXT NOT NULL DEFAULT 'published',
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Page blocks for flexible content management
CREATE TABLE IF NOT EXISTS page_blocks (
  id SERIAL PRIMARY KEY,
  page_id INTEGER REFERENCES pages(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'hero', 'text', 'grid', 'stats', etc.
  block_order INTEGER NOT NULL DEFAULT 0,
  props JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Suites table (replaces static data)
CREATE TABLE IF NOT EXISTS suites (
  id SERIAL PRIMARY KEY,
  label TEXT NOT NULL, -- 'Compacta', 'Ampla', 'Master'
  slug TEXT NOT NULL UNIQUE,
  size_m2 INTEGER NOT NULL,
  capacity INTEGER NOT NULL,
  amenities TEXT[] NOT NULL DEFAULT '{}',
  price INTEGER NOT NULL, -- in cents
  cover_id INTEGER REFERENCES files(id),
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Experiences table
CREATE TABLE IF NOT EXISTS experiences (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  body_md TEXT,
  cover_id INTEGER REFERENCES files(id),
  price_from INTEGER,
  duration TEXT,
  max_participants INTEGER,
  includes TEXT[] DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Stats/Counters table for dynamic numbers
CREATE TABLE IF NOT EXISTS stats (
  id SERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE, -- 'BIRDS_TOTAL', 'SINCE_YEAR', etc.
  value INTEGER NOT NULL,
  unit TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Global settings
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  primary_color TEXT DEFAULT '#C97A2C',
  accent_color TEXT DEFAULT '#064737',
  phone_whatsapp TEXT,
  email TEXT,
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Insert initial suites data
INSERT INTO suites (label, slug, size_m2, capacity, amenities, price, description, sort_order) VALUES
('Suíte Compacta', 'suite-compacta', 28, 2, 
 ARRAY['Varanda com rede', 'Ar-condicionado', 'Wi-Fi satelital', 'Cofre digital', 'Frigobar', 'Banheiro privativo'], 
 80000, 'Conforto essencial com vista para o rio e varanda privativa com rede para contemplação.', 1),

('Suíte Ampla', 'suite-ampla', 35, 3, 
 ARRAY['Varanda ampliada', 'Ar-condicionado', 'Wi-Fi satelital', 'Cofre digital', 'Frigobar', 'Vista para o rio', 'Cama extra', 'Mesa de trabalho'], 
 120000, 'Espaço generoso com varanda ampliada e vista privilegiada para o Rio Cuiabá e mata ciliar.', 2),

('Suíte Master', 'suite-master', 45, 4, 
 ARRAY['Varanda panorâmica', 'Ar-condicionado', 'Wi-Fi satelital', 'Cofre digital', 'Minibar premium', 'Banheira dupla', 'Sala de estar', 'Vista privilegiada', 'Roupões', 'Amenities premium'], 
 180000, 'Nossa suíte mais exclusiva com varanda panorâmica, sala de estar e comodidades premium para máximo conforto.', 3);

-- Insert page templates
INSERT INTO pages (slug, template, title, summary, meta_title, meta_description) VALUES
('/', 'transparent', 'Itaicy Pantanal Eco Lodge', 'Seu refúgio de madeira e vento de rio', 'Itaicy Pantanal Eco Lodge - Refúgio Sustentável no Pantanal', 'Viva o Pantanal autêntico no Itaicy Eco Lodge. Pesca esportiva, birdwatching e hospedagem sustentável às margens do Rio Cuiabá.'),
('/lodge', 'transparent', 'Lodge', 'Arquitetura sustentável em harmonia com a natureza', 'Lodge - Itaicy Pantanal Eco Lodge', 'Conheça nosso lodge sustentável construído com madeiras certificadas e energia solar, em perfeita harmonia com o Pantanal.'),
('/acomodacoes', 'transparent', 'Suítes à Beira-Rio', 'Conforto contemporâneo envolto pela mata do Pantanal', 'Suítes - Itaicy Pantanal Eco Lodge', 'Suítes com varanda sobre o Rio Cuiabá, café pantaneiro e energia solar. Reserve seu refúgio sustentável no Itaicy Eco Lodge.'),
('/experiencias/pesca', 'transparent', 'Pesca Esportiva', 'Dourados troféu em águas pouco batidas', 'Pesca Esportiva - Itaicy Pantanal Eco Lodge', 'Pesca esportiva de dourados gigantes com guias especializados e equipamentos de primeira linha no Rio Cuiabá.'),
('/experiencias', 'sticky', 'Experiências', 'Conecte-se com a natureza através de aventuras autênticas', 'Experiências - Itaicy Pantanal Eco Lodge', 'Experiências únicas no Pantanal: pesca esportiva, safári fotográfico, birdwatching e trilhas guiadas.'),
('/galeria', 'sticky', 'Galeria', 'Momentos únicos capturados no coração do Pantanal', 'Galeria - Itaicy Pantanal Eco Lodge', 'Galeria de fotos do Pantanal: pescarias, vida selvagem, paisagens e momentos inesquecíveis.'),
('/blog', 'sticky', 'Blog', 'Histórias e dicas do Pantanal', 'Blog - Itaicy Pantanal Eco Lodge', 'Dicas de pesca, avistamento de aves, conservação e histórias do Pantanal autêntico.'),
('/contato', 'sticky', 'Contato', 'Fale conosco', 'Contato - Itaicy Pantanal Eco Lodge', 'Entre em contato conosco para reservas e informações sobre experiências no Pantanal.');

-- Insert stats for counters
INSERT INTO stats (code, value, unit) VALUES
('BIRDS_TOTAL', 4700, 'espécies'),
('SINCE_YEAR', 1897, null),
('ACCOMMODATIONS', 11, 'suítes'),
('PROTECTED_AREA', 650, 'hectares');

-- Insert global settings
INSERT INTO settings (id, primary_color, accent_color, email) VALUES
(1, '#C97A2C', '#064737', 'reservas@itaicy.com.br');

-- Enable Row Level Security
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE suites ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read files" ON files FOR SELECT USING (true);
CREATE POLICY "Public read pages" ON pages FOR SELECT USING (status = 'published');
CREATE POLICY "Public read page_blocks" ON page_blocks FOR SELECT USING (true);
CREATE POLICY "Public read suites" ON suites FOR SELECT USING (active = true);
CREATE POLICY "Public read experiences" ON experiences FOR SELECT USING (active = true);
CREATE POLICY "Public read stats" ON stats FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);