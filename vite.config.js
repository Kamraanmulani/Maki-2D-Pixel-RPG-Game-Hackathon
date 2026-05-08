import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  publicDir: 'assets',
  build: {
    outDir: 'dist'
  },
  server: {
    port: 3000,
    open: true
  }
})
