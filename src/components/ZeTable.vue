<template>
  <el-table
    :data="props.data"
    :border="true"
    style="width: 100%"
    maxheight="62vh"
    ref="rawRef"
    v-bind="omit(attrs, ['data'])"
    v-loading="props.loading"
  >
    <slot name="header"></slot>
    <slot name="filter-icon"></slot>

    <slot name="prepend"></slot>

    <ze-table-column v-for="item in showedColumns" :key="getColKey(item)" v-bind="item">
      <template v-if="$slots[`col-${item.prop}`]" #default="scope">
        <slot :name="`col-${item.prop}`" :row="scope.row" :index="scope.$index"></slot>
      </template>
    </ze-table-column>

    <slot></slot>
  </el-table>

  <el-popover
    v-if="props.filterColVR"
    ref="popoverRef"
    :virtual-ref="props.filterColVR"
    trigger="click"
    virtual-triggering
  >
    <span>表格列显示与隐藏</span>
    <el-checkbox-group v-model="filterColumns">
      <el-checkbox
        v-for="item in _columns"
        :key="getColKey(item)"
        :label="item.label"
        :value="item.prop"
        :disabled="item.fixed !== undefined"
      />
    </el-checkbox-group>
  </el-popover>
</template>

<script setup lang="ts">
import type { TableColumnCtx, TableInstance } from 'element-plus'
import { omit } from 'es-toolkit'
import { type PropType } from 'vue'

export type ZeTableColumns = { hidden?: boolean } & TableColumnCtx<any>

const attrs = useAttrs()

const props = defineProps({
  data: {
    type: Array as PropType<any[] | never[]>,
    require: true,
    default: () => [],
  },
  columns: {
    type: Array<Partial<ZeTableColumns>>,
    require: true,
  },
  loading: { type: Boolean, default: false },
  filterColVR: {
    type: Object as PropType<Ref>,
    default: () => ref(undefined),
  },
})
const rawRef = ref<TableInstance>()

const emits = defineEmits(['sort-change', 'row-sort', 'selection-change'])

const getColKey = (item) => item.prop || item.type
const _columns = computed(() => {
  return props.columns?.filter((item) => !item.hidden) || []
})
const showedColumns = computed(() => {
  return _columns.value?.filter((item) => filterColumns.value?.includes(getColKey(item)))
})

const filterColumns = ref<Array<string>>()
const initFilterColumns = () => {
  filterColumns.value = _columns.value.map((item) => getColKey(item)) || []
}

watch(
  () => props.columns,
  () => initFilterColumns(),
  { immediate: true },
)

type ZeTableExpose = TableInstance & {}
defineExpose<ZeTableExpose>(
  new Proxy(
    {},
    {
      get: (_target, prop) => rawRef.value?.[prop],
      has: (_target, prop) => prop in (rawRef.value || {}),
    },
  ) as ZeTableExpose,
)
</script>

<style lang="scss" scoped>
.export-columns {
  margin-top: 10px;
}

:deep(.el-table__expanded-cell) {
  padding: 0 !important;
}
</style>
