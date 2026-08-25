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
                content: t('batchLogout'),
                type: 'danger',
                plain: true,
                confirm: true,
                disabled: selectedRows.length === 0,
                onClick: () => handleBatchLogout({ tokenIds: selectedRows.map((item) => item.tokenId) }),
              },
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
        { prop: 'userName', label: t('userName'), minWidth: 120, fixed: true },
        { prop: 'deptName', label: t('deptName'), minWidth: 130 },
        { prop: 'ipaddr', label: t('ipaddr'), minWidth: 135 },
        { prop: 'loginLocation', label: t('loginLocation'), minWidth: 150 },
        { prop: 'clientKey', label: t('clientKey'), minWidth: 120 },
        { prop: 'deviceType', label: t('deviceType'), width: 110 },
        { prop: 'browser', label: t('browser'), minWidth: 120 },
        { prop: 'os', label: t('os'), minWidth: 140 },
        { prop: 'loginTime', label: t('loginTime'), minWidth: 180 },
        { prop: 'lastAccessTime', label: t('lastAccessTime'), minWidth: 180 },
        { prop: 'expireTime', label: t('expireTime'), minWidth: 180 },
        { prop: 'tokenId', label: t('tokenId'), minWidth: 220, hidden: true },
      ]"
      :filterColVR="filterColRef"
      @selection-change="selectedRows = $event"
    >
      <template #col-deviceType="{ row }">
        <VDictTag :options="sys_device_type" :value="row.deviceType" />
      </template>
      <template #col-loginTime="{ row }">{{ formatTime(row.loginTime) }}</template>
      <template #col-lastAccessTime="{ row }">{{ formatTime(row.lastAccessTime) }}</template>
      <template #col-expireTime="{ row }">{{ formatTime(row.expireTime) }}</template>

      <ze-table-column fixed="right" :label="t('actions')" width="100px" headerAlign="center">
        <template #default="{ row }">
          <ze-actions
            :options="{ text: true, type: 'danger' }"
            :actions="[
              {
                content: t('forceLogout'),
                confirm: true,
                onClick: () => handleForceLogout({ tokenId: row.tokenId }),
              },
            ]"
          />
        </template>
      </ze-table-column>
    </ze-table>

    <template #content-footer><ze-pagination class="ml-a" v-model="pagination" /></template>
  </VPage>
</template>

<script setup lang="ts">
import { onlineApi } from '@/api/_index'
import type { OnlineQuery, OnlineVO } from '@/api/monitor/online.types'
import type { ZeFormInstance } from '@/components/types/form'
import { toReactive, watchDebounced } from '@vueuse/core'

const { t } = useI18nLocal()
const { sys_device_type } = toRefs(useDict('sys_device_type'))

const searchFormRef = ref<ZeFormInstance>()
const [searchForm, searchFormItems] = useForm({
  userName: { value: '', item: { type: 'text', plh: t('userName'), prefixIcon: 'el-search' } },
  ipaddr: { value: '', item: { type: 'text', plh: t('ipaddr') } },
})
watchDebounced(searchForm, () => refresh(), { deep: true, debounce: 500, maxWait: 2000 })

const [listData, refresh, pagination, loading] = useTable<OnlineQuery, OnlineVO>(
  onlineApi.listOnline,
  toReactive(searchForm),
  { immediate: true },
)

const [tableRef, filterColRef] = [ref(), ref()]
const selectedRows = ref<OnlineVO[]>([])
const reset = () => {
  searchFormRef.value?.resetFields()
  tableRef.value?.clearSelection()
  nextTick(() => refresh())
}

const [, handleForceLogout] = useApi(onlineApi.forceLogout, undefined, {
  onSuccess: () => refresh(),
  tipSuccess: computed(() => t('forceLogoutSuccess')),
  tipError: computed(() => t('forceLogoutFailed')),
})

const [, handleBatchLogout] = useApi(onlineApi.batchLogout, undefined, {
  onSuccess: () => {
    selectedRows.value = []
    refresh()
  },
  tipSuccess: computed(() => t('batchLogoutSuccess')),
  tipError: computed(() => t('batchLogoutFailed')),
})

const formatTime = (value?: number) => {
  if (!value) return '-'
  const locale = localStorage.getItem('setting.local') || 'zh-CN'
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date(value))
}
</script>

<i18n lang="yaml">
en:
  columns: 'Show/hide columns'
  reset: 'Reset'
  batchLogout: 'Force selected offline'
  userName: 'Username'
  deptName: 'Department'
  ipaddr: 'IP address'
  loginLocation: 'Location'
  clientKey: 'Client'
  deviceType: 'Device'
  browser: 'Browser'
  os: 'Operating system'
  loginTime: 'Login time'
  lastAccessTime: 'Last active'
  expireTime: 'Expires at'
  tokenId: 'Session ID'
  actions: 'Actions'
  forceLogout: 'Force offline'
  forceLogoutSuccess: 'Session terminated'
  forceLogoutFailed: 'Failed to terminate session'
  batchLogoutSuccess: 'Selected sessions terminated'
  batchLogoutFailed: 'Failed to terminate selected sessions'
zh:
  columns: '显示/隐藏列'
  reset: '重置'
  batchLogout: '批量强退'
  userName: '用户账号'
  deptName: '所属部门'
  ipaddr: '登录地址'
  loginLocation: '登录地点'
  clientKey: '客户端'
  deviceType: '设备类型'
  browser: '浏览器'
  os: '操作系统'
  loginTime: '登录时间'
  lastAccessTime: '最近访问'
  expireTime: '会话过期'
  tokenId: '会话编号'
  actions: '操作'
  forceLogout: '强退'
  forceLogoutSuccess: '强退成功'
  forceLogoutFailed: '强退失败'
  batchLogoutSuccess: '批量强退成功'
  batchLogoutFailed: '批量强退失败'
</i18n>
