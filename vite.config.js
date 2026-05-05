import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/voice': 'http://localhost:8000',
      '/data': 'http://localhost:8000',
      '/audio': 'http://localhost:8000',
    }
  }
})
