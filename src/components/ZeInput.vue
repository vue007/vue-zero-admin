<template>
  <el-input v-bind="toMerged($attrs, props)" class="ze-input" ref="inputR">
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope"></slot>
    </template>
  </el-input>
</template>

<script setup lang="ts">
import type { InputProps } from 'element-plus'
import type { InputInstance } from 'element-plus/lib/components/index.js'
import { toMerged } from 'es-toolkit'
type ElInputType = InputInstance
type ZeInputProps = Partial<InputProps> & {}
const props = withDefaults(defineProps<ZeInputProps>(), {
  clearable: true,
})
const inputR = ref<ElInputType>()

defineExpose<ElInputType>(
  new Proxy(
    {},
    {
      get: (_target, prop) => inputR.value?.[prop],
      has: (_target, prop) => prop in (inputR.value || {}),
    },
  ) as ElInputType,
)
</script>

<style lang="scss" scoped>
.ze-input {
  min-width: 160px;
}
</style>
