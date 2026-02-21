import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// A forma correta agora é importar o objeto 'TanStackRouterVite' 
// mas usá-lo como um plugin genérico se necessário, ou ajustar a importação:
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [
    // Se a função direta ainda der erro, a versão mais nova do plugin 
    // costuma ser usada assim:
    TanStackRouterVite(),
    react(),
  ],
})