export const COLORS = {
  primary: '#1a4d3a',
  secondary: '#b8956b',
  cream: '#f5f1e8',
  charcoal: '#2d2d2d',
} as const;

export const EXPERIENCES = {
  PESCA: 'pesca',
  ECOTURISMO: 'ecoturismo',
  BIRDWATCHING: 'birdwatching',
} as const;

export const GALLERY_CATEGORIES = {
  PESCA: 'pesca',
  NATUREZA: 'natureza',
  LODGE: 'lodge',
  EQUIPE: 'equipe',
} as const;

export const LANGUAGES = {
  PT: 'pt-BR',
  EN: 'en-US',
  ES: 'es-ES',
} as const;

export const BOOKING_EXPERIENCES = [
  { value: 'pesca-esportiva', label: 'Pesca Esportiva' },
  { value: 'ecoturismo', label: 'Ecoturismo' },
  { value: 'birdwatching', label: 'Birdwatching' },
  { value: 'day-use', label: 'Day Use' },
] as const;

export const GUEST_OPTIONS = [
  { value: '1', label: '1 Adulto' },
  { value: '2', label: '2 Adultos' },
  { value: '3', label: '2 Adultos, 1 Criança' },
  { value: '4', label: '2 Adultos, 2 Crianças' },
  { value: '5+', label: '5+ Pessoas' },
] as const;
