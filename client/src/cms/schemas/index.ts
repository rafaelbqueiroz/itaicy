import { heroVideoSchema, heroVideoFormConfig, type HeroVideoData } from './hero-video';
import { splitBlockSchema, splitBlockFormConfig, type SplitBlockData } from './split-block';
import { heroImageSchema, heroImageFormConfig, type HeroImageData } from './hero-image';

// Registry de todos os schemas por tipo de bloco
export const blockSchemas = {
  'hero-video': heroVideoSchema,
  'split-block': splitBlockSchema,
  'hero-image': heroImageSchema,
} as const;

// Registry de todas as configurações de formulário
export const blockFormConfigs = {
  'hero-video': heroVideoFormConfig,
  'split-block': splitBlockFormConfig,
  'hero-image': heroImageFormConfig,
} as const;

// Types
export type BlockType = keyof typeof blockSchemas;
export type BlockData = HeroVideoData | SplitBlockData;

// Função para obter schema por tipo
export function getBlockSchema(type: BlockType) {
  return blockSchemas[type];
}

// Função para obter configuração de formulário por tipo
export function getBlockFormConfig(type: BlockType) {
  return blockFormConfigs[type];
}

// Função para validar payload
export function validateBlockPayload(type: BlockType, payload: unknown) {
  const schema = getBlockSchema(type);
  return schema.safeParse(payload);
}