// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///Users/akai/Documents/GitHub/vue-zero-admin/node_modules/.pnpm/vite@5.4.11_@types+node@22.10.1_sass@1.81.0/node_modules/vite/dist/node/index.js";
import vue from "file:///Users/akai/Documents/GitHub/vue-zero-admin/node_modules/.pnpm/@vitejs+plugin-vue@5.2.1_vite@5.4.11_@types+node@22.10.1_sass@1.81.0__vue@3.5.13_typescript@5.7.2_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///Users/akai/Documents/GitHub/vue-zero-admin/node_modules/.pnpm/@vitejs+plugin-vue-jsx@4.1.1_vite@5.4.11_@types+node@22.10.1_sass@1.81.0__vue@3.5.13_typescript@5.7.2_/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import vueI18n from "file:///Users/akai/Documents/GitHub/vue-zero-admin/node_modules/.pnpm/@intlify+unplugin-vue-i18n@6.0.0_@vue+compiler-dom@3.5.13_eslint@9.16.0_jiti@2.4.1__rollup@4._gsg2kxnfr7pxca2bz6in2uovum/node_modules/@intlify/unplugin-vue-i18n/lib/vite.mjs";
import vueDevTools from "file:///Users/akai/Documents/GitHub/vue-zero-admin/node_modules/.pnpm/vite-plugin-vue-devtools@7.6.7_rollup@4.28.0_vite@5.4.11_@types+node@22.10.1_sass@1.81.0__vue@3.5.13_typescript@5.7.2_/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
import oxlintPlugin from "file:///Users/akai/Documents/GitHub/vue-zero-admin/node_modules/.pnpm/vite-plugin-oxlint@1.1.0_oxlint@0.13.2/node_modules/vite-plugin-oxlint/dist/index.mjs";
import mkcert from "file:///Users/akai/Documents/GitHub/vue-zero-admin/node_modules/.pnpm/vite-plugin-mkcert@1.17.6_vite@5.4.11_@types+node@22.10.1_sass@1.81.0_/node_modules/vite-plugin-mkcert/dist/mkcert.mjs";

// vite/plugins/auto-pages.ts
import Pages from "file:///Users/akai/Documents/GitHub/vue-zero-admin/node_modules/.pnpm/vite-plugin-pages@0.32.4_@vue+compiler-sfc@3.5.13_vite@5.4.11_@types+node@22.10.1_sass@1.81.0_6paacba3vddomtcrasitbyavf4/node_modules/vite-plugin-pages/dist/index.js";
var vitePluginAutoPages = () => Pages({
  dirs: [{ dir: "src/pages", baseRoute: "/" }],
  exclude: ["**/_views/**", "**/components/**"],
  importMode: "async",
  extendRoute(route, _parent) {
    return { ...route, meta: { auth: true, layout: "base" } };
  }
});

// vite/plugins/auto-import.ts
import AutoImport from "file:///Users/akai/Documents/GitHub/vue-zero-admin/node_modules/.pnpm/unplugin-auto-import@0.18.6_@vueuse+core@12.0.0_typescript@5.7.2__rollup@4.28.0/node_modules/unplugin-auto-import/dist/vite.js";
import { ElementPlusResolver } from "file:///Users/akai/Documents/GitHub/vue-zero-admin/node_modules/.pnpm/unplugin-vue-components@0.27.5_@babel+parser@7.26.2_rollup@4.28.0_vue@3.5.13_typescript@5.7.2_/node_modules/unplugin-vue-components/dist/resolvers.js";
var vitePluginAutoImport = () => AutoImport({
  include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
  imports: ["vue", "vue-router", "pinia", "vue-i18n"],
  // global imports to register
  dirs: ["./src/hooks/*.ts*", "./src/components"],
  eslintrc: {
    enabled: true,
    filepath: "./eslintrc-auto-import.json",
    globalsPropValue: true
  },
  dts: "./src/auto-imports.d.ts",
  resolvers: [ElementPlusResolver()]
});

// vite/plugins/components.ts
import Components from "file:///Users/akai/Documents/GitHub/vue-zero-admin/node_modules/.pnpm/unplugin-vue-components@0.27.5_@babel+parser@7.26.2_rollup@4.28.0_vue@3.5.13_typescript@5.7.2_/node_modules/unplugin-vue-components/dist/vite.js";
import { ElementPlusResolver as ElementPlusResolver2 } from "file:///Users/akai/Documents/GitHub/vue-zero-admin/node_modules/.pnpm/unplugin-vue-components@0.27.5_@babel+parser@7.26.2_rollup@4.28.0_vue@3.5.13_typescript@5.7.2_/node_modules/unplugin-vue-components/dist/resolvers.js";
var vitePluginComponents = () => Components({
  include: [/\.vue$/, /\.vue\?vue/],
  extensions: ["vue"],
  dirs: [
    "src/components",
    "src/layouts",
    "src/pages/components",
    "src/pages/_views",
    "src/hooks"
  ],
  // for auto import project components
  dts: "./src/components.d.ts",
  resolvers: [ElementPlusResolver2({ importStyle: "sass" })]
});

// vite/plugins/svg-icon.ts
import { createSvgIconsPlugin } from "file:///Users/akai/Documents/GitHub/vue-zero-admin/node_modules/.pnpm/vite-plugin-svg-icons@2.0.1_vite@5.4.11_@types+node@22.10.1_sass@1.81.0_/node_modules/vite-plugin-svg-icons/dist/index.mjs";
var vitePluginSvgIcons = (pathSrc2) => createSvgIconsPlugin({
  iconDirs: [`${pathSrc2}/icons`],
  symbolId: "icon-[dir]-[name]",
  inject: "body-last",
  // or body-first
  customDomId: "__svg__icons__dom__"
});

// vite/plugins/unocss.ts
import UnoCSS from "file:///Users/akai/Documents/GitHub/vue-zero-admin/node_modules/.pnpm/unocss@0.65.0-beta.2_postcss@5.2.18_rollup@4.28.0_vite@5.4.11_@types+node@22.10.1_sass@1.81.0_o6kjmkzualbddl7uag45ddibui/node_modules/unocss/dist/vite.mjs";
import { presetUno } from "file:///Users/akai/Documents/GitHub/vue-zero-admin/node_modules/.pnpm/unocss@0.65.0-beta.2_postcss@5.2.18_rollup@4.28.0_vite@5.4.11_@types+node@22.10.1_sass@1.81.0_o6kjmkzualbddl7uag45ddibui/node_modules/unocss/dist/index.mjs";
import presetRemToPx from "file:///Users/akai/Documents/GitHub/vue-zero-admin/node_modules/.pnpm/@unocss+preset-rem-to-px@0.65.0-beta.2/node_modules/@unocss/preset-rem-to-px/dist/index.mjs";
import transformerDirectives from "file:///Users/akai/Documents/GitHub/vue-zero-admin/node_modules/.pnpm/@unocss+transformer-directives@0.65.0-beta.2/node_modules/@unocss/transformer-directives/dist/index.mjs";
var vitePluginUnocss = () => UnoCSS({
  presets: [
    presetUno(),
    presetRemToPx({ baseFontSize: 4 })
    // for px by default, like w-100 -> width:100px
  ],
  theme: {
    breakpoints: {
      xs: "320px",
      sm: "576px",
      md: "768px",
      lg: "1024px",
      xl: "1200px",
      xxl: "1400px"
    }
  },
  transformers: [
    transformerDirectives()
    // support @apply、@screen and theme()
  ],
  shortcuts: {
    "flex-center": "flex items-center justify-center"
  }
});

// vite/config/optimize-deps.ts
var ViteConfigOptimizeDeps = {
  include: [
    "vue",
    "vue-router",
    "pinia",
    "@vueuse/core",
    "vue-i18n",
    "axios",
    "element-plus/es",
    "element-plus/es/components/base/style/css",
    "element-plus/es/components/message/style/css",
    "element-plus/es/components/base/style/index",
    "element-plus/es/components/affix/style/css",
    "element-plus/es/components/affix/style/index",
    "element-plus/es/components/alert/style/css",
    "element-plus/es/components/alert/style/index",
    "element-plus/es/components/anchor/style/css",
    "element-plus/es/components/anchor/style/index",
    "element-plus/es/components/anchor-link/style/css",
    "element-plus/es/components/anchor-link/style/index",
    "element-plus/es/components/aside/style/css",
    "element-plus/es/components/aside/style/index",
    "element-plus/es/components/autocomplete/style/css",
    "element-plus/es/components/autocomplete/style/index",
    "element-plus/es/components/avatar/style/css",
    "element-plus/es/components/avatar/style/index",
    "element-plus/es/components/backtop/style/css",
    "element-plus/es/components/backtop/style/index",
    "element-plus/es/components/badge/style/css",
    "element-plus/es/components/badge/style/index",
    "element-plus/es/components/base/style/css",
    "element-plus/es/components/base/style/index",
    "element-plus/es/components/breadcrumb/style/css",
    "element-plus/es/components/breadcrumb/style/index",
    "element-plus/es/components/breadcrumb-item/style/css",
    "element-plus/es/components/breadcrumb-item/style/index",
    "element-plus/es/components/button/style/css",
    "element-plus/es/components/button/style/index",
    "element-plus/es/components/button-group/style/css",
    "element-plus/es/components/button-group/style/index",
    "element-plus/es/components/calendar/style/css",
    "element-plus/es/components/calendar/style/index",
    "element-plus/es/components/card/style/css",
    "element-plus/es/components/card/style/index",
    "element-plus/es/components/carousel/style/css",
    "element-plus/es/components/carousel/style/index",
    "element-plus/es/components/carousel-item/style/css",
    "element-plus/es/components/carousel-item/style/index",
    "element-plus/es/components/cascader/style/css",
    "element-plus/es/components/cascader/style/index",
    "element-plus/es/components/cascader-panel/style/css",
    "element-plus/es/components/cascader-panel/style/index",
    "element-plus/es/components/check-tag/style/css",
    "element-plus/es/components/check-tag/style/index",
    "element-plus/es/components/checkbox/style/css",
    "element-plus/es/components/checkbox/style/index",
    "element-plus/es/components/checkbox-button/style/css",
    "element-plus/es/components/checkbox-button/style/index",
    "element-plus/es/components/checkbox-group/style/css",
    "element-plus/es/components/checkbox-group/style/index",
    "element-plus/es/components/col/style/css",
    "element-plus/es/components/col/style/index",
    "element-plus/es/components/collapse/style/css",
    "element-plus/es/components/collapse/style/index",
    "element-plus/es/components/collapse-item/style/css",
    "element-plus/es/components/collapse-item/style/index",
    "element-plus/es/components/collapse-transition/style/css",
    "element-plus/es/components/collapse-transition/style/index",
    "element-plus/es/components/color-picker/style/css",
    "element-plus/es/components/color-picker/style/index",
    "element-plus/es/components/config-provider/style/css",
    "element-plus/es/components/config-provider/style/index",
    "element-plus/es/components/container/style/css",
    "element-plus/es/components/container/style/index",
    "element-plus/es/components/countdown/style/css",
    "element-plus/es/components/countdown/style/index",
    "element-plus/es/components/date-picker/style/css",
    "element-plus/es/components/date-picker/style/index",
    "element-plus/es/components/descriptions/style/css",
    "element-plus/es/components/descriptions/style/index",
    "element-plus/es/components/descriptions-item/style/css",
    "element-plus/es/components/descriptions-item/style/index",
    "element-plus/es/components/dialog/style/css",
    "element-plus/es/components/dialog/style/index",
    "element-plus/es/components/divider/style/css",
    "element-plus/es/components/divider/style/index",
    "element-plus/es/components/drawer/style/css",
    "element-plus/es/components/drawer/style/index",
    "element-plus/es/components/dropdown/style/css",
    "element-plus/es/components/dropdown/style/index",
    "element-plus/es/components/dropdown-item/style/css",
    "element-plus/es/components/dropdown-item/style/index",
    "element-plus/es/components/dropdown-menu/style/css",
    "element-plus/es/components/dropdown-menu/style/index",
    "element-plus/es/components/empty/style/css",
    "element-plus/es/components/empty/style/index",
    "element-plus/es/components/footer/style/css",
    "element-plus/es/components/footer/style/index",
    "element-plus/es/components/form/style/css",
    "element-plus/es/components/form/style/index",
    "element-plus/es/components/form-item/style/css",
    "element-plus/es/components/form-item/style/index",
    "element-plus/es/components/header/style/css",
    "element-plus/es/components/header/style/index",
    "element-plus/es/components/icon/style/css",
    "element-plus/es/components/icon/style/index",
    "element-plus/es/components/image/style/css",
    "element-plus/es/components/image/style/index",
    "element-plus/es/components/image-viewer/style/css",
    "element-plus/es/components/image-viewer/style/index",
    "element-plus/es/components/infinite-scroll/style/css",
    "element-plus/es/components/infinite-scroll/style/index",
    "element-plus/es/components/input/style/css",
    "element-plus/es/components/input/style/index",
    "element-plus/es/components/input-number/style/css",
    "element-plus/es/components/input-number/style/index",
    "element-plus/es/components/link/style/css",
    "element-plus/es/components/link/style/index",
    "element-plus/es/components/loading/style/css",
    "element-plus/es/components/loading/style/index",
    "element-plus/es/components/main/style/css",
    "element-plus/es/components/main/style/index",
    "element-plus/es/components/mention/style/css",
    "element-plus/es/components/mention/style/index",
    "element-plus/es/components/menu/style/css",
    "element-plus/es/components/menu/style/index",
    "element-plus/es/components/menu-item/style/css",
    "element-plus/es/components/menu-item/style/index",
    "element-plus/es/components/menu-item-group/style/css",
    "element-plus/es/components/menu-item-group/style/index",
    "element-plus/es/components/message/style/css",
    "element-plus/es/components/message/style/index",
    "element-plus/es/components/message-box/style/css",
    "element-plus/es/components/message-box/style/index",
    "element-plus/es/components/notification/style/css",
    "element-plus/es/components/notification/style/index",
    "element-plus/es/components/option/style/css",
    "element-plus/es/components/option/style/index",
    "element-plus/es/components/option-group/style/css",
    "element-plus/es/components/option-group/style/index",
    "element-plus/es/components/overlay/style/css",
    "element-plus/es/components/overlay/style/index",
    "element-plus/es/components/page-header/style/css",
    "element-plus/es/components/page-header/style/index",
    "element-plus/es/components/pagination/style/css",
    "element-plus/es/components/pagination/style/index",
    "element-plus/es/components/popconfirm/style/css",
    "element-plus/es/components/popconfirm/style/index",
    "element-plus/es/components/popover/style/css",
    "element-plus/es/components/popover/style/index",
    "element-plus/es/components/popper/style/css",
    "element-plus/es/components/popper/style/index",
    "element-plus/es/components/progress/style/css",
    "element-plus/es/components/progress/style/index",
    "element-plus/es/components/radio/style/css",
    "element-plus/es/components/radio/style/index",
    "element-plus/es/components/radio-button/style/css",
    "element-plus/es/components/radio-button/style/index",
    "element-plus/es/components/radio-group/style/css",
    "element-plus/es/components/radio-group/style/index",
    "element-plus/es/components/rate/style/css",
    "element-plus/es/components/rate/style/index",
    "element-plus/es/components/result/style/css",
    "element-plus/es/components/result/style/index",
    "element-plus/es/components/row/style/css",
    "element-plus/es/components/row/style/index",
    "element-plus/es/components/scrollbar/style/css",
    "element-plus/es/components/scrollbar/style/index",
    "element-plus/es/components/segmented/style/css",
    "element-plus/es/components/segmented/style/index",
    "element-plus/es/components/select/style/css",
    "element-plus/es/components/select/style/index",
    "element-plus/es/components/select-v2/style/css",
    "element-plus/es/components/select-v2/style/index",
    "element-plus/es/components/skeleton/style/css",
    "element-plus/es/components/skeleton/style/index",
    "element-plus/es/components/skeleton-item/style/css",
    "element-plus/es/components/skeleton-item/style/index",
    "element-plus/es/components/slider/style/css",
    "element-plus/es/components/slider/style/index",
    "element-plus/es/components/space/style/css",
    "element-plus/es/components/space/style/index",
    "element-plus/es/components/statistic/style/css",
    "element-plus/es/components/statistic/style/index",
    "element-plus/es/components/step/style/css",
    "element-plus/es/components/step/style/index",
    "element-plus/es/components/steps/style/css",
    "element-plus/es/components/steps/style/index",
    "element-plus/es/components/sub-menu/style/css",
    "element-plus/es/components/sub-menu/style/index",
    "element-plus/es/components/switch/style/css",
    "element-plus/es/components/switch/style/index",
    "element-plus/es/components/tab-pane/style/css",
    "element-plus/es/components/tab-pane/style/index",
    "element-plus/es/components/table/style/css",
    "element-plus/es/components/table/style/index",
    "element-plus/es/components/table-column/style/css",
    "element-plus/es/components/table-column/style/index",
    "element-plus/es/components/table-v2/style/css",
    "element-plus/es/components/table-v2/style/index",
    "element-plus/es/components/tabs/style/css",
    "element-plus/es/components/tabs/style/index",
    "element-plus/es/components/tag/style/css",
    "element-plus/es/components/tag/style/index",
    "element-plus/es/components/teleport/style/css",
    "element-plus/es/components/teleport/style/index",
    "element-plus/es/components/text/style/css",
    "element-plus/es/components/text/style/index",
    "element-plus/es/components/time-picker/style/css",
    "element-plus/es/components/time-picker/style/index",
    "element-plus/es/components/time-select/style/css",
    "element-plus/es/components/time-select/style/index",
    "element-plus/es/components/timeline/style/css",
    "element-plus/es/components/timeline/style/index",
    "element-plus/es/components/timeline-item/style/css",
    "element-plus/es/components/timeline-item/style/index",
    "element-plus/es/components/tooltip/style/css",
    "element-plus/es/components/tooltip/style/index",
    "element-plus/es/components/tour/style/css",
    "element-plus/es/components/tour/style/index",
    "element-plus/es/components/tour-step/style/css",
    "element-plus/es/components/tour-step/style/index",
    "element-plus/es/components/transfer/style/css",
    "element-plus/es/components/transfer/style/index",
    "element-plus/es/components/tree/style/css",
    "element-plus/es/components/tree/style/index",
    "element-plus/es/components/tree-select/style/css",
    "element-plus/es/components/tree-select/style/index",
    "element-plus/es/components/tree-v2/style/css",
    "element-plus/es/components/tree-v2/style/index",
    "element-plus/es/components/upload/style/css",
    "element-plus/es/components/upload/style/index",
    "element-plus/es/components/virtual-list/style/css",
    "element-plus/es/components/virtual-list/style/index",
    "element-plus/es/components/watermark/style/css",
    "element-plus/es/components/watermark/style/index"
  ]
  // await vite to solve this bug
};

// vite.config.ts
var __vite_injected_original_import_meta_url = "file:///Users/akai/Documents/GitHub/vue-zero-admin/vite.config.ts";
var pathSrc = fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url));
var vite_config_default = defineConfig(({ command, mode }) => {
  const isDev = command === "serve";
  const config = {
    plugins: [
      vue(),
      vueJsx(),
      vueI18n(),
      oxlintPlugin({ allow: ["no-unsafe-declaration-merging", "no-unused-vars"] }),
      // eslintPlugin({}),
      // just remove special plugin when unneed
      vitePluginUnocss(),
      vitePluginAutoPages(),
      vitePluginAutoImport(),
      vitePluginComponents(),
      vitePluginSvgIcons(pathSrc)
    ],
    resolve: { alias: { "@": pathSrc, "~/": pathSrc + "/" } },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/vars.scss" as *;`,
          api: "modern",
          quietDeps: true
        }
      }
    },
    build: {
      terserOptions: { compress: { drop_console: true, drop_debugger: true } },
      rollupOptions: {
        output: {
          manualChunks: { "index-core": ["vue", "vue-router", "pinia", "@vueuse/core"] },
          chunkFileNames: "js/[name]-[hash].js",
          // 引入文件名的名称
          entryFileNames: "js/[name]-[hash].js",
          // 包的入口文件名称
          assetFileNames: "[ext]/[name]-[hash].[ext]"
          // 资源文件像 字体，图片等
        },
        external: [],
        // PLACEHOLDER DONT REMOVE THIS LINE
        plugins: []
        // PLACEHOLDER DONT REMOVE THIS LINE
      },
      outDir: `dist/${{ production: "prod", development: "dev" }[mode] || mode}`
    }
  };
  if (isDev) {
    const server = {
      port: 3001,
      host: "0.0.0.0",
      proxy: {}
    };
    const createProxy = (target, path = "/api", rew = /^\/api/) => {
      server.proxy[path] = {
        target,
        changeOrigin: true,
        ws: true,
        rewrite: (p) => p.replace(rew, "")
      };
    };
    createProxy("https://apifoxmock.com/m1/5534148-5210746-default", "/api", /^\/api/);
    config.server = server;
    const https = true;
    if (https) {
      ;
      config.server.https = true;
      config.plugins = config.plugins?.concat([mkcert()]);
    }
    config.plugins = config.plugins?.concat([vueDevTools()]);
    config.optimizeDeps = ViteConfigOptimizeDeps;
    return config;
  } else {
    config.plugins = config.plugins?.concat([]);
    if (mode === "test") {
    }
    if (mode === "production") {
    }
  }
  config.plugins = config.plugins?.concat([]);
  return config;
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAidml0ZS9wbHVnaW5zL2F1dG8tcGFnZXMudHMiLCAidml0ZS9wbHVnaW5zL2F1dG8taW1wb3J0LnRzIiwgInZpdGUvcGx1Z2lucy9jb21wb25lbnRzLnRzIiwgInZpdGUvcGx1Z2lucy9zdmctaWNvbi50cyIsICJ2aXRlL3BsdWdpbnMvdW5vY3NzLnRzIiwgInZpdGUvY29uZmlnL29wdGltaXplLWRlcHMudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYWthaS9Eb2N1bWVudHMvR2l0SHViL3Z1ZS16ZXJvLWFkbWluXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvYWthaS9Eb2N1bWVudHMvR2l0SHViL3Z1ZS16ZXJvLWFkbWluL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9ha2FpL0RvY3VtZW50cy9HaXRIdWIvdnVlLXplcm8tYWRtaW4vdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tICdub2RlOnVybCdcblxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBVc2VyQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IHZ1ZUpzeCBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUtanN4J1xuaW1wb3J0IHZ1ZUkxOG4gZnJvbSAnQGludGxpZnkvdW5wbHVnaW4tdnVlLWkxOG4vdml0ZSdcbmltcG9ydCB2dWVEZXZUb29scyBmcm9tICd2aXRlLXBsdWdpbi12dWUtZGV2dG9vbHMnXG5pbXBvcnQgb3hsaW50UGx1Z2luIGZyb20gJ3ZpdGUtcGx1Z2luLW94bGludCdcbi8vQHRzLWlnbm9yZVxuaW1wb3J0IGVzbGludFBsdWdpbiBmcm9tICd2aXRlLXBsdWdpbi1lc2xpbnQnXG5cbmltcG9ydCBta2NlcnQgZnJvbSAndml0ZS1wbHVnaW4tbWtjZXJ0J1xuXG5pbXBvcnQgeyB2aXRlUGx1Z2luQXV0b1BhZ2VzIH0gZnJvbSAnLi92aXRlL3BsdWdpbnMvYXV0by1wYWdlcydcbmltcG9ydCB7IHZpdGVQbHVnaW5BdXRvSW1wb3J0IH0gZnJvbSAnLi92aXRlL3BsdWdpbnMvYXV0by1pbXBvcnQnXG5pbXBvcnQgeyB2aXRlUGx1Z2luQ29tcG9uZW50cyB9IGZyb20gJy4vdml0ZS9wbHVnaW5zL2NvbXBvbmVudHMnXG5pbXBvcnQgeyB2aXRlUGx1Z2luU3ZnSWNvbnMgfSBmcm9tICcuL3ZpdGUvcGx1Z2lucy9zdmctaWNvbidcbmltcG9ydCB7IHZpdGVQbHVnaW5Vbm9jc3MgfSBmcm9tICcuL3ZpdGUvcGx1Z2lucy91bm9jc3MnXG5pbXBvcnQgeyBWaXRlQ29uZmlnT3B0aW1pemVEZXBzIH0gZnJvbSAnLi92aXRlL2NvbmZpZy9vcHRpbWl6ZS1kZXBzJ1xuXG5jb25zdCBwYXRoU3JjID0gZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBjb21tYW5kLCBtb2RlIH0pID0+IHtcbiAgY29uc3QgaXNEZXYgPSBjb21tYW5kID09PSAnc2VydmUnXG5cbiAgY29uc3QgY29uZmlnOiBVc2VyQ29uZmlnID0ge1xuICAgIHBsdWdpbnM6IFtcbiAgICAgIHZ1ZSgpLFxuICAgICAgdnVlSnN4KCksXG4gICAgICB2dWVJMThuKCksXG4gICAgICBveGxpbnRQbHVnaW4oeyBhbGxvdzogWyduby11bnNhZmUtZGVjbGFyYXRpb24tbWVyZ2luZycsICduby11bnVzZWQtdmFycyddIH0pLFxuICAgICAgLy8gZXNsaW50UGx1Z2luKHt9KSxcblxuICAgICAgLy8ganVzdCByZW1vdmUgc3BlY2lhbCBwbHVnaW4gd2hlbiB1bm5lZWRcbiAgICAgIHZpdGVQbHVnaW5Vbm9jc3MoKSxcbiAgICAgIHZpdGVQbHVnaW5BdXRvUGFnZXMoKSxcbiAgICAgIHZpdGVQbHVnaW5BdXRvSW1wb3J0KCksXG4gICAgICB2aXRlUGx1Z2luQ29tcG9uZW50cygpLFxuICAgICAgdml0ZVBsdWdpblN2Z0ljb25zKHBhdGhTcmMpLFxuICAgIF0sXG5cbiAgICByZXNvbHZlOiB7IGFsaWFzOiB7ICdAJzogcGF0aFNyYywgJ34vJzogcGF0aFNyYyArICcvJyB9IH0sXG4gICAgY3NzOiB7XG4gICAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICAgIHNjc3M6IHtcbiAgICAgICAgICBhZGRpdGlvbmFsRGF0YTogYEB1c2UgXCJAL3N0eWxlcy92YXJzLnNjc3NcIiBhcyAqO2AsXG4gICAgICAgICAgYXBpOiAnbW9kZXJuJyxcbiAgICAgICAgICBxdWlldERlcHM6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgYnVpbGQ6IHtcbiAgICAgIHRlcnNlck9wdGlvbnM6IHsgY29tcHJlc3M6IHsgZHJvcF9jb25zb2xlOiB0cnVlLCBkcm9wX2RlYnVnZ2VyOiB0cnVlIH0gfSxcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgbWFudWFsQ2h1bmtzOiB7ICdpbmRleC1jb3JlJzogWyd2dWUnLCAndnVlLXJvdXRlcicsICdwaW5pYScsICdAdnVldXNlL2NvcmUnXSB9LFxuICAgICAgICAgIGNodW5rRmlsZU5hbWVzOiAnanMvW25hbWVdLVtoYXNoXS5qcycsIC8vIFx1NUYxNVx1NTE2NVx1NjU4N1x1NEVGNlx1NTQwRFx1NzY4NFx1NTQwRFx1NzlGMFxuICAgICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnanMvW25hbWVdLVtoYXNoXS5qcycsIC8vIFx1NTMwNVx1NzY4NFx1NTE2NVx1NTNFM1x1NjU4N1x1NEVGNlx1NTQwRFx1NzlGMFxuICAgICAgICAgIGFzc2V0RmlsZU5hbWVzOiAnW2V4dF0vW25hbWVdLVtoYXNoXS5bZXh0XScsIC8vIFx1OEQ0NFx1NkU5MFx1NjU4N1x1NEVGNlx1NTBDRiBcdTVCNTdcdTRGNTNcdUZGMENcdTU2RkVcdTcyNDdcdTdCNDlcbiAgICAgICAgfSxcbiAgICAgICAgZXh0ZXJuYWw6IFtdLCAvLyBQTEFDRUhPTERFUiBET05UIFJFTU9WRSBUSElTIExJTkVcbiAgICAgICAgcGx1Z2luczogW10sIC8vIFBMQUNFSE9MREVSIERPTlQgUkVNT1ZFIFRISVMgTElORVxuICAgICAgfSxcbiAgICAgIG91dERpcjogYGRpc3QvJHt7IHByb2R1Y3Rpb246ICdwcm9kJywgZGV2ZWxvcG1lbnQ6ICdkZXYnIH1bbW9kZV0gfHwgbW9kZX1gLFxuICAgIH0sXG4gIH1cblxuICBpZiAoaXNEZXYpIHtcbiAgICAvLyAtLS0tLS0tLS0tIG9ubHkgZGV2IC0tLS0tLS0tLS1cbiAgICBjb25zdCBzZXJ2ZXIgPSB7XG4gICAgICBwb3J0OiAzMDAxLFxuICAgICAgaG9zdDogJzAuMC4wLjAnLFxuICAgICAgcHJveHk6IHt9IGFzIGFueSxcbiAgICB9XG4gICAgY29uc3QgY3JlYXRlUHJveHkgPSAodGFyZ2V0OiBzdHJpbmcsIHBhdGg6IHN0cmluZyA9ICcvYXBpJywgcmV3OiBSZWdFeHAgPSAvXlxcL2FwaS8pID0+IHtcbiAgICAgIHNlcnZlci5wcm94eVtwYXRoXSA9IHtcbiAgICAgICAgdGFyZ2V0LFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIHdzOiB0cnVlLFxuICAgICAgICByZXdyaXRlOiAocDogYW55KSA9PiBwLnJlcGxhY2UocmV3LCAnJyksXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gY3JlYXRlUHJveHkoJ2h0dHA6Ly8xMjcuMC4wLjE6NDUyMy9tMS81NTM0MTQ4LTUyMTA3NDYtZGVmYXVsdCcsICcvYXBpJywgL15cXC9hcGkvKVxuICAgIGNyZWF0ZVByb3h5KCdodHRwczovL2FwaWZveG1vY2suY29tL20xLzU1MzQxNDgtNTIxMDc0Ni1kZWZhdWx0JywgJy9hcGknLCAvXlxcL2FwaS8pXG4gICAgY29uZmlnLnNlcnZlciA9IHNlcnZlclxuXG4gICAgLy8gaHR0cHMgc3VwcG9ydFxuICAgIGNvbnN0IGh0dHBzID0gdHJ1ZVxuICAgIGlmIChodHRwcykge1xuICAgICAgOyhjb25maWcuc2VydmVyIGFzIGFueSkuaHR0cHMgPSB0cnVlXG4gICAgICBjb25maWcucGx1Z2lucyA9IGNvbmZpZy5wbHVnaW5zPy5jb25jYXQoW21rY2VydCgpXSlcbiAgICB9XG5cbiAgICBjb25maWcucGx1Z2lucyA9IGNvbmZpZy5wbHVnaW5zPy5jb25jYXQoW3Z1ZURldlRvb2xzKCldKVxuICAgIGNvbmZpZy5vcHRpbWl6ZURlcHMgPSBWaXRlQ29uZmlnT3B0aW1pemVEZXBzXG4gICAgcmV0dXJuIGNvbmZpZ1xuICB9IGVsc2Uge1xuICAgIC8vIC0tLS0tLS0tLS0gIG9ubHkgcHJvZHVjdGlvbiBhbmQgdGVzdCAgLS0tLS0tLS0tLVxuICAgIGNvbmZpZy5wbHVnaW5zID0gY29uZmlnLnBsdWdpbnM/LmNvbmNhdChbXSlcblxuICAgIGlmIChtb2RlID09PSAndGVzdCcpIHtcbiAgICAgIC8vIC0tLS0tLS0tLS0gb25seSB0ZXN0IC0tLS0tLS0tLS1cbiAgICB9XG4gICAgaWYgKG1vZGUgPT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgLy8gLS0tLS0tLS0tLSBvbmx5IHByb2R1Y3Rpb24gLS0tLS0tLS0tLVxuICAgIH1cbiAgfVxuXG4gIGNvbmZpZy5wbHVnaW5zID0gY29uZmlnLnBsdWdpbnM/LmNvbmNhdChbXSlcbiAgcmV0dXJuIGNvbmZpZ1xufSlcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2FrYWkvRG9jdW1lbnRzL0dpdEh1Yi92dWUtemVyby1hZG1pbi92aXRlL3BsdWdpbnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9ha2FpL0RvY3VtZW50cy9HaXRIdWIvdnVlLXplcm8tYWRtaW4vdml0ZS9wbHVnaW5zL2F1dG8tcGFnZXMudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2FrYWkvRG9jdW1lbnRzL0dpdEh1Yi92dWUtemVyby1hZG1pbi92aXRlL3BsdWdpbnMvYXV0by1wYWdlcy50c1wiO2ltcG9ydCBQYWdlcyBmcm9tICd2aXRlLXBsdWdpbi1wYWdlcydcblxuZXhwb3J0IGNvbnN0IHZpdGVQbHVnaW5BdXRvUGFnZXMgPSAoKSA9PlxuICBQYWdlcyh7XG4gICAgZGlyczogW3sgZGlyOiAnc3JjL3BhZ2VzJywgYmFzZVJvdXRlOiAnLycgfV0sXG4gICAgZXhjbHVkZTogWycqKi9fdmlld3MvKionLCAnKiovY29tcG9uZW50cy8qKiddLFxuICAgIGltcG9ydE1vZGU6ICdhc3luYycsXG4gICAgZXh0ZW5kUm91dGUocm91dGUsIF9wYXJlbnQpIHtcbiAgICAgIHJldHVybiB7IC4uLnJvdXRlLCBtZXRhOiB7IGF1dGg6IHRydWUsIGxheW91dDogJ2Jhc2UnIH0gfVxuICAgIH0sXG4gIH0pXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9ha2FpL0RvY3VtZW50cy9HaXRIdWIvdnVlLXplcm8tYWRtaW4vdml0ZS9wbHVnaW5zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvYWthaS9Eb2N1bWVudHMvR2l0SHViL3Z1ZS16ZXJvLWFkbWluL3ZpdGUvcGx1Z2lucy9hdXRvLWltcG9ydC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvYWthaS9Eb2N1bWVudHMvR2l0SHViL3Z1ZS16ZXJvLWFkbWluL3ZpdGUvcGx1Z2lucy9hdXRvLWltcG9ydC50c1wiO2ltcG9ydCBBdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnXG5cbmltcG9ydCB7IEVsZW1lbnRQbHVzUmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnXG5cbmV4cG9ydCBjb25zdCB2aXRlUGx1Z2luQXV0b0ltcG9ydCA9ICgpID0+XG4gIEF1dG9JbXBvcnQoe1xuICAgIGluY2x1ZGU6IFsvXFwuW3RqXXN4PyQvLCAvXFwudnVlJC8sIC9cXC52dWVcXD92dWUvLCAvXFwubWQkL10sXG4gICAgaW1wb3J0czogWyd2dWUnLCAndnVlLXJvdXRlcicsICdwaW5pYScsICd2dWUtaTE4biddLCAvLyBnbG9iYWwgaW1wb3J0cyB0byByZWdpc3RlclxuICAgIGRpcnM6IFsnLi9zcmMvaG9va3MvKi50cyonLCAnLi9zcmMvY29tcG9uZW50cyddLFxuICAgIGVzbGludHJjOiB7XG4gICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgZmlsZXBhdGg6ICcuL2VzbGludHJjLWF1dG8taW1wb3J0Lmpzb24nLFxuICAgICAgZ2xvYmFsc1Byb3BWYWx1ZTogdHJ1ZSxcbiAgICB9LFxuICAgIGR0czogJy4vc3JjL2F1dG8taW1wb3J0cy5kLnRzJyxcbiAgICByZXNvbHZlcnM6IFtFbGVtZW50UGx1c1Jlc29sdmVyKCldLFxuICB9KVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYWthaS9Eb2N1bWVudHMvR2l0SHViL3Z1ZS16ZXJvLWFkbWluL3ZpdGUvcGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2FrYWkvRG9jdW1lbnRzL0dpdEh1Yi92dWUtemVyby1hZG1pbi92aXRlL3BsdWdpbnMvY29tcG9uZW50cy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvYWthaS9Eb2N1bWVudHMvR2l0SHViL3Z1ZS16ZXJvLWFkbWluL3ZpdGUvcGx1Z2lucy9jb21wb25lbnRzLnRzXCI7aW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcbmltcG9ydCB7IEVsZW1lbnRQbHVzUmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnXG5cbmV4cG9ydCBjb25zdCB2aXRlUGx1Z2luQ29tcG9uZW50cyA9ICgpID0+XG4gIENvbXBvbmVudHMoe1xuICAgIGluY2x1ZGU6IFsvXFwudnVlJC8sIC9cXC52dWVcXD92dWUvXSxcbiAgICBleHRlbnNpb25zOiBbJ3Z1ZSddLFxuICAgIGRpcnM6IFtcbiAgICAgICdzcmMvY29tcG9uZW50cycsXG4gICAgICAnc3JjL2xheW91dHMnLFxuICAgICAgJ3NyYy9wYWdlcy9jb21wb25lbnRzJyxcbiAgICAgICdzcmMvcGFnZXMvX3ZpZXdzJyxcbiAgICAgICdzcmMvaG9va3MnLFxuICAgIF0sIC8vIGZvciBhdXRvIGltcG9ydCBwcm9qZWN0IGNvbXBvbmVudHNcbiAgICBkdHM6ICcuL3NyYy9jb21wb25lbnRzLmQudHMnLFxuICAgIHJlc29sdmVyczogW0VsZW1lbnRQbHVzUmVzb2x2ZXIoeyBpbXBvcnRTdHlsZTogJ3Nhc3MnIH0pXSxcbiAgfSlcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2FrYWkvRG9jdW1lbnRzL0dpdEh1Yi92dWUtemVyby1hZG1pbi92aXRlL3BsdWdpbnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9ha2FpL0RvY3VtZW50cy9HaXRIdWIvdnVlLXplcm8tYWRtaW4vdml0ZS9wbHVnaW5zL3N2Zy1pY29uLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9ha2FpL0RvY3VtZW50cy9HaXRIdWIvdnVlLXplcm8tYWRtaW4vdml0ZS9wbHVnaW5zL3N2Zy1pY29uLnRzXCI7aW1wb3J0IHsgY3JlYXRlU3ZnSWNvbnNQbHVnaW4gfSBmcm9tICd2aXRlLXBsdWdpbi1zdmctaWNvbnMnXG5cbmV4cG9ydCBjb25zdCB2aXRlUGx1Z2luU3ZnSWNvbnMgPSAocGF0aFNyYzogc3RyaW5nKSA9PlxuICBjcmVhdGVTdmdJY29uc1BsdWdpbih7XG4gICAgaWNvbkRpcnM6IFtgJHtwYXRoU3JjfS9pY29uc2BdLFxuICAgIHN5bWJvbElkOiAnaWNvbi1bZGlyXS1bbmFtZV0nLFxuICAgIGluamVjdDogJ2JvZHktbGFzdCcsIC8vIG9yIGJvZHktZmlyc3RcbiAgICBjdXN0b21Eb21JZDogJ19fc3ZnX19pY29uc19fZG9tX18nXG4gIH0pXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9ha2FpL0RvY3VtZW50cy9HaXRIdWIvdnVlLXplcm8tYWRtaW4vdml0ZS9wbHVnaW5zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvYWthaS9Eb2N1bWVudHMvR2l0SHViL3Z1ZS16ZXJvLWFkbWluL3ZpdGUvcGx1Z2lucy91bm9jc3MudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2FrYWkvRG9jdW1lbnRzL0dpdEh1Yi92dWUtemVyby1hZG1pbi92aXRlL3BsdWdpbnMvdW5vY3NzLnRzXCI7aW1wb3J0IFVub0NTUyBmcm9tICd1bm9jc3Mvdml0ZSdcbmltcG9ydCB7IHByZXNldFVubyB9IGZyb20gJ3Vub2NzcydcblxuaW1wb3J0IHByZXNldFJlbVRvUHggZnJvbSAnQHVub2Nzcy9wcmVzZXQtcmVtLXRvLXB4J1xuaW1wb3J0IHRyYW5zZm9ybWVyRGlyZWN0aXZlcyBmcm9tICdAdW5vY3NzL3RyYW5zZm9ybWVyLWRpcmVjdGl2ZXMnXG5cbmV4cG9ydCBjb25zdCB2aXRlUGx1Z2luVW5vY3NzID0gKCkgPT5cbiAgVW5vQ1NTKHtcbiAgICBwcmVzZXRzOiBbXG4gICAgICBwcmVzZXRVbm8oKSxcbiAgICAgIHByZXNldFJlbVRvUHgoeyBiYXNlRm9udFNpemU6IDQgfSksIC8vIGZvciBweCBieSBkZWZhdWx0LCBsaWtlIHctMTAwIC0+IHdpZHRoOjEwMHB4XG4gICAgXSxcbiAgICB0aGVtZToge1xuICAgICAgYnJlYWtwb2ludHM6IHtcbiAgICAgICAgeHM6ICczMjBweCcsXG4gICAgICAgIHNtOiAnNTc2cHgnLFxuICAgICAgICBtZDogJzc2OHB4JyxcbiAgICAgICAgbGc6ICcxMDI0cHgnLFxuICAgICAgICB4bDogJzEyMDBweCcsXG4gICAgICAgIHh4bDogJzE0MDBweCcsXG4gICAgICB9LFxuICAgIH0sXG4gICAgdHJhbnNmb3JtZXJzOiBbXG4gICAgICB0cmFuc2Zvcm1lckRpcmVjdGl2ZXMoKSwgLy8gc3VwcG9ydCBAYXBwbHlcdTMwMDFAc2NyZWVuIGFuZCB0aGVtZSgpXG4gICAgXSxcbiAgICBzaG9ydGN1dHM6IHtcbiAgICAgICdmbGV4LWNlbnRlcic6ICdmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlcicsXG4gICAgfSxcbiAgfSlcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2FrYWkvRG9jdW1lbnRzL0dpdEh1Yi92dWUtemVyby1hZG1pbi92aXRlL2NvbmZpZ1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2FrYWkvRG9jdW1lbnRzL0dpdEh1Yi92dWUtemVyby1hZG1pbi92aXRlL2NvbmZpZy9vcHRpbWl6ZS1kZXBzLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9ha2FpL0RvY3VtZW50cy9HaXRIdWIvdnVlLXplcm8tYWRtaW4vdml0ZS9jb25maWcvb3B0aW1pemUtZGVwcy50c1wiO2V4cG9ydCBjb25zdCBWaXRlQ29uZmlnT3B0aW1pemVEZXBzID0ge1xuICBpbmNsdWRlOiBbXG4gICAgJ3Z1ZScsXG4gICAgJ3Z1ZS1yb3V0ZXInLFxuICAgICdwaW5pYScsXG4gICAgJ0B2dWV1c2UvY29yZScsXG4gICAgJ3Z1ZS1pMThuJyxcbiAgICAnYXhpb3MnLFxuICAgICdlbGVtZW50LXBsdXMvZXMnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9iYXNlL3N0eWxlL2NzcycsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL21lc3NhZ2Uvc3R5bGUvY3NzJyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvYmFzZS9zdHlsZS9pbmRleCcsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2FmZml4L3N0eWxlL2NzcycsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2FmZml4L3N0eWxlL2luZGV4JyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvYWxlcnQvc3R5bGUvY3NzJyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvYWxlcnQvc3R5bGUvaW5kZXgnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9hbmNob3Ivc3R5bGUvY3NzJyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvYW5jaG9yL3N0eWxlL2luZGV4JyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvYW5jaG9yLWxpbmsvc3R5bGUvY3NzJyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvYW5jaG9yLWxpbmsvc3R5bGUvaW5kZXgnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9hc2lkZS9zdHlsZS9jc3MnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9hc2lkZS9zdHlsZS9pbmRleCcsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2F1dG9jb21wbGV0ZS9zdHlsZS9jc3MnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9hdXRvY29tcGxldGUvc3R5bGUvaW5kZXgnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9hdmF0YXIvc3R5bGUvY3NzJyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvYXZhdGFyL3N0eWxlL2luZGV4JyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvYmFja3RvcC9zdHlsZS9jc3MnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9iYWNrdG9wL3N0eWxlL2luZGV4JyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvYmFkZ2Uvc3R5bGUvY3NzJyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvYmFkZ2Uvc3R5bGUvaW5kZXgnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9iYXNlL3N0eWxlL2NzcycsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2Jhc2Uvc3R5bGUvaW5kZXgnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9icmVhZGNydW1iL3N0eWxlL2NzcycsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2JyZWFkY3J1bWIvc3R5bGUvaW5kZXgnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9icmVhZGNydW1iLWl0ZW0vc3R5bGUvY3NzJyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvYnJlYWRjcnVtYi1pdGVtL3N0eWxlL2luZGV4JyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvYnV0dG9uL3N0eWxlL2NzcycsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2J1dHRvbi9zdHlsZS9pbmRleCcsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2J1dHRvbi1ncm91cC9zdHlsZS9jc3MnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9idXR0b24tZ3JvdXAvc3R5bGUvaW5kZXgnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9jYWxlbmRhci9zdHlsZS9jc3MnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9jYWxlbmRhci9zdHlsZS9pbmRleCcsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2NhcmQvc3R5bGUvY3NzJyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvY2FyZC9zdHlsZS9pbmRleCcsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2Nhcm91c2VsL3N0eWxlL2NzcycsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2Nhcm91c2VsL3N0eWxlL2luZGV4JyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvY2Fyb3VzZWwtaXRlbS9zdHlsZS9jc3MnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9jYXJvdXNlbC1pdGVtL3N0eWxlL2luZGV4JyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvY2FzY2FkZXIvc3R5bGUvY3NzJyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvY2FzY2FkZXIvc3R5bGUvaW5kZXgnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9jYXNjYWRlci1wYW5lbC9zdHlsZS9jc3MnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9jYXNjYWRlci1wYW5lbC9zdHlsZS9pbmRleCcsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2NoZWNrLXRhZy9zdHlsZS9jc3MnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9jaGVjay10YWcvc3R5bGUvaW5kZXgnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9jaGVja2JveC9zdHlsZS9jc3MnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9jaGVja2JveC9zdHlsZS9pbmRleCcsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2NoZWNrYm94LWJ1dHRvbi9zdHlsZS9jc3MnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9jaGVja2JveC1idXR0b24vc3R5bGUvaW5kZXgnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9jaGVja2JveC1ncm91cC9zdHlsZS9jc3MnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9jaGVja2JveC1ncm91cC9zdHlsZS9pbmRleCcsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2NvbC9zdHlsZS9jc3MnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9jb2wvc3R5bGUvaW5kZXgnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9jb2xsYXBzZS9zdHlsZS9jc3MnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9jb2xsYXBzZS9zdHlsZS9pbmRleCcsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2NvbGxhcHNlLWl0ZW0vc3R5bGUvY3NzJyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvY29sbGFwc2UtaXRlbS9zdHlsZS9pbmRleCcsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2NvbGxhcHNlLXRyYW5zaXRpb24vc3R5bGUvY3NzJyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvY29sbGFwc2UtdHJhbnNpdGlvbi9zdHlsZS9pbmRleCcsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2NvbG9yLXBpY2tlci9zdHlsZS9jc3MnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9jb2xvci1waWNrZXIvc3R5bGUvaW5kZXgnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9jb25maWctcHJvdmlkZXIvc3R5bGUvY3NzJyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvY29uZmlnLXByb3ZpZGVyL3N0eWxlL2luZGV4JyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvY29udGFpbmVyL3N0eWxlL2NzcycsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2NvbnRhaW5lci9zdHlsZS9pbmRleCcsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2NvdW50ZG93bi9zdHlsZS9jc3MnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9jb3VudGRvd24vc3R5bGUvaW5kZXgnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9kYXRlLXBpY2tlci9zdHlsZS9jc3MnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9kYXRlLXBpY2tlci9zdHlsZS9pbmRleCcsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2Rlc2NyaXB0aW9ucy9zdHlsZS9jc3MnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9kZXNjcmlwdGlvbnMvc3R5bGUvaW5kZXgnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9kZXNjcmlwdGlvbnMtaXRlbS9zdHlsZS9jc3MnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9kZXNjcmlwdGlvbnMtaXRlbS9zdHlsZS9pbmRleCcsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2RpYWxvZy9zdHlsZS9jc3MnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9kaWFsb2cvc3R5bGUvaW5kZXgnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9kaXZpZGVyL3N0eWxlL2NzcycsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2RpdmlkZXIvc3R5bGUvaW5kZXgnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9kcmF3ZXIvc3R5bGUvY3NzJyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvZHJhd2VyL3N0eWxlL2luZGV4JyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvZHJvcGRvd24vc3R5bGUvY3NzJyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvZHJvcGRvd24vc3R5bGUvaW5kZXgnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9kcm9wZG93bi1pdGVtL3N0eWxlL2NzcycsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2Ryb3Bkb3duLWl0ZW0vc3R5bGUvaW5kZXgnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9kcm9wZG93bi1tZW51L3N0eWxlL2NzcycsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2Ryb3Bkb3duLW1lbnUvc3R5bGUvaW5kZXgnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9lbXB0eS9zdHlsZS9jc3MnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9lbXB0eS9zdHlsZS9pbmRleCcsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2Zvb3Rlci9zdHlsZS9jc3MnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9mb290ZXIvc3R5bGUvaW5kZXgnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9mb3JtL3N0eWxlL2NzcycsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2Zvcm0vc3R5bGUvaW5kZXgnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9mb3JtLWl0ZW0vc3R5bGUvY3NzJyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvZm9ybS1pdGVtL3N0eWxlL2luZGV4JyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvaGVhZGVyL3N0eWxlL2NzcycsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2hlYWRlci9zdHlsZS9pbmRleCcsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2ljb24vc3R5bGUvY3NzJyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvaWNvbi9zdHlsZS9pbmRleCcsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2ltYWdlL3N0eWxlL2NzcycsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2ltYWdlL3N0eWxlL2luZGV4JyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvaW1hZ2Utdmlld2VyL3N0eWxlL2NzcycsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2ltYWdlLXZpZXdlci9zdHlsZS9pbmRleCcsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2luZmluaXRlLXNjcm9sbC9zdHlsZS9jc3MnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9pbmZpbml0ZS1zY3JvbGwvc3R5bGUvaW5kZXgnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9pbnB1dC9zdHlsZS9jc3MnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9pbnB1dC9zdHlsZS9pbmRleCcsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2lucHV0LW51bWJlci9zdHlsZS9jc3MnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9pbnB1dC1udW1iZXIvc3R5bGUvaW5kZXgnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9saW5rL3N0eWxlL2NzcycsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2xpbmsvc3R5bGUvaW5kZXgnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9sb2FkaW5nL3N0eWxlL2NzcycsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2xvYWRpbmcvc3R5bGUvaW5kZXgnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9tYWluL3N0eWxlL2NzcycsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL21haW4vc3R5bGUvaW5kZXgnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9tZW50aW9uL3N0eWxlL2NzcycsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL21lbnRpb24vc3R5bGUvaW5kZXgnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9tZW51L3N0eWxlL2NzcycsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL21lbnUvc3R5bGUvaW5kZXgnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9tZW51LWl0ZW0vc3R5bGUvY3NzJyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvbWVudS1pdGVtL3N0eWxlL2luZGV4JyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvbWVudS1pdGVtLWdyb3VwL3N0eWxlL2NzcycsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL21lbnUtaXRlbS1ncm91cC9zdHlsZS9pbmRleCcsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL21lc3NhZ2Uvc3R5bGUvY3NzJyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvbWVzc2FnZS9zdHlsZS9pbmRleCcsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL21lc3NhZ2UtYm94L3N0eWxlL2NzcycsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL21lc3NhZ2UtYm94L3N0eWxlL2luZGV4JyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvbm90aWZpY2F0aW9uL3N0eWxlL2NzcycsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL25vdGlmaWNhdGlvbi9zdHlsZS9pbmRleCcsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL29wdGlvbi9zdHlsZS9jc3MnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9vcHRpb24vc3R5bGUvaW5kZXgnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9vcHRpb24tZ3JvdXAvc3R5bGUvY3NzJyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvb3B0aW9uLWdyb3VwL3N0eWxlL2luZGV4JyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvb3ZlcmxheS9zdHlsZS9jc3MnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9vdmVybGF5L3N0eWxlL2luZGV4JyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvcGFnZS1oZWFkZXIvc3R5bGUvY3NzJyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvcGFnZS1oZWFkZXIvc3R5bGUvaW5kZXgnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9wYWdpbmF0aW9uL3N0eWxlL2NzcycsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3BhZ2luYXRpb24vc3R5bGUvaW5kZXgnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9wb3Bjb25maXJtL3N0eWxlL2NzcycsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3BvcGNvbmZpcm0vc3R5bGUvaW5kZXgnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9wb3BvdmVyL3N0eWxlL2NzcycsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3BvcG92ZXIvc3R5bGUvaW5kZXgnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9wb3BwZXIvc3R5bGUvY3NzJyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvcG9wcGVyL3N0eWxlL2luZGV4JyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvcHJvZ3Jlc3Mvc3R5bGUvY3NzJyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvcHJvZ3Jlc3Mvc3R5bGUvaW5kZXgnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9yYWRpby9zdHlsZS9jc3MnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9yYWRpby9zdHlsZS9pbmRleCcsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3JhZGlvLWJ1dHRvbi9zdHlsZS9jc3MnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9yYWRpby1idXR0b24vc3R5bGUvaW5kZXgnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9yYWRpby1ncm91cC9zdHlsZS9jc3MnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9yYWRpby1ncm91cC9zdHlsZS9pbmRleCcsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3JhdGUvc3R5bGUvY3NzJyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvcmF0ZS9zdHlsZS9pbmRleCcsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3Jlc3VsdC9zdHlsZS9jc3MnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9yZXN1bHQvc3R5bGUvaW5kZXgnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9yb3cvc3R5bGUvY3NzJyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvcm93L3N0eWxlL2luZGV4JyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvc2Nyb2xsYmFyL3N0eWxlL2NzcycsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3Njcm9sbGJhci9zdHlsZS9pbmRleCcsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3NlZ21lbnRlZC9zdHlsZS9jc3MnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9zZWdtZW50ZWQvc3R5bGUvaW5kZXgnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9zZWxlY3Qvc3R5bGUvY3NzJyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvc2VsZWN0L3N0eWxlL2luZGV4JyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvc2VsZWN0LXYyL3N0eWxlL2NzcycsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3NlbGVjdC12Mi9zdHlsZS9pbmRleCcsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3NrZWxldG9uL3N0eWxlL2NzcycsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3NrZWxldG9uL3N0eWxlL2luZGV4JyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvc2tlbGV0b24taXRlbS9zdHlsZS9jc3MnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9za2VsZXRvbi1pdGVtL3N0eWxlL2luZGV4JyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvc2xpZGVyL3N0eWxlL2NzcycsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3NsaWRlci9zdHlsZS9pbmRleCcsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3NwYWNlL3N0eWxlL2NzcycsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3NwYWNlL3N0eWxlL2luZGV4JyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvc3RhdGlzdGljL3N0eWxlL2NzcycsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3N0YXRpc3RpYy9zdHlsZS9pbmRleCcsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3N0ZXAvc3R5bGUvY3NzJyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvc3RlcC9zdHlsZS9pbmRleCcsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3N0ZXBzL3N0eWxlL2NzcycsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3N0ZXBzL3N0eWxlL2luZGV4JyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvc3ViLW1lbnUvc3R5bGUvY3NzJyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvc3ViLW1lbnUvc3R5bGUvaW5kZXgnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9zd2l0Y2gvc3R5bGUvY3NzJyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvc3dpdGNoL3N0eWxlL2luZGV4JyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvdGFiLXBhbmUvc3R5bGUvY3NzJyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvdGFiLXBhbmUvc3R5bGUvaW5kZXgnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy90YWJsZS9zdHlsZS9jc3MnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy90YWJsZS9zdHlsZS9pbmRleCcsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3RhYmxlLWNvbHVtbi9zdHlsZS9jc3MnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy90YWJsZS1jb2x1bW4vc3R5bGUvaW5kZXgnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy90YWJsZS12Mi9zdHlsZS9jc3MnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy90YWJsZS12Mi9zdHlsZS9pbmRleCcsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3RhYnMvc3R5bGUvY3NzJyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvdGFicy9zdHlsZS9pbmRleCcsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3RhZy9zdHlsZS9jc3MnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy90YWcvc3R5bGUvaW5kZXgnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy90ZWxlcG9ydC9zdHlsZS9jc3MnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy90ZWxlcG9ydC9zdHlsZS9pbmRleCcsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3RleHQvc3R5bGUvY3NzJyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvdGV4dC9zdHlsZS9pbmRleCcsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3RpbWUtcGlja2VyL3N0eWxlL2NzcycsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3RpbWUtcGlja2VyL3N0eWxlL2luZGV4JyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvdGltZS1zZWxlY3Qvc3R5bGUvY3NzJyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvdGltZS1zZWxlY3Qvc3R5bGUvaW5kZXgnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy90aW1lbGluZS9zdHlsZS9jc3MnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy90aW1lbGluZS9zdHlsZS9pbmRleCcsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3RpbWVsaW5lLWl0ZW0vc3R5bGUvY3NzJyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvdGltZWxpbmUtaXRlbS9zdHlsZS9pbmRleCcsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3Rvb2x0aXAvc3R5bGUvY3NzJyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvdG9vbHRpcC9zdHlsZS9pbmRleCcsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3RvdXIvc3R5bGUvY3NzJyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvdG91ci9zdHlsZS9pbmRleCcsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3RvdXItc3RlcC9zdHlsZS9jc3MnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy90b3VyLXN0ZXAvc3R5bGUvaW5kZXgnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy90cmFuc2Zlci9zdHlsZS9jc3MnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy90cmFuc2Zlci9zdHlsZS9pbmRleCcsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3RyZWUvc3R5bGUvY3NzJyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvdHJlZS9zdHlsZS9pbmRleCcsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3RyZWUtc2VsZWN0L3N0eWxlL2NzcycsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3RyZWUtc2VsZWN0L3N0eWxlL2luZGV4JyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvdHJlZS12Mi9zdHlsZS9jc3MnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy90cmVlLXYyL3N0eWxlL2luZGV4JyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvdXBsb2FkL3N0eWxlL2NzcycsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3VwbG9hZC9zdHlsZS9pbmRleCcsXG4gICAgJ2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3ZpcnR1YWwtbGlzdC9zdHlsZS9jc3MnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy92aXJ0dWFsLWxpc3Qvc3R5bGUvaW5kZXgnLFxuICAgICdlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy93YXRlcm1hcmsvc3R5bGUvY3NzJyxcbiAgICAnZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvd2F0ZXJtYXJrL3N0eWxlL2luZGV4JyxcbiAgXSwgLy8gYXdhaXQgdml0ZSB0byBzb2x2ZSB0aGlzIGJ1Z1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFtVCxTQUFTLGVBQWUsV0FBVztBQUV0VixTQUFTLG9CQUFnQztBQUN6QyxPQUFPLFNBQVM7QUFDaEIsT0FBTyxZQUFZO0FBQ25CLE9BQU8sYUFBYTtBQUNwQixPQUFPLGlCQUFpQjtBQUN4QixPQUFPLGtCQUFrQjtBQUl6QixPQUFPLFlBQVk7OztBQ1hxVSxPQUFPLFdBQVc7QUFFblcsSUFBTSxzQkFBc0IsTUFDakMsTUFBTTtBQUFBLEVBQ0osTUFBTSxDQUFDLEVBQUUsS0FBSyxhQUFhLFdBQVcsSUFBSSxDQUFDO0FBQUEsRUFDM0MsU0FBUyxDQUFDLGdCQUFnQixrQkFBa0I7QUFBQSxFQUM1QyxZQUFZO0FBQUEsRUFDWixZQUFZLE9BQU8sU0FBUztBQUMxQixXQUFPLEVBQUUsR0FBRyxPQUFPLE1BQU0sRUFBRSxNQUFNLE1BQU0sUUFBUSxPQUFPLEVBQUU7QUFBQSxFQUMxRDtBQUNGLENBQUM7OztBQ1Z1VixPQUFPLGdCQUFnQjtBQUVqWCxTQUFTLDJCQUEyQjtBQUU3QixJQUFNLHVCQUF1QixNQUNsQyxXQUFXO0FBQUEsRUFDVCxTQUFTLENBQUMsY0FBYyxVQUFVLGNBQWMsT0FBTztBQUFBLEVBQ3ZELFNBQVMsQ0FBQyxPQUFPLGNBQWMsU0FBUyxVQUFVO0FBQUE7QUFBQSxFQUNsRCxNQUFNLENBQUMscUJBQXFCLGtCQUFrQjtBQUFBLEVBQzlDLFVBQVU7QUFBQSxJQUNSLFNBQVM7QUFBQSxJQUNULFVBQVU7QUFBQSxJQUNWLGtCQUFrQjtBQUFBLEVBQ3BCO0FBQUEsRUFDQSxLQUFLO0FBQUEsRUFDTCxXQUFXLENBQUMsb0JBQW9CLENBQUM7QUFDbkMsQ0FBQzs7O0FDaEJxVixPQUFPLGdCQUFnQjtBQUMvVyxTQUFTLHVCQUFBQSw0QkFBMkI7QUFFN0IsSUFBTSx1QkFBdUIsTUFDbEMsV0FBVztBQUFBLEVBQ1QsU0FBUyxDQUFDLFVBQVUsWUFBWTtBQUFBLEVBQ2hDLFlBQVksQ0FBQyxLQUFLO0FBQUEsRUFDbEIsTUFBTTtBQUFBLElBQ0o7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRjtBQUFBO0FBQUEsRUFDQSxLQUFLO0FBQUEsRUFDTCxXQUFXLENBQUNDLHFCQUFvQixFQUFFLGFBQWEsT0FBTyxDQUFDLENBQUM7QUFDMUQsQ0FBQzs7O0FDaEJpVixTQUFTLDRCQUE0QjtBQUVsWCxJQUFNLHFCQUFxQixDQUFDQyxhQUNqQyxxQkFBcUI7QUFBQSxFQUNuQixVQUFVLENBQUMsR0FBR0EsUUFBTyxRQUFRO0FBQUEsRUFDN0IsVUFBVTtBQUFBLEVBQ1YsUUFBUTtBQUFBO0FBQUEsRUFDUixhQUFhO0FBQ2YsQ0FBQzs7O0FDUjZVLE9BQU8sWUFBWTtBQUNuVyxTQUFTLGlCQUFpQjtBQUUxQixPQUFPLG1CQUFtQjtBQUMxQixPQUFPLDJCQUEyQjtBQUUzQixJQUFNLG1CQUFtQixNQUM5QixPQUFPO0FBQUEsRUFDTCxTQUFTO0FBQUEsSUFDUCxVQUFVO0FBQUEsSUFDVixjQUFjLEVBQUUsY0FBYyxFQUFFLENBQUM7QUFBQTtBQUFBLEVBQ25DO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxhQUFhO0FBQUEsTUFDWCxJQUFJO0FBQUEsTUFDSixJQUFJO0FBQUEsTUFDSixJQUFJO0FBQUEsTUFDSixJQUFJO0FBQUEsTUFDSixJQUFJO0FBQUEsTUFDSixLQUFLO0FBQUEsSUFDUDtBQUFBLEVBQ0Y7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLHNCQUFzQjtBQUFBO0FBQUEsRUFDeEI7QUFBQSxFQUNBLFdBQVc7QUFBQSxJQUNULGVBQWU7QUFBQSxFQUNqQjtBQUNGLENBQUM7OztBQzVCK1YsSUFBTSx5QkFBeUI7QUFBQSxFQUMvWCxTQUFTO0FBQUEsSUFDUDtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElB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RUFBRTtBQUFBLE1BQ3hDO0FBQUEsSUFDRjtBQUdBLGdCQUFZLHFEQUFxRCxRQUFRLFFBQVE7QUFDakYsV0FBTyxTQUFTO0FBR2hCLFVBQU0sUUFBUTtBQUNkLFFBQUksT0FBTztBQUNUO0FBQUMsTUFBQyxPQUFPLE9BQWUsUUFBUTtBQUNoQyxhQUFPLFVBQVUsT0FBTyxTQUFTLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUFBLElBQ3BEO0FBRUEsV0FBTyxVQUFVLE9BQU8sU0FBUyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDdkQsV0FBTyxlQUFlO0FBQ3RCLFdBQU87QUFBQSxFQUNULE9BQU87QUFFTCxXQUFPLFVBQVUsT0FBTyxTQUFTLE9BQU8sQ0FBQyxDQUFDO0FBRTFDLFFBQUksU0FBUyxRQUFRO0FBQUEsSUFFckI7QUFDQSxRQUFJLFNBQVMsY0FBYztBQUFBLElBRTNCO0FBQUEsRUFDRjtBQUVBLFNBQU8sVUFBVSxPQUFPLFNBQVMsT0FBTyxDQUFDLENBQUM7QUFDMUMsU0FBTztBQUNULENBQUM7IiwKICAibmFtZXMiOiBbIkVsZW1lbnRQbHVzUmVzb2x2ZXIiLCAiRWxlbWVudFBsdXNSZXNvbHZlciIsICJwYXRoU3JjIl0KfQo=
