import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: 'src/views',
  server: {
    port: 5173,
  },
  publicDir: path.resolve(__dirname, 'src'),
});
