import ar from './ar.js'
import deDE from './de-DE.js'
import enUS from './en-US.js'
import esES from './es-ES.js'
import frFR from './fr-FR.js'
import itIT from './it-IT.js'
import jaJP from './ja-JP.js'
import koKR from './ko-KR.js'
import ptPT from './pt-PT.js'
import ruRU from './ru-RU.js'
import viVN from './vi-VN.js'
import zhCN from './zh-CN.js'
import heIL from './he-IL.js'

export const DEFAULT_LOCALE = 'en-US'

export const messages = {
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
  'he-IL': heIL
}

export const LOCALES = Object.keys(messages)

// 需要从右向左（RTL）排布的语言
export const RTL_LOCALES = ['ar', 'he-IL']

export const isRTL = (locale) => RTL_LOCALES.indexOf(locale) !== -1
