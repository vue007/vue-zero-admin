<template>
  <VPage class="p-24">
    <template #header>
      <ze-form ref="searchFormRef" v-model="searchForm" :items="searchFormItems" inline>
        <ze-form-item>
          <ze-actions
            :actions="[
              { icon: 'el-scale-to-original', tip: t('columns'), onRef: (value) => (filterColRef = value) },
              { icon: 'el-refresh', tip: t('reset'), onClick: reset },
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
        { prop: 'memberId', label: t('memberId'), hidden: true },
        { prop: 'username', label: t('username'), minWidth: 140, fixed: true },
        { prop: 'nickname', label: t('nickname'), minWidth: 140 },
        { prop: 'mobile', label: t('mobile'), minWidth: 140 },
        { prop: 'email', label: t('email'), minWidth: 190 },
        { prop: 'registerSource', label: t('registerSource'), minWidth: 150 },
        { prop: 'status', label: t('status'), width: 90 },
        { prop: 'loginIp', label: t('loginIp'), minWidth: 140 },
        { prop: 'loginDate', label: t('loginDate'), minWidth: 180 },
        { prop: 'createTime', label: t('createTime'), minWidth: 180 },
      ]"
      :filterColVR="filterColRef"
    >
      <template #col-status="{ row }">
        <el-switch
          v-model="row.status"
          active-value="0"
          inactive-value="1"
          @click="() => handleStatusChange(row)"
        />
      </template>
    </ze-table>

    <template #content-footer>
      <ze-pagination class="ml-a" v-model="pagination" />
    </template>
  </VPage>
</template>

<script setup lang="ts">
import { memberApi } from '@/api/_index'
import type { MemberQuery, MemberVO } from '@/api/app/member.types'
import type { ZeFormInstance } from '@/components/types/form'
import { toReactive, watchDebounced } from '@vueuse/core'

const { t } = useI18nLocal()
const { sys_normal_disable } = toRefs(useDict('sys_normal_disable'))

const searchFormRef = ref<ZeFormInstance>()
const [searchForm, searchFormItems] = useForm({
  username: { value: '', item: { type: 'text', plh: t('username'), prefixIcon: 'el-search' } },
  nickname: { value: '', item: { type: 'text', plh: t('nickname') } },
  mobile: { value: '', item: { type: 'text', plh: t('mobile') } },
  status: {
    value: '',
    item: { type: 'select', label: t('status'), options: sys_normal_disable, labelWidth: '50px' },
  },
})

const [listData, refresh, pagination, loading] = useTable<MemberQuery, MemberVO>(
  memberApi.listMember,
  toReactive(searchForm),
  { immediate: true },
)

watchDebounced(searchForm, () => refreshFromFirstPage(), { deep: true, debounce: 500, maxWait: 2000 })

const [tableRef, filterColRef] = [ref(), ref()]
const refreshFromFirstPage = () => {
  pagination.pageNo = 1
  return refresh()
}
const reset = () => {
  searchFormRef.value?.resetFields()
  nextTick(() => refreshFromFirstPage())
}

const handleStatusChange = (row: MemberVO) => {
  const action = row.status === '0' ? t('enable') : t('disable')
  const restore = () => (row.status = row.status === '0' ? '1' : '0')

  ElMessageBox.confirm(t('statusConfirm', { action, username: row.username }), { type: 'warning' })
    .then(() =>
      memberApi
        .changeMemberStatus({ memberId: row.memberId, status: row.status })
        .then(() => ElMessage.success(t('statusSuccess', { action })))
        .catch(restore),
    )
    .catch(restore)
}
</script>

<style lang="scss" scoped></style>

<i18n lang="yaml">
en:
  columns: 'Show/hide columns'
  reset: 'Reset'
  memberId: 'Member ID'
  username: 'Username'
  nickname: 'Nickname'
  mobile: 'Mobile'
  email: 'Email'
  registerSource: 'Registration source'
  status: 'Status'
  loginIp: 'Last login IP'
  loginDate: 'Last login time'
  createTime: 'Created at'
  enable: 'enable'
  disable: 'disable'
  statusConfirm: 'Are you sure you want to {action} member "{username}"?'
  statusSuccess: 'Member status updated successfully'
zh-CN:
  columns: '显示/隐藏列'
  reset: '重置'
  memberId: '会员编号'
  username: '会员账号'
  nickname: '会员昵称'
  mobile: '手机号码'
  email: '邮箱'
  registerSource: '注册来源'
  status: '状态'
  loginIp: '最后登录 IP'
  loginDate: '最后登录时间'
  createTime: '创建时间'
  enable: '启用'
  disable: '停用'
  statusConfirm: '确认要{action}会员“{username}”吗？'
  statusSuccess: '{action}成功'
</i18n>
