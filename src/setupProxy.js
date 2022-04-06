const proxy = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    proxy('/api', {
      target: 'http://localhost:8080',
      pathRewrite: { '^/api/': '/' },
    }),
    proxy('/trans', {
      target: 'http://localhost:3333',
    }),
  )
}
