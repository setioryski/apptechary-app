import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'
import { fileURLToPath } from 'url'

// Helper to get the directory name of the current module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      manifest: {
        name: 'Apothecary POS',
        short_name: 'ApothecaryPOS',
        description: 'Modern Point of Sale system for Apothecaries',
        theme_color: '#0284c7',
        background_color: "#ffffff",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      }
    }
  },
  optimizeDeps: {
    include: ['xlsx', 'file-saver'],
  },
  resolve: {
    alias: {
      // Pointing to the absolute path of the module files
      'xlsx': path.resolve(__dirname, 'node_modules/xlsx/xlsx.mjs'),
      'file-saver': path.resolve(__dirname, 'node_modules/file-saver/dist/FileSaver.min.js')
    }
  }
})