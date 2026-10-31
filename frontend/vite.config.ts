
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: '/Subidha/',

  plugins: [react()],

  resolve: {
    alias: [
      {
        find: /^react-native$/,
        replacement: 'react-native-web',
      },
      {
        find: /^react-native\/(.*)$/,
        replacement: 'react-native-web/$1',
      },
      {
        find: '@',
        replacement: path.resolve(projectRoot, 'src'),
      },
    ],

    extensions: [
      '.web.tsx',
      '.web.ts',
      '.web.jsx',
      '.web.js',
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
      '.json',
    ],

    conditions: ['browser', 'module'],
  },

  define: {
    __DEV__: JSON.stringify(true),
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react-router-dom',
      'react-native-web',
    ],
    exclude: ['react-native'],
  },

  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true,
  },
});
