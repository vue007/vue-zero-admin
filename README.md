# vue-zero-admin

This template should help get you started developing with Vue 3 in Vite.

TypeScript \ Vue3.x \ VueRouter4.x \ Pinia \ Axios \ Eslint + Prettier

Element Plus \ Sass \ Unocss \ Vue-i18n \ VueUse \ es-toolkit

## Project Setup

```sh
pnpm install
pnpm i --registry https://registry.npmmirror.com/  // 网络卡时，建议指定淘宝镜像

pnpm run dev

pnpm run build          # default as production
pnpm run build:dev      # dist/development/
pnpm run build:test     # dist/test/
pnpm run build:prod     # dist/prod/
```

## 项目目录结构

```sh
├── .vscode               // vscode 工具工程配置文件 extensions|settings|.
├── public                //
├── src                   //
│   ├── api               // 项目api模块目录
│   ├── assets            // 公共资源目录
│   ├── components        // 公共组件目录
│   ├── hooks             // 项目hooks目录
│   ├── i18n              // vue-i18n 配置目录
│   ├── icons             // 项目svg icon目录
│   ├── layouts           // 项目布局目录
│   ├── pages             // 项目页面目录
│   ├── router            // vue-router 配置目录
│   ├── stores            // 全局状态模块目录
│   ├── styles            // 项目样式目录
│   ├── utils             // 项目工具类目录
│   ├── main.ts           // entry 入口js
│   └── App.vue           // app入口vue
├── env.d.ts              // 系统级typescript类型文件
├── eslint.config.mjs     // eslint 9.X+ 配置文件
├── eslintrc-auto-import.json
├── .env.development      // 环境配置文件-开发环境
├── .env.production       // 环境配置文件-开发环境
├── .env.test             // 环境配置文件-
├── .prettierrc.cjs       // 格式化配置文件
├── index.html            //
├── package.json          // package 工程文件
├── pnpm-lock.yaml        // pnpm 包构建文件
├── tsconfig.app.json     // tslint app 运行时配置
├── tsconfig.json         //
├── tsconfig.node.json    // tslint node 环境配置
├── vite                  // vite plugin 和 vite config 目录
└── vite.config.ts        // vite 配置文件
```

## [Vue3.x](https://vuejs.org/)

- 推荐默认使用 script setup lang=tsx|ts
- 支持tsx

  1. vite插件支持: plugin @vitejs/plugin-vue-jsx
  2. tsconfig: compilerOptions jsx=preserve; include \*.tsx
  3. 推荐使用场景：复杂组件封装 或 简单内部组件片段

## 路由管理 [Vue Router](https://router.vuejs.org/)

- 自动导入 pages/\*\* 下所有.vue 作为路由
- 如需覆盖可以在 src/router/index routes 数组中添加

## 全局状态管理 [Pinia.js](https://pinia.vuejs.org/)

- 按需在 src/stores 目录中添加所需模块
- 模块命名规范：
  - 文件名：base.module.ts
  - 导出模块 `export const useBaseStore = defineStore('base', () => {})`
  - 推荐使用 setup 的方式；定义 const mutation | action | getter 减少 return 语句

## 模板默认工具库

- [es-toolkit](https://es-toolkit.slash.page/intro.html)
- [vue-use](https://vueuse.org/functions.html)
- 遇到一些简单场景时先考虑这两个工具库，提高代码质量

```ts
// @/store/demo.module.ts
import { defineStore } from 'pinia'
export const useDemoStore = defineStore('demo', () => {
  const demoObj = reactive({
    count: 0,
  })

  const mutation = {
    setCount(num: number) {
      demoObj.count = num
    },
    increment: () => demoObj.count++,
    decrement: () => demoObj.count--,
  }

  const action = {}
  const getter = {}

  return { demoObj, ...mutation, ...action, ...getter }
})
```

## 默认组件库 [Element Plus](https://element-plus.org/zh-CN/)

- 默认自动导入
- 全局导入组件
  - [ElMessage](https://element-plus.org/zh-CN/component/message.html)
  - [ElMessageBox](https://element-plus.org/zh-CN/component/message-box.html)
  - [ElNotification](https://element-plus.org/zh-CN/component/notification.html)
  - [ElLoading](https://element-plus.org/zh-CN/component/loading.html)
- src/styles/theme/ 组件库主题目录
- v-tooltip 指令方式使用 [ElTooltip](https://element-plus.org/zh-CN/component/tooltip.html)
  - `<div v-tooltip="{ content: 'up up up' }">↑↑↑</div>`

## 国际化 [vue-i18n](https://vue-i18n.intlify.dev/)

### 全局模块化

- 公共的国际化字符串在 @/i18n/目录下添加 {module_name}.lang.ts

```ts
// @/i18n/demo.lang.ts
import { i18nMsgItem as i } from './_helper'

export const demoLang = {
  count: i('计数', '計數', 'Count'),
}
```

- 在@/i18n/index.ts 中这次对应模块

### 组件页面局部国际化

- 支持 json 、 yaml 格式

1. .vue 文件内部添加`<i18n></i18n>`标签引入

```yaml
<i18n lang="yaml">
en:
  count: count
zh-CN:
  count: 计数
zh-TW:
  count: 計數
</i18n>
```

1. 引用外部国际化文件 ` <i18n lang="json" src="lang.yaml"></i18n>`

## 样式相关

### [Sass](https://sass-lang.com/)

### 主题化

- 主题文件目录 @/styles/theme/\*
- 使用[Element Plus设计规范](https://element-plus.org/zh-CN/resource/)
- 同步sass变量 @/styles/vars.scss

### 原子化CSS引擎 [Unocss](https://unocss.dev/)

### 预设原子类继承自tailwindcss 参考文档：[原子类参考文档 tailwindcss](https://tailwindcss.com/docs/flex)

- /vite/unocss.ts 配置文件
  - presetUno 使用默认预设
  - [presetRemToPx](https://unocss.dev/presets/rem-to-px) 生成rem转化成px， 配置{baseFontSize: 4} 和 实现如 ml-20 = ml-20px
- 支持 @apply, @screen 配置 [@unocss/transfor mer-directives](https://unocss.dev/transformers/directives)

- 推荐使用场景：嵌套深层页面结构 或 简单样式
- 原子类过多时：定义className，使用 @apply 继承原子类

```html
<div class="ml-50 mt-20"></div>
```

```scss
.count {
  @apply: flex justify-center items-center;
}
```

## 代码格式化 Eslint & Prettier

- Eslint 使用9.x 配置 /eslint.comfig.mjs
- eslintrc-auto-import.json // 根据 自动导入 自动生成的lint配置

## api层 [axios](https://axios-http.com/docs/intro) & useApi hooks

1. 在@api/目录下添加模块
2. 在模块中添加具体接口，以及 接口对应的接口参数ts类型 和 返回ts类型
3. 使用useApi 简化接口调用

```ts
const loginForm = reactive<LoginForm>({ username: '', password: '' })
const [userInfo, fetchLogin] = useApi(login, loginForm)
```

## vscode 插件

- 下载项目启动推荐的插件即可 .vscode/extensions.json

## 构建优化

```js
{
  manualChunks: { 'index-core': ['vue', 'vue-router', 'pinia', '@vueuse/core'] }, // index-core-[hash].js核心库
  chunkFileNames: 'js/[name]-[hash].js', // 引入文件名的名称
  entryFileNames: 'js/[name]-[hash].js', // 包的入口文件名称
  assetFileNames: '[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等
}
```

### 如有问题或建议，可发 issues
