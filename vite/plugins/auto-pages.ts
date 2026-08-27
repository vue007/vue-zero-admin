import { toMerged } from 'es-toolkit'
import Pages from 'vite-plugin-pages'

export const vitePluginAutoPages = () =>
  Pages({
    dirs: [{ dir: 'src/pages', baseRoute: '/' }],
    exclude: ['**/_views/**', '**/components/**'],
    importMode: 'async',
    caseSensitive: true,
    extendRoute(route) {
      const merged = toMerged({ meta: { auth: true, layout: 'base' } }, route)
      if (typeof merged.path === 'string') {
        const lower = merged.path.toLowerCase()
        if (lower !== merged.path) {
          const extra = Array.isArray(merged.alias) ? merged.alias : merged.alias ? [merged.alias] : []
          merged.alias = [lower, ...extra]
        }
      }
      return merged
    },
  })
