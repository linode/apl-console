const proxy = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    proxy('/api', {
      target: `http://${process.env.API_BASE_URL || 'localhost:8080'}`,
      pathRewrite: { '^/api/': '/' },
    }),
  )
}
