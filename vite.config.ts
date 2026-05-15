import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.CI ? '/ds881-devmarket-2026-1-n/' : '/',
  plugins: [
    tailwindcss(),
    react()
  ]
})
