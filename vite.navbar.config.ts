import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': resolve(__dirname, '.') },
  },
  build: {
    outDir: 'dist-navbar',
    lib: {
      entry: resolve(__dirname, 'widget.navbar.ts'),
      name: 'VueAppNavbar',
      fileName: 'vue-app-navbar',
      formats: ['iife'],
    },
  },
})
