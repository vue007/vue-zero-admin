import { uniqBy } from 'es-toolkit'
import { concat } from 'es-toolkit/compat'
import { createRouter, createWebHistory } from 'vue-router'

// @ts-ignore 动态导入pages 下 非_views 页面 name格式： a/b -> a-b
import autoPageRoutes from '~pages'

let routes: any = []

routes = uniqBy(concat(routes, autoPageRoutes), (item) => item.path)

console.log(routes, 'routes')

let router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
