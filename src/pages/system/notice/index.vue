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
        { prop: 'noticeId', label: t('noticeId'), hidden: true },
        { prop: 'noticeTitle', label: t('noticeTitle'), minWidth: 200, fixed: true },
        { prop: 'noticeType', label: t('noticeType'), width: 100 },
        { prop: 'status', label: t('status'), width: 100 },
        { prop: 'createByName', label: t('creator'), minWidth: 110 },
        { prop: 'createTime', label: t('createTime'), minWidth: 180 },
      ]"
      :filterColVR="filterColRef"
    >
      <template #col-noticeType="{ row }">
        <VDictTag :options="sys_notice_type" :value="row.noticeType" />
      </template>

      <template #col-status="{ row }">
        <VDictTag :options="sys_notice_status" :value="row.status" />
      </template>

      <ze-table-column fixed="right" :label="t('actions')" width="200px" headerAlign="center">
        <template #default="{ row }">
          <ze-actions
            :options="{ text: true, type: 'primary' }"
            :actions="[
              { content: t('detail'), onClick: () => detailRef.open(row) },
              { content: t('edit'), onClick: () => editRef.open(row) },
              { content: t('delete'), confirm: true, onClick: () => handleDel([row.noticeId]) },
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

  <EditModal width="760px">
    <ze-form v-model="editForm" :items="editFormItems" :rules="editFormRules" />
  </EditModal>

  <DetailModal width="820px" :show-action="false">
    <div class="notice-detail">
      <h2 class="notice-detail__title">{{ detailData?.noticeTitle || '-' }}</h2>
      <div class="notice-detail__meta">
        <span>{{ t('noticeType') }}：<VDictTag :options="sys_notice_type" :value="detailData?.noticeType || ''" /></span>
        <span>{{ t('status') }}：<VDictTag :options="sys_notice_status" :value="detailData?.status || ''" /></span>
        <span>{{ t('creator') }}：{{ detailData?.createByName || '-' }}</span>
        <span>{{ t('createTime') }}：{{ detailData?.createTime || '-' }}</span>
      </div>
      <el-divider />
      <div class="notice-detail__content">{{ detailData?.noticeContent || t('emptyContent') }}</div>
    </div>
  </DetailModal>
</template>

<script setup lang="ts">
import { noticeApi } from '@/api/_index'
import type { NoticeQuery, NoticeVO } from '@/api/sys/notice.types'
import type { ZeFormInstance } from '@/components/types/form'
import { toReactive, watchDebounced } from '@vueuse/core'
import { merge } from 'es-toolkit'

const { t } = useI18nLocal()
const { sys_notice_status, sys_notice_type } = toRefs(useDict('sys_notice_status', 'sys_notice_type'))

const searchFormRef = ref<ZeFormInstance>()
const [searchForm, searchFormItems] = useForm({
  noticeTitle: { value: '', item: { type: 'text', plh: t('noticeTitle'), prefixIcon: 'el-search' } },
  createByName: { value: '', item: { type: 'text', plh: t('creator') } },
  noticeType: {
    value: '',
    item: { type: 'select', label: t('type'), options: sys_notice_type, labelWidth: '45px' },
  },
  status: {
    value: '',
    item: { type: 'select', label: t('status'), options: sys_notice_status, labelWidth: '45px' },
  },
})
watchDebounced(searchForm, () => refresh(), { deep: true, debounce: 666, maxWait: 3000 })

const [listData, refresh, pagination, loading] = useTable<NoticeQuery, NoticeVO>(
  noticeApi.listNotice,
  toReactive(searchForm),
  { immediate: true },
)

const [tableRef, filterColRef] = [ref(), ref()]
const reset = () => {
  searchFormRef.value?.resetFields()
  nextTick(() => refresh())
}

const isEdit = computed(() => Boolean(editForm.value.noticeId))
const [noticeDetail, refreshNoticeDetail] = useApi<Pick<NoticeVO, 'noticeId'>, NoticeVO>(noticeApi.getNotice)
watch(noticeDetail, () => merge(editForm.value, noticeDetail.value || {}), { deep: true })

const [editRef, EditModal] = useModal({
  title: computed(() => (isEdit.value ? t('editTitle') : t('addTitle'))),
  submitting: computed(() => submitting.value),
  onOpen: (row?: NoticeVO) => row && refreshNoticeDetail({ noticeId: row.noticeId }),
  onConfirm: () => fetchEdit(),
})

const [editForm, editFormItems, editFormRules] = useForm({
  noticeId: { value: undefined as number | string | undefined },
  noticeTitle: {
    value: '',
    item: { type: 'text', label: t('noticeTitle'), plh: t('noticeTitlePlaceholder') },
    rule: [{ required: true, message: t('noticeTitleRequired'), trigger: 'blur' }],
  },
  noticeType: {
    value: '',
    item: { type: 'select', label: t('noticeType'), plh: t('noticeTypePlaceholder'), options: sys_notice_type },
    rule: [{ required: true, message: t('noticeTypeRequired'), trigger: 'change' }],
  },
  status: {
    value: '0',
    item: { type: 'radio', label: t('noticeStatus'), options: sys_notice_status },
  },
  noticeContent: {
    value: '',
    item: { type: 'textarea', label: t('noticeContent'), plh: t('noticeContentPlaceholder'), rows: 10 },
  },
  remark: {
    value: '',
    item: { type: 'textarea', label: t('remark'), plh: t('remarkPlaceholder') },
  },
})

const { request: fetchEdit, loading: submitting } = useApi(
  (data: typeof editForm.value) => (isEdit.value ? noticeApi.updateNotice(data) : noticeApi.addNotice(data)),
  editForm,
  {
    onSuccess: () => (editRef.value.close(), refresh()),
    tipSuccess: computed(() => (isEdit.value ? t('saveSuccess') : t('addSuccess'))),
    tipError: computed(() => (isEdit.value ? t('saveFailed') : t('addFailed'))),
  },
)

const detailData = ref<NoticeVO>()
const [, fetchDetail] = useApi<Pick<NoticeVO, 'noticeId'>, NoticeVO>(noticeApi.getNotice, undefined, {
  onSuccess: (response) => (detailData.value = response?.apiData),
  tipError: computed(() => t('detailFailed')),
})
const [detailRef, DetailModal] = useModal({
  title: computed(() => t('detailTitle')),
  showAction: false,
  onOpen: (row: NoticeVO) => fetchDetail({ noticeId: row.noticeId }),
})

const [, handleDel] = useApi(noticeApi.delNotice, [], {
  onSuccess: () => refresh(),
  tipSuccess: computed(() => t('deleteSuccess')),
  tipError: computed(() => t('deleteFailed')),
})
</script>

<style lang="scss" scoped>
.notice-detail {
  &__title {
    margin: 0;
    font-size: 22px;
    line-height: 1.5;
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 20px;
    margin-top: 12px;
    color: var(--el-text-color-secondary);

    span {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
  }

  &__content {
    max-height: 50vh;
    overflow: auto;
    line-height: 1.8;
    white-space: pre-wrap;
    word-break: break-word;
  }
}
</style>

<i18n lang="yaml">
en:
  columns: 'Show/hide columns'
  reset: 'Reset'
  add: 'Add'
  noticeId: 'Notice ID'
  noticeTitle: 'Title'
  noticeType: 'Notice type'
  type: 'Type'
  status: 'Status'
  creator: 'Creator'
  createTime: 'Created at'
  actions: 'Actions'
  detail: 'Details'
  edit: 'Edit'
  delete: 'Delete'
  emptyContent: 'No notice content'
  editTitle: 'Edit notice'
  addTitle: 'Add notice'
  noticeTitlePlaceholder: 'Enter a notice title'
  noticeTitleRequired: 'Notice title is required'
  noticeTypePlaceholder: 'Select a notice type'
  noticeTypeRequired: 'Notice type is required'
  noticeStatus: 'Notice status'
  noticeContent: 'Content'
  noticeContentPlaceholder: 'Enter notice content'
  remark: 'Remark'
  remarkPlaceholder: 'Enter a remark'
  saveSuccess: 'Saved successfully'
  addSuccess: 'Added successfully'
  saveFailed: 'Failed to save'
  addFailed: 'Failed to add'
  detailFailed: 'Failed to load notice details'
  detailTitle: 'Notice details'
  deleteSuccess: 'Deleted successfully'
  deleteFailed: 'Failed to delete'
zh:
  columns: '显示/隐藏列'
  reset: '重置'
  add: '新增'
  noticeId: '公告编号'
  noticeTitle: '公告标题'
  noticeType: '公告类型'
  type: '类型'
  status: '状态'
  creator: '创建者'
  createTime: '创建时间'
  actions: '操作'
  detail: '详情'
  edit: '编辑'
  delete: '删除'
  emptyContent: '暂无公告内容'
  editTitle: '编辑公告'
  addTitle: '添加公告'
  noticeTitlePlaceholder: '请输入公告标题'
  noticeTitleRequired: '公告标题不能为空'
  noticeTypePlaceholder: '请选择公告类型'
  noticeTypeRequired: '公告类型不能为空'
  noticeStatus: '公告状态'
  noticeContent: '公告内容'
  noticeContentPlaceholder: '请输入公告内容'
  remark: '备注'
  remarkPlaceholder: '请输入备注'
  saveSuccess: '保存成功'
  addSuccess: '新增成功'
  saveFailed: '保存失败'
  addFailed: '新增失败'
  detailFailed: '获取公告详情失败'
  detailTitle: '公告详情'
  deleteSuccess: '删除成功'
  deleteFailed: '删除失败'
</i18n>
