import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: { port: 5174, strictPort: true },

  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei'],
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2015',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'motion':       ['framer-motion'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'charts':       ['recharts'],
          'ui':           ['lucide-react', 'react-hot-toast'],
          'state':        ['zustand'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
