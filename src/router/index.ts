import { uniqBy } from 'es-toolkit'
import { concat } from 'es-toolkit/compat'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// @ts-ignore 动态导入pages 下 非_views 页面 name格式： a/b -> a-b
import autoPageRoutes from '~pages'

type AppRouteMeta = {
  activeMenu?: string
  auth?: boolean
  breadcrumb?: string[]
  layout?: string
}
export type AppRouteRecordRaw = RouteRecordRaw & { meta: AppRouteMeta }

const routes: Array<AppRouteRecordRaw> = uniqBy(
  concat([{ path: '/', redirect: '/dashboard', meta: { layout: 'base' } }], autoPageRoutes),
  (item) => item.path,
)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  sensitive: true,
})

export default router
