import { toMerged } from 'es-toolkit'
import Pages from 'vite-plugin-pages'

export const vitePluginAutoPages = () =>
  Pages({
    dirs: [{ dir: 'src/pages', baseRoute: '/' }],
    exclude: ['**/_views/**', '**/components/**'],
    importMode: 'async',
    extendRoute(route) {
      return toMerged({ meta: { auth: true, layout: 'base' } }, route)
    },
  })
