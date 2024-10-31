import { createI18n } from 'vue-i18n'
import en from './locales/en.js'
import es from './locales/es.js'

const userLocale = navigator.language || 'en'
const i18n = createI18n({
  locale: userLocale.startsWith('es') ? 'es' : 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    es,
  },
})

export default i18n
