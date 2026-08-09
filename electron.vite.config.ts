import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  main: {
    build: {
      sourcemap: true
    }
  },
  preload: {},
  renderer: {
    server: {
      port: 8800
    },
    optimizeDeps: {
      // Rerun resolves its WASM next to the package entrypoint. Keeping it
      // out of Vite's dependency bundle preserves that relative URL in dev.
      exclude: ['@rerun-io/web-viewer', '@rerun-io/web-viewer-react']
    },
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react(), tailwindcss()]
  }
})
