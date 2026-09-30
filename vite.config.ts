import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ command, mode }) => ({
  base: command === 'build' ? '##CONTEXT_PATH##/' : '/',
  build: {
    outDir: 'build',
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
    'process.env.CONTEXT_PATH': JSON.stringify(process.env.CONTEXT_PATH || ''),
  },
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 3000,
    proxy: {
      '/api/ws': {
        target: 'ws://localhost:8080',
        ws: true,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ws/, '/ws'),
      },
      '/api': {
        target: 'http://localhost:8080',
        rewrite: (path) => path.replace(/^\/api\//, '/'),
      },
      '/trans': {
        target: 'http://localhost:3333',
      },
    },
  },
}))
