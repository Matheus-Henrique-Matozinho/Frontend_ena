// vite.config.js

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import path from 'path' // <-- 1. IMPORTE O MÓDULO 'path' DO NODE

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
  ],
  resolve: { // <-- 2. ADICIONE ESTA SEÇÃO 'resolve'
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})