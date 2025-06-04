# Sprint 5 - Performance & Core Web Vitals

## Objetivo
Ajustar performance (Core Web Vitals), implementar Lighthouse CI no pipeline e adicionar RUM (web-vitals) no site público.

## Metas de Performance
- **LCP (Largest Contentful Paint)**: ≤ 2.5s
- **FID (First Input Delay)**: ≤ 100ms
- **CLS (Cumulative Layout Shift)**: ≤ 0.1
- **TBT (Total Blocking Time)**: ≤ 200ms
- **Lighthouse Score**: ≥ 90 (Performance, A11Y, SEO)

## Implementações

### 1. CSS Crítico e Carregamento Assíncrono
- ✅ Extração de CSS crítico por template
- ✅ Injeção inline no `<head>`
- ✅ Carregamento assíncrono do CSS restante
- ✅ Preload de recursos críticos

### 2. JavaScript Code-Splitting e Otimização
- ✅ Separação de bundles (CMS vs Site Público)
- ✅ Scripts com `defer` e `async`
- ✅ Carregamento dinâmico de dependências não-críticas
- ✅ Tree-shaking e minificação

### 3. Lazy Loading e Imagens Responsivas
- ✅ `<picture>` com AVIF/WebP/JPEG
- ✅ `loading="lazy"` para imagens below-the-fold
- ✅ Atributos `sizes` apropriados
- ✅ Placeholders blur para UX

### 4. Lighthouse CI Pipeline
- ✅ GitHub Actions com Lighthouse CI
- ✅ Testes em múltiplas páginas
- ✅ Baseline de performance (90/100)
- ✅ Notificações de falhas

### 5. RUM (Real User Monitoring)
- ✅ Web Vitals tracking
- ✅ Endpoint `/api/vitals` para coleta
- ✅ Dashboard de métricas no CMS
- ✅ Alertas automáticos

## Estrutura de Arquivos

```
performance/
├── critical-css/           # CSS crítico por template
│   ├── home.css
│   ├── accommodations.css
│   ├── experiences.css
│   ├── gastronomy.css
│   └── blog.css
├── web-vitals/            # Sistema RUM
│   ├── client.ts          # Coleta no frontend
│   ├── server.ts          # API endpoint
│   └── dashboard.tsx      # Dashboard CMS
├── lighthouse/            # Lighthouse CI
│   ├── lighthouserc.js    # Configuração
│   └── ci.yml             # GitHub Actions
└── optimization/          # Utilitários
    ├── bundle-analyzer.ts
    ├── critical-css-extractor.ts
    └── performance-monitor.ts
```

## Breakpoints de Imagem

```typescript
const IMAGE_BREAKPOINTS = {
  mobile: '(max-width: 768px) 100vw',
  tablet: '(max-width: 1280px) 50vw', 
  desktop: '33vw'
};

const SIZES_BY_USAGE = {
  hero: '100vw',
  gallery: '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw',
  card: '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw',
  thumb: '(max-width: 768px) 50vw, 200px'
};
```

## Configuração Vite para Performance

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          cms: ['@cms/**'],
          ui: ['@radix-ui/**']
        }
      }
    },
    cssCodeSplit: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
});
```

## Web Vitals Thresholds

```typescript
const VITALS_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  TTFB: { good: 800, poor: 1800 }
};
```

## Lighthouse CI Configuração

```javascript
module.exports = {
  ci: {
    collect: {
      url: [
        'https://staging.itaicy.com.br/',
        'https://staging.itaicy.com.br/acomodacoes',
        'https://staging.itaicy.com.br/experiencias',
        'https://staging.itaicy.com.br/gastronomia',
        'https://staging.itaicy.com.br/blog'
      ],
      numberOfRuns: 3
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }]
      }
    }
  }
};
```

## Monitoramento e Alertas

### Dashboard Métricas
- Médias e percentis de LCP/FID/CLS
- Gráficos temporais (7d, 30d)
- Breakdown por página/dispositivo
- Comparação com thresholds

### Alertas Automáticos
- Email/Slack se >10% usuários com CLS > 0.1
- Notificação se LCP médio > 3s por 1h
- Alerta se FID P95 > 200ms

## Performance Budget

```json
{
  "budget": [
    {
      "path": "/**",
      "timings": [
        { "metric": "first-contentful-paint", "budget": 2000 },
        { "metric": "largest-contentful-paint", "budget": 2500 },
        { "metric": "cumulative-layout-shift", "budget": 0.1 }
      ],
      "resourceSizes": [
        { "resourceType": "script", "budget": 150 },
        { "resourceType": "total", "budget": 500 }
      ]
    }
  ]
}
```

## Checklist de Implementação

### Fase 1: CSS e JavaScript
- [ ] Extrair CSS crítico por template
- [ ] Configurar carregamento assíncrono
- [ ] Implementar code-splitting
- [ ] Otimizar bundles

### Fase 2: Imagens e Assets
- [ ] Implementar lazy loading universal
- [ ] Otimizar picture elements
- [ ] Configurar preload de recursos críticos
- [ ] Implementar placeholders

### Fase 3: Monitoramento
- [ ] Configurar Web Vitals tracking
- [ ] Implementar endpoint de coleta
- [ ] Criar dashboard de métricas
- [ ] Configurar alertas

### Fase 4: CI/CD
- [ ] Configurar Lighthouse CI
- [ ] Integrar com GitHub Actions
- [ ] Definir performance budget
- [ ] Configurar notificações

## Resultados Esperados

### Antes vs Depois
```
Métrica          | Antes  | Meta   | Melhoria
-----------------|--------|--------|----------
LCP              | 4.2s   | ≤2.5s  | -40%
FID              | 180ms  | ≤100ms | -44%
CLS              | 0.15   | ≤0.1   | -33%
Lighthouse Score | 72     | ≥90    | +25%
Bundle Size      | 250KB  | ≤150KB | -40%
```

### ROI Esperado
- **Conversão**: +15% (melhoria UX)
- **SEO**: +20% (Core Web Vitals)
- **Bounce Rate**: -25% (performance)
- **Mobile Experience**: +30% (otimizações)
