import fs from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueI18n from '@intlify/unplugin-vue-i18n/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vitest/config'
import { inferZeFormItemProp } from './vite/plugins/infer-form-item-prop.ts'

const pathSrc = fileURLToPath(new URL('./src', import.meta.url))

export default defineConfig({
  plugins: [
    vue({
      template: { compilerOptions: { nodeTransforms: [inferZeFormItemProp] } },
      script: {
        fs: {
          fileExists: (file) => fs.existsSync(file),
          readFile: (file) => fs.readFileSync(file, 'utf-8'),
          realpath: (file) => fs.realpathSync(file),
        },
      },
    }),
    vueJsx(),
    vueI18n({ include: [], strictMessage: false, runtimeOnly: true }),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia', 'vue-i18n'],
      dirs: ['./src/hooks/*.ts*'],
      dts: false,
    }),
  ],
  resolve: {
    alias: {
      '@': pathSrc,
    },
  },
  css: {
    preprocessorOptions: {
      scss: { additionalData: `@use "@/styles/vars.scss" as *;`, quietDeps: true },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}', 'vite/**/*.test.ts'],
    clearMocks: true,
    restoreMocks: true,
  },
})
