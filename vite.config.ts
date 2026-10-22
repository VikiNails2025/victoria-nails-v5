import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      // Ignoramos la carpeta data/: el servidor escribe ahí cada vez que se guarda un turno y, sin esto,
      // Vite recargaba la página completa en desarrollo (el modal de reserva se cerraba solo).
      watch: process.env.DISABLE_HMR === 'true' ? null : { ignored: ['**/data/**'] },
    },
  };
});