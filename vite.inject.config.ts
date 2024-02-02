import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// the crx plugin doesn't seem to work with additional files, so we'll just build the injection library here
export default defineConfig({
  root: resolve(__dirname, 'src/chrome'),
  plugins: [],
  build: {
    lib: {
      entry: 'src/inject/index.ts',
      fileName: 'index',
      formats: ['es'],
    },
    outDir: resolve(__dirname, 'dist/chrome/src/inject'),
  },
});
