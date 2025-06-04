# Sistema de Otimização de Imagens

Este documento descreve como usar o sistema de otimização de imagens do Itaicy Pantanal Eco Lodge.

## Visão Geral

O sistema automaticamente:
- Redimensiona imagens para múltiplos breakpoints (1920px, 1280px, 768px, 400px)
- Converte para formatos modernos (AVIF, WebP) com fallback JPEG
- Gera placeholders blur para carregamento suave
- Detecta orientação (paisagem/retrato) automaticamente
- Cria thumbnails quadrados quando necessário

## Configuração Inicial

### 1. Instalar Dependências

```bash
npm install sharp multer @types/multer
```

### 2. Criar Diretórios

```bash
npm run setup-images
```

Isso criará:
- `public/images/originals/` - Para imagens originais
- `public/images/optimized/` - Para imagens processadas

## Uso

### Processamento em Lote (Recomendado)

1. **Adicione suas imagens originais** em `public/images/originals/`
   - Formatos suportados: JPG, PNG, WebP, AVIF
   - Tamanho máximo recomendado: 50MB por arquivo

2. **Execute o otimizador:**
   ```bash
   npm run optimize-images
   ```

3. **Resultado:** Imagens otimizadas em `public/images/optimized/` + arquivo `metadata.json`

### Upload via CMS

1. Acesse a **Biblioteca de Mídia** no CMS
2. Clique em **"Enviar Imagem"**
3. Selecione opções:
   - **Thumbnail 1:1**: Para criar versão quadrada
   - **Forçar Quadrado**: Corta a imagem em formato quadrado
   - **Alt Text**: Descrição para acessibilidade

## Tamanhos Gerados

### Hero Images (Banners)
- **1920px** - Desktop full-width
- **1280px** - Tablet landscape
- **768px** - Mobile

### Gallery Images
- **1024px** - Cards grandes
- **768px** - Cards médios
- **400px** - Thumbnails

### Thumbnails
- **400px** - Preview padrão
- **300px** - Mini thumbnails

### Quadrados (1:1)
- **300px × 300px** - Avatars, logos

## Formatos de Saída

Para cada tamanho, são gerados 3 formatos:

1. **AVIF** (`.avif`) - Mais moderno, menor tamanho
2. **WebP** (`.webp`) - Suporte amplo, boa compressão
3. **JPEG** (`.jpg`) - Fallback universal

## Uso no Código

### Componente OptimizedImage

```tsx
import { OptimizedImage } from '@/components/ui/optimized-image';

// Uso básico
<OptimizedImage
  src="minha-foto" // Nome sem extensão
  alt="Descrição da imagem"
  category="gallery"
/>

// Hero image
<OptimizedImage
  src="hero-pantanal"
  alt="Vista do Pantanal"
  category="hero"
  priority={true}
  aspectRatio="16/9"
/>

// Thumbnail quadrado
<OptimizedImage
  src="avatar-chef"
  alt="Chef do lodge"
  category="square"
  aspectRatio="1/1"
/>
```

### Componente HeroImage

```tsx
import { HeroImage } from '@/components/ui/optimized-image';

<HeroImage
  src="pantanal-sunset"
  alt="Pôr do sol no Pantanal"
  overlay={true}
>
  <div className="text-center text-white">
    <h1>Bem-vindos ao Pantanal</h1>
  </div>
</HeroImage>
```

## Configurações de Qualidade

### Padrões Atuais
- **AVIF**: 65% (ótima compressão)
- **WebP**: 75% (equilíbrio qualidade/tamanho)
- **JPEG**: 75% (compatibilidade)

### Personalizar (em `scripts/image-optimizer.js`)

```javascript
const QUALITY = {
  avif: 65,  // 50-80 recomendado
  webp: 75,  // 70-85 recomendado
  jpeg: 75   // 70-85 recomendado
};
```

## Estrutura de Arquivos

```
public/images/
├── originals/           # Imagens originais (4000×2667px)
│   ├── pantanal-1.jpg
│   └── lodge-exterior.png
└── optimized/           # Imagens processadas
    ├── metadata.json    # Metadados de todas as imagens
    ├── pantanal-1-hero-1920.avif
    ├── pantanal-1-hero-1920.webp
    ├── pantanal-1-hero-1920.jpg
    ├── pantanal-1-gallery-1024.avif
    └── ...
```

## Metadados (metadata.json)

```json
[
  {
    "filename": "pantanal-1",
    "orientation": "landscape",
    "blurPlaceholder": "data:image/jpeg;base64,/9j/4AAQ...",
    "alt": "Vista panorâmica do Pantanal",
    "variants": [
      {
        "category": "hero",
        "size": 1920,
        "width": 1920,
        "height": 1280,
        "formats": {
          "avif": "/images/optimized/pantanal-1-hero-1920.avif",
          "webp": "/images/optimized/pantanal-1-hero-1920.webp",
          "jpeg": "/images/optimized/pantanal-1-hero-1920.jpg"
        },
        "fileSize": 156789
      }
    ]
  }
]
```

## Performance

### Benefícios
- **Redução de 60-80%** no tamanho dos arquivos
- **Carregamento 3x mais rápido** em conexões lentas
- **Lazy loading** automático
- **Placeholder blur** elimina layout shift

### Métricas Típicas
- **Original**: 4000×2667px, ~8MB
- **Hero AVIF**: 1920×1280px, ~200KB (97% menor)
- **Gallery WebP**: 1024×683px, ~80KB
- **Thumb JPEG**: 400×267px, ~25KB

## Troubleshooting

### Erro: "Sharp não instalado"
```bash
npm install sharp --save
```

### Erro: "Diretório não encontrado"
```bash
npm run setup-images
```

### Imagem não aparece no site
1. Verifique se `metadata.json` foi atualizado
2. Confirme que os arquivos estão em `public/images/optimized/`
3. Use o nome correto (sem extensão) no componente

### Qualidade muito baixa
Ajuste as configurações de qualidade em `scripts/image-optimizer.js`

## Boas Práticas

1. **Sempre use Alt Text** descritivo para acessibilidade
2. **Marque como priority** apenas imagens above-the-fold
3. **Use category apropriada** (hero, gallery, thumb, square)
4. **Mantenha originals** em alta resolução (4000px+)
5. **Teste em dispositivos móveis** para verificar qualidade

## API Endpoints

### Upload
```
POST /api/media/upload
Content-Type: multipart/form-data

Body:
- image: File
- isThumb: boolean
- forceSquare: boolean
- alt: string
```

### Biblioteca
```
GET /api/media/library?search=termo&limit=50&offset=0
```

### Deletar
```
DELETE /api/media/{filename}
```
