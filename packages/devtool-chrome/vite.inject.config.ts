import { resolve } from 'node:path';
import { defineConfig } from 'vite';

import { resolveAliases, wrapInIife } from './vite.shared';

// the crx plugin doesn't seem to work with additional files, so we'll just build the injection library here
export default defineConfig((config) => {
  const isDev = config.mode === 'development';
  const outDir = isDev ? 'chrome-dev' : 'chrome';
  return {
    resolve: {
      alias: resolveAliases,
    },
    root: resolve(__dirname, 'src/'),
    plugins: [wrapInIife()],
    build: {
      lib: {
        entry: ['inject/index.ts', 'inject/close.ts'],
        fileName: 'index',
        formats: ['es'],
      },
      target: 'es2020',
      outDir: resolve(__dirname, `dist/${outDir}/inject`),
    },
  };
});
