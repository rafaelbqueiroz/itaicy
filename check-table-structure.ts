import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hcmrlpevcpkclqubnmmf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjbXJscGV2Y3BrY2xxdWJubW1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NTk1MzksImV4cCI6MjA2NDEzNTUzOX0.zJj-0ovtg-c48VOMPBtS3lO_--gucNGRMs3sFndmsc0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  try {
    console.log('Verificando estrutura das tabelas...');
    
    const { data: pages, error } = await supabase
      .from('pages')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Erro:', error);
      return;
    }
    
    if (pages && pages.length > 0) {
      console.log('Colunas da tabela pages:', Object.keys(pages[0]));
    }
    
    const { data: blocks, error: blocksError } = await supabase
      .from('blocks')
      .select('*')
      .limit(1);
    
    if (blocksError) {
      console.error('Erro blocks:', blocksError);
      return;
    }
    
    if (blocks && blocks.length > 0) {
      console.log('Colunas da tabela blocks:', Object.keys(blocks[0]));
    }
    
  } catch (error) {
    console.error('Erro na verificação:', error);
  }
}

checkTables();
