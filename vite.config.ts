import { fileURLToPath, URL } from 'node:url'

import { defineConfig, UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueI18n from '@intlify/unplugin-vue-i18n/vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import oxlintPlugin from 'vite-plugin-oxlint'
// @ts-ignore
// import eslintPlugin from 'vite-plugin-eslint'

import mkcert from 'vite-plugin-mkcert'
import ElementPlus from 'unplugin-element-plus/vite'

import { vitePluginAutoPages } from './vite/plugins/auto-pages'
import { vitePluginAutoImport } from './vite/plugins/auto-import'
import { vitePluginComponents } from './vite/plugins/components'
import { vitePluginSvgIcons } from './vite/plugins/svg-icon'
import { vitePluginUnocss } from './vite/plugins/unocss'
import { ViteConfigOptimizeDeps } from './vite/config/optimize-deps'

const pathSrc = fileURLToPath(new URL('./src', import.meta.url))

export default defineConfig(({ command, mode }) => {
  const isDev = command === 'serve'

  const config: UserConfig = {
    plugins: [
      vue(),
      vueJsx(),
      vueI18n(),
      ElementPlus({}),
      oxlintPlugin({ allow: ['no-unsafe-declaration-merging', 'no-unused-vars'] }),
      // eslintPlugin(),

      // just remove special plugin when unneed
      vitePluginUnocss(),
      vitePluginAutoPages(),
      vitePluginAutoImport(),
      vitePluginComponents(),
      vitePluginSvgIcons(pathSrc),
    ],

    resolve: { alias: { '@': pathSrc, '~/': pathSrc + '/' } },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/vars.scss" as *;`,
          api: 'modern',
          quietDeps: true,
        },
      },
    },

    build: {
      terserOptions: { compress: { drop_console: true, drop_debugger: true } },
      rollupOptions: {
        output: {
          // manualChunks: { 'index-core': ['vue', 'vue-router', 'pinia', '@vueuse/core'] },
          chunkFileNames: 'js/[name]-[hash].js', // 引入文件名的名称
          entryFileNames: 'js/[name]-[hash].js', // 包的入口文件名称
          assetFileNames: '[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等
          advancedChunks: {
            minSize: 10 * 1024, // 10kb
            minModuleSize: 10 * 1024, // 10kb
            groups: [
              {
                // Core framework libraries (change less frequently)
                test: /[\\/]node_modules[\\/](vue|vue-router|pinia|@vueuse\/core)[\\/]/,
                name: 'vendor-core',
                priority: 40,
              },
              {
                // UI libraries
                test: /[\\/]node_modules[\\/](element-plus|@element-plus)[\\/]/,
                name: 'vendor-ui',
                priority: 30,
              },
              {
                // All other dependencies
                test: /[\\/]node_modules[\\/]/,
                name: 'vendor-others',
                priority: 20,
              },
            ],
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
    const createProxy = (target: string, path: string = '/api', rew: RegExp = /^\/api/) => {
      server.proxy[path] = {
        target,
        changeOrigin: true,
        ws: true,
        rewrite: (p: any) => p.replace(rew, ''),
      }
    }

    createProxy('http://localhost:8080/', '/api', /^\/api/)
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
