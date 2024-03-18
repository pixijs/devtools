import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@devtool/frontend': path.resolve(process.cwd(), '../../packages/frontend/src/'),
    },
  },
});
