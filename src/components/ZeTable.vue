<template>
  <el-table
    style="width: 100%"
    maxheight="62vh"
    ref="rawRef"
    v-bind="mergeProps($attrs, props)"
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
        :value="item.prop"
        :disabled="item.fixed !== undefined"
      />
    </el-checkbox-group>
  </el-popover>
</template>

<script setup lang="ts">
import { ElTable, type TableColumnCtx, type TableInstance, type TableProps } from 'element-plus'
import { mergeProps, type Ref } from 'vue'

const emits = defineEmits([])

type ZeTableColumns = { hidden?: boolean } & Partial<TableColumnCtx<any>>

type ZeTableProps<T = any> = TableProps<T> & {
  data: T[] | any[]
  columns: ZeTableColumns[]
  loading: boolean
  filterColVR?: Ref
}

const props = withDefaults(defineProps<ZeTableProps>(), {
  data: undefined,
  filterColVR: undefined,
  defaultExpandAll: false,
  columns: undefined,

  showHeader: ElTable.__defaults?.showHeader,
  fit: ElTable.__defaults?.fit,
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

const getColKey = (item) => item.prop || item.type
const _columns = computed(() => {
  return props.columns?.filter((item) => !(item && item.hidden)) || []
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

const customExpose = {
  toggleAllExpansion,
}
type ZeTableExpose = TableInstance & { toggleAllExpansion: () => void }
defineExpose<ZeTableExpose>(
  new Proxy(
    {},
    {
      get(_target, prop) {
        if (rawRef.value?.[prop]) return rawRef.value[prop]
        if (customExpose?.[prop]) return customExpose[prop]
      },
      has: (_target, prop) => prop in (rawRef.value || {}) || prop in (customExpose || {}),
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
