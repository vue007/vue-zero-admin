<template>
  <ElConfigProvider :locale="locale" :size="setting.size" :z-index="3000">
    <component :is="currentLayout" />
  </ElConfigProvider>
</template>

<script setup lang="ts">
import './styles/sanitize.css'
import './styles/theme/index.scss'

import { useBaseStore } from './stores/base.module'
import { applyThemeColor } from './styles/theme/theme-colors'

import BaseLayout from './layouts/BaseLayout.vue'
import BlankLayout from './layouts/BlankLayout.vue'

import zh_CN from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import { useMediaQuery, watchImmediate } from '@vueuse/core'

const route = useRoute()
const baseStore = useBaseStore()
const { setting } = baseStore
const i18n = useI18n()

// # switch layout
const currentLayout = shallowRef(BaseLayout)
const layouts = { base: BaseLayout, blank: BlankLayout }
watchEffect(() => {
  const layoutName: string = route.meta?.layout as string
  currentLayout.value = layouts[layoutName || 'blank']
})

// # switch lang
const langs = { 'zh-CN': zh_CN, en }
const locale = computed(() => langs[setting.local] || zh_CN)
watchEffect(() => (i18n.locale.value = setting.local))

// # switch color scheme
const scheme = computed(() => setting.scheme)
const systemScheme = computed(() => {
  return useMediaQuery('(prefers-color-scheme: dark)').value ? 'dark' : 'light'
})

// - switch by user
watchImmediate(
  () => scheme.value,
  () => {
    if (scheme.value === 'auto') document.documentElement.setAttribute('data-scheme', systemScheme.value)
    else document.documentElement.setAttribute('data-scheme', scheme.value)
  },
)
// - auto switch by system
watchImmediate(systemScheme, () => {
  if (scheme.value !== 'auto') return
  document.documentElement.setAttribute('data-scheme', systemScheme.value)
})

// # switch visual theme (independent from the light/dark color scheme)
watchImmediate(
  () => setting.theme,
  (theme) => document.documentElement.setAttribute('data-theme', theme),
)

// # switch primary color (independent from visual theme and color scheme)
watchImmediate(
  () => [setting.themeColor, scheme.value === 'auto' ? systemScheme.value : scheme.value] as const,
  ([themeColor, currentScheme]) => applyThemeColor(themeColor, currentScheme),
)

watchImmediate(
  () => setting.size,
  (val) => document.documentElement.setAttribute('data-size', val),
)
</script>

<style lang="scss" scoped>
:global(html) {
  font-family: var(--el-font-family);
  width: 100vw;
  height: 100vh;
}
</style>
