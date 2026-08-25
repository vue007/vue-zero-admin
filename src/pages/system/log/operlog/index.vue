<template>
  <VPage class="p-24">
    <template #header>
      <ze-form v-model="searchForm" :items="searchFormItems" ref="searchFormRef" inline>
        <ze-form-item>
          <ze-actions
            :actions="[
              { icon: 'el-scale-to-original', tip: t('columns'), onRef: (r) => (filterColRef = r) },
              { icon: 'el-refresh', tip: t('reset'), onClick: reset },
            ]"
          />
        </ze-form-item>

        <ze-form-item class="mla mr0!">
          <ze-actions
            :actions="[
              {
                content: t('deleteSelected'),
                disabled: selectedRows.length === 0,
                confirm: true,
                onClick: () => handleDel(selectedRows.map((item) => item.operId)),
              },
              { content: t('clean'), type: 'danger', plain: true, confirm: true, onClick: () => handleClean() },
              { content: t('export'), type: 'primary', loading: exporting, onClick: handleExport },
            ]"
          />
        </ze-form-item>
      </ze-form>
    </template>

    <ze-table
      ref="tableRef"
      :data="listData"
      :loading="loading"
      :columns="[
        { type: 'selection', width: 48, fixed: true },
        { prop: 'operId', label: t('operId'), hidden: true },
        { prop: 'title', label: t('title'), minWidth: 120, fixed: true },
        { prop: 'businessType', label: t('businessType'), width: 110 },
        { prop: 'requestMethod', label: t('requestMethod'), width: 100 },
        { prop: 'operName', label: t('operName'), minWidth: 110 },
        { prop: 'operIp', label: t('operIp'), minWidth: 135 },
        { prop: 'operLocation', label: t('operLocation'), minWidth: 150 },
        { prop: 'status', label: t('status'), width: 90 },
        { prop: 'operTime', label: t('operTime'), minWidth: 180 },
        { prop: 'costTime', label: t('costTime'), width: 100 },
      ]"
      :filterColVR="filterColRef"
      @selection-change="selectedRows = $event"
    >
      <template #col-businessType="{ row }">
        <VDictTag :options="sys_oper_type" :value="row.businessType" />
      </template>

      <template #col-status="{ row }">
        <VDictTag :options="sys_common_status" :value="row.status" />
      </template>

      <template #col-costTime="{ row }">
        {{ row.costTime ?? 0 }} ms
      </template>

      <ze-table-column fixed="right" :label="t('actions')" width="130px" headerAlign="center">
        <template #default="{ row }">
          <ze-actions
            :options="{ text: true, type: 'primary' }"
            :actions="[
              { content: t('detail'), onClick: () => detailRef.open(row) },
              { content: t('delete'), confirm: true, onClick: () => handleDel([row.operId]) },
            ]"
          />
        </template>
      </ze-table-column>
    </ze-table>

    <template #content-footer>
      <ze-pagination class="ml-a" v-model="pagination" />
    </template>
  </VPage>

  <DetailModal width="920px" :show-action="false">
    <el-descriptions v-if="detailData" :column="2" border>
      <el-descriptions-item :label="t('title')">{{ detailData.title || '-' }}</el-descriptions-item>
      <el-descriptions-item :label="t('businessType')">
        <VDictTag :options="sys_oper_type" :value="detailData.businessType" />
      </el-descriptions-item>
      <el-descriptions-item :label="t('operName')">{{ detailData.operName || '-' }}</el-descriptions-item>
      <el-descriptions-item :label="t('deptName')">{{ detailData.deptName || '-' }}</el-descriptions-item>
      <el-descriptions-item :label="t('requestMethod')">{{ detailData.requestMethod || '-' }}</el-descriptions-item>
      <el-descriptions-item :label="t('operUrl')">{{ detailData.operUrl || '-' }}</el-descriptions-item>
      <el-descriptions-item :label="t('operIp')">{{ detailData.operIp || '-' }}</el-descriptions-item>
      <el-descriptions-item :label="t('operLocation')">{{ detailData.operLocation || '-' }}</el-descriptions-item>
      <el-descriptions-item :label="t('method')" :span="2">{{ detailData.method || '-' }}</el-descriptions-item>
      <el-descriptions-item :label="t('status')">
        <VDictTag :options="sys_common_status" :value="detailData.status" />
      </el-descriptions-item>
      <el-descriptions-item :label="t('costTime')">{{ detailData.costTime ?? 0 }} ms</el-descriptions-item>
      <el-descriptions-item :label="t('operTime')" :span="2">{{ detailData.operTime || '-' }}</el-descriptions-item>
      <el-descriptions-item :label="t('operParam')" :span="2">
        <pre class="log-detail-value">{{ detailData.operParam || '-' }}</pre>
      </el-descriptions-item>
      <el-descriptions-item :label="t('jsonResult')" :span="2">
        <pre class="log-detail-value">{{ detailData.jsonResult || '-' }}</pre>
      </el-descriptions-item>
      <el-descriptions-item v-if="detailData.errorMsg" :label="t('errorMsg')" :span="2">
        <pre class="log-detail-value log-detail-value--error">{{ detailData.errorMsg }}</pre>
      </el-descriptions-item>
    </el-descriptions>
  </DetailModal>
</template>

<script setup lang="ts">
import { operLogApi } from '@/api/_index'
import type { OperLogQuery, OperLogVO } from '@/api/monitor/operlog.types'
import type { ZeFormInstance } from '@/components/types/form'
import { downloadBlob } from '@/utils/download'
import { watchDebounced } from '@vueuse/core'

const { t } = useI18nLocal()
const { sys_common_status, sys_oper_type } = toRefs(useDict('sys_common_status', 'sys_oper_type'))

const searchFormRef = ref<ZeFormInstance>()
const [searchForm, searchFormItems] = useForm({
  title: { value: '', item: { type: 'text', plh: t('title'), prefixIcon: 'el-search' } },
  operName: { value: '', item: { type: 'text', plh: t('operName') } },
  operIp: { value: '', item: { type: 'text', plh: t('operIp') } },
  businessType: {
    value: '',
    item: { type: 'select', label: t('businessType'), options: sys_oper_type, labelWidth: '75px' },
  },
  status: {
    value: '',
    item: { type: 'select', label: t('status'), options: sys_common_status, labelWidth: '45px' },
  },
  timeRange: {
    value: [] as string[],
    item: {
      type: 'datetimerange',
      label: t('operTime'),
      labelWidth: '75px',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      startPlaceholder: t('startTime'),
      endPlaceholder: t('endTime'),
      rangeSeparator: '-',
    },
  },
})

const queryParams = computed<OperLogQuery>(() => ({
  title: searchForm.value.title,
  operName: searchForm.value.operName,
  operIp: searchForm.value.operIp,
  businessType: searchForm.value.businessType,
  status: searchForm.value.status,
  params: {
    beginTime: searchForm.value.timeRange?.[0],
    endTime: searchForm.value.timeRange?.[1],
  },
}))
watchDebounced(searchForm, () => refresh(), { deep: true, debounce: 666, maxWait: 3000 })

const [listData, refresh, pagination, loading] = useTable<OperLogQuery, OperLogVO>(
  operLogApi.listOperLog,
  queryParams,
  { immediate: true },
)

const [tableRef, filterColRef] = [ref(), ref()]
const selectedRows = ref<OperLogVO[]>([])
const reset = () => {
  searchFormRef.value?.resetFields()
  tableRef.value?.clearSelection()
  nextTick(() => refresh())
}

const detailData = ref<OperLogVO>()
const [detailRef, DetailModal] = useModal({
  title: computed(() => t('detailTitle')),
  showAction: false,
  onOpen: (row: OperLogVO) => (detailData.value = row),
})

const [, handleDel] = useApi(operLogApi.delOperLog, [], {
  onSuccess: () => {
    selectedRows.value = []
    refresh()
  },
  tipSuccess: computed(() => t('deleteSuccess')),
  tipError: computed(() => t('deleteFailed')),
})

const [, handleClean] = useApi(operLogApi.cleanOperLog, undefined, {
  onSuccess: () => refresh(),
  tipSuccess: computed(() => t('cleanSuccess')),
  tipError: computed(() => t('cleanFailed')),
})

const exporting = ref(false)
const handleExport = async () => {
  exporting.value = true
  try {
    downloadBlob(await operLogApi.exportOperLog(queryParams.value), 'operation-log.xlsx')
    ElMessage.success(t('exportSuccess'))
  } catch {
    ElMessage.error(t('exportFailed'))
  } finally {
    exporting.value = false
  }
}
</script>

<style lang="scss" scoped>
.log-detail-value {
  max-height: 180px;
  margin: 0;
  overflow: auto;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;

  &--error {
    color: var(--el-color-danger);
  }
}
</style>

<i18n lang="yaml">
en:
  columns: 'Show/hide columns'
  reset: 'Reset'
  deleteSelected: 'Delete selected'
  clean: 'Clear all'
  export: 'Export'
  operId: 'Log ID'
  title: 'Module'
  businessType: 'Operation type'
  requestMethod: 'Request method'
  operName: 'Operator'
  operIp: 'IP address'
  operLocation: 'Location'
  status: 'Status'
  operTime: 'Operation time'
  costTime: 'Duration'
  actions: 'Actions'
  detail: 'Details'
  delete: 'Delete'
  deptName: 'Department'
  operUrl: 'Request URL'
  method: 'Method'
  operParam: 'Request parameters'
  jsonResult: 'Response'
  errorMsg: 'Error message'
  startTime: 'Start time'
  endTime: 'End time'
  detailTitle: 'Operation log details'
  deleteSuccess: 'Deleted successfully'
  deleteFailed: 'Failed to delete'
  cleanSuccess: 'Logs cleared'
  cleanFailed: 'Failed to clear logs'
  exportSuccess: 'Exported successfully'
  exportFailed: 'Failed to export'
zh:
  columns: '显示/隐藏列'
  reset: '重置'
  deleteSelected: '删除所选'
  clean: '清空'
  export: '导出'
  operId: '日志编号'
  title: '系统模块'
  businessType: '操作类型'
  requestMethod: '请求方式'
  operName: '操作人员'
  operIp: '操作地址'
  operLocation: '操作地点'
  status: '状态'
  operTime: '操作时间'
  costTime: '消耗时间'
  actions: '操作'
  detail: '详情'
  delete: '删除'
  deptName: '部门名称'
  operUrl: '请求地址'
  method: '请求方法'
  operParam: '请求参数'
  jsonResult: '返回参数'
  errorMsg: '错误消息'
  startTime: '开始时间'
  endTime: '结束时间'
  detailTitle: '操作日志详情'
  deleteSuccess: '删除成功'
  deleteFailed: '删除失败'
  cleanSuccess: '清空成功'
  cleanFailed: '清空失败'
  exportSuccess: '导出成功'
  exportFailed: '导出失败'
</i18n>
