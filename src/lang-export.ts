#!/usr/bin/env node --nolazy --loader ts-node/esm
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/await-thenable */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import glob from 'glob'
// import fetch from 'node-fetch'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const patt = `${__dirname}/i18n/trans/**.json`
// const langs = ['de', 'nl']
const langs = ['de']

const main = function () {
  glob(patt, {}, async (err, res) => {
    await Promise.all(
      res.map(async (file) => {
        const obj = JSON.parse(readFileSync(file, 'utf8'))
        if (process.env.IMPORT) {
          await Promise.all(
            langs.map(async (l) => {
              // const url = `https://translate.google.com/?sl=en&tl=${l}&text=${encodeURIComponent(content)}&op=translate`
              // console.log(url)
              // const response = await fetch(url, {
              //   headers: {
              //     'user-agent':
              //       'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.60 Safari/537.36',
              //   },
              // })
              // const ret = await response.text()
              // console.log(ret)
              // await sleep(2000)
              const newLoc = file.replace('i18n/trans', `i18n/import/${l}`).replace('.json', '.txt')
              const langDir = dirname(newLoc)
              if (!existsSync(langDir)) mkdirSync(langDir)
              if (!existsSync(newLoc)) return
              // we have new imports, merge back
              const importCnt = `["${readFileSync(newLoc, 'utf8')
                .replaceAll('"', '\\"')
                .replace(/(?:\r\n|\r|\n)/g, '","')}"]`
              const ret = JSON.parse(importCnt)
              const imp = {}
              Object.keys(obj).forEach((key, idx) => {
                if (ret[idx]) imp[key] = ret[idx]
              })
              const finalLoc = file.replace('i18n/trans', `i18n/export/${l}`)
              const finLangDir = dirname(finalLoc)
              if (!existsSync(finLangDir)) mkdirSync(finLangDir)
              console.log(`writing to final destination: ${finalLoc}`)
              const cnt = JSON.stringify(imp, undefined, 2)
              writeFileSync(finalLoc, cnt)
            }),
          )
          return
        }
        // export
        const values = Object.values(obj)
        const content = values.join('\n')
        writeFileSync(file.replace('i18n/trans', 'i18n/dump').replace('.json', '.txt'), content)
      }),
    )
  })
}

;(() => {
  main()
})()
