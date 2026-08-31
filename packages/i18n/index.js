import { createI18n as createVueI18n } from 'vue-i18n'
import {
  messages as baseMessages,
  DEFAULT_LOCALE,
  LOCALES,
  RTL_LOCALES,
  isRTL
} from './langs/index.js'

const isPlainObject = (value) => Object.prototype.toString.call(value) === '[object Object]'

/**
 * 深合并，用于把各端扩展词条覆盖/补充到公共词条上
 */
export const deepMerge = (target, source) => {
  if (!isPlainObject(source)) return target
  const output = isPlainObject(target) ? { ...target } : {}
  Object.keys(source).forEach((key) => {
    const sourceValue = source[key]
    if (isPlainObject(sourceValue)) {
      output[key] = deepMerge(output[key], sourceValue)
    } else {
      output[key] = sourceValue
    }
  })
  return output
}

/**
 * 创建 vue-i18n 实例
 * @param {Object} options
 * @param {string} [options.locale] 默认语言，缺省 'en-US'
 * @param {Object} [options.extend] 各端扩展/覆盖词条，形如 { 'en-US': {...} }
 * @param {boolean} [options.legacy]
 * @param {boolean} [options.globalInjection] 保持 true 以支持 $t 全局注入
 */
export const createI18n = (options = {}) => {
  const {
    locale = DEFAULT_LOCALE,
    extend = {},
    legacy = false,
    globalInjection = true
  } = options

  const mergedMessages = {}
  Object.keys(baseMessages).forEach((lang) => {
    mergedMessages[lang] = deepMerge(baseMessages[lang], extend[lang])
  })
  // 处理公共词条中不存在的新增语言
  Object.keys(extend).forEach((lang) => {
    if (!mergedMessages[lang]) mergedMessages[lang] = extend[lang]
  })

  return createVueI18n({
    legacy,
    globalInjection,
    locale,
    messages: mergedMessages
  })
}

export { baseMessages as messages, DEFAULT_LOCALE, LOCALES, RTL_LOCALES, isRTL }
