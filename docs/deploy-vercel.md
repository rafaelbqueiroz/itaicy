# Guia de Deploy no Vercel  
Itaicy Pantanal Eco Lodge · CMS em Tempo-Real

> Este documento explica passo-a-passo como publicar **frontend + CMS** no [Vercel](https://vercel.com) usando Supabase como backend. Tempo estimado: **15 min**.

---

## 1. Visão Geral

| Item | Valor |
|------|-------|
| Frontend | React 18 + Vite (pasta `client`) |
| Build | `vite build` → pasta `dist/` |
| Backend | Supabase (`pages`/`blocks`/`media`) |
| Deploy | Vercel Hosting (Static / SPA) |
| Roteamento | `vercel.json` com rewrites para SPA |
| Preview | `/preview/:slug` (tempo-real via Supabase Realtime) |

A aplicação roda **100 % estática** em produção; todas as APIs vêm diretamente do Supabase.  
O servidor Express (`server/`) é usado **apenas em desenvolvimento** → não é enviado ao Vercel.

---

## 2. Pré-requisitos

1. Conta Vercel (free plan é suficiente).  
2. Projeto Supabase já provisionado com:
   - Bucket público **media**.
   - Tabelas criadas via `scripts/cms-schema.sql`.
3. Repositório GitHub com código Itaicy (branch `main` ou `cms-completo-tempo-real`).

---

## 3. Variáveis de Ambiente

Crie estas chaves na aba **Settings → Environment Variables** do projeto Vercel:

| Chave | Descrição | Exemplo |
|-------|-----------|---------|
| `SUPABASE_URL` | URL do projeto Supabase | `https://abc.supabase.co` |
| `SUPABASE_ANON_KEY` | Chave `anon` pública | `eyJ...` |
| `SESSION_SECRET` | String aleatória usada pelo CMS (Auth cookie) | `itaicy-session-secret` |
| `SITE_URL` | URL final (sem `/`) | `https://itaicy.com.br` |
| `CLOUDFLARE_API_TOKEN` | Token para purge de cache (opcional) | `…` |
| `CLOUDFLARE_ZONE_ID` | Zone ID do domínio (opcional) | `…` |

> ⚠️ **Não** defina `DATABASE_URL`; em produção usamos apenas Supabase.

---

## 4. Passos de Configuração

### 4.1 Importar Repositório

1. Acesse **https://vercel.com/new**  
2. Clique **“Import Git Repository”** → escolha `studiodeia/itaicy`.  
3. Nomeie o projeto (`itaicy-web`).  

### 4.2 Configurações de Build

| Campo | Valor |
|-------|-------|
| Framework Preset | `Other` (ou `Vite`) |
| **Build Command** | `pnpm vercel:build` |
| **Output Directory** | `dist` |
| Install Command | `pnpm install --frozen-lockfile` |

O arquivo `vercel.json` já cuida de:
```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
Isso garante **SPA routing** (qualquer rota cai em `index.html`) e permite futura adição de funções em `/api/*`.

### 4.3 Configurar Variáveis

Cole cada variável listada na seção 3 em **Vercel → Project → Settings → Environment Variables**  
Selecione **Production** e **Preview** para todas.

### 4.4 Deploy

Clique **“Deploy”**.  
Primeiro build levará ~2 min. Ao final, Vercel mostrará a URL de produção (`https://itaicy-web.vercel.app`) — atualize **DNS** para apontar seu domínio.

---

## 5. Pós-Deploy

1. Abra `https://<seu-domínio>/cms/login`  
2. Faça login com usuário _admin_ cadastrado no Supabase (`profiles.role = 'admin'`).  
3. Edite um bloco → **Salvar** → **Publicar** → verifique alteração em tempo-real.  
4. Acesse `/preview/home` para confirmar live update.

---

## 6. Troubleshooting

| Sintoma | Possível causa | Solução |
|---------|---------------|---------|
| Build falha `Cannot find module 'vite'` | Cache limpo ou lock desatualizado | Refazer `pnpm install`; garanta `pnpm` no pipeline |
| Tela branca em produção | `vercel.json` ausente ou build output errado | Confirme existe `vercel.json` na raiz e `dist/` contém `index.html` |
| 404 em rotas internas | Rewrites faltando | Validar `vercel.json` SPA rewrite `/(.*) → /index.html` |
| API Supabase 401 | `SUPABASE_ANON_KEY` incorreta | Copie novamente a chave no dashboard Supabase |
| Upload falha (403) | Bucket `media` privado | No Supabase Storage marque bucket `media` como **Public** |
| Mudanças não aparecem | Cache Cloudflare não purgado | Configure `CLOUDFLARE_API_TOKEN` e verifique função `purgeCache()` |

---

## 7. Otimizações Recomendadas

| Área | Ação |
|------|------|
| **Imagens** | Ativar “Images Optimization” no Vercel; usar WebP/AVIF |
| **Edge Cache** | Usar `Cache-Control` headers (já incluído em `vercel.json`) |
| **Bundle** | `vite.config.ts` agrupa `react` e libs UI em chunks separados |
| **Env Secreta** | Marcar `SESSION_SECRET` como _Encrypted_ em Vercel |
| **Preview URLs** | Cada Pull Request gera _Preview Deployment_ automático |

---

## 8. Atualização do CMS

Para atualizar código:

```bash
git checkout -b feat/nova-funcionalidade
# edite arquivos…
git commit -am "feat: novo bloco testimonials-carousel"
git push origin feat/nova-funcionalidade
```

Abra Pull Request → Vercel gera preview.  
Ao mergear na `main`, produção será re-deployada automaticamente.

---

## 9. Referências Rápidas

```bash
# Build local de produção
pnpm static:build && pnpm static:preview

# Setup completo (primeira vez)
pnpm cms:setup
```

---

**Parabéns!** Seu site e CMS Itaicy agora rodam em produção no Vercel com live preview e edição em tempo-real. Qualquer dúvida abra uma issue ou consulte `docs/cms-manual.md`.
