import { crx, ManifestV3Export } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

import { resolve } from 'path';
import pkg from './package.json';
import devManifest from './src/chrome/manifest.dev.json';
import manifest from './src/chrome/manifest.json';

export default defineConfig((config) => {
  const publicDir = resolve(__dirname, 'src/chrome/assets');
  const outDir = resolve(__dirname, 'dist/chrome');
  const isDev = config.mode === 'development';
  const extensionManifest = {
    ...manifest,
    ...(isDev ? devManifest : ({} as ManifestV3Export)),
    name: isDev ? `DEV: ${manifest.name}` : manifest.name,
    version: pkg.version,
  };

  return {
    root: resolve(__dirname, 'src/chrome'),
    resolve: {
      alias: {
        '@lib': resolve(__dirname, 'src/lib'),
        '@chrome': resolve(__dirname, 'src/chrome'),
      },
    },
    plugins: [
      react(),
      crx({
        manifest: extensionManifest as ManifestV3Export,
        contentScripts: {
          injectCss: true,
        },
      }),
    ],
    publicDir,
    build: {
      outDir,
      sourcemap: isDev,
      rollupOptions: {
        input: {
          panel: resolve(__dirname, 'src/chrome/src/devtools/panel/panel.html'),
        },
      },
    },
    server: {
      port: 10808,
    },
  };
});
