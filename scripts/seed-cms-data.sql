-- Seed inicial para o CMS - Sprint 1
-- Execute este SQL no Supabase Dashboard > SQL Editor

-- 1. Configurações globais do site
INSERT INTO site_settings (key, value, description, category) VALUES
('site_title', '"Itaicy Pantanal Eco Lodge"', 'Título principal do site', 'seo'),
('site_description', '"Experiência única no Pantanal com pesca esportiva, safaris fotográficos e contato direto com a natureza."', 'Descrição do site para SEO', 'seo'),
('contact_email', '"contato@itaicypantanal.com.br"', 'Email principal de contato', 'contact'),
('contact_phone', '"+55 65 99999-9999"', 'Telefone principal', 'contact'),
('contact_whatsapp', '"+55 65 99999-9999"', 'WhatsApp para contato', 'contact'),
('social_instagram', '"@itaicypantanal"', 'Instagram oficial', 'social'),
('social_facebook', '"itaicypantanal"', 'Facebook oficial', 'social'),
('booking_email', '"reservas@itaicypantanal.com.br"', 'Email para reservas', 'booking'),
('analytics_gtag', '""', 'Google Analytics Tag', 'tracking'),
('maps_api_key', '""', 'Chave da API do Google Maps', 'integrations')
ON CONFLICT (key) DO UPDATE SET 
  value = EXCLUDED.value,
  updated_at = now();

-- 2. Usuários iniciais do CMS
INSERT INTO cms_users (email, name, role, active) VALUES
('robson@itaicypantanal.com.br', 'Robson Silva', 'admin', true),
('editor@itaicypantanal.com.br', 'Editor de Teste', 'editor', true),
('redator@itaicypantanal.com.br', 'Redator de Teste', 'redator', true)
ON CONFLICT (email) DO UPDATE SET 
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  updated_at = now();

-- 3. Imagens placeholder para a biblioteca de mídia
INSERT INTO media_library (path, alt, filename, file_size, mime_type, orientation, processing_completed) VALUES
('placeholder%20(2).avif', 'Imagem placeholder padrão', 'placeholder.avif', 15000, 'image/avif', 'landscape', true),
('459.avif', 'Conforto na Natureza', 'conforto-natureza.avif', 25000, 'image/avif', 'landscape', true),
('onca.avif', 'Ver Onças de Perto', 'onca-pantanal.avif', 30000, 'image/avif', 'landscape', true),
('vida_pantaneira.avif', 'Histórias do Pantanal', 'vida-pantaneira.avif', 28000, 'image/avif', 'landscape', true),
('19.avif', 'Planeje sua Viagem', 'planeje-viagem.avif', 22000, 'image/avif', 'landscape', true),
('hero-video-thumb.avif', 'Thumbnail do vídeo hero', 'hero-video-thumb.avif', 35000, 'image/avif', 'landscape', true),
('safari-card.avif', 'Safari fotográfico', 'safari-card.avif', 20000, 'image/avif', 'landscape', true),
('pesca-card.avif', 'Pesca esportiva', 'pesca-card.avif', 20000, 'image/avif', 'landscape', true),
('birdwatching-card.avif', 'Observação de aves', 'birdwatching-card.avif', 20000, 'image/avif', 'landscape', true),
('suite-standard.avif', 'Apartamento Standard', 'suite-standard.avif', 25000, 'image/avif', 'landscape', true),
('suite-superior.avif', 'Apartamento Superior', 'suite-superior.avif', 25000, 'image/avif', 'landscape', true),
('restaurante-interior.avif', 'Interior do restaurante', 'restaurante-interior.avif', 25000, 'image/avif', 'landscape', true)
ON CONFLICT (path) DO UPDATE SET 
  alt = EXCLUDED.alt,
  filename = EXCLUDED.filename;

-- 4. Experiências de exemplo
INSERT INTO experiences (slug, title, description, short_description, price_from, duration_hours, max_participants, difficulty_level, category, available, featured) VALUES
('safari-fotografico', 'Safari Fotográfico', 'Explore o Pantanal em busca da fauna selvagem com guias especializados. Uma experiência única para fotografar onças, capivaras, jacarés e centenas de espécies de aves em seu habitat natural.', 'Aventura fotográfica no Pantanal com guias especializados', 350.00, 6, 8, 'easy', 'safari', true, true),
('pesca-esportiva', 'Pesca Esportiva', 'Desfrute da melhor pesca esportiva do Pantanal. Pescarias de pintado, dourado, pacu e outras espécies nativas em rios cristalinos com equipamentos de primeira qualidade.', 'Pesca esportiva com equipamentos profissionais', 280.00, 8, 6, 'moderate', 'fishing', true, true),
('observacao-aves', 'Observação de Aves', 'O Pantanal abriga mais de 650 espécies de aves. Acompanhe nossos guias ornitólogos em uma jornada única de descoberta da avifauna pantaneira.', 'Birdwatching com guias ornitólogos especializados', 220.00, 4, 10, 'easy', 'birdwatching', true, true),
('trilha-ecologica', 'Trilha Ecológica', 'Caminhadas interpretativas pela mata ciliar e campos alagados, conhecendo a flora e fauna local com nossos guias naturalistas.', 'Trilhas guiadas pela natureza pantaneira', 150.00, 3, 12, 'easy', 'hiking', true, false),
('passeio-barco', 'Passeio de Barco', 'Navegue pelos rios e corixos do Pantanal observando a vida selvagem das águas. Ideal para famílias e grupos que buscam tranquilidade.', 'Navegação contemplativa pelos rios pantaneiros', 180.00, 4, 15, 'easy', 'boat', true, false),
('cavalgada-pantaneira', 'Cavalgada Pantaneira', 'Experimente a tradicional cavalgada pantaneira pelos campos e estradas de terra, vivenciando o dia a dia do peão pantaneiro.', 'Cavalgada tradicional com peões locais', 200.00, 5, 8, 'moderate', 'horseback', true, false)
ON CONFLICT (slug) DO UPDATE SET 
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  updated_at = now();

-- 5. Acomodações de exemplo
INSERT INTO accommodations (slug, name, description, short_description, capacity, area_m2, price_per_night, room_type, amenities, available, featured, sort_order) VALUES
('apartamento-standard', 'Apartamento Duplo Standard', 'Apartamento confortável com vista para o rio, ideal para casais ou amigos. Conta com ar-condicionado, frigobar, TV e varanda com rede para relaxar ao som da natureza.', 'Conforto e vista para o rio', 2, 25, 450.00, 'standard', ARRAY['Ar-condicionado', 'Frigobar', 'TV', 'Varanda com rede', 'Banheiro privativo', 'Wi-Fi'], true, true, 1),
('apartamento-superior', 'Apartamento Duplo Superior', 'Apartamento espaçoso com varanda ampla e vista privilegiada do rio. Oferece maior conforto com área de estar separada e amenidades premium.', 'Espaço amplo com vista privilegiada', 2, 30, 550.00, 'superior', ARRAY['Ar-condicionado', 'Frigobar', 'TV', 'Varanda ampla', 'Área de estar', 'Banheiro premium', 'Wi-Fi', 'Cofre'], true, true, 2),
('suite-master', 'Suíte Master', 'Nossa acomodação mais luxuosa com sala de estar, varanda panorâmica e acabamentos especiais. Perfeita para lua de mel ou ocasiões especiais.', 'Luxo e exclusividade no Pantanal', 2, 45, 750.00, 'suite', ARRAY['Ar-condicionado', 'Frigobar', 'TV', 'Sala de estar', 'Varanda panorâmica', 'Banheiro de luxo', 'Wi-Fi', 'Cofre', 'Serviço de quarto'], true, false, 3)
ON CONFLICT (slug) DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at = now();

-- 6. Itens gastronômicos de exemplo
INSERT INTO gastronomy_items (slug, name, description, category, subcategory, price, ingredients, available, featured, sort_order) VALUES
('pintado-pantaneiro', 'Pintado Pantaneiro', 'Filé de pintado grelhado com temperos regionais, acompanhado de farofa de banana e vinagrete de mamão.', 'main', 'regional', 65.00, ARRAY['Pintado', 'Temperos regionais', 'Banana', 'Mamão', 'Cebola', 'Tomate'], true, true, 1),
('pacu-assado', 'Pacu Assado', 'Pacu inteiro assado na brasa com ervas pantaneiras, servido com pirão de peixe e salada tropical.', 'main', 'regional', 58.00, ARRAY['Pacu', 'Ervas pantaneiras', 'Farinha de mandioca', 'Frutas tropicais'], true, true, 2),
('carne-seca-mandioca', 'Carne Seca com Mandioca', 'Tradicional carne seca desfiada acompanhada de mandioca cozida e vinagrete pantaneiro.', 'main', 'regional', 45.00, ARRAY['Carne seca', 'Mandioca', 'Cebola', 'Tomate', 'Pimentão'], true, false, 3),
('sobremesa-pequi', 'Doce de Pequi', 'Sobremesa tradicional feita com pequi, leite condensado e coco ralado.', 'dessert', 'regional', 18.00, ARRAY['Pequi', 'Leite condensado', 'Coco ralado', 'Açúcar'], true, true, 4),
('caipirinha-caju', 'Caipirinha de Caju', 'Caipirinha refrescante feita com caju do cerrado e cachaça artesanal.', 'beverage', 'regional', 22.00, ARRAY['Caju', 'Cachaça artesanal', 'Açúcar', 'Limão'], true, true, 5),
('suco-cupuacu', 'Suco de Cupuaçu', 'Suco natural da fruta amazônica, refrescante e nutritivo.', 'beverage', 'natural', 15.00, ARRAY['Cupuaçu', 'Água', 'Açúcar'], true, false, 6)
ON CONFLICT (slug) DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at = now();

-- 7. Redirecionamentos de exemplo
INSERT INTO redirects (from_path, to_path, status_code, active, description) VALUES
('/old-home', '/', 301, true, 'Redirecionamento da página antiga'),
('/contatos', '/contato', 301, true, 'Padronização da URL de contato'),
('/quartos', '/acomodacoes', 301, true, 'Redirecionamento para nova seção'),
('/atividades', '/experiencias', 301, true, 'Redirecionamento para experiências')
ON CONFLICT (from_path) DO UPDATE SET 
  to_path = EXCLUDED.to_path,
  description = EXCLUDED.description,
  updated_at = now();

-- Verificar se os dados foram inseridos
SELECT 'Site Settings' as tabela, count(*) as registros FROM site_settings
UNION ALL
SELECT 'CMS Users' as tabela, count(*) as registros FROM cms_users
UNION ALL
SELECT 'Media Library' as tabela, count(*) as registros FROM media_library
UNION ALL
SELECT 'Experiences' as tabela, count(*) as registros FROM experiences
UNION ALL
SELECT 'Accommodations' as tabela, count(*) as registros FROM accommodations
UNION ALL
SELECT 'Gastronomy Items' as tabela, count(*) as registros FROM gastronomy_items
UNION ALL
SELECT 'Redirects' as tabela, count(*) as registros FROM redirects;
