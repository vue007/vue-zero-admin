<template>
  <el-table
    :data="props.data"
    :border="true"
    style="width: 100%"
    maxheight="62vh"
    ref="tableRef"
    v-bind="omit($attrs, 'data')"
  >
    <slot name="header"></slot>
    <slot name="filter-icon"></slot>

    <slot name="before-columns"></slot>

    <el-table-column v-for="item in _columns" :key="item.prop" v-bind="item">
      <template v-if="$slots[`col-${item.prop}`]" #default="scope">
        <slot :name="`col-${item.prop}`" :row="scope.row" :index="scope.$index"></slot>
      </template>
    </el-table-column>

    <slot name="after-columns"></slot>
  </el-table>
</template>

<script setup lang="ts">
import type { ElTable, ElTableColumn, TableColumnCtx, TableInstance } from 'element-plus'
import { omit } from 'es-toolkit'

export type ZeTableColumns = { hidden?: boolean } & TableColumnCtx<any>

const exportColumns = inject<any>('VPage_exportColumns', null)

const props = defineProps({
  data: {
    type: Array<any>,
    require: true,
  },
  columns: {
    type: Array<Partial<ZeTableColumns>>,
    require: true,
  },
})

const emits = defineEmits(['sort-change', 'row-sort', 'selection-change'])

const tableRef = ref<TableInstance>()

const _columns = computed(() => {
  return props.columns?.filter((item) => !item.hidden) || []
})

watchEffect(() => {
  if (!props || !props.columns) return
  if (exportColumns) {
    exportColumns.value = props.columns.map((item) => ({ prop: item.prop, label: item.label }))
  }
})
</script>

<style lang="scss" scoped>
.export-columns {
  margin-top: 10px;
}

:deep(.el-table__expanded-cell) {
  padding: 0 !important;
}
</style>
