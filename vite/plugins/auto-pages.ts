import Pages from 'vite-plugin-pages'

export const vitePluginAutoPages = () =>
  Pages({
    dirs: [{ dir: 'src/pages', baseRoute: '/' }],
    exclude: ['**/_views/**', '**/components/**'],
    importMode: 'async',
    extendRoute(route, parent) {
      return { ...route, meta: { auth: true, layout: 'base' } }
    }
  })
