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
    // Direct proxy to agent services in Kubernetes
    proxy('/agent-direct', {
      target: 'http://localhost:9100', // Port-forward fc-agent service to this port
      pathRewrite: { '^/agent-direct': '' },
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
