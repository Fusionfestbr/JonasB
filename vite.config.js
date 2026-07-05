import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  // Configuração para Multi-Page Application (MPA)
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ingresso: resolve(__dirname, 'ingresso.html'),
        admin: resolve(__dirname, 'admin.html'),
      },
      output: {
        // Remove o hash dos arquivos para não quebrar seu Service Worker manual
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`
      }
    },
    assetsDir: 'build-assets',
    // Garante que o build limpe a pasta dist antes de começar
    emptyOutDir: true,
  },
  server: {
    open: true,
  },
});

