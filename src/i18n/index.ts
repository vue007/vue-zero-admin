import { createI18n } from 'vue-i18n'
import { generateI18nMsg } from './_helper'

import { baseLang as base } from './base.lang'
import { docLang as doc } from './doc.lang'

const messages = generateI18nMsg({
  base,
  doc,

  // 可以追加其他模块
})

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',

  globalInjection: true,
  legacy: false,
  silentFallbackWarn: true,
  missingWarn: false,
  fallbackWarn: false,
  messages,
})

export default i18n
