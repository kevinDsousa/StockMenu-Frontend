import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Altere para a importação unificada do plugin
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [
    // O plugin agora é invocado desta forma para garantir compatibilidade futura
    TanStackRouterVite({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
  ],
})