<template>
  <div class="layout-background" aria-hidden="true">
    <div class="background-base" />
    <div v-if="showWallpaper" class="background-wallpaper" :style="{ opacity: wallpaperOpacity }">
      <component :is="currentWallpaperComponent" v-bind="currentWallpaperProps" />
    </div>
  </div>
</template>

<script setup lang="ts">
import BgBallpit from '@/components/background/BgBallpit.vue'
import BgWavys from '@/components/background/BgWavys.vue'
import { useBaseStore } from '@/stores/base.module'
import { BASE_THEME_COLORS } from '@/styles/theme/theme-colors'
import { useDocumentVisibility, useMediaQuery, usePreferredReducedMotion } from '@vueuse/core'

const { setting } = useBaseStore()
const route = useRoute()
const systemDark = useMediaQuery('(prefers-color-scheme: dark)')
const pageVisibility = useDocumentVisibility()
const preferredMotion = usePreferredReducedMotion()

const isDark = computed(() => setting.scheme === 'dark' || (setting.scheme === 'auto' && systemDark.value))
const showWallpaper = computed(() => route.path === '/login' || setting.theme === 'argon')
const paused = computed(
  () => route.path !== '/login' || pageVisibility.value !== 'visible' || preferredMotion.value === 'reduce',
)
const wallpaperOpacity = computed(() => Math.min(1, Math.max(0.1, Number(setting.wallpaperOpacity) || 0.88)))
const primary = computed(
  () => BASE_THEME_COLORS.find((item) => item.name === setting.themeColor)?.color ?? '#596cff',
)

const hexToRgb = (hex: string) => {
  const value = Number.parseInt(hex.slice(1), 16)
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255]
}
const mixHex = (source: string, target: string, weight: number) => {
  const from = hexToRgb(source)
  const to = hexToRgb(target)
  return `#${from
    .map((channel, index) => Math.round(channel * (1 - weight) + to[index]! * weight).toString(16).padStart(2, '0'))
    .join('')}`
}

const wavyColors = computed(() => {
  const color = primary.value
  if (isDark.value) {
    return [
      mixHex(color, '#020617', 0.94),
      mixHex(color, '#020617', 0.72),
      mixHex(color, '#020617', 0.46),
      color,
      mixHex(color, '#ffffff', 0.22),
      mixHex(color, '#ffffff', 0.42),
      mixHex(color, '#ffffff', 0.58),
    ]
  }
  return [
    mixHex(color, '#ffffff', 0.92),
    mixHex(color, '#ffffff', 0.78),
    mixHex(color, '#ffffff', 0.58),
    mixHex(color, '#ffffff', 0.34),
    color,
    mixHex(color, '#0f172a', 0.28),
    mixHex(color, '#0f172a', 0.5),
  ]
})

const ballpitColors = computed(() => {
  const colors = [primary.value, '#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b']
  return isDark.value ? colors.map((color) => mixHex(color, '#020617', 0.18)) : colors.map((color) => mixHex(color, '#ffffff', 0.2))
})

const wallpaperComponents = {
  Wavy: BgWavys,
  Ballpit: BgBallpit,
}
const currentWallpaperComponent = computed(() => wallpaperComponents[setting.wallpaper])
const currentWallpaperProps = computed(() => {
  if (setting.wallpaper === 'Ballpit') {
    return {
      className: 'layout-wallpaper-component',
      count: 56,
      colors: ballpitColors.value,
      backgroundColor: isDark.value ? '#05080e' : '#f8fafc',
      dark: isDark.value,
      speed: 0.1,
      movement: 15,
      blurriness: 0.1,
      radius: 0.68,
      paused: paused.value,
    }
  }

  return {
    class: 'layout-wallpaper-component',
    colors: wavyColors.value,
    bgColor: wavyColors.value[0],
    speed: 1.15,
    waveOpacity: isDark.value ? 0.82 : 0.72,
    layer: 6,
    peak: 5,
    diverge: 0.41,
    slope: 0.16,
    scale: 0.4,
    offset: 0.4,
    dark: isDark.value,
    paused: paused.value,
  }
})
</script>

<style scoped lang="scss">
.layout-background,
.background-base,
.background-wallpaper {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
}

.layout-background {
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}

.background-base {
  background: var(--el-bg-color-page);
}

.background-wallpaper {
  isolation: isolate;
  transition: opacity 0.25s ease;
}

:deep(.layout-wallpaper-component) {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
</style>
