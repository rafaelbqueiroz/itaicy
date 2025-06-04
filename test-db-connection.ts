import { db } from './server/db.ts';

async function testConnection() {
  console.log('🔄 Testando conexão com o banco...');
  
  try {
    // Teste básico de conexão
    const result = await db.execute('SELECT 1 as test');
    console.log('✅ Conexão com banco funcionando!');
    
    // Verificar se a tabela media_library existe
    const tableCheck = await db.execute(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'media_library'
      ORDER BY column_name;
    `);
    
    console.log('📋 Colunas da tabela media_library:');
    console.table(tableCheck);
    
    // Executar o SQL para adicionar as colunas se não existirem
    console.log('🔧 Adicionando colunas para múltiplos formatos...');
    
    await db.execute(`
      ALTER TABLE media_library 
      ADD COLUMN IF NOT EXISTS avif_path TEXT,
      ADD COLUMN IF NOT EXISTS webp_path TEXT,
      ADD COLUMN IF NOT EXISTS jpeg_path TEXT,
      ADD COLUMN IF NOT EXISTS avif_url TEXT,
      ADD COLUMN IF NOT EXISTS webp_url TEXT,
      ADD COLUMN IF NOT EXISTS jpeg_url TEXT;
    `);
    
    console.log('✅ Colunas adicionadas com sucesso!');
    
    // Verificar novamente
    const updatedTableCheck = await db.execute(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'media_library'
      AND (column_name LIKE '%_path' OR column_name LIKE '%_url')
      ORDER BY column_name;
    `);
    
    console.log('📋 Colunas de path/url na tabela media_library:');
    console.table(updatedTableCheck);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error('🔍 Stack:', error.stack);
  }
}

testConnection();
