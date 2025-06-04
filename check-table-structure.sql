-- Verificar estrutura atual da tabela media_library
-- Execute este SQL primeiro para ver o que temos

-- 1. Verificar se a tabela existe
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_name = 'media_library'
) as table_exists;

-- 2. Ver estrutura atual da tabela
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default,
    ordinal_position
FROM information_schema.columns 
WHERE table_name = 'media_library' 
ORDER BY ordinal_position;

-- 3. Ver dados existentes (primeiros 5 registros)
SELECT * FROM media_library LIMIT 5;

-- 4. Contar registros
SELECT COUNT(*) as total_records FROM media_library;
