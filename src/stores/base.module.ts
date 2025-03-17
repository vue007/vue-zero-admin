// @ts-ignore
import autoPageRoutes from '~pages'

import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

import { baseApi } from '@/api/_index'
import { merge } from 'es-toolkit'

export type BaseSize = 'large' | 'default' | 'small'
export type BaseTheme = 'dark' | 'light' | 'auto'
export type BaseLang = 'en' | 'zh-CN' | 'zh-TW'
export type BaseArrangement = 'default' | ''

export const useBaseStore = defineStore('base', () => {
  const router = useRouter()

  const setting = reactive({
    local: useLocalStorage<BaseLang>('setting.local', 'zh-CN'),
    theme: useLocalStorage<BaseTheme>('setting.theme', 'light'),
    size: useLocalStorage<BaseSize>('setting.size', 'default'),
    userInfo: useLocalStorage('setting.userInfo', {}),

    setLocale(locale: BaseLang) {
      setting.local = locale
    },
    setTheme(theme: BaseTheme) {
      setting.theme = theme
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
    treeList: [] as any[],
    setTreeList(list: any[]) {
      menu.treeList = list
    },
    setBreadcrumb(list: string[]) {
      menu.breadcrumb = list
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
      const route = useRoute()

      return baseApi.getRouters().then((res) => {
        menu.setTreeList(res.apiData)

        const authorisedRoutes = flattenMenus(res.apiData, '/')
        autoPageRoutes.forEach((r) => {
          if (!r.meta?.auth) return

          const item = authorisedRoutes.find((item) => item.path === r.path)
          if (!item && !['/'].includes(item?.path) && !['/'].includes(item?.alias)) {
            router?.removeRoute(r.name)
          } else {
            merge(r, { meta: item.meta })
          }
        })
        menu.setBreadcrumb(authorisedRoutes.find((item) => item.path === route?.path)?.meta?.breadcrumb || [])
        return res.apiData
      })
    },
  })

  return { setting, menu }
})

function flattenMenus(routes, basePath = '', breadcrumb = []) {
  const list: any[] = []
  const stack = routes.map((route) => ({ route, fullPath: basePath, breadcrumb }))
  while (stack.length) {
    const { route, fullPath, breadcrumb } = stack.pop()
    const currentPath = `${fullPath}/${route.path}`.replace(/\/+/g, '/')
    const _nb = [...breadcrumb]
    if (route.meta?.title) _nb.push(route.meta.title)
    if (route.children?.length)
      stack.push(...route.children.map((child) => ({ route: child, fullPath: currentPath, breadcrumb: _nb })))
    else list.push({ ...route, path: currentPath, meta: { ...route.meta, breadcrumb: _nb } })
  }
  return list
}
