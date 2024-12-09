<template>
  <el-input v-bind="mergeProps($attrs, props)" class="ze-input" ref="rawRef">
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope"></slot>
    </template>
  </el-input>
</template>

<script setup lang="ts">
import type { InputProps } from 'element-plus'
import type { InputInstance } from 'element-plus'
import { mergeProps } from 'vue'
type ElInputType = InputInstance & {}
type ZeInputProps = Partial<InputProps> & {}
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
  min-width: 190px;
}
</style>
