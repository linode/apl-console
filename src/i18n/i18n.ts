/* eslint-disable @typescript-eslint/no-unsafe-argument */
import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'
import { memo } from 'react'
import { initReactI18next } from 'react-i18next'
import common from './trans/common.json'
import error from './trans/error.json'

const isDev = process.env.NODE_ENV === 'development'

export const availableLanguages = {
  en: 'english',
  de: 'german',
}
export const defaultNS = 'common'
export const resources = {
  en: {
    common,
    error,
  },
} as const

// also extract keys into a map for lookups
const keyMapper = (memo, key) => {
  memo[key] = key
  return memo
}
export const c: Record<string, string> = Object.keys(common).reduce(keyMapper, memo)
export const e: Record<string, string> = Object.keys(error).reduce(keyMapper, memo)

// eslint-disable-next-line @typescript-eslint/no-floating-promises
i18next
  // learn more: https://github.com/i18next/i18next-http-backend
  .use(new Backend())
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // passes i18next down to react-i18next
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    backend: {
      loadPath: '/i18n/{{lng}}/{{ns}}.json',
      addPath: '/trans/{{lng}}/{{ns}}.missing.json',
      requestOptions: {
        cache: isDev ? 'no-store' : 'default',
      },
    },
    // debug: isDev,
    ns: 'common',
    defaultNS: 'common',
    fallbackLng: 'en',
    load: 'languageOnly',
    keySeparator: false, // we do not use keys in form messages.welcome
    nsSeparator: false,
    interpolation: {
      escapeValue: false, // react already saves us from xss
    },
  })
