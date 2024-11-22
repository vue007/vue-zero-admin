import AutoImport from 'unplugin-auto-import/vite'

import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export const vitePluginAutoImport = () =>
  AutoImport({
    include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
    imports: ['vue', 'vue-router', 'pinia', 'vue-i18n'], // global imports to register
    dirs: ['./src/hooks/*.ts*', './src/components'],
    eslintrc: {
      enabled: true,
      filepath: './eslintrc-auto-import.json',
      globalsPropValue: true,
    },
    dts: './src/auto-imports.d.ts',
    resolvers: [ElementPlusResolver()],
  })
