import { createI18n } from '@flylinking/i18n'

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n()

  vueApp.use(i18n)

  return {
    provide: {
      t: i18n.global.t,
      locale: i18n.global.locale
    }
  }
})
