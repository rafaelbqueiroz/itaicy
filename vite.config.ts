import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Carrega variáveis de ambiente com base no modo (development, production)
  const env = loadEnv(mode, process.cwd(), '')
  
  const isProduction = mode === 'production'
  
  return {
    plugins: [react()],
    
    // Base path para assets (vazio para path relativo, que funciona bem no Vercel)
    base: '/',
    
    // Configuração de build
    build: {
      // Diretório de saída compatível com Vercel
      outDir: 'dist',
      
      // Otimizações para produção
      minify: isProduction ? 'esbuild' : false,
      sourcemap: !isProduction,
      
      // Configurações para melhorar performance
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            ui: [
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-tabs',
              '@radix-ui/react-toast',
              // Outros componentes UI podem ser agrupados aqui
            ],
          },
        },
      },
      
      // Configuração para Vercel
      emptyOutDir: true,
      chunkSizeWarningLimit: 1000,
    },
    
    // Aliases de importação
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './client/src'),
        '@assets': path.resolve(__dirname, './client/public/assets'),
        '@components': path.resolve(__dirname, './client/src/components'),
        '@hooks': path.resolve(__dirname, './client/src/hooks'),
        '@lib': path.resolve(__dirname, './client/src/lib'),
        '@pages': path.resolve(__dirname, './client/src/pages'),
      },
    },
    
    // Configuração do servidor de desenvolvimento
    server: {
      // Proxy apenas para ambiente de desenvolvimento
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    
    // Configuração para preview (ambiente de teste após build)
    preview: {
      port: 5173,
      host: true,
    },
    
    // Otimizações para dependências
    optimizeDeps: {
      include: ['react', 'react-dom', 'wouter'],
      exclude: [],
    },
    
    // Configuração específica para produção
    ...(isProduction && {
      // Em produção, não precisamos de proxy porque usaremos Supabase diretamente
      server: {
        proxy: {}
      }
    })
  }
})
