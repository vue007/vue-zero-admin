import UnoCSS from 'unocss/vite'
import { presetUno } from 'unocss'

import presetRemToPx from '@unocss/preset-rem-to-px'
import transformerDirectives from '@unocss/transformer-directives'

export const vitePluginUnocss = () =>
  UnoCSS({
    presets: [
      presetUno(),
      presetRemToPx({ baseFontSize: 4 }), // for px by default, like w-100 -> width:100px
    ],
    theme: {
      breakpoints: {
        xs: '320px',
        sm: '576px',
        md: '768px',
        lg: '1024px',
        xl: '1200px',
        xxl: '1400px',
      },
    },
    transformers: [
      transformerDirectives(), // support @apply、@screen and theme()
    ],
    shortcuts: {
      'flex-center': 'flex items-center justify-center',
    },
  })
