import path from 'node:path';
import type { Plugin } from 'vite';

export const resolveAliases = {
  '@devtool/frontend': path.resolve(process.cwd(), '../../packages/frontend/src/'),
  '@devtool/backend': path.resolve(process.cwd(), '../../packages/backend/src/'),
};

export function wrapInIife(): Plugin {
  return {
    name: 'wrap-in-iife',
    generateBundle(_outputOptions, bundle) {
      Object.keys(bundle).forEach((fileName) => {
        const file = bundle[fileName];
        if (fileName.slice(-3) === '.js' && 'code' in file) {
          file.code = `(() => {\n${file.code}})()`;
        }
      });
    },
  };
}
