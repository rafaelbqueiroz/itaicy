# Pull Request

## 📋 Descrição
<!-- Descreva brevemente as mudanças implementadas -->

## 🔄 Tipo de Mudança
- [ ] 🐛 Bug fix (correção que resolve um problema)
- [ ] ✨ Nova funcionalidade (mudança que adiciona funcionalidade)
- [ ] 💥 Breaking change (correção ou funcionalidade que quebra compatibilidade)
- [ ] 📚 Documentação (mudanças apenas na documentação)
- [ ] 🎨 Refatoração (mudanças de código que não corrigem bugs nem adicionam funcionalidades)
- [ ] ⚡ Performance (mudanças que melhoram performance)
- [ ] 🗃️ **Mudanças de Banco de Dados** (alterações em schema, migrations, etc.)

## 🗃️ Mudanças de Banco de Dados
<!-- ⚠️ OBRIGATÓRIO preencher se marcou "Mudanças de Banco de Dados" acima -->

### Tabelas Afetadas
- [ ] `experiences`
- [ ] `accommodations` 
- [ ] `blog_posts`
- [ ] `pages`
- [ ] `media_files`
- [ ] Outras: _______________

### Tipo de Alteração
- [ ] Nova tabela criada
- [ ] Coluna adicionada
- [ ] Coluna removida
- [ ] Coluna renomeada: `antiga_coluna` → `nova_coluna`
- [ ] Tipo de dados alterado
- [ ] Índice adicionado/removido
- [ ] Constraint adicionada/removida

### Migration Criada
- [ ] ✅ Migration SQL criada em `/migrations/`
- [ ] ✅ Schema TypeScript atualizado em `/shared/schema.ts`
- [ ] ✅ Validações de API atualizadas (se aplicável)
- [ ] ✅ Testes de integração passando

### Validação Executada
- [ ] ✅ `npm run validate-schema` executado com sucesso
- [ ] ✅ `npm run health-check` executado com sucesso
- [ ] ✅ Testado localmente com banco limpo (drop + recreate)

## 🧪 Como Testar
<!-- Descreva os passos para testar as mudanças -->

1. 
2. 
3. 

## 📸 Screenshots (se aplicável)
<!-- Adicione screenshots para mudanças visuais -->

## ✅ Checklist
- [ ] Código segue os padrões do projeto
- [ ] Self-review realizado
- [ ] Comentários adicionados em código complexo
- [ ] Documentação atualizada (se necessário)
- [ ] Testes adicionados/atualizados
- [ ] Todas as verificações de CI passando
- [ ] **Se mudanças de DB**: Migration + Schema + Validações atualizados

## 🔗 Issues Relacionadas
<!-- Referencie issues relacionadas usando #numero -->

Closes #
Related to #

## 📝 Notas Adicionais
<!-- Qualquer informação adicional relevante para os revisores -->

---

### ⚠️ Para Revisores
**Se este PR contém mudanças de banco de dados:**
1. ✅ Verificar se migration está presente e bem formada
2. ✅ Confirmar que `shared/schema.ts` foi atualizado
3. ✅ Validar que rotas da API foram ajustadas (se necessário)
4. ✅ Executar `npm run validate-schema` localmente
5. ✅ Testar fluxo CRUD básico das tabelas afetadas
