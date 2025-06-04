# 🔐 Configuração do Usuário Admin - Itaicy CMS

## 📋 Resumo das Alterações Realizadas

### ✅ 1. Logo da Itaicy Adicionado
- **Localização**: Tela de login do CMS (`/cms`)
- **Arquivo**: `client/src/cms/components/LoginForm.tsx`
- **Logo usado**: `/attached_assets/itaicy-wordmark-primary.png`
- **Resultado**: O logo da Itaicy agora aparece acima do título "Itaicy CMS"

### ✅ 2. Informações de Login Atualizadas
- **Usuários de teste configurados**:
  - **Admin**: `robson@itaicy.com.br`
  - **Editor**: `editor@itaicy.com.br`
- **Senha sugerida**: `itaicy123`

## 🚀 Como Configurar o Usuário Admin

### Passo 1: Acessar o Supabase Dashboard
1. Acesse: https://supabase.com/dashboard
2. Faça login na sua conta
3. Selecione o projeto: `hcmrlpevcpkclqubnmmf`

### Passo 2: Criar Usuários no Authentication
1. No painel lateral, clique em **"Authentication"**
2. Clique na aba **"Users"**
3. Clique no botão **"Add user"**

### Passo 3: Criar o Usuário Admin
**Dados para o Admin:**
- **Email**: `robson@itaicy.com.br`
- **Password**: `itaicy123`
- **Email Confirm**: ✅ (marcar como confirmado)
- **Auto Confirm User**: ✅ (marcar)

### Passo 4: Criar o Usuário Editor (Opcional)
**Dados para o Editor:**
- **Email**: `editor@itaicy.com.br`
- **Password**: `itaicy123`
- **Email Confirm**: ✅ (marcar como confirmado)
- **Auto Confirm User**: ✅ (marcar)

### Passo 5: Verificar Tabela CMS Users
1. No Supabase, vá em **"Table Editor"**
2. Procure pela tabela **"cms_users"**
3. Verifique se os usuários estão listados:
   - `robson@itaicy.com.br` com role `admin`
   - `editor@itaicy.com.br` com role `editor`

## 🔧 Solução de Problemas

### Se a tabela cms_users não existir:
```bash
# Execute o setup do Sprint 1
cd ItaicyEcoLodge
node scripts/setup-sprint1.mjs
```

### Se os usuários não estiverem na tabela cms_users:
Execute este SQL no Supabase SQL Editor:

```sql
-- Inserir usuários na tabela cms_users
INSERT INTO cms_users (email, name, role, active) VALUES
('robson@itaicy.com.br', 'Robson Silva', 'admin', true),
('editor@itaicy.com.br', 'Editor de Teste', 'editor', true)
ON CONFLICT (email) DO UPDATE SET 
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  updated_at = now();
```

## 🌐 Testando o Login

1. **Acesse**: http://localhost:5000/cms
2. **Faça login com**:
   - **Email**: `robson@itaicy.com.br`
   - **Senha**: `itaicy123`

## 📁 Arquivos Modificados

1. **`client/src/cms/components/LoginForm.tsx`**
   - Adicionado logo da Itaicy
   - Atualizado informações de usuários de teste
   - Adicionado instruções de configuração

2. **`scripts/setup-admin-user.mjs`** (criado)
   - Script para automatizar criação de usuários
   - Atualmente com limitações de permissão

## 🎯 Próximos Passos

1. ✅ Logo da Itaicy implementado
2. ✅ Instruções de configuração criadas
3. 🔄 **Pendente**: Configurar usuários no Supabase Dashboard
4. 🔄 **Pendente**: Testar login com credenciais

## 📞 Suporte

Se encontrar problemas:
1. Verifique se o servidor está rodando: `npm run dev`
2. Confirme as variáveis de ambiente no `.env`
3. Verifique se o Supabase está acessível
4. Execute o setup: `node scripts/setup-sprint1.mjs`

---

**Desenvolvido para Itaicy Pantanal Eco Lodge**  
*CMS v1.0 - Sprint 1*
