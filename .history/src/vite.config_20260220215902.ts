import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Mude a importação para usar o plugin genérico
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [
    // Se o aviso persistir, a versão mais recente recomenda passar o framework explicitamente
    TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
    react(),
  ],
})