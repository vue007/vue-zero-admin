import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

export default [
  ...compat.extends(
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
    'prettier',
    '@unocss/eslint-config/flat',
    './eslintrc-auto-import.json'
  ),

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script'
    },
    rules: {
      'vue/multi-word-component-names': ['off']
    }
  },

  {
    ignores: [
      'node_modules',
      '**/index.html',
      '.idea',
      'dist',
      '/public',
      'src/assets',
      '*.md',
      '*.woff',
      '*.ttf',
      'README.md'
    ]
  }
]
