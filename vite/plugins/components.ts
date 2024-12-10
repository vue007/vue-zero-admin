import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export const vitePluginComponents = () =>
  Components({
    include: [/\.vue$/, /\.vue\?vue/],
    extensions: ['vue'],
    dirs: ['src/components', 'src/layouts', 'src/pages/components', 'src/pages/_views', 'src/hooks'], // for auto import project components
    dts: './src/components.d.ts',
    resolvers: [ElementPlusResolver({ importStyle: 'sass' })],
  })
