const proxy = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    proxy('/api/ws', {
      target: 'ws://localhost:8080',
      ws: true,
      changeOrigin: true,
      logLevel: 'debug',
      pathRewrite: { '^/api/ws': '/ws' },
    }),
    proxy('/agent', {
      target: 'http://localhost:9099',
      pathRewrite: { '^/agent': '' },
      changeOrigin: true,
    }),
    proxy('/api', {
      target: 'http://localhost:8080',
      pathRewrite: { '^/api/': '/' },
    }),
    proxy('/trans', {
      target: 'http://localhost:3333',
    }),
  )
}
