# Itaicy Pantanal Eco Lodge

Um website moderno e responsivo para o Itaicy Pantanal Eco Lodge, construído com React, TypeScript, Tailwind CSS e um CMS completo integrado.

## 🌟 Características

- **Design Responsivo**: Otimizado para todos os dispositivos
- **CMS Completo**: Sistema de gerenciamento de conteúdo em tempo real
- **Performance Otimizada**: Core Web Vitals otimizados (LCP ≤ 2.5s, CLS ≤ 0.1, FID < 100ms)
- **SEO Avançado**: Meta tags dinâmicas, JSON-LD, sitemap automático
- **Processamento de Imagens**: Otimização automática para AVIF/WebP/JPEG
- **Multilíngue**: Suporte para Português e Inglês
- **Acessibilidade**: Seguindo as melhores práticas WCAG

## 🚀 Tecnologias

### Frontend
- **React 18** com TypeScript
- **Tailwind CSS** para estilização
- **Vite** como build tool
- **Radix UI** para componentes acessíveis
- **Framer Motion** para animações
- **React Hook Form** para formulários

### Backend & CMS
- **Node.js** com Express
- **Supabase** como banco de dados PostgreSQL
- **Drizzle ORM** para queries type-safe
- **Sharp** para processamento de imagens
- **JWT** para autenticação

### Performance & SEO
- **Lighthouse CI** para monitoramento
- **Web Vitals** para métricas de performance
- **Critical CSS** extraction
- **Image optimization** com múltiplos formatos

## 📦 Instalação

### Requisitos
- Node.js 18+
- npm ou pnpm
- PostgreSQL (local ou Supabase)

### 1. Clone e Configure

```bash
# Clone o repositório
git clone [URL_DO_REPOSITORIO]
cd ItaicyEcoLodge

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais do Supabase
```

### 2. Configuração do Banco

```bash
# Execute as migrações do banco
npm run db:migrate

# Popule o banco com dados iniciais
npm run db:seed
```

### 3. Inicie o Desenvolvimento

```bash
# Inicia o servidor de desenvolvimento
npm run dev

# Acesse:
# Website: http://localhost:5173
# CMS: http://localhost:5173/cms
```

## 🏗️ Estrutura do Projeto

```
ItaicyEcoLodge/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── hooks/          # Custom hooks
│   │   └── lib/            # Utilitários
├── server/                 # Backend Node.js
│   ├── api/               # Rotas da API
│   ├── services/          # Serviços (auth, storage, etc.)
│   └── routes/            # Definições de rotas
├── shared/                # Código compartilhado
│   └── schema.ts          # Schemas do banco de dados
├── scripts/               # Scripts de setup e migração
├── docs/                  # Documentação
└── performance/           # Configurações de performance
```

## 🎛️ CMS (Sistema de Gerenciamento)

O CMS oferece funcionalidades completas para gerenciar o conteúdo:

### Funcionalidades
- **Páginas**: Criação e edição de páginas com blocos dinâmicos
- **Experiências**: Gestão de atividades e pacotes
- **Acomodações**: Gerenciamento de quartos e suítes
- **Blog**: Sistema completo de blog com categorias
- **Gastronomia**: Cardápios e pratos especiais
- **Mídia**: Biblioteca de imagens com otimização automática
- **SEO**: Gestão de meta tags, JSON-LD e redirects

### Acesso ao CMS
- **URL**: `/cms`
- **Usuário padrão**: `admin@itaicy.com`
- **Senha padrão**: `admin123` (altere após primeiro acesso)

## 📱 Páginas do Website

- **Home**: Hero com vídeo, destaques e informações principais
- **Lodge**: Acomodações e facilidades
- **Experiências**: Safaris, birdwatching, pesca esportiva
- **Gastronomia**: Culinária pantaneira e internacional
- **Blog**: Artigos sobre natureza e sustentabilidade
- **Galeria**: Fotos do lodge e da fauna local
- **Contato**: Formulário e informações de localização

## 🎨 Design System

### Cores
- **Primary**: Verde Pantanal (#22c55e)
- **Secondary**: Terra (#a3a3a3)
- **Accent**: Dourado (#fbbf24)

### Tipografia
- **Headings**: Inter (peso 600-700)
- **Body**: Inter (peso 400-500)
- **Hierarchy**: H1 (3xl), H2 (2xl), H3 (xl), H4 (lg)

### Componentes
- Biblioteca completa de componentes UI
- Variantes consistentes (primary, secondary, outline)
- Estados interativos (hover, focus, disabled)

## 🔧 Scripts Disponíveis

### Desenvolvimento
- `npm run dev`: Servidor de desenvolvimento
- `npm run build`: Build de produção
- `npm run preview`: Preview da build

### Banco de Dados
- `npm run db:migrate`: Executa migrações
- `npm run db:seed`: Popula dados iniciais
- `npm run db:studio`: Interface visual do banco

### Performance
- `npm run lighthouse`: Auditoria de performance
- `npm run vitals`: Coleta métricas Web Vitals
- `npm run optimize`: Otimização de imagens

### CMS
- `npm run cms:setup`: Configuração inicial do CMS
- `npm run cms:reset`: Reset completo dos dados

## 📈 Performance

### Métricas Alvo
- **LCP**: ≤ 2.5s (Largest Contentful Paint)
- **CLS**: ≤ 0.1 (Cumulative Layout Shift)
- **FID**: < 100ms (First Input Delay)
- **Lighthouse**: 90+ em todas as categorias

### Otimizações
- **Imagens**: AVIF/WebP com fallback JPEG
- **CSS**: Critical CSS inline, resto lazy-loaded
- **JavaScript**: Code splitting e tree shaking
- **Fonts**: Preload de fontes críticas
- **CDN**: Assets servidos via CDN

## 🌐 SEO

### Funcionalidades
- **Meta Tags**: Dinâmicas por página
- **Open Graph**: Cards para redes sociais
- **JSON-LD**: Schema.org markup
- **Sitemap**: Geração automática
- **Redirects**: Gestão de 301/302

### Monitoramento
- Google Search Console integrado
- Relatórios de performance SEO
- Sugestões automáticas de melhorias

## 🖼️ Processamento de Imagens

### Formatos Suportados
- **AVIF**: Formato moderno, máxima compressão
- **WebP**: Fallback para navegadores compatíveis
- **JPEG**: Fallback universal

### Tamanhos Gerados
- **Hero**: 1920×1280, 1280×853, 768×512
- **Cards**: 1024×683
- **Thumbnails**: 400×267
- **Quadradas**: 300×300

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Variáveis de Ambiente
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key (opcional)
```

## 🔒 Segurança

- **Autenticação**: JWT com refresh tokens
- **Autorização**: Roles (Admin, Editor, Redator)
- **Validação**: Schemas Zod em todas as entradas
- **Sanitização**: XSS protection
- **Rate Limiting**: Proteção contra spam

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

- **Email**: contato@itaicyecolodge.com.br
- **Website**: [www.itaicyecolodge.com.br](https://www.itaicyecolodge.com.br)
- **Documentação**: [/docs](./docs/)

---

**Desenvolvido com ❤️ para o Pantanal**
