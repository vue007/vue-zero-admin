<template>
  <VPage class="p-24">
    <template #header>
      <ze-form ref="searchFormRef" v-model="searchForm" :items="searchFormItems" inline>
        <template #item-tenantId="item">
          <VTenantSelector v-model="searchForm.tenantId" v-bind="item" />
        </template>
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
        { prop: 'assetId', label: t('assetId'), hidden: true },
        { prop: 'tenantId', label: t('tenantId'), minWidth: 110, hidden: !isSuperAdmin },
        { prop: 'title', label: t('title'), minWidth: 220, fixed: true },
        { prop: 'ownerName', label: t('owner'), minWidth: 120 },
        { prop: 'kind', label: t('kind'), width: 110 },
        { prop: 'deviceType', label: t('deviceType'), width: 110 },
        { prop: 'sourceProductCode', label: t('sourceProduct'), minWidth: 150 },
        { prop: 'status', label: t('status'), width: 110 },
        { prop: 'featured', label: t('featured'), width: 90 },
        { prop: 'favoriteCount', label: t('favorites'), width: 90 },
        { prop: 'downloadCount', label: t('downloads'), width: 90 },
        { prop: 'createTime', label: t('createTime'), minWidth: 180 },
      ]"
      :filterColVR="filterColRef"
    >
      <template #col-kind="{ row }">
        <el-tag effect="plain">{{ kindLabel(row.kind) }}</el-tag>
      </template>
      <template #col-deviceType="{ row }">
        {{ deviceLabel(row.deviceType) }}
      </template>
      <template #col-status="{ row }">
        <el-tag :type="statusTagType(row.status)">{{ statusLabel(row.status) }}</el-tag>
      </template>
      <template #col-featured="{ row }">
        <el-tag v-if="row.featured === '1'" type="warning">{{ t('yes') }}</el-tag>
        <span v-else>{{ t('no') }}</span>
      </template>

      <ze-table-column fixed="right" :label="t('actions')" width="250px" headerAlign="center">
        <template #default="{ row }">
          <ze-actions
            :options="{ text: true, type: 'primary' }"
            :actions="rowActions(row)"
          />
        </template>
      </ze-table-column>
    </ze-table>

    <template #content-footer>
      <ze-pagination class="ml-a" v-model="pagination" />
    </template>
  </VPage>

  <el-dialog v-model="detailVisible" :title="detail?.title || t('detail')" width="min(860px, 92vw)">
    <el-descriptions v-if="detail" :column="2" border>
      <el-descriptions-item :label="t('owner')">{{ detail.ownerName || detail.ownerMemberId }}</el-descriptions-item>
      <el-descriptions-item :label="t('status')">{{ statusLabel(detail.status) }}</el-descriptions-item>
      <el-descriptions-item :label="t('kind')">{{ kindLabel(detail.kind) }}</el-descriptions-item>
      <el-descriptions-item :label="t('deviceType')">{{ deviceLabel(detail.deviceType) }}</el-descriptions-item>
      <el-descriptions-item :label="t('sourceProduct')">{{ detail.sourceProductCode || '-' }}</el-descriptions-item>
      <el-descriptions-item :label="t('schemaVersion')">{{ detail.schemaVersion || '-' }}</el-descriptions-item>
      <el-descriptions-item :label="t('summary')" :span="2">{{ detail.summary || '-' }}</el-descriptions-item>
      <el-descriptions-item v-if="detail.rejectReason" :label="t('rejectReason')" :span="2">
        {{ detail.rejectReason }}
      </el-descriptions-item>
    </el-descriptions>
    <div class="community-json-title">{{ t('payload') }}</div>
    <pre class="community-json">{{ prettyPayload }}</pre>
  </el-dialog>
</template>

<script setup lang="ts">
import { communityApi } from '@/api/_index'
import type {
  CommunityAssetKind,
  CommunityAssetQuery,
  CommunityAssetStatus,
  CommunityAssetVO,
  CommunityDeviceType,
} from '@/api/app/community.types'
import type { ZeFormInstance } from '@/components/types/form'
import { useBaseStore } from '@/stores/base.module'
import { toReactive, watchDebounced } from '@vueuse/core'
import VTenantSelector from '@/pages/tenant/_views/VTenantSelector.vue'

const { t } = useI18nLocal()
const baseStore = useBaseStore()
const isSuperAdmin = computed(() => baseStore.setting.userInfo.roles?.includes('superadmin') ?? false)
const searchFormRef = ref<ZeFormInstance>()

const kindOptions = computed(() => [
  { label: 'DPI', value: 'dpi' },
  { label: t('macro'), value: 'macro' },
  { label: t('lighting'), value: 'lighting' },
  { label: 'Profile', value: 'profile' },
])
const deviceOptions = computed(() => [
  { label: t('mouse'), value: 'mouse' },
  { label: t('keyboard'), value: 'keyboard' },
  { label: t('gamepad'), value: 'gamepad' },
  { label: t('headset'), value: 'headset' },
  { label: t('speaker'), value: 'speaker' },
  { label: t('anyDevice'), value: 'any' },
])
const statusOptions = computed(() => [
  { label: t('draft'), value: 'draft' },
  { label: t('pending'), value: 'pending' },
  { label: t('published'), value: 'published' },
  { label: t('rejected'), value: 'rejected' },
  { label: t('hidden'), value: 'hidden' },
])

const [searchForm, searchFormItems] = useForm({
  tenantId: {
    value: '',
    item: {},
  },
  keyword: { value: '', item: { type: 'text', plh: t('searchPlaceholder'), prefixIcon: 'el-search' } },
  kind: { value: '', item: { type: 'select', plh: t('kind'), options: kindOptions } },
  deviceType: { value: '', item: { type: 'select', plh: t('deviceType'), options: deviceOptions } },
  status: { value: '', item: { type: 'select', plh: t('status'), options: statusOptions } },
})

const [listData, refresh, pagination, loading] = useTable<CommunityAssetQuery, CommunityAssetVO>(
  communityApi.listCommunity,
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

const detailVisible = ref(false)
const detail = ref<CommunityAssetVO>()
const prettyPayload = computed(() => JSON.stringify(detail.value?.payload ?? {}, null, 2))
const openDetail = async (row: CommunityAssetVO) => {
  const response = await communityApi.getCommunity(row.assetId)
  detail.value = response.apiData
  detailVisible.value = true
}

const approve = (row: CommunityAssetVO) =>
  ElMessageBox.confirm(t('approveConfirm', { title: row.title }), { type: 'warning' }).then(async () => {
    await communityApi.reviewCommunity({ assetId: row.assetId, action: 'approve' })
    ElMessage.success(t('approveSuccess'))
    await refresh()
  })

const reject = (row: CommunityAssetVO) =>
  ElMessageBox.prompt(t('rejectPrompt', { title: row.title }), t('reject'), {
    inputType: 'textarea',
    inputValidator: (value) => Boolean(value.trim()) || t('rejectReasonRequired'),
  }).then(async ({ value }) => {
    await communityApi.reviewCommunity({ assetId: row.assetId, action: 'reject', reason: value })
    ElMessage.success(t('rejectSuccess'))
    await refresh()
  })

const toggleFeature = async (row: CommunityAssetVO) => {
  await communityApi.featureCommunity(row.assetId, row.featured !== '1')
  ElMessage.success(t('operationSuccess'))
  await refresh()
}

const hide = (row: CommunityAssetVO) =>
  ElMessageBox.confirm(t('hideConfirm', { title: row.title }), { type: 'warning' }).then(async () => {
    await communityApi.hideCommunity(row.assetId)
    ElMessage.success(t('operationSuccess'))
    await refresh()
  })

const rowActions = (row: CommunityAssetVO) => {
  const actions: Array<Record<string, unknown>> = [{ content: t('detail'), onClick: () => openDetail(row) }]
  if (row.status === 'pending') {
    actions.push({ content: t('approve'), onClick: () => approve(row) })
    actions.push({ content: t('reject'), onClick: () => reject(row) })
  }
  if (row.status === 'published') {
    actions.push({ content: row.featured === '1' ? t('unfeature') : t('feature'), onClick: () => toggleFeature(row) })
    actions.push({ content: t('hide'), confirm: true, onClick: () => hide(row) })
  }
  return actions
}

const kindLabel = (kind: CommunityAssetKind) => ({ dpi: 'DPI', macro: t('macro'), lighting: t('lighting'), profile: 'Profile' })[kind]
const deviceLabel = (device: CommunityDeviceType) => ({
  mouse: t('mouse'), keyboard: t('keyboard'), gamepad: t('gamepad'), headset: t('headset'), speaker: t('speaker'), any: t('anyDevice'),
})[device]
const statusLabel = (status: CommunityAssetStatus) => ({
  draft: t('draft'), pending: t('pending'), published: t('published'), rejected: t('rejected'), hidden: t('hidden'),
})[status]
const statusTagType = (status: CommunityAssetStatus) => ({
  draft: 'info', pending: 'warning', published: 'success', rejected: 'danger', hidden: 'info',
})[status] as 'info' | 'warning' | 'success' | 'danger'
</script>

<style lang="scss" scoped>
.community-json-title { margin: 18px 0 8px; font-weight: 600; }
.community-json {
  max-height: 420px;
  margin: 0;
  padding: 16px;
  overflow: auto;
  border-radius: 8px;
  color: var(--el-text-color-primary);
  background: var(--el-fill-color-light);
  font: 12px/1.6 ui-monospace, SFMono-Regular, Menlo, monospace;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>

<i18n lang="yaml">
en:
  columns: 'Show/hide columns'
  reset: 'Reset'
  tenantId: 'Tenant ID'
  assetId: 'Asset ID'
  title: 'Title'
  owner: 'Author'
  kind: 'Kind'
  deviceType: 'Device'
  sourceProduct: 'Source product'
  status: 'Status'
  featured: 'Featured'
  favorites: 'Favorites'
  downloads: 'Downloads'
  createTime: 'Created at'
  actions: 'Actions'
  searchPlaceholder: 'Search title or summary'
  macro: 'Macro'
  lighting: 'Lighting'
  mouse: 'Mouse'
  keyboard: 'Keyboard'
  gamepad: 'Gamepad'
  headset: 'Headset'
  speaker: 'Speaker'
  anyDevice: 'Any device'
  draft: 'Draft'
  pending: 'Pending'
  published: 'Published'
  rejected: 'Rejected'
  hidden: 'Hidden'
  yes: 'Yes'
  no: 'No'
  detail: 'Details'
  approve: 'Approve'
  reject: 'Reject'
  feature: 'Feature'
  unfeature: 'Unfeature'
  hide: 'Hide'
  schemaVersion: 'Schema version'
  summary: 'Summary'
  rejectReason: 'Reject reason'
  payload: 'Configuration JSON'
  approveConfirm: 'Approve "{title}"?'
  approveSuccess: 'Approved'
  rejectPrompt: 'Enter the rejection reason for "{title}"'
  rejectReasonRequired: 'Rejection reason is required'
  rejectSuccess: 'Rejected'
  hideConfirm: 'Hide "{title}"?'
  operationSuccess: 'Operation completed'
zh-CN:
  columns: '显示/隐藏列'
  reset: '重置'
  tenantId: '租户编号'
  assetId: '内容编号'
  title: '标题'
  owner: '作者'
  kind: '配置类型'
  deviceType: '设备类型'
  sourceProduct: '来源产品'
  status: '状态'
  featured: '精选'
  favorites: '收藏数'
  downloads: '下载数'
  createTime: '创建时间'
  actions: '操作'
  searchPlaceholder: '搜索标题或摘要'
  macro: '宏'
  lighting: '灯光'
  mouse: '鼠标'
  keyboard: '键盘'
  gamepad: '手柄'
  headset: '耳机'
  speaker: '音箱'
  anyDevice: '通用设备'
  draft: '草稿'
  pending: '待审核'
  published: '已发布'
  rejected: '已驳回'
  hidden: '已下架'
  yes: '是'
  no: '否'
  detail: '详情'
  approve: '通过'
  reject: '驳回'
  feature: '设为精选'
  unfeature: '取消精选'
  hide: '下架'
  schemaVersion: '协议版本'
  summary: '摘要'
  rejectReason: '驳回原因'
  payload: '配置 JSON'
  approveConfirm: '确认通过“{title}”吗？'
  approveSuccess: '审核已通过'
  rejectPrompt: '请输入“{title}”的驳回原因'
  rejectReasonRequired: '驳回原因不能为空'
  rejectSuccess: '已驳回'
  hideConfirm: '确认下架“{title}”吗？'
  operationSuccess: '操作成功'
</i18n>
