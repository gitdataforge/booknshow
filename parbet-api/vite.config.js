import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

/**
 * FEATURE: Enterprise-Grade React/Vite Compiler Config
 * This configuration ensures that JSX is properly transpiled and 
 * minified for production deployment on Vercel Edge.
 */
export default defineConfig({
  plugins: [
    // Enables Fast Refresh and JSX support
    react()
  ],
  resolve: {
    alias: {
      // Allows for clean imports using '@/' instead of relative paths
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    // Standard Vercel output directory
    outDir: 'dist',
    // Generates source maps for debugging (optional, can be disabled for privacy)
    sourcemap: true,
    // Ensures the build is optimized for modern browsers
    target: 'esnext',
    // Cleans the output directory before each build
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // Chunks vendor libraries (React, Firebase) to improve loading speed
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'firebase', 'framer-motion'],
        },
      },
    },
  },
  server: {
    // Port 5175 for local development
    port: 5175,
    // Prevents issues when running inside nested environments
    host: true,
    strictPort: true,
  }
});