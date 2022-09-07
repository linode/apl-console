import express from 'express'
import i18next from 'i18next'
import middleware from 'i18next-http-middleware'

const app = express()
const port = 3333

const handle = middleware.missingKeyHandler(i18next)
app.use(handle)
app.post('/trans/:lng/:ns.missing.json', handle)
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())

// app.get('myRoute', (req, res) => {
//   const lng = req.language // 'de-CH'
//   const lngs = req.languages // ['de-CH', 'de', 'en']
//   req.i18n.changeLanguage('en') // will not load that!!! assert it was preloaded

//   const exists = req.i18n.exists('myKey')
//   const translation = req.t('myKey')
// })
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
