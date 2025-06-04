# 🖼️ Sistema de Imagens Otimizadas

## Visão Geral

O Itaicy Eco Lodge implementa um sistema avançado de otimização de imagens que suporta formatos modernos (AVIF, WebP) com fallback automático para formatos tradicionais (JPEG, PNG).

## ✨ Funcionalidades

### 🎯 **Formatos Suportados**
- **AVIF** - Formato mais moderno, até 50% menor que JPEG
- **WebP** - Formato do Google, até 30% menor que JPEG  
- **JPEG/PNG** - Fallback para navegadores antigos

### 🔄 **Fallback Automático**
```
AVIF → WebP → JPEG/PNG original
```

### 🌐 **Compatibilidade**
- **Unsplash**: Conversão automática via parâmetros de URL
- **Supabase Storage**: Tentativa de conversão de extensão
- **URLs genéricas**: Fallback inteligente

## 🛠️ Como Usar

### Componente OptimizedImage

```tsx
import { OptimizedImage } from '@/components/ui/optimized-image';

<OptimizedImage
  src="https://images.unsplash.com/photo-123456"
  alt="Descrição da imagem"
  width={800}
  height={600}
  className="w-full h-auto rounded-lg"
  sizes="(max-width: 768px) 100vw, 50vw"
  loading="lazy"
/>
```

### Propriedades

| Prop | Tipo | Descrição |
|------|------|-----------|
| `src` | string | URL da imagem original |
| `alt` | string | Texto alternativo |
| `width` | number | Largura para otimização |
| `height` | number | Altura para otimização |
| `className` | string | Classes CSS |
| `sizes` | string | Atributo sizes para responsive |
| `loading` | 'lazy' \| 'eager' | Estratégia de carregamento |
| `onLoad` | function | Callback quando carrega |
| `onError` | function | Callback em caso de erro |

## 📱 Responsive Images

### Sizes Recomendados

```tsx
// Para imagens full-width
sizes="100vw"

// Para grid de 2 colunas em desktop
sizes="(max-width: 768px) 100vw, 50vw"

// Para grid de 3 colunas em desktop
sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"

// Para grid de 4 colunas em desktop
sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"

// Para avatares pequenos
sizes="48px"
```

## 🎨 Implementação no Site

### Componentes Atualizados

- ✅ **FeatureBlocks** - Imagens das experiências
- ✅ **Testimonials** - Avatares dos depoimentos
- ✅ **Acomodações** - Fotos das suítes
- ✅ **Galeria** - Grid de fotos e modal
- ✅ **MediaLibrary (CMS)** - Biblioteca de mídia

### Exemplo de Uso no CMS

```tsx
// No MediaLibrary
<OptimizedImage
  src={item.path}
  alt={item.alt}
  className="w-full h-full object-cover"
  width={200}
  height={200}
  sizes="200px"
  loading="lazy"
/>
```

## 🔧 Configuração Técnica

### Detecção de Suporte

```tsx
import { useImageFormatSupport } from '@/components/ui/optimized-image';

const { avif, webp } = useImageFormatSupport();
```

### URLs do Unsplash

O componente converte automaticamente URLs do Unsplash:

```
Original: https://images.unsplash.com/photo-123456
AVIF:     https://images.unsplash.com/photo-123456?fm=avif&q=85&w=800&h=600
WebP:     https://images.unsplash.com/photo-123456?fm=webp&q=85&w=800&h=600
```

### URLs do Supabase

Para arquivos no Supabase Storage:

```
Original: https://abc.supabase.co/storage/v1/object/public/media/image.jpg
AVIF:     https://abc.supabase.co/storage/v1/object/public/media/image.avif
WebP:     https://abc.supabase.co/storage/v1/object/public/media/image.webp
```

## 📊 Performance

### Benefícios

- **Redução de 30-50%** no tamanho dos arquivos
- **Carregamento mais rápido** das páginas
- **Melhor Core Web Vitals** (LCP, CLS)
- **Economia de banda** para usuários

### Métricas

| Formato | Tamanho Médio | Economia |
|---------|---------------|----------|
| JPEG    | 100KB        | 0%       |
| WebP    | 70KB         | 30%      |
| AVIF    | 50KB         | 50%      |

## 🧪 Teste de Compatibilidade

Acesse: `http://localhost:5000/test-image-formats.html`

Este teste verifica:
- ✅ Suporte do navegador a AVIF/WebP
- 🖼️ Carregamento prático das imagens
- 📱 Informações técnicas do dispositivo

## 🚀 Próximos Passos

### Melhorias Futuras

1. **Lazy Loading Avançado** - Intersection Observer
2. **Blur Placeholder** - Imagens base64 pequenas
3. **Responsive Breakpoints** - Múltiplos tamanhos
4. **CDN Integration** - Cloudflare/AWS CloudFront
5. **Compression Levels** - Qualidade adaptativa

### Upload no CMS

O MediaLibrary já suporta upload de arquivos AVIF/WebP:

```tsx
accept="image/*,video/*,.avif,.webp"
```

## 📝 Notas Importantes

- **Fallback Garantido**: Sempre funciona, mesmo em navegadores antigos
- **SEO Friendly**: Mantém atributos alt e estrutura semântica
- **Acessibilidade**: Preserva todos os recursos de acessibilidade
- **Performance**: Carregamento otimizado com lazy loading

## 🔍 Debugging

### Console Logs

O componente não gera logs por padrão. Para debug, adicione:

```tsx
onLoad={() => console.log('Imagem carregada')}
onError={() => console.log('Erro no carregamento')}
```

### Network Tab

No DevTools, verifique:
- Formato carregado (AVIF/WebP/JPEG)
- Tamanho do arquivo
- Tempo de carregamento
