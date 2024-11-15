import { createI18n } from 'vue-i18n'
import { generateI18nMsg } from './_helper'

import { baseLang as base } from './base.lang'
import { demoLang as demo } from './demo.lang'

const messages = generateI18nMsg({
  base,
  demo,

  // 可以追加其他模块
})

const i18n = createI18n({
  locale: 'en',
  messages,
})

export default i18n
