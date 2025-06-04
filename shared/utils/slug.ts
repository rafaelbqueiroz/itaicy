/**
 * Slug generation and validation utilities for Sprint 1
 * Implements kebab-case normalization and uniqueness validation
 */

/**
 * Converts a string to a URL-friendly slug
 * - Converts to lowercase
 * - Removes accents and special characters
 * - Replaces spaces and underscores with hyphens
 * - Removes consecutive hyphens
 * - Trims hyphens from start and end
 */
export function generateSlug(text: string): string {
  if (!text) return '';
  
  return text
    .toLowerCase()
    // Remove accents and special characters
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Replace spaces, underscores, and other separators with hyphens
    .replace(/[\s_]+/g, '-')
    // Remove any character that's not alphanumeric or hyphen
    .replace(/[^a-z0-9-]/g, '')
    // Remove consecutive hyphens
    .replace(/-+/g, '-')
    // Remove hyphens from start and end
    .replace(/^-+|-+$/g, '');
}

/**
 * Validates if a slug follows the correct format
 */
export function isValidSlug(slug: string): boolean {
  if (!slug) return false;
  
  // Must be lowercase, alphanumeric with hyphens, no consecutive hyphens
  const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

/**
 * Ensures slug uniqueness by appending a number if needed
 * This function should be used with database queries to check uniqueness
 */
export function ensureUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }
  
  let counter = 1;
  let uniqueSlug = `${baseSlug}-${counter}`;
  
  while (existingSlugs.includes(uniqueSlug)) {
    counter++;
    uniqueSlug = `${baseSlug}-${counter}`;
  }
  
  return uniqueSlug;
}

/**
 * Generates a unique slug from text, checking against existing slugs
 */
export function createUniqueSlug(text: string, existingSlugs: string[]): string {
  const baseSlug = generateSlug(text);
  return ensureUniqueSlug(baseSlug, existingSlugs);
}

/**
 * Slug validation schema for Zod
 */
export const slugSchema = {
  required: (message = 'Slug é obrigatório') => ({
    min: 1,
    message
  }),
  format: (message = 'Slug deve conter apenas letras minúsculas, números e hífens') => ({
    regex: /^[a-z0-9]+(-[a-z0-9]+)*$/,
    message
  }),
  maxLength: (length = 100, message = `Slug deve ter no máximo ${length} caracteres`) => ({
    max: length,
    message
  })
};

/**
 * Common slug validation rules
 */
export const SLUG_RULES = {
  MIN_LENGTH: 1,
  MAX_LENGTH: 100,
  PATTERN: /^[a-z0-9]+(-[a-z0-9]+)*$/,
  RESERVED_SLUGS: [
    'admin', 'api', 'cms', 'www', 'mail', 'ftp', 'localhost',
    'home', 'index', 'about', 'contact', 'blog', 'news',
    'search', 'login', 'register', 'dashboard', 'profile',
    'settings', 'help', 'support', 'terms', 'privacy'
  ]
};

/**
 * Checks if a slug is reserved and should not be used
 */
export function isReservedSlug(slug: string): boolean {
  return SLUG_RULES.RESERVED_SLUGS.includes(slug.toLowerCase());
}

/**
 * Validates a slug against all rules
 */
export function validateSlug(slug: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!slug) {
    errors.push('Slug é obrigatório');
    return { valid: false, errors };
  }
  
  if (slug.length < SLUG_RULES.MIN_LENGTH) {
    errors.push(`Slug deve ter pelo menos ${SLUG_RULES.MIN_LENGTH} caractere`);
  }
  
  if (slug.length > SLUG_RULES.MAX_LENGTH) {
    errors.push(`Slug deve ter no máximo ${SLUG_RULES.MAX_LENGTH} caracteres`);
  }
  
  if (!SLUG_RULES.PATTERN.test(slug)) {
    errors.push('Slug deve conter apenas letras minúsculas, números e hífens');
  }
  
  if (isReservedSlug(slug)) {
    errors.push('Este slug é reservado e não pode ser usado');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
