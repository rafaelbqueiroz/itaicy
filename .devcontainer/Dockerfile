FROM mcr.microsoft.com/devcontainers/typescript-node:1-20-bullseye

# Instalar ferramentas adicionais
RUN apt-get update && apt-get install -y \
    git \
    curl \
    wget \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Configurar variáveis de ambiente
ENV NODE_ENV=development
ENV SHELL=/bin/bash
ENV LANG=pt_BR.UTF-8

# Definir diretório de trabalho
WORKDIR /workspaces/itaicy

# Habilitar pnpm
RUN corepack enable

# Copiar arquivos do projeto
COPY . .

# Instalar dependências
RUN pnpm install

# Expor portas
EXPOSE 3000 5173

# Comando padrão
CMD ["pnpm", "dev"]
