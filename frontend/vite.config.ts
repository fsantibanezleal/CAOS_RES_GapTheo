import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router', 'react-router-dom'],
          shell: ['@fasl-work/caos-app-shell', 'katex'],
          icons: ['lucide-react'],
        },
      },
    },
  },
  test: {
    environment: 'node',
    globals: true,
  },
});
