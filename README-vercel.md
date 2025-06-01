# Deploy Itaicy Eco Lodge no Vercel

Guia rápido para publicar **frontend + CMS em tempo-real** usando Vercel (hosting estático) e Supabase (backend).

---

## 1. Pré-requisitos

| Item | Valor |
|------|-------|
| Conta Vercel | plano free OK |
| Projeto Supabase | tabelas criadas via `scripts/cms-schema.sql` + bucket **media** público |
| Repositório GitHub | código Itaicy (branch `main` ou similar) |

---

## 2. Variáveis de Ambiente (Vercel → Settings → Environment Variables)

| Chave | Descrição |
|-------|-----------|
| `SUPABASE_URL` | URL do seu projeto Supabase |
| `SUPABASE_ANON_KEY` | chave **anon** pública |
| `SESSION_SECRET` | string aleatória (cookies do CMS) |
| `SITE_URL` | URL final, ex.: `https://itaicy.com.br` |
| `CLOUDFLARE_API_TOKEN`* | (opcional) purge cache |
| `CLOUDFLARE_ZONE_ID`* | (opcional) zone ID |

> *Opcional, só se quiser limpar CDN após publicar páginas.*

---

## 3. Importar no Vercel

1. Acesse **https://vercel.com/new**  
2. **Import Git Repository** → selecione `studiodeia/itaicy`  
3. Framework Preset: **Other** (ou **Vite**)  
4. Configurações de build  

| Campo | Valor |
|-------|-------|
| Build Command | `pnpm vercel:build` |
| Output Directory | `dist` |
| Install Command | `pnpm install --frozen-lockfile` |
| Root Directory | **/ (raiz do repo)** |

O arquivo `vercel.json` já trata SPA routing e headers.

---

## 4. Fluxo de Deploy

```bash
# local (opcional para testar)
pnpm install
pnpm static:build       # gera dist/
pnpm static:preview     # pré-visualiza em http://localhost:4173
```

Cada push na _main_ → **production**  
Cada pull request → **Preview Deployment**

---

## 5. Pós-Deploy

1. Acesse **/cms/login**  
2. Faça login com usuário `admin` (tabela `profiles`)  
3. Edite um bloco → **Salvar** → **Publicar**  
4. Confirme atualização instantânea em `/preview/:slug` ou na página pública.

---

## 6. Solução de Problemas

| Erro | Causa Comum | Ação |
|------|-------------|------|
| 401 Supabase | `SUPABASE_ANON_KEY` errado | Atualizar variável |
| Tela branca | SPA rewrite faltando | Verifique `vercel.json` |
| Upload 403 | bucket `media` privado | Tornar público no Supabase |
| Cache não limpa | token Cloudflare ausente | Definir `CLOUDFLARE_API_TOKEN` |

---

Pronto! Seu site e CMS Itaicy estão ao vivo no Vercel. 🎉
