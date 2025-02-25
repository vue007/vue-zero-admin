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
import type { InputProps } from 'element-plus'
import type { InputInstance } from 'element-plus/lib/components/index.js'
import { omit } from 'es-toolkit'
import { mergeProps } from 'vue'

type ElInputType = InputInstance
type ZeInputProps = Partial<InputProps> & { prefixIcon?: string; suffixIcon?: string }
const props = withDefaults(defineProps<ZeInputProps>(), {
  clearable: true,
})
const rawRef = ref<ElInputType>()

defineExpose<ElInputType>(
  new Proxy(
    {},
    {
      get: (_target, prop) => rawRef.value?.[prop],
      has: (_target, prop) => prop in (rawRef.value || {}),
    },
  ) as ElInputType,
)
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
