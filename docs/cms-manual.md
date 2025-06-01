# Manual do CMS – Itaicy Pantanal Eco Lodge

Este documento descreve **tudo** que você precisa para instalar, configurar e operar o CMS em tempo-real que espelha o site `itaicy.com.br`.

---

## 1. Visão Geral

| Área | Valor |
|------|-------|
| **Stack** | React 18 + Vite + Tailwind + shadcn/ui • Zustand • Supabase (PostgreSQL/Storage/Auth/Realtime) |
| **Objetivo** | Permitir que equipe e administradores editem qualquer página, bloco ou mídia e vejam o resultado **instantaneamente** no site público. |
| **Modo de Trabalho** | Cada página é composta por *blocos* armazenados na tabela `blocks`. Campos `payload` (rascunho) e `published` (publicado) garantem edição segura. Realtime Channels replicam alterações em < 500 ms. |

---

## 2. Instalação Local

1. **Pré-requisitos**
   - Node >= 18, pnpm >= 8
   - Conta Supabase com projeto provisionado
   - Bucket público chamado `media`
   - Variáveis de ambiente em `.env`:

     ```
     SUPABASE_URL=🟢 URL do projeto
     SUPABASE_ANON_KEY=🟢 Chave anon
     SESSION_SECRET=qualquer-string-segura
     ```

2. **Clonar & instalar**

   ```bash
   git clone https://github.com/studiodeia/itaicy.git
   cd itaicy
   pnpm install
   ```

3. **Criar schema no Supabase**

   No SQL Editor cole todo o conteúdo de `scripts/cms-schema.sql` e execute.

4. **Extrair conteúdo do site e popular o banco**

   ```bash
   pnpm ts-node scripts/extract-site.ts       # gera extracted-content/
   pnpm ts-node scripts/seed-supabase.ts      # popula pages, blocks, media
   ```

5. **Rodar em desenvolvimento**

   ```bash
   pnpm dev          # inicia frontend (5173) e backend (3000)
   open http://localhost:5173
   ```

---

## 3. Configuração (Ambientes)

| Ambiente | URL | Variável `NODE_ENV` | Notas |
|----------|-----|---------------------|-------|
| Local    | `localhost:5173` | `development` | Hot-reload habilitado |
| Staging  | `staging.itaicy.com.br` | `preview` | Branchs de PR | 
| Produção | `itaicy.com.br` | `production` | Cloudflare Pages + Purge API |

**Pós-deploy**: o hook `purgeCache(slug)` (scripts/cloudflare.ts) limpa o CDN sempre que uma página é publicada.

---

## 4. Uso do CMS

### 4.1 Login

1. Acesse `/cms/login`.
2. Autentique-se com usuário **admin** (tabela `profiles.role = 'admin'`).
3. Após sucesso, você verá o **Dashboard** `/cms/home`.

### 4.2 Estrutura da Interface

```
┌──────────────┐  Top-Bar: Preview | Publicar | Sair
│  Sidebar     │
│ • Páginas    │
│ • Mídia      │
└──────────────┘  Painel Direito
                  ├─ Lista de Blocos (drag-drop)
                  └─ Formulário de Edição (tabs Conteúdo / Estilo / SEO)
```

### 4.3 Editando Blocos

1. Clique em uma página na árvore.
2. Selecione um bloco → formulário gera campos dinamicamente (Zod schemas).
3. `Salvar` grava no campo `payload` (rascunho).
4. `Publicar` copia `payload` → `published` e dispara:
   - Realtime broadcast
   - Purge cache da rota

### 4.4 Reordenação

Arraste blocos na lista lateral. A posição é salva otimisticamente (`PATCH /blocks/:id position`).

### 4.5 Preview em Tempo Real

- Botão **Preview** abre iframe `/preview/:slug`.
- Cada `UPDATE` em `blocks` é recebido via channel `blocks-{page_id}` e re-renderiza em < 500 ms.
- Parâmetro `draft=false` exibe apenas versão publicada.

### 4.6 Publicar Página Inteira

Clique **Publicar** na Top-Bar. O CMS:
1. Itera todos os blocos da página.
2. Copia `payload → published`.
3. Atualiza `updated_at`.
4. Purge cache Cloudflare.

---

## 5. Gerenciamento de Mídia

1. Rota `/cms/media`.
2. **Upload**: arraste arquivos (até 50 MB) ou clique.
3. **Metadados**: editar *alt* e *caption* via diálogo.
4. **Deleção** segura: remove do Storage e da tabela `media_library`.
5. **Picker**: em qualquer campo `imageSrc`/`videoSrc` use **Selecionar** para abrir biblioteca.

---

## 6. Sistema de Blocos

| Tipo (`block_type`) | Descrição | Arquivo React |
|---------------------|-----------|---------------|
| `hero-video` | Vídeo full bleed com sobreposição e CTA | `components/sections/hero-video.tsx` |
| `hero-image` | Hero estático com imagem | `hero-image.tsx` |
| `split-block` | Texto + imagem lado a lado | `split-block.tsx` |
| `feature-blocks` | Cartões de recurso em grade | `feature-blocks.tsx` |
| `stats-ribbon` | Faixa de números estáticos | `stats-ribbon.tsx` |
| `counters-ribbon` | Contadores animados | `counters-ribbon.tsx` |
| `testimonials` | Depoimentos | `testimonials.tsx` |
| `gallery` | Grade/Masonry/Carousel | `gallery.tsx` |
| `blog-grid` | Últimos posts | `blog-grid.tsx` |
| `newsletter` | Captura de email | `newsletter.tsx` |
| `contact-form` | Formulário genérico | `contact-form.tsx` |
| `lodge-overview` | Destaques do lodge | `lodge-overview.tsx` |
| `highlights` | Lista simples de ícones | `highlights.tsx` |
| ... | Fácil adicionar novos – basta: 1) criar schema Zod, 2) componente React, 3) registrar no `BlockRenderer`. |

---

## 7. SEO e Blog

- Aba **SEO** por bloco ou página: `metaTitle`, `metaDescription`, `ogImage`.
- Tabela `posts` + editor Markdown (`react-mde`).
- Função edge `/sitemap.xml` gera URLs dinâmicas.

---

## 8. Troubleshooting

| Sintoma | Possível causa | Solução |
|---------|---------------|---------|
| Bloco “Não renderizado” no preview | Schema faltando ou payload inválido | Verificar `cms/schemas/index.ts`, consertar campos obrigatórios |
| Upload falha com 401 | Supabase policy ou chave errada | Conferir RLS (`role = admin`) e `.env` |
| Preview lento (> 1 s) | Canal Realtime inativo | Checar Logs Supabase → Realtime, inscrever de novo |
| Página não purge após publish | Variável `CLOUDFLARE_API_TOKEN` ausente | Adicionar no `.env` e verificar `scripts/cloudflare.ts` |
| Formulário “Salvar” não habilita | Nenhum campo modificado | Alterar algo ou limpar cache do navegador |
| Erro 426 ao rodar scripts `.ts` | Node < 18 ou ts-node ausente | `pnpm add -D ts-node` e atualizar Node |

---

## 9. Referências Rápidas

```bash
# Executar todos os scripts auxiliares
pnpm ts-node scripts/setup-cms-dependencies.ts
pnpm ts-node scripts/extract-site.ts
pnpm ts-node scripts/seed-supabase.ts
pnpm ts-node scripts/test-cms.ts
```

---

**Pronto!** Sua equipe agora possui um CMS de nível “best-in-class” para o Itaicy. Qualquer dúvida consulte este manual ou abra issue no repositório.
