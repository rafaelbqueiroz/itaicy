import { db } from '../db.js';
import { pages, blogPosts, experiences, accommodations, gastronomyItems } from '@shared/schema';
import { eq, ilike, or, and, ne, desc } from 'drizzle-orm';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface LinkSuggestion {
  keyword: string;
  url: string;
  title: string;
  contentType: 'page' | 'blog_post' | 'experience' | 'accommodation' | 'gastronomy_item';
  relevanceScore: number;
  context?: string;
}

export interface InternalLinkRequest {
  content: string;
  contentType?: string;
  excludeSlug?: string; // Exclude current content from suggestions
}

export class InternalLinkService {
  private static readonly BASE_URL = 'https://itaicy.com.br';

  /**
   * Generate internal link suggestions for given content
   */
  static async generateSuggestions(request: InternalLinkRequest): Promise<LinkSuggestion[]> {
    console.log('🔗 Generating internal link suggestions...');

    try {
      // Extract keywords using AI
      const keywords = await this.extractKeywords(request.content);
      
      // Find matching content for each keyword
      const suggestions: LinkSuggestion[] = [];
      
      for (const keyword of keywords) {
        const matches = await this.findMatchingContent(keyword, request.excludeSlug);
        suggestions.push(...matches);
      }

      // Remove duplicates and sort by relevance
      const uniqueSuggestions = this.deduplicateAndSort(suggestions);

      // Limit to top 10 suggestions
      return uniqueSuggestions.slice(0, 10);

    } catch (error) {
      console.error('❌ Failed to generate link suggestions:', error);
      throw error;
    }
  }

  /**
   * Extract relevant keywords from content using OpenAI
   */
  private static async extractKeywords(content: string): Promise<string[]> {
    try {
      const prompt = `
Analise o seguinte conteúdo sobre turismo no Pantanal e extraia palavras-chave e frases relevantes que poderiam ser usadas para links internos.

Foque em:
- Atividades turísticas (pesca, safari, birdwatching, etc.)
- Fauna e flora do Pantanal
- Acomodações e serviços
- Gastronomia regional
- Experiências específicas

Conteúdo:
${content.substring(0, 2000)}

Retorne apenas uma lista de palavras-chave separadas por vírgula, sem explicações:
`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em SEO e turismo no Pantanal. Extraia palavras-chave relevantes para links internos.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.3,
      });

      const keywordsText = response.choices[0]?.message?.content || '';
      const keywords = keywordsText
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 2)
        .slice(0, 15); // Limit to 15 keywords

      console.log(`🔍 Extracted ${keywords.length} keywords:`, keywords);
      return keywords;

    } catch (error) {
      console.error('Error extracting keywords:', error);
      // Fallback to basic keyword extraction
      return this.extractBasicKeywords(content);
    }
  }

  /**
   * Fallback basic keyword extraction
   */
  private static extractBasicKeywords(content: string): string[] {
    const pantanalKeywords = [
      'pantanal', 'pesca', 'safari', 'birdwatching', 'observação de aves',
      'onça', 'jacaré', 'capivara', 'tuiuiú', 'natureza', 'ecoturismo',
      'sustentabilidade', 'conservação', 'lodge', 'acomodação', 'gastronomia',
      'peixe', 'piranha', 'pacu', 'dourado', 'pintado', 'aventura'
    ];

    const contentLower = content.toLowerCase();
    return pantanalKeywords.filter(keyword => 
      contentLower.includes(keyword)
    ).slice(0, 10);
  }

  /**
   * Find matching content for a keyword
   */
  private static async findMatchingContent(
    keyword: string, 
    excludeSlug?: string
  ): Promise<LinkSuggestion[]> {
    const suggestions: LinkSuggestion[] = [];

    try {
      // Search in pages
      const pageMatches = await db
        .select({
          slug: pages.slug,
          title: pages.title,
          description: pages.description,
        })
        .from(pages)
        .where(
          and(
            or(
              ilike(pages.title, `%${keyword}%`),
              ilike(pages.description, `%${keyword}%`)
            ),
            excludeSlug ? ne(pages.slug, excludeSlug) : undefined
          )
        )
        .limit(3);

      pageMatches.forEach(match => {
        suggestions.push({
          keyword,
          url: `${this.BASE_URL}/${match.slug}`,
          title: match.title,
          contentType: 'page',
          relevanceScore: this.calculateRelevance(keyword, match.title, match.description),
        });
      });

      // Search in blog posts
      const blogMatches = await db
        .select({
          slug: blogPosts.slug,
          title: blogPosts.title,
          excerpt: blogPosts.excerpt,
        })
        .from(blogPosts)
        .where(
          and(
            eq(blogPosts.isPublished, true),
            or(
              ilike(blogPosts.title, `%${keyword}%`),
              ilike(blogPosts.excerpt, `%${keyword}%`)
            ),
            excludeSlug ? ne(blogPosts.slug, excludeSlug) : undefined
          )
        )
        .limit(3);

      blogMatches.forEach(match => {
        suggestions.push({
          keyword,
          url: `${this.BASE_URL}/blog/${match.slug}`,
          title: match.title,
          contentType: 'blog_post',
          relevanceScore: this.calculateRelevance(keyword, match.title, match.excerpt),
        });
      });

      // Search in experiences
      const experienceMatches = await db
        .select({
          slug: experiences.slug,
          title: experiences.title,
          shortDescription: experiences.shortDescription,
        })
        .from(experiences)
        .where(
          and(
            eq(experiences.available, true),
            or(
              ilike(experiences.title, `%${keyword}%`),
              ilike(experiences.shortDescription, `%${keyword}%`)
            ),
            excludeSlug ? ne(experiences.slug, excludeSlug) : undefined
          )
        )
        .limit(3);

      experienceMatches.forEach(match => {
        suggestions.push({
          keyword,
          url: `${this.BASE_URL}/experiencias/${match.slug}`,
          title: match.title,
          contentType: 'experience',
          relevanceScore: this.calculateRelevance(keyword, match.title, match.shortDescription),
        });
      });

      // Search in accommodations
      const accommodationMatches = await db
        .select({
          slug: accommodations.slug,
          name: accommodations.name,
          shortDescription: accommodations.shortDescription,
        })
        .from(accommodations)
        .where(
          and(
            eq(accommodations.available, true),
            or(
              ilike(accommodations.name, `%${keyword}%`),
              ilike(accommodations.shortDescription, `%${keyword}%`)
            ),
            excludeSlug ? ne(accommodations.slug, excludeSlug) : undefined
          )
        )
        .limit(2);

      accommodationMatches.forEach(match => {
        suggestions.push({
          keyword,
          url: `${this.BASE_URL}/acomodacoes/${match.slug}`,
          title: match.name,
          contentType: 'accommodation',
          relevanceScore: this.calculateRelevance(keyword, match.name, match.shortDescription),
        });
      });

      // Search in gastronomy items
      const gastronomyMatches = await db
        .select({
          slug: gastronomyItems.slug,
          name: gastronomyItems.name,
          description: gastronomyItems.description,
        })
        .from(gastronomyItems)
        .where(
          and(
            eq(gastronomyItems.available, true),
            or(
              ilike(gastronomyItems.name, `%${keyword}%`),
              ilike(gastronomyItems.description, `%${keyword}%`)
            ),
            excludeSlug ? ne(gastronomyItems.slug, excludeSlug) : undefined
          )
        )
        .limit(2);

      gastronomyMatches.forEach(match => {
        suggestions.push({
          keyword,
          url: `${this.BASE_URL}/gastronomia/${match.slug}`,
          title: match.name,
          contentType: 'gastronomy_item',
          relevanceScore: this.calculateRelevance(keyword, match.name, match.description),
        });
      });

    } catch (error) {
      console.error(`Error finding matches for keyword "${keyword}":`, error);
    }

    return suggestions;
  }

  /**
   * Calculate relevance score for a match
   */
  private static calculateRelevance(
    keyword: string, 
    title: string, 
    description?: string | null
  ): number {
    let score = 0;
    const keywordLower = keyword.toLowerCase();
    const titleLower = title.toLowerCase();
    const descLower = (description || '').toLowerCase();

    // Title exact match
    if (titleLower === keywordLower) score += 100;
    // Title contains keyword
    else if (titleLower.includes(keywordLower)) score += 50;
    
    // Description contains keyword
    if (descLower.includes(keywordLower)) score += 25;

    // Boost score for longer keywords (more specific)
    score += keyword.length * 2;

    return score;
  }

  /**
   * Remove duplicates and sort by relevance
   */
  private static deduplicateAndSort(suggestions: LinkSuggestion[]): LinkSuggestion[] {
    const seen = new Set<string>();
    const unique: LinkSuggestion[] = [];

    // Sort by relevance score first
    suggestions.sort((a, b) => b.relevanceScore - a.relevanceScore);

    for (const suggestion of suggestions) {
      const key = `${suggestion.url}:${suggestion.keyword}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(suggestion);
      }
    }

    return unique;
  }

  /**
   * Get popular internal link targets
   */
  static async getPopularTargets(): Promise<Array<{
    url: string;
    title: string;
    contentType: string;
    slug: string;
  }>> {
    try {
      const targets: Array<{
        url: string;
        title: string;
        contentType: string;
        slug: string;
      }> = [];

      // Get featured experiences
      const featuredExperiences = await db
        .select({
          slug: experiences.slug,
          title: experiences.title,
        })
        .from(experiences)
        .where(and(
          eq(experiences.available, true),
          eq(experiences.featured, true)
        ))
        .limit(5);

      featuredExperiences.forEach(exp => {
        targets.push({
          url: `${this.BASE_URL}/experiencias/${exp.slug}`,
          title: exp.title,
          contentType: 'experience',
          slug: exp.slug,
        });
      });

      // Get recent blog posts
      const recentPosts = await db
        .select({
          slug: blogPosts.slug,
          title: blogPosts.title,
        })
        .from(blogPosts)
        .where(eq(blogPosts.isPublished, true))
        .orderBy(desc(blogPosts.publishedAt))
        .limit(5);

      recentPosts.forEach(post => {
        targets.push({
          url: `${this.BASE_URL}/blog/${post.slug}`,
          title: post.title,
          contentType: 'blog_post',
          slug: post.slug,
        });
      });

      return targets;

    } catch (error) {
      console.error('Error getting popular targets:', error);
      return [];
    }
  }
}
