import { uniqBy } from 'es-toolkit'
import { concat } from 'es-toolkit/compat'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// @ts-ignore 动态导入pages 下 非_views 页面 name格式： a/b -> a-b
import autoPageRoutes from '~pages'

let routes: Array<RouteRecordRaw> = []

routes = uniqBy(concat(routes, autoPageRoutes), (item) => item.path)

let router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
