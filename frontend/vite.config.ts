import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  root: './src', 
  build: {
    rollupOptions: {
      input: '/src/index.html',
    },
  },
});

