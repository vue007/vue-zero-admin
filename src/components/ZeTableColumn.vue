<template>
  <el-table-column v-bind="mergeProps($attrs, props)" class="ze-table-column" ref="rawRef">
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope"></slot>
    </template>
  </el-table-column>
</template>

<script setup lang="ts">
import type { TableColumnProps } from './types/mixin'
import { ElTableColumn, type TableColumnInstance } from 'element-plus'
import { mergeProps } from 'vue'

const props = withDefaults(defineProps<TableColumnProps>(), {
  showOverflowTooltip: true,
  width: '',
})
const rawRef = ref<TableColumnInstance>()

type ZeTableColumnExpose = TableColumnInstance & {}
defineExpose<ZeTableColumnExpose>(
  new Proxy(
    {},
    {
      get: (_target, prop) => rawRef.value?.[prop],
      has: (_target, prop) => prop in (rawRef.value || {}),
    },
  ) as ZeTableColumnExpose,
)
</script>

<style lang="scss" scoped>
// .ze-table-column {
// }
</style>
