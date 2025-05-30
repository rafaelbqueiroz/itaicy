import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hcmrlpevcpkclqubnmmf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjbXJscGV2Y3BrY2xxdWJubW1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NTk1MzksImV4cCI6MjA2NDEzNTUzOX0.zJj-0ovtg-c48VOMPBtS3lO_--gucNGRMs3sFndmsc0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('Testando conexão com Supabase...');
    
    const { data: pages, error } = await supabase
      .from('pages')
      .select('*')
      .order('order', { ascending: true });
    
    if (error) {
      console.error('Erro ao buscar páginas:', error);
      return;
    }
    
    console.log('Páginas encontradas:', pages?.length);
    pages?.forEach(page => {
      console.log(`- ${page.name} (${page.slug})`);
    });
    
  } catch (error) {
    console.error('Erro na conexão:', error);
  }
}

testConnection();
