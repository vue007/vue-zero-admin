<template>
  <el-table
    style="width: 100%"
    max-height="62vh"
    ref="rawRef"
    v-bind="mergeProps($attrs, omit(props, ['columns', 'loading', 'filterColVR']))"
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
    <span>显示/隐藏列</span>
    <el-checkbox-group v-model="filterColumns">
      <el-checkbox
        v-for="item in _columns"
        :key="getColKey(item)"
        :label="item.label"
        :value="getColKey(item)"
        :disabled="item.fixed !== undefined"
      />
    </el-checkbox-group>
  </el-popover>
</template>

<script setup lang="ts">
import type { Measurable, TableColumnCtx, TableInstance, TableProps } from 'element-plus'
import { omit } from 'es-toolkit'
import { mergeProps, type Ref } from 'vue'

type ZeTableColumns = { hidden?: boolean } & Partial<TableColumnCtx<any>>
type DefaultRow = Record<PropertyKey, any>

type ZeTableProps<T extends DefaultRow = DefaultRow> = Partial<TableProps<T>> & {
  data?: T[]
  columns?: ZeTableColumns[]
  loading?: boolean
  filterColVR?: Measurable
}

const props = withDefaults(defineProps<ZeTableProps>(), {
  data: () => [],
  filterColVR: undefined,
  defaultExpandAll: false,
  columns: () => [],
  loading: false,
  showHeader: true,
  fit: true,
  highlightCurrentRow: true,
  border: false,
})

// const props = defineProps({
//   data: { type: Array as PropType<any[] | never[]>, require: true, default: () => [] },
//   columns: { type: Array<Partial<ZeTableColumns>>, require: true },
//   loading: { type: Boolean, default: false },
//   filterColVR: { type: Object as PropType<Ref>, default: () => ref(undefined) },
//   defaultExpandAll: { type: Boolean, default: () => false },
// })

const isExpandAll = ref(props.defaultExpandAll)

const toggleAllExpansion = () => {
  isExpandAll.value = !isExpandAll.value
  toggleExpandAll(props.data, isExpandAll.value)
}

const toggleExpandAll = (data: any[] = [], status: boolean) => {
  data.forEach((item) => {
    rawRef.value?.toggleRowExpansion(item, status)
    if (item.children && item.children.length > 0) toggleExpandAll(item.children, status)
  })
}

const rawRef: Ref<TableInstance | undefined> = ref()

const getColKey = (item: ZeTableColumns) => String(item.prop ?? item.type ?? item.label ?? '')
const _columns = computed(() => {
  return props.columns.filter((item) => item && !item.hidden)
})
const showedColumns = computed(() => {
  return _columns.value.filter((item) => filterColumns.value.includes(getColKey(item)))
})

const filterColumns = ref<string[]>([])
let previousColumnKeys: string[] = []
const reconcileFilterColumns = (columnKeys: string[]) => {
  const previousKeys = new Set(previousColumnKeys)
  const selectedKeys = new Set(filterColumns.value)
  filterColumns.value = columnKeys.filter((key) => selectedKeys.has(key) || !previousKeys.has(key))
  previousColumnKeys = columnKeys
}

watch(
  () => _columns.value.map(getColKey),
  (columnKeys) => reconcileFilterColumns(columnKeys),
  { immediate: true },
)

const customExpose = {
  toggleAllExpansion,
}
type ZeTableExpose = TableInstance & { toggleAllExpansion: () => void }
defineExpose<ZeTableExpose>(
  new Proxy(
    {},
    {
      get(_target, prop) {
        const raw = rawRef.value as unknown as Record<PropertyKey, any> | undefined
        const custom = customExpose as Record<PropertyKey, any>
        if (raw && prop in raw) return raw[prop]
        if (prop in custom) return custom[prop]
      },
      has(_target, prop) {
        const raw = rawRef.value as unknown as Record<PropertyKey, any> | undefined
        const custom = customExpose as Record<PropertyKey, any>
        return Boolean(raw && prop in raw) || prop in custom
      },
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

:deep(.el-table__body) {
  width: 100% !important;
}
</style>
