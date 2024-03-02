import path, { resolve } from 'node:path';
import { defineConfig } from 'vite';

// the crx plugin doesn't seem to work with additional files, so we'll just build the injection library here
export default defineConfig((config) => {
  const isDev = config.mode === 'development';
  const outDir = isDev ? 'chrome-dev' : 'chrome';
  return {
    resolve: {
      alias: {
        '@devtool/frontend': path.resolve(process.cwd(), '../../packages/frontend/src/'),
      },
    },
    root: resolve(__dirname, 'src/'),
    plugins: [
      {
        name: 'wrap-in-iife',
        generateBundle(_outputOptions, bundle) {
          Object.keys(bundle).forEach((fileName) => {
            const file = bundle[fileName];
            if (fileName.slice(-3) === '.js' && 'code' in file) {
              file.code = `(() => {\n${file.code}})()`;
            }
          });
        },
      },
    ],
    build: {
      lib: {
        entry: 'inject/index.ts',
        fileName: 'index',
        formats: ['es'],
      },
      target: 'es2020',
      outDir: resolve(__dirname, `dist/${outDir}/inject`),
    },
  };
});
