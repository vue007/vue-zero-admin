import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import type { PluginOption } from 'vite'

export const vitePluginComponents = (): PluginOption =>
  Components({
    include: [/\.vue$/, /\.vue\?vue/],
    extensions: ['vue'],
    dirs: ['src/components', 'src/layouts', 'src/pages/_views', 'src/pages/components', 'src/hooks', 'src/prime'],
    dts: './src/components.d.ts',
    resolvers: [ElementPlusResolver({ importStyle: 'sass' })],
  })
