const proxy = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    proxy('/api', {
      target: `http://${process.env.API_BASE_URL || 'localhost:8080'}`,
      pathRewrite: { '^/api/': '/' },
    }),
    proxy('/v1', {
      target: `http://${process.env.WEB_BASE_URL || 'localhost:8081'}`,
    }),
  )
}
