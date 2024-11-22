<template>
  <svg aria-hidden="true" class="svg-icon" v-bind="$attrs">
    <use :href="symbolId" :fill="color" :stroke="color" />
  </svg>
</template>

<script setup lang="ts">
import { isNumber } from 'es-toolkit/compat'

const props = defineProps({
  prefix: {
    type: String,
    default: 'icon',
  },
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: 'inherit',
  },
  size: {
    type: [Number, String],
    default: undefined,
  },
})

const symbolId = computed(() => `#${props.prefix}-${props.name}`)

const fontSize = computed(() => {
  if (props.size) {
    return isNumber(props.size) ? `${props.size}px` : props.size
  } else {
    return 'inherit'
  }
})
</script>

<style lang="scss" scoped>
.svg-icon {
  --color: inherit;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: relative;
  fill: currentColor;
  color: var(--color);
  stroke: var(--color);
  font-size: v-bind(fontSize);
  width: 1em;
  height: 1em;
}
</style>
