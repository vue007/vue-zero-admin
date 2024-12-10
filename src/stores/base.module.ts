import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export type BaseSize = 'large' | 'default' | 'small'
export type BaseTheme = 'dark' | 'light' | 'auto'
export type BaseLang = 'en' | 'zh-CN' | 'zh-TW'
export type BaseArrangement = 'default' | ''

export const useBaseStore = defineStore('base', () => {
  const setting = reactive({
    local: useLocalStorage<BaseLang>('setting.local', 'zh-CN'),
    theme: useLocalStorage<BaseTheme>('setting.theme', 'light'),
    size: useLocalStorage<BaseSize>('setting.size', 'default'),

    setLocale(locale: BaseLang) {
      setting.local = locale
    },
    setTheme(theme: BaseTheme) {
      setting.theme = theme
    },
    setSize(size: BaseSize) {
      setting.size = size
    },
  })

  const menu = reactive({
    collapse: false,
    active: '/',

    toggleCollapse() {
      menu.collapse = !menu.collapse
    },
    setActive(path: string) {
      menu.active = path
    },
  })

  return { setting, menu }
})
