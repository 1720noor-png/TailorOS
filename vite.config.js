import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('pdf-lib')) {
              return 'vendor-pdf'
            }
            if (id.includes('tesseract.js')) {
              return 'vendor-ocr'
            }
            if (id.includes('jszip')) {
              return 'vendor-zip'
            }
            if (id.includes('qrcode')) {
              return 'vendor-qrcode'
            }
          }
        }
      }
    }
  }
})
