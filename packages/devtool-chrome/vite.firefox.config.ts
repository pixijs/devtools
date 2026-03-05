import react from '@vitejs/plugin-react-swc';
import fs from 'fs';
import path, { resolve } from 'node:path';
import { defineConfig } from 'vite';

import manifest from './manifest.firefox.json';
import pkg from './package.json';

export default defineConfig((config) => {
  const isDev = config.mode === 'development';
  const publicDir = resolve(__dirname, './assets');
  const outDir = resolve(__dirname, isDev ? 'dist/firefox-dev' : 'dist/firefox');

  return {
    root: resolve(__dirname, 'src/'),
    resolve: {
      alias: {
        '@devtool/frontend': path.resolve(process.cwd(), '../../packages/frontend/src/'),
        '@devtool/backend': path.resolve(process.cwd(), '../../packages/backend/src/'),
      },
    },
    plugins: [
      react(),
      {
        // Strip crossorigin attributes — unnecessary in extension contexts
        // and can cause silent loading failures
        name: 'strip-module-attrs',
        transformIndexHtml: {
          order: 'post',
          handler(html: string) {
            return html.replace(/ crossorigin/g, '');
          },
        },
      },
      {
        name: 'firefox-manifest-and-devtools',
        writeBundle() {
          // Write Firefox manifest
          const firefoxManifest = {
            ...manifest,
            version: pkg.version,
          };
          fs.writeFileSync(path.resolve(outDir, 'manifest.json'), JSON.stringify(firefoxManifest, null, 2));

          // Write static devtools page at root (Firefox requires root-level devtools_page)
          // Must use classic script, not module
          fs.writeFileSync(
            path.resolve(outDir, 'devtools.html'),
            '<!DOCTYPE html>\n<html>\n<head><script src="devtools.js"></script></head>\n</html>\n',
          );
        },
      },
    ],
    publicDir,
    // Extension pages don't need crossorigin or modulepreload
    base: './',
    build: {
      outDir,
      sourcemap: isDev,
      modulePreload: false,
      crossOriginLoading: false,
      rollupOptions: {
        input: {
          panel: resolve(__dirname, 'src/devtools/panel/panel.html'),
        },
        output: {
          // Keep assets alongside HTML for simpler relative paths
          assetFileNames: 'assets/[name]-[hash].[ext]',
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
        },
      },
    },
  };
});
