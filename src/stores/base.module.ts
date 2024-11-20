import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

type BaseSize = 'large' | 'default' | 'small'
type BaseTheme = 'dark' | 'light' | 'auto'
type BaseLang = 'en' | 'zh-CN' | 'zh-TW'
type BaseArrangement = 'default' | ''

export const useBaseStore = defineStore('base', () => {
  const setting = reactive({
    local: useLocalStorage<BaseLang>('setting.local', 'zh-CN'),
    theme: useLocalStorage<BaseTheme>('setting.theme', 'light'),
    size: useLocalStorage<BaseSize>('setting.size', 'default'),
    arrangement: useLocalStorage<BaseArrangement>('setting.size', 'default'),

    setLocale(locale: BaseLang) {
      setting.local = locale
    },
    setTheme(theme: BaseTheme) {
      setting.theme = theme
    },
    setSize(size: BaseSize) {
      setting.size = size
    },
    setArrangement(arrangement) {
      setting.arrangement = arrangement
    },
  })

  const menu = reactive({
    collapse: false,
    active: '/',

    toggleCollapse() {
      menu.collapse = !menu.collapse
    },
  })

  return { setting, menu }
})
