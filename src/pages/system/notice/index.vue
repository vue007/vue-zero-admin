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
        { prop: 'noticeId', label: '公告编号', hidden: true },
        { prop: 'noticeTitle', label: '公告标题', minWidth: 200, fixed: true },
        { prop: 'noticeType', label: '公告类型', width: 100 },
        { prop: 'status', label: '状态', width: 100 },
        { prop: 'createByName', label: '创建者', minWidth: 110 },
        { prop: 'createTime', label: '创建时间', minWidth: 180 },
      ]"
      :filterColVR="filterColRef"
    >
      <template #col-noticeType="{ row }">
        <VDictTag :options="sys_notice_type" :value="row.noticeType" />
      </template>

      <template #col-status="{ row }">
        <VDictTag :options="sys_notice_status" :value="row.status" />
      </template>

      <ze-table-column fixed="right" label="操作" width="200px" headerAlign="center">
        <template #default="{ row }">
          <ze-actions
            :options="{ text: true, type: 'primary' }"
            :actions="[
              { content: '详情', onClick: () => detailRef.open(row) },
              { content: '编辑', onClick: () => editRef.open(row) },
              { content: '删除', confirm: true, onClick: () => handleDel([row.noticeId]) },
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
        <span>类型：<VDictTag :options="sys_notice_type" :value="detailData?.noticeType || ''" /></span>
        <span>状态：<VDictTag :options="sys_notice_status" :value="detailData?.status || ''" /></span>
        <span>创建者：{{ detailData?.createByName || '-' }}</span>
        <span>创建时间：{{ detailData?.createTime || '-' }}</span>
      </div>
      <el-divider />
      <div class="notice-detail__content">{{ detailData?.noticeContent || '暂无公告内容' }}</div>
    </div>
  </DetailModal>
</template>

<script setup lang="ts">
import { noticeApi } from '@/api/_index'
import type { NoticeQuery, NoticeVO } from '@/api/sys/notice.types'
import type { ZeFormInstance } from '@/components/types/form'
import { toReactive, watchDebounced } from '@vueuse/core'
import { merge } from 'es-toolkit'

const { sys_notice_status, sys_notice_type } = toRefs(useDict('sys_notice_status', 'sys_notice_type'))

const searchFormRef = ref<ZeFormInstance>()
const [searchForm, searchFormItems] = useForm({
  noticeTitle: { value: '', item: { type: 'text', plh: '公告标题', prefixIcon: 'el-search' } },
  createByName: { value: '', item: { type: 'text', plh: '操作人员' } },
  noticeType: {
    value: '',
    item: { type: 'select', label: '类型', options: sys_notice_type, labelWidth: '45px' },
  },
  status: {
    value: '',
    item: { type: 'select', label: '状态', options: sys_notice_status, labelWidth: '45px' },
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
  title: computed(() => `${isEdit.value ? '编辑' : '添加'}公告`),
  submitting: computed(() => submitting.value),
  onOpen: (row?: NoticeVO) => row && refreshNoticeDetail({ noticeId: row.noticeId }),
  onConfirm: () => fetchEdit(),
})

const [editForm, editFormItems, editFormRules] = useForm({
  noticeId: { value: undefined as number | string | undefined },
  noticeTitle: {
    value: '',
    item: { type: 'text', label: '公告标题', plh: '请输入公告标题' },
    rule: [{ required: true, message: '公告标题不能为空', trigger: 'blur' }],
  },
  noticeType: {
    value: '',
    item: { type: 'select', label: '公告类型', plh: '请选择公告类型', options: sys_notice_type },
    rule: [{ required: true, message: '公告类型不能为空', trigger: 'change' }],
  },
  status: {
    value: '0',
    item: { type: 'radio', label: '公告状态', options: sys_notice_status },
  },
  noticeContent: {
    value: '',
    item: { type: 'textarea', label: '公告内容', plh: '请输入公告内容', rows: 10 },
  },
  remark: {
    value: '',
    item: { type: 'textarea', label: '备注', plh: '请输入备注' },
  },
})

const { request: fetchEdit, loading: submitting } = useApi(
  (data: typeof editForm.value) => (isEdit.value ? noticeApi.updateNotice(data) : noticeApi.addNotice(data)),
  editForm,
  {
    onSuccess: () => (editRef.value.close(), refresh()),
    tipSuccess: computed(() => (isEdit.value ? '保存成功' : '新增成功')),
    tipError: computed(() => (isEdit.value ? '保存失败' : '新增失败')),
  },
)

const detailData = ref<NoticeVO>()
const [, fetchDetail] = useApi<Pick<NoticeVO, 'noticeId'>, NoticeVO>(noticeApi.getNotice, undefined, {
  onSuccess: (response) => (detailData.value = response?.apiData),
  tipError: '获取公告详情失败',
})
const [detailRef, DetailModal] = useModal({
  title: '公告详情',
  showAction: false,
  onOpen: (row: NoticeVO) => fetchDetail({ noticeId: row.noticeId }),
})

const [, handleDel] = useApi(noticeApi.delNotice, [], {
  onSuccess: () => refresh(),
  tipSuccess: '删除成功',
  tipError: '删除失败',
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
