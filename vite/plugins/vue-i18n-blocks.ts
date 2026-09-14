import { parse as parseYaml } from 'yaml'
import type { Plugin } from 'vite-plus'

function parseI18nBlock(code: string, id: string): unknown {
  const lang = id.match(/[?&]lang\.([^&]+)/)?.[1] ?? ''
  if (lang === 'json' || lang === 'json5') {
    return JSON.parse(code)
  }
  return parseYaml(code)
}

/** Compile Vue SFC `<i18n>` blocks without @intlify/unplugin-vue-i18n (and esbuild). */
export function vitePluginVueI18nBlocks(): Plugin {
  return {
    name: 'vite-plugin-vue-i18n-blocks',
    transform(code, id) {
      if (!id.includes('vue&type=i18n')) return
      const resource = parseI18nBlock(code, id)
      const field = /(?:^|[?&])global(?:&|$)/.test(id) ? '__i18nGlobal' : '__i18n'
      return {
        code: `export default function (Component) {
  Component.${field} = Component.${field} || []
  Component.${field}.push(${JSON.stringify({ locale: '', resource })})
}
`,
        map: null,
      }
    },
  }
}
