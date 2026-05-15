import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Skip TypeScript checking during build
      include: '**/*.{jsx,tsx}',
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api/grok': {
        target: 'https://api.x.ai',
        changeOrigin: true,
        rewrite: (_path) => '/v1/chat/completions',
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            const key = process.env.VITE_GROK_API_KEY || process.env.GROK_API_KEY || ''
            if (key) proxyReq.setHeader('Authorization', `Bearer ${key}`)
          })
        },
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: true,
    // Ensure correct base path for production
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
  base: '/',
  esbuild: {
    // Ignore TypeScript errors during build
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
});
