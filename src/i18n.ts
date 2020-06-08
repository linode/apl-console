import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { Keys } from './translations/keys'

type TranslationKeys = keyof typeof Keys
type TranslationResources = {
  [lang: string]: {
    translation: {
      [key in TranslationKeys]: string
    }
  }
}

const resources: TranslationResources = {
  en: {
    translation: {
      CREATE_MODEL: 'Create a {{model}}',
      WELCOME_DASHBOARD: 'Welcome to the team <1>{{teamName}}</1> dashboard!',
      SELECT_TEAM: 'Select a team to create {{model}}',
      CREATE_MODEL_FOR_TEAM: 'Create a {{model}} for team {{teamName}}',
    },
  },
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

export default i18n
