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

        <ze-form-item class="ml-a">
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
        { prop: 'id', label: '租户ID', hidden: true },
        { prop: 'tenantId', label: '租户编号', minWidth: 138, fixed: true },
        { prop: 'contactUserName', label: '联系人', minWidth: 138 },
        { prop: 'contactPhone', label: '联系电话', minWidth: 138 },
        { prop: 'companyName', label: '企业名称', minWidth: 138 },
        { prop: 'licenseNumber', label: '社会信用代码', minWidth: 138 },
        { prop: 'expireTime', label: '创建时间', minWidth: 180 },
        { prop: 'status', label: '租户状态', minWidth: 100 },
        // { prop: '', label: '' },
      ]"
      :filterColVR="filterColRef"
    >
      <template #col-status="{ row }">
        <el-switch v-model="row.status" active-value="0" inactive-value="1" @click="() => handleStatusChange(row)" />
      </template>

      <ze-table-column fixed="right" label="操作" width="150px" headerAlign="center" :show-overflow-tooltip="false">
        <template #default="{ row }">
          <ze-actions
            :options="{ text: true, type: 'primary' }"
            :actions="[
              { content: '修改', text: true, type: 'primary', onClick: () => editRef.open(row) },
              { content: '同步套餐', text: true, type: 'primary', onClick: () => handleSyncTenantPackage(row) },
              { content: '删除', confirm: true, onClick: () => handleDel(row) },
            ]"
            ellipsis
          />
        </template>
      </ze-table-column>
    </ze-table>

    <template #content-footer>
      <ze-pagination class="ml-a" v-model="pagination" />
    </template>
  </VPage>

  <EditModal top="5vh">
    <ze-form v-model="editForm" :items="editFormItems" :rules="editFormRules"></ze-form>
  </EditModal>
</template>

<script setup lang="ts">
import { tenantApi } from '@/api/_index'
import type { ZeFormInstance } from '@/components/types/form'
import { watchDebounced } from '@vueuse/core'

const { sys_normal_disable } = toRefs(useDict('sys_normal_disable'))

const searchFormRef = ref<ZeFormInstance>()

const [searchForm, searchFormItems] = useForm({
  packageName: { value: '', item: { type: 'text', plh: '请输入套餐名称', prefixIcon: 'el-search' } },
})
watchDebounced(searchForm, () => refresh(), { debounce: 666, maxWait: 3000 })

const [listData, refresh, pagination, loading] = useTable(tenantApi.listTenant, searchForm, { immediate: true })

const [tableRef, filterColRef] = [ref(), ref()]
const reset = () => {
  searchFormRef.value?.resetFields()
  nextTick(() => refresh())
}

const isEdit = computed(() => editForm.value?.tenantId || false)

const [editRef, EditModal] = useModal({
  title: computed(() => `${isEdit.value ? '编辑' : '添加'}租户`),
  submitting: computed(() => submitting.value),
  onConfirm: () => fetchEdit(),
})

const [editForm, editFormItems, editFormRules] = useForm({
  tenantId: { value: '' },
  companyName: { value: '', item: { type: 'text', label: '企业名称', plh: '请输入企业名称' } },
  contactUserName: { value: '', item: { type: 'text', label: '联系人', plh: '请输入联系人' } },
  contactPhone: { value: '', item: { type: 'text', label: '联系电话', plh: '请输入联系电话' } },
  username: { value: '', item: { type: 'text', label: '用户名', plh: '请输入系统用户名' } },
  password: { value: '', item: { type: 'password', label: '用户密码', plh: '请输入系统用户密码' } },
  packageId: { value: '', item: { type: 'select', label: '租户套餐', plh: '请选择租户套餐' } },
  expireTime: { value: '', item: { type: 'datetime', label: '过期时间', plh: '请选择过期时间' } },
  accountCount: { value: 0, item: { type: 'number', label: '用户数量', plh: '请输入用户数量' } },
  domain: { value: '', item: { type: 'text', label: '绑定域名', plh: '请输入绑定域名' } },
  address: { value: '', item: { type: 'text', label: '企业地址', plh: '请输入企业地址' } },
  licenseNumber: { value: '', item: { type: 'text', label: '企业代码', plh: '请输入统一社会信用代码' } },
  intro: { value: '', item: { type: 'text', label: '企业简介', plh: '请输入企业简介' } },
  remark: { value: '', item: { type: 'text', label: '备注', plh: '请输入备注' } },
})

const { request: fetchEdit, loading: submitting } = useApi(
  (data: typeof editForm.value) => (isEdit.value ? tenantApi.updateTenant(data) : tenantApi.addTenant(data)),
  editForm,
  {
    onSuccess: () => (editRef.value.close(), refresh()),
    tipSuccess: computed(() => (isEdit.value ? '保存成功' : '新增成功')),
    tipError: computed(() => (isEdit.value ? '保存失败' : '新增失败')),
  },
)

const handleStatusChange = (row) => {
  const text = row.status === '0' ? '启用' : '停用'
  const cancel = () => (row.status = row.status === '0' ? '1' : '0')
  ElMessageBox.confirm(`确定要${text} ${row.companyName} 租户吗？`, { type: 'warning' })
    .then(() => {
      tenantApi
        .changeTenantStatus(row)
        .then(() => ElMessage.success(`${text}成功`))
        .catch(() => cancel())
    })
    .catch(() => cancel())
}

const handleSyncTenantPackage = (row) => {
  ElMessageBox.confirm(`是否确认同步租户套餐租户编号为"${row.tenantId}"的数据项？`, { type: 'warning' })
    .then(() => {
      loading.value = true
      tenantApi.syncTenantPackage(row).then(() => ElMessage.success('同步成功'))
    })
    .finally(() => (loading.value = false))
}

const [, handleDel] = useApi(tenantApi.delTenant, '', { onSuccess: () => refresh(), tipSuccess: '删除成功' })
</script>

<style lang="scss" scoped></style>
