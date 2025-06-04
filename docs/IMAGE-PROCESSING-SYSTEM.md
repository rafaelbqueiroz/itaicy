# 🖼️ Sistema de Processamento Automático de Imagens

## Visão Geral

O Itaicy Eco Lodge implementa um sistema avançado de processamento automático de imagens que gera múltiplos breakpoints e formatos (AVIF, WebP, JPEG) com detecção automática de orientação e opções de thumbnail.

## ✨ Funcionalidades Implementadas

### 🎯 **Processamento Automático**
- **Detecção de orientação** - Paisagem vs Retrato automático
- **Múltiplos breakpoints** - 5 tamanhos responsivos por orientação
- **3 formatos** - AVIF, WebP, JPEG com fallback
- **Thumbnail opcional** - Versão 300×300 com crop centralizado
- **Compressão otimizada** - Qualidade adaptativa por tamanho

### 📐 **Breakpoints Gerados**

#### Paisagem (Landscape)
| Tamanho | Dimensões | Uso |
|---------|-----------|-----|
| XL | 1920×1280 | Hero desktop |
| LG | 1280×853 | Desktop |
| MD | 1024×683 | Tablet |
| SM | 768×512 | Mobile |
| XS | 400×267 | Thumbnail |

#### Retrato (Portrait)
| Tamanho | Dimensões | Uso |
|---------|-----------|-----|
| XL | 1280×1920 | Hero mobile |
| LG | 853×1280 | Mobile |
| MD | 683×1024 | Tablet |
| SM | 512×768 | Small mobile |
| XS | 267×400 | Thumbnail |

#### Thumbnail Quadrado (Opcional)
| Tamanho | Dimensões | Uso |
|---------|-----------|-----|
| THUMB | 300×300 | Avatares, previews |

## 🛠️ Arquitetura do Sistema

### Backend (Node.js + Express)

#### 1. **ImageProcessor Service**
```typescript
// server/services/imageProcessor.ts
class ImageProcessor {
  - detectOrientation(buffer): 'landscape' | 'portrait'
  - getBreakpoints(orientation, options): ImageBreakpoint[]
  - processImage(buffer, filename, options): ProcessedImage
  - processBreakpoint(buffer, breakpoint, isSquare): Variants[]
}
```

#### 2. **API Routes**
```typescript
// server/routes/media.ts
POST   /api/media/upload     - Upload e processamento
GET    /api/media/library    - Listar biblioteca
DELETE /api/media/:id        - Deletar item
GET    /api/media/srcset/:id - Gerar srcset
```

#### 3. **Database Schema**
```sql
-- Tabela media_library aprimorada
ALTER TABLE media_library ADD COLUMN:
- original_url TEXT           -- URL da imagem original
- filename TEXT              -- Nome do arquivo
- file_size INTEGER          -- Tamanho em bytes
- mime_type TEXT             -- Tipo MIME
- variants JSONB             -- Array de variantes
- processing_completed BOOLEAN -- Status do processamento
- orientation TEXT           -- landscape/portrait
- is_thumb BOOLEAN           -- Se tem thumbnail
- metadata JSONB             -- Metadados extras
```

### Frontend (React + TypeScript)

#### 1. **OptimizedImage Component**
```tsx
// Componente original com fallback AVIF → WebP → JPEG
<OptimizedImage
  src="url"
  alt="alt text"
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

#### 2. **ResponsiveImage Component**
```tsx
// Novo componente que usa variantes do processamento
<ResponsiveImage
  variants={imageVariants}
  originalUrl="fallback"
  alt="alt text"
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

#### 3. **MediaImage Component**
```tsx
// Componente que carrega por ID da biblioteca
<MediaImage
  imageId="uuid"
  className="w-full h-auto"
  sizes={responsiveSizes.grid3}
/>
```

#### 4. **Enhanced MediaLibrary**
- ✅ Dialog de configuração de upload
- ✅ Opções: isThumb, forceSquare, alt text
- ✅ Preview das variantes geradas
- ✅ Badges de status (orientação, thumbnail, processamento)
- ✅ Informações de tamanho e economia

## 🔧 Configuração e Uso

### 1. **Dependências Instaladas**
```bash
npm install @squoosh/lib sharp multer @types/multer
```

### 2. **Variáveis de Ambiente**
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
```

### 3. **Upload via CMS**
1. Acesse: `http://localhost:5000/cms`
2. Vá para "Biblioteca de Mídia"
3. Clique em "Enviar Imagem"
4. Configure opções:
   - ✅ Gerar thumbnail
   - ✅ Forçar formato quadrado
   - 📝 Texto alternativo
5. Clique em "Processar Imagem"

### 4. **Upload via API**
```javascript
const formData = new FormData();
formData.append('image', file);
formData.append('isThumb', 'true');
formData.append('forceSquare', 'false');
formData.append('alt', 'Descrição da imagem');

fetch('/api/media/upload', {
  method: 'POST',
  body: formData
});
```

## 📊 Performance e Otimização

### Economia de Espaço
- **AVIF**: 50-70% menor que JPEG
- **WebP**: 30-50% menor que JPEG
- **Múltiplos tamanhos**: Serve apenas o necessário

### Exemplo de Resultado
```
Imagem original: 2.5MB (2000×1333)
Variantes geradas: 15 arquivos
Tamanho total: 1.2MB
Economia: 52%

Formatos:
- 5 variantes AVIF (300KB total)
- 5 variantes WebP (450KB total)
- 5 variantes JPEG (450KB total)
```

## 🎨 Uso nos Componentes

### FeatureBlocks
```tsx
<OptimizedImage
  src={feature.image}
  alt={feature.title}
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### Galeria
```tsx
<ResponsiveImage
  variants={item.variants}
  originalUrl={item.original_url}
  alt={item.alt}
  sizes={responsiveSizes.gallery}
/>
```

### Testimonials
```tsx
<OptimizedImage
  src={testimonial.avatar}
  alt={testimonial.author}
  width={48}
  height={48}
  sizes="48px"
/>
```

## 🧪 Testes

### 1. **Teste Manual via Interface**
Acesse: `http://localhost:5000/test-image-processing.html`

### 2. **Teste via Script**
```bash
npx zx scripts/test-image-processing.mjs
```

### 3. **Teste de Compatibilidade**
Acesse: `http://localhost:5000/test-image-formats.html`

## 🔍 Debugging

### Logs do Servidor
```
🖼️ Processando imagem: 1234567890_abc123.jpg
📐 Opções: isThumb=true, forceSquare=false
  📐 Processando xl (1920×1280)
    ✅ AVIF - 45.2 KB
    ✅ WebP - 67.8 KB
    ✅ JPEG - 89.1 KB
✅ Processamento concluído: 18 variantes geradas
```

### Verificar Banco
```sql
SELECT 
  filename,
  orientation,
  is_thumb,
  jsonb_array_length(variants) as variant_count,
  processing_completed
FROM media_library 
ORDER BY created_at DESC;
```

## 🚀 Próximos Passos

### Melhorias Planejadas
1. **Progressive Loading** - Blur placeholder
2. **Lazy Loading Avançado** - Intersection Observer
3. **CDN Integration** - Cloudflare Images
4. **Batch Processing** - Upload múltiplo
5. **Image Optimization** - Análise de qualidade automática

### Integração com CMS
- ✅ Upload configurável
- ✅ Preview de variantes
- ✅ Seleção de formato preferido
- 🔄 Editor de crop manual
- 🔄 Filtros e ajustes

## 📝 Notas Importantes

- **Compatibilidade**: Fallback garantido para todos os navegadores
- **Performance**: Lazy loading e sizes responsivos
- **SEO**: Atributos alt e estrutura semântica preservados
- **Acessibilidade**: Todos os recursos mantidos
- **Escalabilidade**: Sistema preparado para CDN e cache
