import fs from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig, UserConfig } from 'vite-plus'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueI18n from '@intlify/unplugin-vue-i18n/vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import oxlintPlugin from 'vite-plugin-oxlint'
// @ts-ignore
// import eslintPlugin from 'vite-plugin-eslint'

import mkcert from 'vite-plugin-mkcert'
import ElementPlus from 'unplugin-element-plus/vite'

import { vitePluginAutoPages } from './vite/plugins/auto-pages.ts'
import { vitePluginAutoImport } from './vite/plugins/auto-import.ts'
import { vitePluginComponents } from './vite/plugins/components.ts'
import { inferZeFormItemProp } from './vite/plugins/infer-form-item-prop.ts'
import { vitePluginSvgIcons } from './vite/plugins/svg-icon.ts'
import { vitePluginUnocss } from './vite/plugins/unocss.ts'
import { ViteConfigOptimizeDeps } from './vite/config/optimize-deps.ts'

const pathSrc = fileURLToPath(new URL('./src', import.meta.url))

export default defineConfig(({ command, mode }) => {
  const isDev = command === 'serve'

  const config: UserConfig = {
    fmt: {
      printWidth: 120,
      singleQuote: true,
      semi: false,
    },
    plugins: [
      vue({
        template: {
          compilerOptions: {
            nodeTransforms: [inferZeFormItemProp],
          },
        },
        script: {
          // TypeScript 7 no longer exposes ts.sys; compiler-sfc still needs fs for imported defineProps types.
          fs: {
            fileExists: (file) => fs.existsSync(file),
            readFile: (file) => fs.readFileSync(file, 'utf-8'),
            realpath: (file) => fs.realpathSync(file),
          },
        },
      }),
      vueJsx({}),
      vueI18n({
        include: [],
        strictMessage: false,
        runtimeOnly: true,
      }),
      (oxlintPlugin as any)({ allow: ['no-unsafe-declaration-merging', 'no-unused-vars'] }),
      // eslintPlugin(),

      // just remove special plugin when unneed
      vitePluginUnocss(),
      vitePluginAutoPages(),
      vitePluginAutoImport(),
      vitePluginComponents(),
      vitePluginSvgIcons(pathSrc),

      ElementPlus({}),
    ],
    resolve: { alias: { '@': pathSrc, '~/': pathSrc + '/' } },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/vars.scss" as *;`,
          quietDeps: true,
        },
      },
    },
    build: {
      chunkSizeWarningLimit: 1200,
      rollupOptions: {
        output: {
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: '[ext]/[name]-[hash].[ext]',
          // Vite 8 + Rolldown：用 oxc minify 替代已移除的 terserOptions / esbuild.drop
          ...(mode === 'production'
            ? {
                minify: {
                  compress: {
                    dropConsole: true,
                    dropDebugger: true,
                  },
                },
              }
            : {}),

          manualChunks(id) {
            const path = id.replace(/\\/g, '/')

            // 依赖分组（兼容 .pnpm 结构，锚定 node_modules 段）
            if (path.includes('node_modules')) {
              // Core framework
              if (
                /node_modules\/(?:\.pnpm\/[^/]+\/node_modules\/)?(vue|vue-router|pinia)(\/|$)/.test(path) ||
                /node_modules\/(?:\.pnpm\/[^/]+\/node_modules\/)?@vueuse\//.test(path)
              ) {
                return 'vendor-core'
              }
              // UI libraries
              if (/node_modules\/(?:\.pnpm\/[^/]+\/node_modules\/)?(element-plus|@element-plus)(\/|$)/.test(path)) {
                return 'vendor-ui'
              }
              // All other dependencies
              return 'vendor-others'
            }
          },
        },
        external: [], // PLACEHOLDER DONT REMOVE THIS LINE
        plugins: [], // PLACEHOLDER DONT REMOVE THIS LINE
      },
      outDir: `dist/${{ production: 'prod', development: 'dev' }[mode] || mode}`,
    },
  }

  if (isDev) {
    // ---------- only dev ----------
    const server = {
      port: 3001,
      host: '0.0.0.0',
      proxy: {} as any,
    }
    const createProxy = (
      target: string,
      path: string = '/api',
      rew?: RegExp,
      rewriteRedirect = false,
      changeOrigin = true,
    ) => {
      server.proxy[path] = {
        target,
        changeOrigin,
        ws: true,
        ...(rewriteRedirect ? { autoRewrite: true } : {}),
        ...(rew ? { rewrite: (p: string) => p.replace(rew, '') } : {}),
      }
    }

    createProxy('http://localhost:8080/', '/api', /^\/api/)
    createProxy('http://localhost:9090/', '/admin', undefined, true, false)
    createProxy('http://localhost:8800/', '/snail-job', undefined, true, false)
    // createProxy('https://apifoxmock.com/m1/5534148-5210746-default', '/api', /^\/api/)
    config.server = server

    // https support
    const https = false
    if (https) {
      ;(config.server as any).https = true
      config.plugins = config.plugins?.concat([mkcert()])
    }

    // config.plugins = config.plugins?.concat([vueDevTools({})])
    config.optimizeDeps = ViteConfigOptimizeDeps
    return config
  } else {
    // ----------  only production and test  ----------
    config.plugins = config.plugins?.concat([])

    if (mode === 'test') {
      // ---------- only test ----------
    }
    if (mode === 'production') {
      // ---------- only production ----------
    }
  }

  config.plugins = config.plugins?.concat([])
  return config
})
