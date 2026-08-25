// @ts-ignore
import autoPageRoutes from '~pages'

import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

import { baseApi } from '@/api/_index'
import type { UserInfo } from '@/api/user.type'
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
    userInfo: useLocalStorage<Partial<UserInfo>>('setting.userInfo', {}),

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

          const item = authorisedRoutes.find((item) => item.path === r.path)
          if (!item && !r.meta?.menuIndependent) {
            if (r.path !== '/' && r.alias !== '/') router?.removeRoute(r.name)
            return
          }
          merge(r, { meta: item.meta })
        })
        const currentPath = router.currentRoute.value.path
        const currentRoute = authorisedRoutes.find((item) => item.path === currentPath)
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
