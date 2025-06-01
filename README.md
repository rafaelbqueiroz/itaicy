# Itaicy Pantanal Eco Lodge • Website + CMS em Tempo-Real

Website oficial do **Itaicy Pantanal Eco Lodge** – uma experiência única no coração do Pantanal.  
Agora com **CMS próprio** que espelha o site em tempo-real e permite edição instantânea.

---

## 🌟 Destaques Rápidos

| Área | Detalhes |
|------|----------|
| **Frontend** | React 18 + Vite + TypeScript + Tailwind + shadcn/ui |
| **Estado** | Zustand + React Query |
| **Backend (BaaS)** | Supabase (PostgreSQL + Storage + Auth + Realtime) |
| **CMS** | Edição de páginas por blocos, preview live (< 500 ms), drag-drop, biblioteca de mídia |
| **Deploy** | Vercel (estático) + Cloudflare Pages opcional para purge de cache |
| **Scripts** | `pnpm cms:*` automatizam extração, seed e testes |

---

## 📂 Estrutura do Projeto

```
.
├── client/                 # Frontend React + Vite
│   ├── src/
│   │   ├── pages/          # Rotas públicas e /cms
│   │   ├── components/     # UI e Sections
│   │   └── cms/            # Block schemas + helpers
├── scripts/                # Automação (extração, seed, setup)
├── server/                 # Express (apenas para dev)
├── docs/                   # Documentação adicional
└── vercel.json             # Configuração de deploy
```

---

## 🚀 Instalação Local

```bash
# 1. Clone
git clone https://github.com/studiodeia/itaicy.git
cd itaicy

# 2. Instale dependências
pnpm install

# 3. Copie variáveis
cp .env.example .env          # preencha SUPABASE_URL / KEY / SESSION_SECRET etc.

# 4. Setup completo (tabelas, seed, testes)
pnpm ts-node scripts/complete-setup.ts

# 5. Desenvolvimento (frontend + api dev)
pnpm dev                       # http://localhost:5173
```

> **Dica:** use `pnpm static:build && pnpm static:preview` para pré-visualizar produção local.

---

## 🗂️ CMS – Como Funciona

1. **Estrutura de Página**  
   Cada página (`pages`) possui *blocos* (`blocks`) ordenados por `position`.  
   Campos:  
   `payload` – rascunho • `published` – produção.

2. **Interface**  
   - Sidebar com árvore de páginas.  
   - Lista de blocos (drag-drop).  
   - Form gerado por **Zod schemas** → nada de JSON manual.  
   - Preview live (`/preview/:slug`).

3. **Biblioteca de Mídia**  
   Upload via drag-drop (até 50 MB) → Supabase Storage (bucket **media**).  
   Metadados editáveis (*alt*, caption).  
   Picker embutido nos formulários.

4. **Publicação**  
   `Publicar` copia `payload → published` e dispara **Realtime** + purge de cache (Cloudflare opcional).

Scripts úteis:

| Script | Descrição |
|--------|-----------|
| `pnpm cms:setup`   | Executa *complete-setup* |
| `pnpm cms:extract` | Crawleia site e gera JSON de blocos |
| `pnpm cms:seed`    | Popula Supabase com dados extraídos |
| `pnpm cms:test`    | Rodada rápida de testes de CMS |

---

## 🌍 Deploy no Vercel

> Deploy 100 % estático; Supabase lida com dados em tempo-real.

### 1. Variáveis (Vercel → Settings → Environment Variables)

| Chave | Valor de Exemplo |
|-------|------------------|
| `SUPABASE_URL` | `https://abc.supabase.co` |
| `SUPABASE_ANON_KEY` | `eyJ…` |
| `SESSION_SECRET` | `itaicy-secret` |
| `SITE_URL` | `https://itaicy.com.br` |
| `CLOUDFLARE_API_TOKEN`* | `<opcional>` |
| `CLOUDFLARE_ZONE_ID`* | `<opcional>` |

### 2. Configuração de Build

`vercel.json` já incluso:

```json
{
  "version": 2,
  "buildCommand": "pnpm vercel:build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Na importação do repo marque:

| Campo | Valor |
|-------|-------|
| Framework | **Other** (ou **Vite**) |
| Build Command | `pnpm vercel:build` |
| Output Dir | `dist` |

### 3. Fluxo

1. Push na branch `main` → Vercel builda e publica.  
2. Each PR cria *Preview Deployment*.  
3. Acesse `/cms/login` e gerencie conteúdo em tempo-real.

---

## 🧪 Testes Rápidos

```bash
# Conexão Supabase, blocos e preview
pnpm cms:test
```

---

## 📝 Licença

Projeto proprietário do **Itaicy Pantanal Eco Lodge**.  
Uso e distribuição restritos.

---

Desenvolvido com ❤️ para o Pantanal – _“Viva o Pantanal autêntico.”_
