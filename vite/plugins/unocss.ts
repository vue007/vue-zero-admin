import UnoCSS from 'unocss/vite'
import presetRemToPx from '@unocss/preset-rem-to-px'
import transformerDirectives from '@unocss/transformer-directives'

import presetWind from '@unocss/preset-wind4'

import transformerVariantGroup from '@unocss/transformer-variant-group'
import presetAttributify from '@unocss/preset-attributify'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { breakpoints, breakpointsScssAdditionalData } from '../config/breakpoints.ts'
import { presetLegacyCompat } from '@unocss/preset-legacy-compat'

function syncBreakpointsScss() {
  const file = join(dirname(fileURLToPath(import.meta.url)), '../config/_breakpoints.scss')
  const content = `// Generated from vite/config/breakpoints.ts — do not edit\n${breakpointsScssAdditionalData()}\n`
  if (existsSync(file) && readFileSync(file, 'utf8') === content) return
  writeFileSync(file, content)
}

const vitePluginBreakpointsScss = () => ({
  name: 'breakpoints-scss',
  buildStart: syncBreakpointsScss,
})

const presets = [
  presetAttributify(),
  presetWind(),
  presetRemToPx({ baseFontSize: 4 }), // for px by default, like w-100 -> width:100px
]

export const vitePluginUnocss = () => {
  syncBreakpointsScss()

  return [
    vitePluginBreakpointsScss(),
    UnoCSS({
      shortcuts: {
        'flex-center': 'flex items-center justify-center',
      },
      // 限制扫描范围，只处理业务源码，大幅减少扫描时间
      // 排除 node_modules、dist 等目录，只扫描 src 下的业务代码
      content: {
        filesystem: ['src/**/*.{vue,ts,tsx,js,jsx}', './node_modules/primevue/**/*.{vue,ts,tsx,js,jsx}'],
      },

      presets,
      theme: {
        breakpoints,
        spacing: {
          DEFAULT: '0.06250rem',
        },
      },

      transformers: [transformerDirectives(), transformerVariantGroup()] as any,
    }),
  ]
}
