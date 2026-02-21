import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite' // Adicione isso

export default defineConfig({
  plugins: [
    TanStackRouterVite(), // Precisa vir antes do react()
    react(),
  ],
})