import { createClient } from 'contentful';
import { createClient as createManagementClient } from 'contentful-management';

// Cliente para consumo da API de conteúdo
export const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
  environment: process.env.CONTENTFUL_ENVIRONMENT || 'master'
});

// Cliente para gerenciamento (usado nos scripts de migração)
export const contentfulManagement = createManagementClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN || ''
});

// Tipos de conteúdo
export const ContentTypes = {
  PAGE: 'page',
  BLOCK: 'block',
  POST: 'post',
  GLOBAL_SETTINGS: 'globalSettings',
  SUITE: 'suite',
  TESTIMONIAL: 'testimonial'
} as const;

// Tipos de blocos
export const BlockTypes = {
  HERO_VIDEO: 'heroVideo',
  HERO_IMAGE: 'heroImage',
  SPLIT_BLOCK: 'splitBlock',
  FEATURE_BLOCKS: 'featureBlocks'
} as const;

// Helpers para tipagem
export type ContentType = typeof ContentTypes[keyof typeof ContentTypes];
export type BlockType = typeof BlockTypes[keyof typeof BlockTypes];
