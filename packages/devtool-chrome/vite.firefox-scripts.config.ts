import path, { resolve } from 'node:path';
import { defineConfig } from 'vite';

// Build script groups individually to prevent code splitting.
// Set ENTRY env var to: 'background', 'content', 'inject', or 'devtools'
const entryGroup = process.env.ENTRY || 'background';

const entryMap: Record<string, Record<string, string>> = {
  background: {
    'background/index': resolve(__dirname, 'src/background/index.ts'),
  },
  content: {
    'content/index': resolve(__dirname, 'src/content/index.ts'),
  },
  inject: {
    'inject/index': resolve(__dirname, 'src/inject/index.ts'),
    'inject/index2': resolve(__dirname, 'src/inject/close.ts'),
  },
  devtools: {
    devtools: resolve(__dirname, 'src/devtools/devtools.ts'),
  },
};

export default defineConfig((config) => {
  const isDev = config.mode === 'development';
  const outDir = isDev ? 'firefox-dev' : 'firefox';
  const input = entryMap[entryGroup];

  if (!input) {
    throw new Error(`Unknown ENTRY group: ${entryGroup}. Use 'background', 'content', or 'inject'.`);
  }

  return {
    resolve: {
      alias: {
        '@devtool/frontend': path.resolve(process.cwd(), '../../packages/frontend/src/'),
        '@devtool/backend': path.resolve(process.cwd(), '../../packages/backend/src/'),
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
      rollupOptions: {
        input,
        output: {
          format: 'es',
          entryFileNames: '[name].js',
        },
      },
      target: 'es2020',
      outDir: resolve(__dirname, `dist/${outDir}`),
    },
  };
});
