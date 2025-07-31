const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    '/api/ws',
    createProxyMiddleware({
      target: 'ws://localhost:8080',
      ws: true,
      changeOrigin: true,
      logLevel: 'debug',
      pathRewrite: { '^/api/ws': '/ws' },
    }),
  )

  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      pathRewrite: { '^/api/': '/' },
    }),
  )

  app.use(
    '/trans',
    createProxyMiddleware({
      target: 'http://localhost:3333',
    }),
  )
}
