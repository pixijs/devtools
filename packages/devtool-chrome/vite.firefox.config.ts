import react from '@vitejs/plugin-react-swc';
import fs from 'fs';
import path, { resolve } from 'node:path';
import { defineConfig } from 'vite';

import manifest from './manifest.firefox.json';
import pkg from './package.json';
import { resolveAliases } from './vite.shared';

export default defineConfig((config) => {
  const isDev = config.mode === 'development';
  const publicDir = resolve(__dirname, './assets');
  const outDir = resolve(__dirname, isDev ? 'dist/firefox-dev' : 'dist/firefox');

  return {
    root: resolve(__dirname, 'src/'),
    resolve: {
      alias: resolveAliases,
    },
    plugins: [
      react(),
      {
        name: 'firefox-manifest-and-devtools',
        writeBundle() {
          // Write Firefox manifest
          const firefoxManifest = {
            ...manifest,
            version: pkg.version,
          };
          fs.writeFileSync(path.resolve(outDir, 'manifest.json'), JSON.stringify(firefoxManifest, null, 2));

          // Write devtools page with a classic script tag (not type="module")
          fs.writeFileSync(
            path.resolve(outDir, 'devtools.html'),
            '<!DOCTYPE html>\n<html>\n<head><script src="devtools.js"></script></head>\n</html>\n',
          );
        },
      },
    ],
    publicDir,
    base: './',
    build: {
      outDir,
      sourcemap: isDev,
      rollupOptions: {
        input: {
          panel: resolve(__dirname, 'src/devtools/panel/panel.html'),
        },
      },
    },
  };
});
