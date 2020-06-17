const proxy = require('http-proxy-middleware')

module.exports = function proxy(app) {
  app.use(
    proxy('/api', { target: `http://${process.env.PUBLIC_URL || 'localhost:8080'}`, pathRewrite: { '^/api/': '/' } }),
  )
}
