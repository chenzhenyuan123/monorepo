import { createI18n } from 'vue-i18n'

import ar from './langs/ar.js'
import deDE from './langs/de-DE.js'
import enUS from './langs/en-US.js'
import esES from './langs/es-ES.js'
import frFR from './langs/fr-FR.js'
import itIT from './langs/it-IT.js'
import jaJP from './langs/ja-JP.js'
import koKR from './langs/ko-KR.js'
import ptPT from './langs/pt-PT.js'
import ruRU from './langs/ru-RU.js'
import viVN from './langs/vi-VN.js'
import zhCN from './langs/zh-CN.js'
import heIL from './langs/he-IL.js'

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'en-US',
    messages: {
      ar: ar,
      'de-DE': deDE,
      'en-US': enUS,
      'es-ES': esES,
      'fr-FR': frFR,
      'it-IT': itIT,
      'ja-JP': jaJP,
      'ko-KR': koKR,
      'pt-PT': ptPT,
      'ru-RU': ruRU,
      'vi-VN': viVN,
      'zh-CN': zhCN,
      'he-IL': heIL,
    }
  })

  vueApp.use(i18n)

  return {
    provide: {
      t: i18n.global.t,
      locale: i18n.global.locale
    }
  }
})