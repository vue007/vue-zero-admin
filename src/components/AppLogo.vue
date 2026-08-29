<template>
  <svg
    class="app-logo-svg"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1032 1167"
    role="img"
    :aria-labelledby="titleId"
  >
    <title :id="titleId">Zero Admin</title>

    <defs>
      <linearGradient :id="topGradientId" x1="0" y1="166" x2="1002" y2="166" gradientUnits="userSpaceOnUse">
        <stop class="top-start" offset="0" />
        <stop class="top-end" offset="1" />
      </linearGradient>
      <linearGradient
        :id="bottomGradientId"
        x1="25"
        y1="998"
        x2="1032"
        y2="998"
        gradientUnits="userSpaceOnUse"
      >
        <stop class="bottom-start" offset="0" />
        <stop class="bottom-end" offset="1" />
      </linearGradient>
      <linearGradient
        :id="bodyGradientId"
        x1="268"
        y1="454"
        x2="763"
        y2="835"
        gradientUnits="userSpaceOnUse"
      >
        <stop class="body-start" offset="0" />
        <stop class="body-end" offset="1" />
      </linearGradient>
      <linearGradient
        :id="coreGradientId"
        x1="508"
        y1="332"
        x2="508"
        y2="831"
        gradientUnits="userSpaceOnUse"
      >
        <stop class="core-start" offset="0" />
        <stop class="core-end" offset="1" />
      </linearGradient>
    </defs>

    <path
      :fill="`url(#${bodyGradientId})`"
      d="M470 332h410c70 0 110 25 102 67-10 34-42 67-86 101L557 831H123c-48 0-78-8-88-25 7-14 20-36 33-57 14-22 30-45 44-68Z"
    />
    <path
      :fill="`url(#${topGradientId})`"
      d="M0 333C73 174 235 65 411 17 591-32 782 17 910 120c64 52 96 119 92 182-1 11-3 21-8 31-4 35-24 69-64 97l-80-97H0Z"
    />
    <path
      :fill="`url(#${bottomGradientId})`"
      d="M32 829h1000c-67 134-190 241-340 296-160 58-343 48-479-15C99 1058 28 962 25 874c-1-16 1-31 7-45Z"
    />
    <path
      :fill="`url(#${coreGradientId})`"
      d="M569 332h282c34 0 51 16 50 44-1 21-12 42-31 61L455 831H177c-31 0-49-17-49-42 0-20 12-44 32-63Z"
    />
  </svg>
</template>

<script setup lang="ts">
import { useId } from 'vue'

const logoId = useId()
const titleId = `${logoId}-title`
const topGradientId = `${logoId}-top`
const bottomGradientId = `${logoId}-bottom`
const bodyGradientId = `${logoId}-body`
const coreGradientId = `${logoId}-core`
</script>

<style scoped>
.app-logo-svg {
  display: block;
  flex: none;
  overflow: visible;
}

.top-start,
.bottom-end {
  stop-color: color-mix(in srgb, var(--el-color-primary) 82%, #27465b);
}

.top-end,
.bottom-start {
  stop-color: color-mix(in srgb, var(--el-color-primary) 34%, white);
}

.body-start {
  stop-color: color-mix(in srgb, var(--el-color-primary) 78%, #315d78);
}

.body-end {
  stop-color: color-mix(in srgb, var(--el-color-primary) 42%, white);
}

.core-start {
  stop-color: color-mix(in srgb, var(--el-color-primary) 26%, #102836);
}

.core-end {
  stop-color: color-mix(in srgb, var(--el-color-primary) 48%, #315b72);
}
</style>
