import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    outDir: 'build',
  },
  define: {
    __COMMIT_HASH__: JSON.stringify(process.env.COMMIT_REF || 'dev'),
  },
});
