-- Script para limpar paths duplicados na tabela media_library
-- Execute este SQL no Supabase Dashboard

-- 1. Verificar registros com paths duplicados
SELECT 
    id,
    path,
    original_url,
    filename,
    CASE 
        WHEN path LIKE 'media/media/%' THEN 'DUPLICADO'
        WHEN path LIKE 'media/%' THEN 'CORRETO'
        ELSE 'OUTRO'
    END as status_path
FROM media_library 
ORDER BY created_at DESC;

-- 2. Corrigir paths duplicados (remover 'media/' extra)
UPDATE media_library 
SET 
    path = REPLACE(path, 'media/media/', ''),
    original_url = REPLACE(original_url, '/media/media/', '/media/'),
    avif_path = CASE 
        WHEN avif_path IS NOT NULL THEN REPLACE(avif_path, 'media/media/', '')
        ELSE avif_path 
    END,
    webp_path = CASE 
        WHEN webp_path IS NOT NULL THEN REPLACE(webp_path, 'media/media/', '')
        ELSE webp_path 
    END,
    jpeg_path = CASE 
        WHEN jpeg_path IS NOT NULL THEN REPLACE(jpeg_path, 'media/media/', '')
        ELSE jpeg_path 
    END,
    avif_url = CASE 
        WHEN avif_url IS NOT NULL THEN REPLACE(avif_url, '/media/media/', '/media/')
        ELSE avif_url 
    END,
    webp_url = CASE 
        WHEN webp_url IS NOT NULL THEN REPLACE(webp_url, '/media/media/', '/media/')
        ELSE webp_url 
    END,
    jpeg_url = CASE 
        WHEN jpeg_url IS NOT NULL THEN REPLACE(jpeg_url, '/media/media/', '/media/')
        ELSE jpeg_url 
    END
WHERE path LIKE 'media/media/%';

-- 3. Verificar resultado da correção
SELECT 
    id,
    path,
    original_url,
    avif_path,
    webp_path,
    jpeg_path,
    'CORRIGIDO' as status
FROM media_library 
WHERE path NOT LIKE 'media/media/%'
ORDER BY created_at DESC;

-- 4. Contar registros corrigidos
SELECT 
    COUNT(*) as total_registros,
    COUNT(CASE WHEN path LIKE 'media/media/%' THEN 1 END) as ainda_duplicados,
    COUNT(CASE WHEN path NOT LIKE 'media/media/%' THEN 1 END) as corrigidos
FROM media_library;
