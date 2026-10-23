import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    sourcemap: true,
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'react'
          if (id.includes('@tanstack/react-router')) return 'router'
          if (id.includes('@tanstack/react-query')) return 'query'
          if (id.includes('node_modules/axios')) return 'http'
        },
      },
    },
  },
})
