# 📸 Guia de Uso - Imagens Responsivas

## 🎯 Breakpoints Implementados

O sistema de processamento de imagens agora usa os breakpoints especificados:

### **Hero Images (Full-width)**
- **Desktop:** 1920×1280 (3:2) / 1280×1920 (2:3 para portrait)
- **Tablet:** 1280×853 (3:2) / 853×1280 (2:3 para portrait)  
- **Mobile:** 768×512 (3:2) / 512×768 (2:3 para portrait)

### **Galerias e Cards**
- **Gallery:** 1024×683 (3:2) / 683×1024 (2:3 para portrait)

### **Thumbs (Preview)**
- **Thumb:** 400×267 (3:2) / 267×400 (2:3 para portrait)

### **Miniaturas**
- **Miniature:** 300×300 (1:1 sempre, crop centralizado)

## 🖼️ Como Usar o Componente ResponsiveImage

### **1. Importação**
```tsx
import { 
  ResponsiveImage, 
  HeroImage, 
  GalleryCard, 
  Thumbnail 
} from '@/components/ui/ResponsiveImage';
```

### **2. Hero Images**
```tsx
// Para banners e hero sections
<HeroImage
  variants={imageVariants}
  alt="Vista panorâmica do Pantanal"
  className="w-full h-[70vh]"
/>
```

### **3. Cards de Galeria**
```tsx
// Para galerias e cards horizontais
<GalleryCard
  variants={imageVariants}
  alt="Safari fotográfico no Pantanal"
  className="rounded-lg shadow-md"
/>
```

### **4. Thumbnails**
```tsx
// Para previews e miniaturas
<Thumbnail
  variants={imageVariants}
  alt="Miniatura da experiência"
  className="rounded-full"
/>
```

### **5. Uso Personalizado**
```tsx
<ResponsiveImage
  variants={imageVariants}
  alt="Descrição da imagem"
  usage="gallery" // 'hero' | 'gallery' | 'thumb'
  loading="lazy"
  className="custom-class"
  onLoad={() => console.log('Imagem carregada')}
  onError={() => console.log('Erro ao carregar')}
/>
```

## 🔧 Estrutura dos Dados

### **Formato das Variantes**
```typescript
interface ImageVariant {
  size: string;        // 'hero_desktop', 'gallery', 'thumb', etc.
  width: number;       // Largura em pixels
  height: number;      // Altura em pixels
  format: string;      // 'webp', 'jpeg', 'avif'
  url: string;         // URL da imagem
  fileSize: number;    // Tamanho do arquivo em bytes
}
```

### **Exemplo de Dados do CMS**
```typescript
const imageData = {
  variants: [
    // Hero Desktop
    { size: 'hero_desktop', width: 1920, height: 1280, format: 'webp', url: '...', fileSize: 85000 },
    { size: 'hero_desktop', width: 1920, height: 1280, format: 'jpeg', url: '...', fileSize: 120000 },
    
    // Hero Tablet
    { size: 'hero_tablet', width: 1280, height: 853, format: 'webp', url: '...', fileSize: 45000 },
    { size: 'hero_tablet', width: 1280, height: 853, format: 'jpeg', url: '...', fileSize: 65000 },
    
    // Gallery
    { size: 'gallery', width: 1024, height: 683, format: 'webp', url: '...', fileSize: 35000 },
    { size: 'gallery', width: 1024, height: 683, format: 'jpeg', url: '...', fileSize: 50000 },
    
    // Thumb
    { size: 'thumb', width: 400, height: 267, format: 'avif', url: '...', fileSize: 8000 },
    { size: 'thumb', width: 400, height: 267, format: 'webp', url: '...', fileSize: 12000 },
    
    // Miniature
    { size: 'miniature', width: 300, height: 300, format: 'avif', url: '...', fileSize: 6000 }
  ]
};
```

## 📱 Orientação: Landscape vs Portrait

### **Landscape (3:2) - Uso Recomendado:**
- ✅ Hero images e banners
- ✅ Cards de galeria horizontais
- ✅ Imagens de experiências
- ✅ Fotos de acomodações

### **Portrait (2:3) - Uso Recomendado:**
- ✅ Depoimentos com foto de pessoa
- ✅ Cards de equipe/staff
- ✅ Exibições verticais específicas
- ⚠️ **Evitar** em containers landscape (usar crop ou letterbox)

### **Square (1:1) - Uso Recomendado:**
- ✅ Avatares e perfis
- ✅ Ícones e logos
- ✅ Thumbnails pequenas
- ✅ Redes sociais

## 🎨 Exemplos Práticos

### **Hero Section**
```tsx
function HeroSection({ heroImage }) {
  return (
    <section className="relative">
      <HeroImage
        variants={heroImage.variants}
        alt="Pantanal - Natureza Exuberante"
        className="w-full h-[70vh] object-cover"
      />
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
        <h1 className="text-white text-4xl font-bold">
          Bem-vindo ao Pantanal
        </h1>
      </div>
    </section>
  );
}
```

### **Galeria de Experiências**
```tsx
function ExperienceGrid({ experiences }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {experiences.map((exp) => (
        <div key={exp.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <GalleryCard
            variants={exp.featured_image.variants}
            alt={exp.title}
            className="w-full h-48"
          />
          <div className="p-4">
            <h3 className="font-semibold">{exp.title}</h3>
            <p className="text-gray-600">{exp.short_description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### **Lista com Thumbnails**
```tsx
function ExperienceList({ experiences }) {
  return (
    <div className="space-y-4">
      {experiences.map((exp) => (
        <div key={exp.id} className="flex items-center gap-4">
          <Thumbnail
            variants={exp.featured_image.variants}
            alt={exp.title}
            className="flex-shrink-0"
          />
          <div>
            <h4 className="font-medium">{exp.title}</h4>
            <p className="text-sm text-gray-600">{exp.short_description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
```

## 🚀 Benefícios

### **Performance**
- ✅ **Carregamento otimizado** com lazy loading
- ✅ **Formatos modernos** (AVIF, WebP) com fallback JPEG
- ✅ **Tamanhos apropriados** para cada dispositivo
- ✅ **Bandwidth reduzido** em dispositivos móveis

### **SEO e Acessibilidade**
- ✅ **Alt text obrigatório** para acessibilidade
- ✅ **Dimensões explícitas** para evitar layout shift
- ✅ **Loading states** com placeholders
- ✅ **Error handling** para imagens quebradas

### **Responsividade**
- ✅ **Breakpoints consistentes** em todo o site
- ✅ **Proporções mantidas** (3:2, 2:3, 1:1)
- ✅ **Orientação automática** baseada na imagem original
- ✅ **Crop inteligente** para miniaturas

## 📋 Checklist de Implementação

- ✅ Breakpoints especificados implementados
- ✅ Suporte a orientação landscape/portrait
- ✅ Componente ResponsiveImage criado
- ✅ Componentes específicos (Hero, Gallery, Thumb)
- ✅ Processamento automático com Sharp
- ✅ Geração de srcset e picture elements
- ✅ Formatos AVIF, WebP e JPEG
- ✅ Loading states e error handling
- ✅ Documentação e exemplos de uso

**Status:** ✅ **SISTEMA DE IMAGENS RESPONSIVAS COMPLETO**
