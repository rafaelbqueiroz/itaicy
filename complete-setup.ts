import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hcmrlpevcpkclqubnmmf.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function completeSuites() {
  const suites = [
    {
      name: 'Suíte Compacta',
      capacity: 2,
      area_m2: 25,
      price: 450.00,
      description: 'Acomodação aconchegante com vista para o rio'
    },
    {
      name: 'Suíte Ampla', 
      capacity: 3,
      area_m2: 35,
      price: 650.00,
      description: 'Espaço generoso com varanda privativa'
    },
    {
      name: 'Suíte Master',
      capacity: 4,
      area_m2: 50,
      price: 950.00,
      description: 'Suíte premium com vista panorâmica do Pantanal'
    }
  ];

  for (const suite of suites) {
    const { error } = await supabase.from('suites').insert(suite);
    if (error) console.error('Erro:', error);
    else console.log(`Suíte ${suite.name} inserida`);
  }
}

completeSuites();
