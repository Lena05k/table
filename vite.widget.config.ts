import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

/**
 * Сборка виджета в отдельный JS-файл для встраивания в легаси-страницы.
 * Запуск: npx vite build --config vite.widget.config.ts
 */
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': resolve(__dirname, '.') },
  },
  build: {
    outDir: 'dist-widget',
    lib: {
      entry: resolve(__dirname, 'widget.ts'),
      name: 'VueDpDocumentsTable',
      fileName: 'vue-dp-documents-table',
      formats: ['iife'],  // IIFE — работает как <script> без модульной системы
    },
    rollupOptions: {
      // Vue не выносим в external — бандлим всё в один файл
    },
  },
})
