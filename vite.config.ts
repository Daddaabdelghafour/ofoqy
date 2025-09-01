import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
    ],
    esbuild: {
        jsx: 'automatic',
    },
    resolve: {
        alias: {
            'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
        },
    },
    build: {
    outDir: 'public/build', // relative to resources/js
    emptyOutDir: true,
    manifest: true,
  },
    server : {
	host: '0.0.0.0',
	port: 5173,
        hmr: {
            host: '98.85.221.49',  // your EC2 public IP
            protocol: 'ws',
        },
	},
    base: process.env.VITE_URL + '/' ,
    define: {
      'import.meta.env.VITE_URL': JSON.stringify(process.env.VITE_URL),
 },
});
