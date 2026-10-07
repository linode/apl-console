import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const normalizeContextPath = (value?: string): string => {
  if (!value) return ''

  const trimmed = value.trim().replace(/^\/+|\/+$/g, '')
  return trimmed ? `/${trimmed}` : ''
}

export default defineConfig(({ command, mode }) => {
  const runtimeContextPath = normalizeContextPath(process.env.CONTEXT_PATH)

  return {
    base: command === 'build' ? '/##CONTEXT_PATH_SEGMENT##' : '/',
    build: {
      outDir: 'build',
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.CONTEXT_PATH': JSON.stringify(command === 'build' ? '##CONTEXT_PATH##' : runtimeContextPath),
    },
    plugins: [react()],
    resolve: {
      tsconfigPaths: true,
    },
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
  }
})
