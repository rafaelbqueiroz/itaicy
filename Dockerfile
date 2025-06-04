# Development stage
FROM node:18-slim as development

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Expose ports
EXPOSE 3000
EXPOSE 5173

# Start development server
CMD ["pnpm", "dev"]

# Production stage
FROM node:18-slim as production

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies
RUN pnpm install --prod

# Copy built assets
COPY --from=development /app/dist ./dist

# Expose production port
EXPOSE 3000

# Start production server
CMD ["pnpm", "start"]
