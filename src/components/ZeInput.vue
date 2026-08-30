<template>
  <el-input v-bind="omit(mergeProps($attrs, props), ['prefixIcon', 'suffixIcon'])" class="ze-input" ref="rawRef">
    <template #prefix v-if="props.prefixIcon">
      <svg-icon :name="props.prefixIcon" />
    </template>
    <template #suffix v-if="props.suffixIcon">
      <svg-icon :name="props.suffixIcon" />
    </template>
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope" />
    </template>
  </el-input>
</template>

<script setup lang="ts">
import type { InputInstance } from 'element-plus/lib/components/index.js'
import { omit } from 'es-toolkit'
import { mergeProps } from 'vue'
import { createExposeProxy } from '@/utils/expose-proxy'

type ElInputType = InputInstance
type ZeInputProps = { clearable?: boolean; prefixIcon?: string; suffixIcon?: string }
const props = withDefaults(defineProps<ZeInputProps>(), { clearable: true })
const rawRef = ref<ElInputType>()

// ZeInput 是 ElInput 的能力超集：调用方仍可使用全部 ElInput 实例 API。
defineExpose<ElInputType>(createExposeProxy(rawRef))
</script>

<style lang="scss" scoped>
.ze-input {
  min-width: 160px;

  :deep(.el-input-group__prepend) {
    background-color: unset;
  }

  :deep(.el-input-group__append) {
    background-color: unset;
  }
}
</style>
