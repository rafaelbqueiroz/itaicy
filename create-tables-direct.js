const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://hcmrlpevcpkclqubnmmf.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  console.log('Criando tabelas...');
  
  const sql = `
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
  `;
  
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql });
    if (error) {
      console.error('Erro:', error);
    } else {
      console.log('Tabelas criadas com sucesso!');
    }
  } catch (err) {
    console.error('Erro na execução:', err);
  }
}

createTables();
