import { uniqBy } from 'es-toolkit'
import { concat } from 'es-toolkit/compat'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// @ts-ignore 动态导入pages 下 非_views 页面 name格式： a/b -> a-b
import autoPageRoutes from '~pages'

type AppRouteMeta = {
  auth?: boolean
  layout?: string
}
export type AppRouteRecordRaw = RouteRecordRaw & { meta: AppRouteMeta }

let routes: Array<AppRouteRecordRaw> = [{ path: '/', redirect: '/dashboard', meta: { layout: 'base' } }]

routes = uniqBy(concat(routes, autoPageRoutes), (item) => item.path)

let router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
