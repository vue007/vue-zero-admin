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
                onClick: () => handleDel(selectedRows.map((item) => item.infoId)),
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
        { prop: 'infoId', label: t('infoId'), hidden: true },
        { prop: 'userName', label: t('userName'), minWidth: 120, fixed: true },
        { prop: 'status', label: t('status'), width: 90 },
        { prop: 'ipaddr', label: t('ipaddr'), minWidth: 135 },
        { prop: 'loginLocation', label: t('loginLocation'), minWidth: 150 },
        { prop: 'clientKey', label: t('clientKey'), minWidth: 120 },
        { prop: 'deviceType', label: t('deviceType'), width: 100 },
        { prop: 'browser', label: t('browser'), minWidth: 120 },
        { prop: 'os', label: t('os'), minWidth: 140 },
        { prop: 'msg', label: t('msg'), minWidth: 180 },
        { prop: 'loginTime', label: t('loginTime'), minWidth: 180 },
      ]"
      :filterColVR="filterColRef"
      @selection-change="selectedRows = $event"
    >
      <template #col-status="{ row }">
        <VDictTag :options="sys_common_status" :value="row.status" />
      </template>

      <template #col-deviceType="{ row }">
        <VDictTag :options="sys_device_type" :value="row.deviceType" />
      </template>

      <ze-table-column fixed="right" :label="t('actions')" width="160px" headerAlign="center">
        <template #default="{ row }">
          <ze-actions
            :options="{ text: true, type: 'primary' }"
            :actions="[
              { content: t('unlock'), confirm: true, onClick: () => handleUnlock(row.userName) },
              { content: t('delete'), confirm: true, onClick: () => handleDel([row.infoId]) },
            ]"
          />
        </template>
      </ze-table-column>
    </ze-table>

    <template #content-footer>
      <ze-pagination class="ml-a" v-model="pagination" />
    </template>
  </VPage>
</template>

<script setup lang="ts">
import { loginInfoApi } from '@/api/_index'
import type { LoginInfoQuery, LoginInfoVO } from '@/api/monitor/logininfor.types'
import type { ZeFormInstance } from '@/components/types/form'
import { downloadBlob } from '@/utils/download'
import { watchDebounced } from '@vueuse/core'

const { t } = useI18nLocal()
const { sys_common_status, sys_device_type } = toRefs(useDict('sys_common_status', 'sys_device_type'))

const searchFormRef = ref<ZeFormInstance>()
const [searchForm, searchFormItems] = useForm({
  userName: { value: '', item: { type: 'text', plh: t('userName'), prefixIcon: 'el-search' } },
  ipaddr: { value: '', item: { type: 'text', plh: t('ipaddr') } },
  status: {
    value: '',
    item: { type: 'select', label: t('status'), options: sys_common_status, labelWidth: '45px' },
  },
  timeRange: {
    value: [] as string[],
    item: {
      type: 'datetimerange',
      label: t('loginTime'),
      labelWidth: '75px',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      startPlaceholder: t('startTime'),
      endPlaceholder: t('endTime'),
      rangeSeparator: '-',
    },
  },
})

const queryParams = computed<LoginInfoQuery>(() => ({
  userName: searchForm.value.userName,
  ipaddr: searchForm.value.ipaddr,
  status: searchForm.value.status,
  params: {
    beginTime: searchForm.value.timeRange?.[0],
    endTime: searchForm.value.timeRange?.[1],
  },
}))
watchDebounced(searchForm, () => refresh(), { deep: true, debounce: 666, maxWait: 3000 })

const [listData, refresh, pagination, loading] = useTable<LoginInfoQuery, LoginInfoVO>(
  loginInfoApi.listLoginInfo,
  queryParams,
  { immediate: true },
)

const [tableRef, filterColRef] = [ref(), ref()]
const selectedRows = ref<LoginInfoVO[]>([])
const reset = () => {
  searchFormRef.value?.resetFields()
  tableRef.value?.clearSelection()
  nextTick(() => refresh())
}

const [, handleDel] = useApi(loginInfoApi.delLoginInfo, [], {
  onSuccess: () => {
    selectedRows.value = []
    refresh()
  },
  tipSuccess: computed(() => t('deleteSuccess')),
  tipError: computed(() => t('deleteFailed')),
})

const [, handleClean] = useApi(loginInfoApi.cleanLoginInfo, undefined, {
  onSuccess: () => refresh(),
  tipSuccess: computed(() => t('cleanSuccess')),
  tipError: computed(() => t('cleanFailed')),
})

const [, handleUnlock] = useApi(loginInfoApi.unlockUser, '', {
  tipSuccess: computed(() => t('unlockSuccess')),
  tipError: computed(() => t('unlockFailed')),
})

const exporting = ref(false)
const handleExport = async () => {
  exporting.value = true
  try {
    downloadBlob(await loginInfoApi.exportLoginInfo(queryParams.value), 'login-log.xlsx')
    ElMessage.success(t('exportSuccess'))
  } catch {
    ElMessage.error(t('exportFailed'))
  } finally {
    exporting.value = false
  }
}
</script>

<style lang="scss" scoped></style>

<i18n lang="yaml">
en:
  columns: 'Show/hide columns'
  reset: 'Reset'
  deleteSelected: 'Delete selected'
  clean: 'Clear all'
  export: 'Export'
  infoId: 'Log ID'
  userName: 'Username'
  status: 'Status'
  ipaddr: 'IP address'
  loginLocation: 'Location'
  clientKey: 'Client'
  deviceType: 'Device'
  browser: 'Browser'
  os: 'Operating system'
  msg: 'Message'
  loginTime: 'Login time'
  actions: 'Actions'
  unlock: 'Unlock'
  delete: 'Delete'
  startTime: 'Start time'
  endTime: 'End time'
  deleteSuccess: 'Deleted successfully'
  deleteFailed: 'Failed to delete'
  cleanSuccess: 'Logs cleared'
  cleanFailed: 'Failed to clear logs'
  unlockSuccess: 'Account unlocked'
  unlockFailed: 'Failed to unlock account'
  exportSuccess: 'Exported successfully'
  exportFailed: 'Failed to export'
zh:
  columns: '显示/隐藏列'
  reset: '重置'
  deleteSelected: '删除所选'
  clean: '清空'
  export: '导出'
  infoId: '访问编号'
  userName: '用户账号'
  status: '状态'
  ipaddr: '登录地址'
  loginLocation: '登录地点'
  clientKey: '客户端'
  deviceType: '设备类型'
  browser: '浏览器'
  os: '操作系统'
  msg: '提示消息'
  loginTime: '访问时间'
  actions: '操作'
  unlock: '解锁'
  delete: '删除'
  startTime: '开始时间'
  endTime: '结束时间'
  deleteSuccess: '删除成功'
  deleteFailed: '删除失败'
  cleanSuccess: '清空成功'
  cleanFailed: '清空失败'
  unlockSuccess: '账号解锁成功'
  unlockFailed: '账号解锁失败'
  exportSuccess: '导出成功'
  exportFailed: '导出失败'
</i18n>
