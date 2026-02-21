import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Importe o novo nome correto
import { tanstackRouter } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [
    // Use o novo nome. O warning vai sumir na hora!
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
  ],
})