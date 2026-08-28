// @ts-ignore
import autoPageRoutes from '~pages'

import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

import { baseApi } from '@/api/_index'
import type { UserInfo } from '@/api/user.type'
import { isBaseThemeColor, type BaseThemeColor } from '@/styles/theme/theme-colors'
import { merge } from 'es-toolkit'

export type BaseSize = 'large' | 'default' | 'small'
export type BaseScheme = 'dark' | 'light' | 'auto'
export type BaseTheme = 'default' | 'argon'
export type { BaseThemeColor } from '@/styles/theme/theme-colors'
export type BaseLang = 'en' | 'zh-CN'
export type BaseArrangement = 'default' | ''

const readStoredSetting = (key: string): unknown => {
  const value = globalThis.localStorage?.getItem(key)
  if (!value) return undefined
  try {
    // Accept the JSON-encoded values used by older releases.
    return JSON.parse(value)
  } catch {
    // VueUse stores string values as-is.
    return value
  }
}

const migrateAppearanceSettings = (): { scheme: BaseScheme; theme: BaseTheme; themeColor: BaseThemeColor } => {
  const storedScheme = readStoredSetting('setting.scheme')
  const storedTheme = readStoredSetting('setting.theme')
  const storedThemeColor = readStoredSetting('setting.themeColor')
  const schemes: BaseScheme[] = ['dark', 'light', 'auto']

  // `argon` used to be stored as a color scheme. Keep that preference while
  // separating visual theme from light/dark color scheme.
  const scheme = schemes.includes(storedScheme as BaseScheme)
    ? (storedScheme as BaseScheme)
    : schemes.includes(storedTheme as BaseScheme)
      ? (storedTheme as BaseScheme)
      : 'light'
  const theme: BaseTheme = storedTheme === 'default' ? 'default' : 'argon'
  const themeColor: BaseThemeColor = isBaseThemeColor(storedThemeColor) ? storedThemeColor : 'indigo'

  try {
    globalThis.localStorage?.setItem('setting.scheme', scheme)
    globalThis.localStorage?.setItem('setting.theme', theme)
    globalThis.localStorage?.setItem('setting.themeColor', themeColor)
  } catch {
    // Storage may be unavailable in private/SSR contexts; VueUse will fall back.
  }

  return { scheme, theme, themeColor }
}

const initialAppearance = migrateAppearanceSettings()

const getInitialLocale = (): BaseLang => {
  const locale = globalThis.localStorage?.getItem('setting.local')
  if (locale === 'en' || locale === 'zh-CN') return locale

  // 兼容曾经选择繁体中文的用户，升级后统一回退到简体中文。
  if (locale) globalThis.localStorage?.setItem('setting.local', 'zh-CN')
  return 'zh-CN'
}

export const useBaseStore = defineStore('base', () => {
  const router = useRouter()

  const setting = reactive({
    local: useLocalStorage<BaseLang>('setting.local', getInitialLocale()),
    scheme: useLocalStorage<BaseScheme>('setting.scheme', initialAppearance.scheme),
    theme: useLocalStorage<BaseTheme>('setting.theme', initialAppearance.theme),
    themeColor: useLocalStorage<BaseThemeColor>('setting.themeColor', initialAppearance.themeColor),
    size: useLocalStorage<BaseSize>('setting.size', 'default'),
    userInfo: useLocalStorage<Partial<UserInfo>>('setting.userInfo', {}),

    setLocale(locale: BaseLang) {
      setting.local = locale
    },
    setScheme(scheme: BaseScheme) {
      setting.scheme = scheme
    },
    setTheme(theme: BaseTheme) {
      setting.theme = theme
    },
    setThemeColor(themeColor: BaseThemeColor) {
      setting.themeColor = themeColor
    },
    setSize(size: BaseSize) {
      setting.size = size
    },

    fetchUserInfo() {
      return baseApi.getInfo().then((res) => {
        setting.userInfo = res.apiData
        return res.apiData
      })
    },
  })

  const menu = reactive({
    collapse: false,
    active: '',
    breadcrumb: [] as any[],
    routeMeta: {} as Record<string, any>,
    treeList: [] as any[],
    setTreeList(list: any[]) {
      menu.treeList = list
    },
    setBreadcrumb(list: string[]) {
      menu.breadcrumb = list
    },
    setRouteMeta(routes: any[]) {
      menu.routeMeta = Object.fromEntries(routes.map((route) => [route.path, route.meta]))
    },
    setCollapse(flag) {
      menu.collapse = flag
    },
    toggleCollapse() {
      menu.setCollapse(!menu.collapse)
    },
    setActive(path: string) {
      menu.active = path
    },

    initMenuList() {
      console.log('initMenuList', autoPageRoutes)

      return baseApi.getRouters().then((res) => {
        menu.setTreeList(res.apiData)

        const authorisedRoutes = flattenMenus(res.apiData, '/')
        menu.setRouteMeta(authorisedRoutes)
        autoPageRoutes.forEach((r) => {
          if (!r.meta?.auth) return

          const item = authorisedRoutes.find((item) => pathsEqual(item.path, r.path))
          if (!item) {
            if (!r.meta?.menuIndependent && r.path !== '/' && r.alias !== '/') router?.removeRoute(r.name)
            return
          }
          merge(r, { meta: item.meta })
        })
        const currentPath = router.currentRoute.value.path
        const currentRoute = authorisedRoutes.find((item) => pathsEqual(item.path, currentPath))
        menu.setActive(currentRoute?.meta?.activeMenu || currentPath)
        menu.setBreadcrumb(currentRoute?.meta?.breadcrumb || [])
        return res.apiData
      })
    },
  })

  return { setting, menu }
})

function flattenMenus(routes: any[], basePath = '', breadcrumb: any[] = []) {
  const list: any[] = []
  const stack: Array<{ route: any; fullPath: string; breadcrumb: any[] }> = (Array.isArray(routes) ? routes : [])
    .filter(Boolean)
    .map((route) => ({ route, fullPath: basePath, breadcrumb }))
  while (stack.length) {
    const current = stack.pop()
    if (!current?.route) continue
    const { route, fullPath, breadcrumb } = current
    const currentPath = `${fullPath}/${route.path}`.replace(/\/+/g, '/')
    const _nb = [...breadcrumb]
    if (route.meta?.title) _nb.push(route.meta.title)
    if (route.children?.length)
      stack.push(
        ...route.children
          .filter(Boolean)
          .map((child) => ({ route: child, fullPath: currentPath, breadcrumb: _nb })),
      )
    else list.push({ ...route, path: currentPath, meta: { ...route.meta, breadcrumb: _nb } })
  }
  const visibleRoutes = list.filter((item) => !item.hidden)
  list.forEach((item) => {
    if (!item.hidden) return
    const activeParent = visibleRoutes
      .filter((candidate) => item.path.startsWith(`${candidate.path}/`))
      .sort((a, b) => b.path.length - a.path.length)[0]
    if (!activeParent) return
    item.meta.activeMenu = activeParent.path
    item.meta.breadcrumb = [...(activeParent.meta?.breadcrumb || []), item.meta?.title].filter(Boolean)
  })
  return list
}

function pathsEqual(a?: string, b?: string) {
  const normalize = (path = '') => path.replace(/\/+$/, '').toLowerCase() || '/'
  return normalize(a) === normalize(b)
}
