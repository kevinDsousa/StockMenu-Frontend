import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [
    // Use a função sem o sufixo ou apenas a chamada direta se as versões forem as mais novas
    TanStackRouterVite({
      autoCodeSplitting: true,
    }),
    react(),
  ],
})