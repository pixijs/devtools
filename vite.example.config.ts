import { resolve } from 'path';
import { defineConfig } from 'vite';

const publicDir = resolve(__dirname, 'src/example/assets');
const outDir = resolve(__dirname, 'dist/example');

export default defineConfig({
  root: resolve(__dirname, 'src/example'),
  resolve: {
    alias: {
      '@lib': resolve(__dirname, 'src/lib'),
      '@chrome': resolve(__dirname, 'src/chrome'),
    },
  },
  publicDir,
  build: {
    outDir,
    sourcemap: true,
  },
});
