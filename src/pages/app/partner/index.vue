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

        <ze-form-item class="mla mr0!">
          <ze-actions
            :actions="[{ icon: 'el-plus', content: t('add'), type: 'primary', onClick: () => editRef.open() }]"
          />
        </ze-form-item>
      </ze-form>
    </template>

    <ze-table
      ref="tableRef"
      :data="listData"
      :loading="loading"
      :columns="[
        { prop: 'partnerId', label: t('partnerId'), hidden: true },
        { prop: 'partnerCode', label: t('partnerCode'), minWidth: 150, fixed: true },
        { prop: 'partnerName', label: t('partnerName'), minWidth: 200 },
        { prop: 'creditCode', label: t('creditCode'), minWidth: 190 },
        { prop: 'contactName', label: t('contactName'), minWidth: 120 },
        { prop: 'contactPhone', label: t('contactPhone'), minWidth: 140 },
        { prop: 'status', label: t('status'), width: 90 },
        { prop: 'createTime', label: t('createTime'), minWidth: 180 },
      ]"
      :filterColVR="filterColRef"
    >
      <template #col-status="{ row }">
        <VDictTag :options="sys_normal_disable" :value="row.status" />
      </template>

      <ze-table-column fixed="right" :label="t('actions')" width="150px" headerAlign="center">
        <template #default="{ row }">
          <ze-actions
            :options="{ text: true, type: 'primary' }"
            :actions="[
              { content: t('edit'), onClick: () => editRef.open(row) },
              { content: t('delete'), confirm: true, onClick: () => handleDel([row.partnerId]) },
            ]"
          />
        </template>
      </ze-table-column>
    </ze-table>

    <template #content-footer>
      <ze-pagination class="ml-a" v-model="pagination" />
    </template>
  </VPage>

  <EditModal width="720px">
    <ze-form v-model="editForm" :items="editFormItems" :rules="editFormRules" />
  </EditModal>
</template>

<script setup lang="ts">
import { partnerApi } from '@/api/_index'
import type { PartnerForm, PartnerQuery, PartnerVO } from '@/api/app/partner.types'
import type { ZeFormInstance } from '@/components/types/form'
import { toReactive, watchDebounced } from '@vueuse/core'
import { merge } from 'es-toolkit'

const { t } = useI18nLocal()
const { sys_normal_disable } = toRefs(useDict('sys_normal_disable'))

const searchFormRef = ref<ZeFormInstance>()
const [searchForm, searchFormItems] = useForm({
  partnerCode: { value: '', item: { type: 'text', plh: t('partnerCode'), prefixIcon: 'el-search' } },
  partnerName: { value: '', item: { type: 'text', plh: t('partnerName') } },
  contactName: { value: '', item: { type: 'text', plh: t('contactName') } },
  status: {
    value: '',
    item: { type: 'select', label: t('status'), options: sys_normal_disable, labelWidth: '50px' },
  },
})

const [listData, refresh, pagination, loading] = useTable<PartnerQuery, PartnerVO>(
  partnerApi.listPartner,
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

const isEdit = computed(() => Boolean(editForm.value.partnerId))
const [partnerDetail, fetchPartnerDetail] = useApi<Pick<PartnerVO, 'partnerId'>, PartnerVO>(partnerApi.getPartner)
watch(partnerDetail, () => merge(editForm.value, partnerDetail.value || {}), { deep: true })

const [editRef, EditModal] = useModal({
  title: computed(() => (isEdit.value ? t('editTitle') : t('addTitle'))),
  submitting: computed(() => submitting.value),
  onOpen: (row?: PartnerVO) => row && fetchPartnerDetail({ partnerId: row.partnerId }),
  onConfirm: () => submitEdit(),
})

const [editForm, editFormItems, editFormRules] = useForm({
  partnerId: { value: undefined as number | string | undefined },
  partnerCode: {
    value: '',
    item: { type: 'text', label: t('partnerCode'), plh: t('partnerCodePlaceholder') },
    rule: [{ required: true, message: t('partnerCodeRequired'), trigger: 'blur' }],
  },
  partnerName: {
    value: '',
    item: { type: 'text', label: t('partnerName'), plh: t('partnerNamePlaceholder') },
    rule: [{ required: true, message: t('partnerNameRequired'), trigger: 'blur' }],
  },
  creditCode: {
    value: '',
    item: { type: 'text', label: t('creditCode'), plh: t('creditCodePlaceholder') },
  },
  contactName: {
    value: '',
    item: { type: 'text', label: t('contactName'), plh: t('contactNamePlaceholder') },
  },
  contactPhone: {
    value: '',
    item: { type: 'text', label: t('contactPhone'), plh: t('contactPhonePlaceholder') },
  },
  contactEmail: {
    value: '',
    item: { type: 'text', label: t('contactEmail'), plh: t('contactEmailPlaceholder') },
  },
  address: {
    value: '',
    item: { type: 'textarea', label: t('address'), plh: t('addressPlaceholder'), rows: 2 },
  },
  status: {
    value: '0',
    item: { type: 'radio', label: t('status'), options: sys_normal_disable },
  },
  remark: {
    value: '',
    item: { type: 'textarea', label: t('remark'), plh: t('remarkPlaceholder'), rows: 3 },
  },
})

const { request: submitEdit, loading: submitting } = useApi(
  (data: PartnerForm) => (isEdit.value ? partnerApi.updatePartner(data) : partnerApi.addPartner(data)),
  editForm,
  {
    onSuccess: () => (editRef.value.close(), refresh()),
    tipSuccess: computed(() => (isEdit.value ? t('saveSuccess') : t('addSuccess'))),
  },
)

const [, handleDel] = useApi(partnerApi.delPartner, [], {
  onSuccess: () => refresh(),
  tipSuccess: computed(() => t('deleteSuccess')),
})
</script>

<style lang="scss" scoped></style>

<i18n lang="yaml">
en:
  columns: 'Show/hide columns'
  reset: 'Reset'
  add: 'Add'
  partnerId: 'Partner ID'
  partnerCode: 'Partner code'
  partnerName: 'Partner name'
  creditCode: 'Business registration number'
  contactName: 'Contact'
  contactPhone: 'Phone'
  contactEmail: 'Email'
  address: 'Address'
  status: 'Status'
  createTime: 'Created at'
  actions: 'Actions'
  edit: 'Edit'
  delete: 'Delete'
  addTitle: 'Add partner customer'
  editTitle: 'Edit partner customer'
  partnerCodePlaceholder: 'Enter a unique partner code'
  partnerCodeRequired: 'Partner code is required'
  partnerNamePlaceholder: 'Enter the merchant or partner name'
  partnerNameRequired: 'Partner name is required'
  creditCodePlaceholder: 'Enter the business registration number'
  contactNamePlaceholder: 'Enter the contact name'
  contactPhonePlaceholder: 'Enter the contact phone'
  contactEmailPlaceholder: 'Enter the contact email'
  addressPlaceholder: 'Enter the business address'
  remark: 'Remark'
  remarkPlaceholder: 'Enter a remark'
  saveSuccess: 'Saved successfully'
  addSuccess: 'Added successfully'
  deleteSuccess: 'Deleted successfully'
zh-CN:
  columns: '显示/隐藏列'
  reset: '重置'
  add: '新增'
  partnerId: '合作客户编号'
  partnerCode: '客户编码'
  partnerName: '商户名称'
  creditCode: '统一社会信用代码'
  contactName: '联系人'
  contactPhone: '联系电话'
  contactEmail: '联系邮箱'
  address: '经营地址'
  status: '状态'
  createTime: '创建时间'
  actions: '操作'
  edit: '编辑'
  delete: '删除'
  addTitle: '新增合作客户'
  editTitle: '编辑合作客户'
  partnerCodePlaceholder: '请输入租户内唯一的客户编码'
  partnerCodeRequired: '客户编码不能为空'
  partnerNamePlaceholder: '请输入合作商户名称'
  partnerNameRequired: '商户名称不能为空'
  creditCodePlaceholder: '请输入统一社会信用代码'
  contactNamePlaceholder: '请输入联系人'
  contactPhonePlaceholder: '请输入联系电话'
  contactEmailPlaceholder: '请输入联系邮箱'
  addressPlaceholder: '请输入经营地址'
  remark: '备注'
  remarkPlaceholder: '请输入备注'
  saveSuccess: '保存成功'
  addSuccess: '新增成功'
  deleteSuccess: '删除成功'
</i18n>
