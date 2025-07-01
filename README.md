# Itaicy Eco Lodge - CMS e Website

## Visão Geral

Este repositório contém o código-fonte do website e sistema de gerenciamento de conteúdo (CMS) para o Itaicy Eco Lodge, um eco-resort localizado no Pantanal brasileiro. O projeto utiliza uma arquitetura moderna com Payload CMS, React, e Supabase.

## Estrutura do Projeto

O projeto está organizado da seguinte forma:

```
ItaicyEcoLodge/
  ├── client/               # Frontend em React
  │   ├── public/           # Arquivos estáticos
  │   └── src/              # Código-fonte React
  ├── server/               # Backend com Payload CMS
  │   ├── cms/              # Configurações do Payload CMS
  │   │   ├── blocks/       # Blocos de conteúdo reutilizáveis
  │   │   ├── collections/  # Coleções do CMS
  │   │   └── shared/       # Componentes compartilhados
  │   ├── routes/           # Rotas da API
  │   └── services/         # Serviços do backend
  ├── scripts/              # Scripts de utilidade
  └── docs/                 # Documentação
```

## Sprints Concluídos

### Sprint 1: Configuração Básica do Payload CMS

- ✅ Configuração base do Payload CMS
- ✅ Conexão com PostgreSQL via Supabase
- ✅ Sistema de autenticação
- ✅ Configuração do editor Lexical
- ✅ Implementação das coleções principais (Users, Media, Pages)
- ✅ Configuração de localização (PT/EN/ES)

Detalhes: [Relatório de Conclusão do Sprint 1](./SPRINT1-COMPLETION-REPORT.md)

### Sprint 2: Coleções Específicas e Sistema de Blocos

- ✅ Implementação da coleção Gastronomy
- ✅ Criação de blocos avançados:
  - Carousel: Carrossel de imagens com múltiplas opções
  - Tabs: Sistema de abas com layouts flexíveis
  - ContactForm: Formulário de contato personalizável
- ✅ Componentes frontend para renderização dos blocos
- ✅ Integração com o sistema de páginas existente

Detalhes: [Relatório de Conclusão do Sprint 2](./SPRINT2-COMPLETION-REPORT.md)

## Próximos Passos

### Sprint 3: Migração de Dados e Testes

- Desenvolvimento de scripts de migração
- Sistema de validação e rollback
- Testes de integração
- Hooks para processamento de dados específicos
- Sistema de versionamento de conteúdo

## Tecnologias Utilizadas

- **Frontend**: React, TypeScript, Tailwind CSS
- **CMS**: Payload CMS
- **Backend**: Node.js, Express
- **Banco de Dados**: PostgreSQL via Supabase
- **Editor**: Lexical (Rich Text)
- **Imagens**: Sistema de otimização e processamento

## Instalação e Execução

### Pré-requisitos

- Node.js 16+
- PostgreSQL ou Supabase
- Variáveis de ambiente configuradas

### Instalação

1. Clone o repositório
   ```
   git clone https://github.com/seu-usuario/ItaicyEcoLodge.git
   cd ItaicyEcoLodge
   ```

2. Instale as dependências
   ```
   npm install
   ```

3. Configure as variáveis de ambiente
   ```
   cp .env.example .env
   ```
   Edite o arquivo `.env` com suas configurações

4. Execute o projeto em modo de desenvolvimento
   ```
   npm run dev
   ```

## Documentação Adicional

- [Configuração do Payload CMS](./docs/PAYLOAD-CMS-SETUP.md)
- [Sistema de Imagens](./docs/IMAGE-PROCESSING-SYSTEM.md)
- [Resumo do Sprint 1](./docs/SPRINT1-SETUP-SUMMARY.md)
