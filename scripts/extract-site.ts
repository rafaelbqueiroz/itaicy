import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs/promises';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// URLs das páginas a serem crawleadas
const PAGES = [
  { url: '/', slug: 'home', name: 'Home', priority: 1 },
  { url: '/acomodacoes', slug: 'acomodacoes', name: 'Acomodações', priority: 2 },
  { url: '/experiencias', slug: 'experiencias', name: 'Experiências', priority: 3 },
  { url: '/galeria', slug: 'galeria', name: 'Galeria', priority: 4 },
  { url: '/blog', slug: 'blog', name: 'Blog', priority: 5 },
  { url: '/contato', slug: 'contato', name: 'Contato', priority: 6 },
  { url: '/sobre-nos', slug: 'sobre-nos', name: 'Sobre Nós', priority: 7 },
  { url: '/sustentabilidade', slug: 'sustentabilidade', name: 'Sustentabilidade', priority: 8 },
  { url: '/gastronomia', slug: 'gastronomia', name: 'Gastronomia', priority: 9 },
  { url: '/pesca-esportiva', slug: 'pesca-esportiva', name: 'Pesca Esportiva', priority: 10 },
  { url: '/lodge', slug: 'lodge', name: 'Lodge', priority: 11 },
];

// Mapeamento de seletores para tipos de blocos
const BLOCK_SELECTORS = [
  { type: 'hero-video', selector: '.hero-video, [data-block="hero-video"]' },
  { type: 'hero-image', selector: '.hero-image, [data-block="hero-image"]' },
  { type: 'split-block', selector: '.split-block, [data-block="split-block"]' },
  { type: 'stats-ribbon', selector: '.stats-ribbon, [data-block="stats-ribbon"]' },
  { type: 'counters-ribbon', selector: '.counters-ribbon, [data-block="counters-ribbon"]' },
  { type: 'feature-blocks', selector: '.feature-blocks, [data-block="feature-blocks"]' },
  { type: 'testimonials', selector: '.testimonials-section, [data-block="testimonials"]' },
  { type: 'newsletter', selector: '.newsletter-section, [data-block="newsletter"]' },
  { type: 'gallery', selector: '.gallery-section, [data-block="gallery"]' },
  { type: 'blog-grid', selector: '.blog-grid, [data-block="blog-grid"]' },
  { type: 'hero-simple', selector: '.hero-simple, [data-block="hero-simple"]' },
  { type: 'contact-form', selector: '.contact-form, [data-block="contact-form"]' },
  { type: 'lodge-overview', selector: '.lodge-overview, [data-block="lodge-overview"]' },
  { type: 'highlights', selector: '.highlights-section, [data-block="highlights"]' },
];

// Função para extrair dados de blocos específicos
const extractBlockData = ($: cheerio.CheerioAPI, element: cheerio.Element, type: string) => {
  const $element = $(element);
  
  // Dados básicos para todos os blocos
  const baseData = {
    id: $element.attr('id') || `block-${Math.random().toString(36).substring(2, 9)}`,
    type,
  };

  // Extração específica por tipo de bloco
  switch (type) {
    case 'hero-video':
      return {
        ...baseData,
        title: $element.find('h1, .hero-title').text().trim(),
        subtitle: $element.find('p, .hero-subtitle').first().text().trim(),
        videoSrc: $element.find('video source').attr('src') || $element.find('video').attr('src') || '',
        overlayColor: getComputedStyle($element.get(0)).getPropertyValue('--overlay-color') || 'rgba(0,0,0,0.4)',
        ctaText: $element.find('.cta-button, .btn-primary').text().trim(),
        ctaUrl: $element.find('.cta-button, .btn-primary').attr('href') || '#',
      };
      
    case 'hero-image':
      return {
        ...baseData,
        title: $element.find('h1, .hero-title').text().trim(),
        subtitle: $element.find('p, .hero-subtitle').first().text().trim(),
        imageSrc: $element.find('img').attr('src') || 
                 $element.css('background-image')?.replace(/url\(['"]?([^'"]+)['"]?\)/i, '$1') || '',
        overlayColor: getComputedStyle($element.get(0)).getPropertyValue('--overlay-color') || 'rgba(0,0,0,0.4)',
        ctaText: $element.find('.cta-button, .btn-primary').text().trim(),
        ctaUrl: $element.find('.cta-button, .btn-primary').attr('href') || '#',
      };
      
    case 'split-block':
      return {
        ...baseData,
        title: $element.find('h2, .split-title').text().trim(),
        content: $element.find('p, .split-content').text().trim(),
        imageSrc: $element.find('img').attr('src') || '',
        imagePosition: $element.hasClass('image-right') ? 'right' : 'left',
        ctaText: $element.find('.cta-button, .btn').text().trim(),
        ctaUrl: $element.find('.cta-button, .btn').attr('href') || '#',
      };
      
    case 'stats-ribbon':
      return {
        ...baseData,
        title: $element.find('h2, .ribbon-title').text().trim(),
        stats: $element.find('.stat-item').map((i, el) => ({
          value: $(el).find('.stat-value').text().trim(),
          label: $(el).find('.stat-label').text().trim(),
        })).get(),
        backgroundColor: getComputedStyle($element.get(0)).backgroundColor || '#f8f9fa',
      };
      
    case 'counters-ribbon':
      return {
        ...baseData,
        title: $element.find('h2, .ribbon-title').text().trim(),
        counters: $element.find('.counter-item').map((i, el) => ({
          value: parseInt($(el).find('.counter-value').text().trim().replace(/\D/g, ''), 10),
          label: $(el).find('.counter-label').text().trim(),
          icon: $(el).find('i, svg').attr('class') || '',
        })).get(),
        backgroundColor: getComputedStyle($element.get(0)).backgroundColor || '#f8f9fa',
      };
      
    case 'feature-blocks':
      return {
        ...baseData,
        title: $element.find('h2, .section-title').first().text().trim(),
        subtitle: $element.find('.section-subtitle, h3 + p').first().text().trim(),
        features: $element.find('.feature-item, .card').map((i, el) => ({
          title: $(el).find('h3, .feature-title, .card-title').text().trim(),
          description: $(el).find('p, .feature-description, .card-text').text().trim(),
          imageSrc: $(el).find('img').attr('src') || '',
          icon: $(el).find('i, svg').attr('class') || '',
        })).get(),
      };
      
    case 'testimonials':
      return {
        ...baseData,
        title: $element.find('h2, .section-title').text().trim(),
        testimonials: $element.find('.testimonial-item').map((i, el) => ({
          quote: $(el).find('.testimonial-quote, blockquote').text().trim(),
          author: $(el).find('.testimonial-author, .author-name').text().trim(),
          location: $(el).find('.testimonial-location, .author-location').text().trim(),
          rating: $(el).find('.rating').children().length,
          avatarSrc: $(el).find('.avatar img').attr('src') || '',
        })).get(),
      };
      
    case 'gallery':
      return {
        ...baseData,
        title: $element.find('h2, .section-title').text().trim(),
        subtitle: $element.find('.section-subtitle, h2 + p').text().trim(),
        images: $element.find('.gallery-item img').map((i, el) => ({
          src: $(el).attr('src') || '',
          alt: $(el).attr('alt') || '',
          caption: $(el).attr('data-caption') || $(el).closest('.gallery-item').find('.caption').text().trim(),
        })).get(),
      };
      
    case 'blog-grid':
      return {
        ...baseData,
        title: $element.find('h2, .section-title').text().trim(),
        subtitle: $element.find('.section-subtitle, h2 + p').text().trim(),
        posts: $element.find('.blog-post, .card').map((i, el) => ({
          title: $(el).find('h3, .post-title, .card-title').text().trim(),
          excerpt: $(el).find('.post-excerpt, .card-text').text().trim(),
          imageSrc: $(el).find('img').attr('src') || '',
          url: $(el).find('a').attr('href') || '',
          date: $(el).find('.post-date').text().trim(),
        })).get(),
      };
      
    case 'contact-form':
      return {
        ...baseData,
        title: $element.find('h2, .section-title').text().trim(),
        subtitle: $element.find('.section-subtitle, h2 + p').text().trim(),
        fields: $element.find('input, textarea, select').map((i, el) => ({
          type: $(el).attr('type') || el.tagName.toLowerCase(),
          name: $(el).attr('name') || '',
          placeholder: $(el).attr('placeholder') || '',
          required: $(el).attr('required') !== undefined,
        })).get(),
        submitText: $element.find('button[type="submit"]').text().trim(),
      };
      
    case 'lodge-overview':
      return {
        ...baseData,
        title: $element.find('h2, .section-title').text().trim(),
        description: $element.find('.overview-description, h2 + p').text().trim(),
        features: $element.find('.overview-feature').map((i, el) => ({
          title: $(el).find('h3, .feature-title').text().trim(),
          description: $(el).find('p, .feature-description').text().trim(),
          icon: $(el).find('i, svg').attr('class') || '',
        })).get(),
        imageSrc: $element.find('.overview-image img').attr('src') || '',
      };
      
    case 'highlights':
      return {
        ...baseData,
        title: $element.find('h2, .section-title').text().trim(),
        items: $element.find('.highlight-item').map((i, el) => ({
          title: $(el).find('h3, .highlight-title').text().trim(),
          description: $(el).find('p, .highlight-description').text().trim(),
          icon: $(el).find('i, svg').attr('class') || '',
        })).get(),
      };
      
    default:
      // Para blocos não identificados, tentamos extrair o máximo de informações genéricas
      return {
        ...baseData,
        title: $element.find('h1, h2, h3').first().text().trim(),
        content: $element.find('p').first().text().trim(),
        html: $element.html(),
      };
  }
};

// Função para extrair todos os blocos de uma página
const extractPageBlocks = async (url: string): Promise<any[]> => {
  try {
    console.log(`Extraindo blocos de: ${url}`);
    
    // Inicia o servidor local se ainda não estiver rodando
    try {
      await axios.get('http://localhost:5173');
    } catch (error) {
      console.log('Servidor não está rodando, iniciando...');
      execAsync('pnpm dev');
      // Aguarda o servidor iniciar
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    // Faz a requisição à página
    const response = await axios.get(`http://localhost:5173${url}`);
    const html = response.data;
    const $ = cheerio.load(html);
    
    // Array para armazenar os blocos encontrados
    const blocks: any[] = [];
    
    // Extrai metadados da página
    const pageTitle = $('title').text().trim();
    const pageDescription = $('meta[name="description"]').attr('content') || '';
    
    // Procura por blocos usando os seletores definidos
    BLOCK_SELECTORS.forEach(({ type, selector }, index) => {
      $(selector).each((i, element) => {
        const blockData = extractBlockData($, element, type);
        blocks.push({
          ...blockData,
          position: blocks.length + 1, // Posição sequencial
        });
      });
    });
    
    // Se não encontrarmos blocos pelos seletores específicos, tentamos uma abordagem mais genérica
    if (blocks.length === 0) {
      console.log(`Nenhum bloco identificado por seletores em ${url}, tentando abordagem genérica...`);
      
      // Procura por seções principais
      $('main > section, main > div, .page-content > section, .page-content > div').each((i, element) => {
        // Tenta determinar o tipo pelo contexto
        let type = 'unknown';
        const $element = $(element);
        
        if (i === 0 && ($element.find('h1').length > 0 || $element.hasClass('hero'))) {
          type = $element.find('video').length > 0 ? 'hero-video' : 'hero-image';
        } else if ($element.find('.testimonial, blockquote').length > 0) {
          type = 'testimonials';
        } else if ($element.find('.stat, .counter').length > 0) {
          type = 'stats-ribbon';
        } else if ($element.find('form').length > 0) {
          type = 'contact-form';
        } else if ($element.find('.card, .feature').length >= 3) {
          type = 'feature-blocks';
        } else if ($element.find('img').length > 0 && $element.find('h2, h3, p').length > 0) {
          type = 'split-block';
        }
        
        const blockData = extractBlockData($, element, type);
        blocks.push({
          ...blockData,
          position: blocks.length + 1,
        });
      });
    }
    
    console.log(`Extraídos ${blocks.length} blocos de ${url}`);
    return blocks;
  } catch (error) {
    console.error(`Erro ao extrair blocos de ${url}:`, error);
    return [];
  }
};

// Função principal
const extractSite = async () => {
  try {
    console.log('Iniciando extração do site...');
    
    // Cria diretório para os dados extraídos
    const outputDir = path.resolve('./extracted-content');
    await fs.mkdir(outputDir, { recursive: true });
    
    // Objeto para armazenar todas as páginas e seus blocos
    const siteData = {
      pages: [],
      blocks: [],
      mediaItems: new Set(),
    };
    
    // Processa cada página
    for (const page of PAGES) {
      const blocks = await extractPageBlocks(page.url);
      
      if (blocks.length > 0) {
        // Adiciona a página ao conjunto de dados
        const pageId = `page_${page.slug}`;
        siteData.pages.push({
          id: pageId,
          slug: page.slug,
          name: page.name,
          template: 'default',
          priority: page.priority,
        });
        
        // Adiciona os blocos ao conjunto de dados
        blocks.forEach(block => {
          siteData.blocks.push({
            ...block,
            page_id: pageId,
          });
          
          // Coleta URLs de mídia para posterior download
          if (block.imageSrc) siteData.mediaItems.add(block.imageSrc);
          if (block.videoSrc) siteData.mediaItems.add(block.videoSrc);
          
          // Coleta mídias de arrays
          ['images', 'features', 'testimonials', 'posts'].forEach(arrayKey => {
            if (Array.isArray(block[arrayKey])) {
              block[arrayKey].forEach((item: any) => {
                if (item.imageSrc) siteData.mediaItems.add(item.imageSrc);
                if (item.src) siteData.mediaItems.add(item.src);
                if (item.avatarSrc) siteData.mediaItems.add(item.avatarSrc);
              });
            }
          });
        });
        
        // Salva os dados da página individual
        await fs.writeFile(
          path.join(outputDir, `${page.slug}.json`),
          JSON.stringify({ page: siteData.pages[siteData.pages.length - 1], blocks }, null, 2)
        );
      }
    }
    
    // Salva o conjunto completo de dados
    await fs.writeFile(
      path.join(outputDir, 'site-data.json'),
      JSON.stringify({
        pages: siteData.pages,
        blocks: siteData.blocks,
        mediaItems: Array.from(siteData.mediaItems),
      }, null, 2)
    );
    
    console.log(`Extração concluída! Dados salvos em ${outputDir}`);
    return siteData;
  } catch (error) {
    console.error('Erro durante a extração do site:', error);
    throw error;
  }
};

// Executa a função principal se este arquivo for executado diretamente
if (require.main === module) {
  extractSite()
    .then(() => {
      console.log('Extração concluída com sucesso!');
      process.exit(0);
    })
    .catch(error => {
      console.error('Falha na extração:', error);
      process.exit(1);
    });
}

export { extractSite, extractPageBlocks };
