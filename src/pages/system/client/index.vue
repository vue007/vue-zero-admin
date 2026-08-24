<template>
  <VPage class="p-24">
    <template #header>
      <ze-form v-model="searchForm" :items="searchFormItems" ref="searchFormRef" inline>
        <ze-form-item>
          <ze-actions
            :actions="[
              { icon: 'el-scale-to-original', tip: '显示/隐藏列', onRef: (r) => (filterColRef = r) },
              { icon: 'el-refresh', tip: '重置', onClick: reset },
            ]"
          />
        </ze-form-item>

        <ze-form-item class="mla mr0!">
          <ze-actions
            :actions="[{ icon: 'el-plus', content: '新增', type: 'primary', onClick: () => editRef.open() }]"
          />
        </ze-form-item>
      </ze-form>
    </template>

    <ze-table
      ref="tableRef"
      :data="listData"
      :loading="loading"
      :columns="[
        { prop: 'id', label: 'ID', hidden: true },
        { prop: 'clientId', label: '客户端 ID', minWidth: 170, fixed: true },
        { prop: 'clientKey', label: '客户端 Key', minWidth: 140 },
        { prop: 'clientSecret', label: '客户端密钥', minWidth: 160 },
        { prop: 'grantTypeList', label: '授权类型', minWidth: 170 },
        { prop: 'deviceType', label: '设备类型', minWidth: 110 },
        { prop: 'activeTimeout', label: 'Token 活跃超时', minWidth: 140 },
        { prop: 'timeout', label: 'Token 固定超时', minWidth: 140 },
        { prop: 'status', label: '状态', width: 90 },
      ]"
      :filterColVR="filterColRef"
    >
      <template #col-grantTypeList="{ row }">
        <VDictTag :options="sys_grant_type" :value="row.grantTypeList" />
      </template>

      <template #col-deviceType="{ row }">
        <VDictTag :options="sys_device_type" :value="row.deviceType" />
      </template>

      <template #col-status="{ row }">
        <el-switch
          v-model="row.status"
          active-value="0"
          inactive-value="1"
          @click="() => handleStatusChange(row)"
        />
      </template>

      <ze-table-column fixed="right" label="操作" width="150px" headerAlign="center">
        <template #default="{ row }">
          <ze-actions
            :options="{ text: true, type: 'primary' }"
            :actions="[
              { content: '编辑', onClick: () => editRef.open(row) },
              { content: '删除', confirm: true, onClick: () => handleDel([row.id]) },
            ]"
          />
        </template>
      </ze-table-column>
    </ze-table>

    <template #content-footer>
      <ze-pagination class="ml-a" v-model="pagination" />
    </template>
  </VPage>

  <EditModal width="700px" top="5vh">
    <ze-form v-model="editForm" :items="editFormItems" :rules="editFormRules" />
  </EditModal>
</template>

<script setup lang="ts">
import { clientApi } from '@/api/_index'
import type { ClientQuery, ClientVO } from '@/api/sys/client.types'
import type { ZeFormInstance } from '@/components/types/form'
import { toReactive, watchDebounced } from '@vueuse/core'
import { merge } from 'es-toolkit'

const { sys_normal_disable, sys_grant_type, sys_device_type } = toRefs(
  useDict('sys_normal_disable', 'sys_grant_type', 'sys_device_type'),
)

const searchFormRef = ref<ZeFormInstance>()
const [searchForm, searchFormItems] = useForm({
  clientKey: { value: '', item: { type: 'text', plh: '客户端 Key', prefixIcon: 'el-search' } },
  clientSecret: { value: '', item: { type: 'text', plh: '客户端密钥' } },
  status: {
    value: '',
    item: { type: 'select', label: '状态', options: sys_normal_disable, labelWidth: '45px' },
  },
})
watchDebounced(searchForm, () => refresh(), { deep: true, debounce: 666, maxWait: 3000 })

const [listData, refresh, pagination, loading] = useTable<ClientQuery, ClientVO>(
  clientApi.listClient,
  toReactive(searchForm),
  { immediate: true },
)

const [tableRef, filterColRef] = [ref(), ref()]
const reset = () => (searchFormRef.value?.resetFields(), nextTick(() => refresh()))

const isEdit = computed(() => Boolean(editForm.value.id))
const [clientDetail, fetchClientDetail] = useApi<Pick<ClientVO, 'id'>, ClientVO>(clientApi.getClient)
watch(clientDetail, () => merge(editForm.value, clientDetail.value || {}), { deep: true })

const [editRef, EditModal] = useModal({
  title: computed(() => `${isEdit.value ? '编辑' : '添加'}客户端`),
  submitting: computed(() => submitting.value),
  onOpen: (row?: ClientVO) => row && fetchClientDetail({ id: row.id }),
  onConfirm: () => fetchEdit(),
})

const [editForm, editFormItems, editFormRules] = useForm({
  id: { value: undefined as number | string | undefined },
  clientId: { value: '' },
  clientKey: {
    value: '',
    item: { type: 'text', label: '客户端 Key', plh: '请输入客户端 Key' },
    rule: [{ required: true, message: '客户端 Key 不能为空', trigger: 'blur' }],
  },
  clientSecret: {
    value: '',
    item: { type: 'password', label: '客户端密钥', plh: '请输入客户端密钥', showPassword: true },
    rule: [{ required: true, message: '客户端密钥不能为空', trigger: 'blur' }],
  },
  grantTypeList: {
    value: [] as string[],
    item: { type: 'select', label: '授权类型', plh: '请选择授权类型', options: sys_grant_type, multiple: true },
    rule: [{ required: true, message: '授权类型不能为空', trigger: 'change' }],
  },
  deviceType: {
    value: '',
    item: { type: 'select', label: '设备类型', plh: '请选择设备类型', options: sys_device_type },
  },
  activeTimeout: {
    value: 1800,
    item: { type: 'number', label: 'Token 活跃超时', min: -1, plh: '单位：秒' },
  },
  timeout: {
    value: 604800,
    item: { type: 'number', label: 'Token 固定超时', min: -1, plh: '单位：秒' },
  },
  status: {
    value: '0',
    item: { type: 'radio', label: '状态', options: sys_normal_disable },
  },
})

const { request: fetchEdit, loading: submitting } = useApi(
  (data: typeof editForm.value) => (isEdit.value ? clientApi.updateClient(data) : clientApi.addClient(data)),
  editForm,
  {
    onSuccess: () => (editRef.value.close(), refresh()),
    tipSuccess: computed(() => (isEdit.value ? '保存成功' : '新增成功')),
    tipError: computed(() => (isEdit.value ? '保存失败' : '新增失败')),
  },
)

const handleStatusChange = (row: ClientVO) => {
  const text = row.status === '0' ? '启用' : '停用'
  const cancel = () => (row.status = row.status === '0' ? '1' : '0')
  ElMessageBox.confirm(`确定要${text}客户端 ${row.clientKey} 吗？`, { type: 'warning' })
    .then(() =>
      clientApi
        .changeClientStatus({ clientId: row.clientId, status: row.status })
        .then(() => ElMessage.success(`${text}成功`))
        .catch(cancel),
    )
    .catch(cancel)
}

const [, handleDel] = useApi(clientApi.delClient, [], {
  onSuccess: () => refresh(),
  tipSuccess: '删除成功',
  tipError: '删除失败',
})
</script>

<style lang="scss" scoped></style>
