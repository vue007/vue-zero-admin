<template>
  <VPage class="p-24">
    <template #header>
      <ze-form ref="searchFormRef" v-model="searchForm" :items="searchFormItems" inline>
        <ze-form-item>
          <ze-actions
            :actions="[
              { icon: 'el-scale-to-original', tip: t('columns'), onRef: (value) => (filterColRef = value) },
              { icon: 'el-refresh', tip: t('reset'), onClick: resetSearch },
            ]"
          />
        </ze-form-item>

        <ze-form-item v-if="hasPermission('add')" class="mla mr0!">
          <ze-actions
            :actions="[{ icon: 'el-plus', content: t('add'), type: 'primary', onClick: () => editRef.open() }]"
          />
        </ze-form-item>
      </ze-form>
    </template>

    <ze-table ref="tableRef" :data="listData" :loading="loading" :columns="tableColumns" :filterColVR="filterColRef">
      <template #col-appId="{ row }">
        <div class="app-id-cell">
          <code>{{ row.appId }}</code>
          <el-button link type="primary" :aria-label="t('copyAppId')" @click="copyCredential(row.appId, t('appId'))">
            {{ t('copy') }}
          </el-button>
        </div>
      </template>

      <template #col-scopes="{ row }">
        <div v-if="row.scopes?.length" class="scope-list">
          <el-tag v-for="scope in row.scopes" :key="scope" size="small" type="info">{{ scopeLabel(scope) }}</el-tag>
        </div>
        <span v-else class="empty-value">—</span>
      </template>

      <template #col-terminals="{ row }">
        <div v-if="row.terminals?.length" class="terminal-tags">
          <el-tag
            v-for="terminal in row.terminals"
            :key="`${terminal.channel}-${terminal.authClientId}`"
            size="small"
            :type="terminal.status === '0' && terminal.clientStatus === '0' ? 'success' : 'info'"
          >
            {{ terminal.channel }} · {{ terminal.clientKey || terminal.deviceType || t('unknownClient') }}
          </el-tag>
        </div>
        <span v-else class="empty-value">—</span>
      </template>

      <template #col-status="{ row }">
        <el-switch
          v-if="hasPermission('status')"
          v-model="row.status"
          active-value="0"
          inactive-value="1"
          :disabled="changingStatusId === row.id"
          @click="() => handleStatusChange(row)"
        />
        <VDictTag
          v-else-if="row.status !== undefined && row.status !== null"
          :options="sys_normal_disable"
          :value="row.status"
        />
        <span v-else class="empty-value">—</span>
      </template>

      <ze-table-column
        v-if="hasRowActions"
        fixed="right"
        :label="t('actions')"
        width="210px"
        headerAlign="center"
        :show-overflow-tooltip="false"
      >
        <template #default="{ row }">
          <ze-actions
            :options="{ text: true, type: 'primary' }"
            :actions="getRowActions(row)"
            ellipsis
            :ellipsis-start="2"
          />
        </template>
      </ze-table-column>
    </ze-table>

    <template #content-footer>
      <ze-pagination class="ml-a" v-model="pagination" />
    </template>
  </VPage>

  <EditModal width="900px" top="5vh">
    <div v-loading="detailLoading">
      <ze-form v-model="editForm" :items="editFormItems" :rules="editFormRules" label-width="110px" />

      <section class="terminal-editor">
        <div class="terminal-editor__header">
          <div>
            <div class="terminal-editor__title">{{ t('terminals') }}</div>
            <div class="terminal-editor__tip">{{ t('terminalsTip') }}</div>
          </div>
          <el-button
            type="primary"
            plain
            :disabled="clientOptionsLoading || editForm.terminals.length >= MAX_TERMINALS"
            @click="addTerminal"
          >
            {{ t('addTerminal') }}
          </el-button>
        </div>

        <div v-if="editForm.terminals.length" class="terminal-editor__list">
          <div
            v-for="(terminal, index) in editForm.terminals"
            :key="terminalRowKey(terminal, index)"
            class="terminal-editor__row"
          >
            <el-select
              v-model="terminal.authClientId"
              class="terminal-editor__client"
              :placeholder="t('authClientPlaceholder')"
              :loading="clientOptionsLoading"
              @change="(value) => handleClientChange(terminal, value)"
            >
              <el-option
                v-for="option in clientOptions || []"
                :key="option.authClientId"
                :value="option.authClientId"
                :label="clientOptionLabel(option)"
                :disabled="option.clientStatus !== '0'"
              />
            </el-select>
            <el-input
              v-model="terminal.channel"
              class="terminal-editor__channel"
              :placeholder="t('channelPlaceholder')"
              maxlength="32"
            >
              <template #prepend>{{ t('channel') }}</template>
            </el-input>
            <el-switch
              v-model="terminal.status"
              active-value="0"
              inactive-value="1"
              :active-text="t('enabled')"
              :inactive-text="t('disabled')"
            />
            <el-button type="danger" link :disabled="editForm.terminals.length === 1" @click="removeTerminal(index)">
              {{ t('removeTerminal') }}
            </el-button>
          </div>
        </div>
        <el-empty v-else :description="t('terminalsRequired')" :image-size="64" />
      </section>
    </div>
  </EditModal>

  <CredentialModal
    width="660px"
    :show-action="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    destroy-on-close
    @closed="clearCredential"
  >
    <div v-if="oneTimeCredential" class="credential-panel">
      <el-alert :title="t('credentialWarning')" type="warning" show-icon :closable="false" />

      <div class="credential-toolbar">
        <el-button type="primary" @click="copyAllCredentials">{{ t('copyAllCredentials') }}</el-button>
      </div>

      <el-descriptions class="credential-details" :column="1" border>
        <el-descriptions-item :label="t('appId')">
          <div class="credential-value">
            <code>{{ oneTimeCredential.appId }}</code>
            <el-button type="primary" link @click="copyCredential(oneTimeCredential.appId, t('appId'))">
              {{ t('copy') }}
            </el-button>
          </div>
        </el-descriptions-item>
        <el-descriptions-item :label="t('appSecret')">
          <div class="credential-value">
            <code data-testid="one-time-app-secret">{{ oneTimeCredential.appSecret }}</code>
            <el-button type="primary" link @click="copyCredential(oneTimeCredential.appSecret, t('appSecret'))">
              {{ t('copy') }}
            </el-button>
          </div>
        </el-descriptions-item>
      </el-descriptions>

      <p class="credential-tip">{{ t('credentialTip') }}</p>
    </div>

    <template #footer>
      <div class="credential-footer">
        <el-checkbox v-model="credentialSaved">{{ t('credentialSaved') }}</el-checkbox>
        <el-button type="primary" :disabled="!credentialSaved" @click="closeCredential">
          {{ t('savedAndClose') }}
        </el-button>
      </div>
    </template>
  </CredentialModal>
</template>

<script setup lang="ts">
import { applicationApi, tenantAppApi } from '@/api/_index'
import type {
  ApplicationClientOption,
  ApplicationCredential,
  ApplicationForm,
  ApplicationQuery,
  ApplicationScopeOption,
  ApplicationTerminalForm,
  ApplicationTerminalVO,
  ApplicationVO,
} from '@/api/app/application.types'
import type { ZeActionItem } from '@/components/types/action'
import type { ZeFormInstance } from '@/components/types/form'
import type { TenantAppTenantOption } from '@/api/sys/tenant-app.api'
import { useBaseStore } from '@/stores/base.module'
import { toReactive, useClipboard, useDebounceFn, watchDebounced } from '@vueuse/core'
import { merge } from 'es-toolkit'

const props = defineProps({
  platform: { type: Boolean, default: false },
})

const { t } = useI18nLocal()
const { sys_normal_disable } = toRefs(useDict('sys_normal_disable'))
const baseStore = useBaseStore()
const { copy } = useClipboard({ legacy: true })

const platformApi = {
  list: tenantAppApi.listTenantApp,
  get: tenantAppApi.getTenantApp,
  add: tenantAppApi.addTenantApp,
  update: tenantAppApi.updateTenantApp,
  changeStatus: tenantAppApi.changeTenantAppStatus,
  resetSecret: tenantAppApi.resetTenantAppSecret,
  remove: tenantAppApi.delTenantApp,
  scopeOptions: tenantAppApi.getTenantAppScopeOptions,
  clientOptions: tenantAppApi.getTenantAppClientOptions,
}
const selfServiceApi = {
  list: applicationApi.listApplication,
  get: applicationApi.getApplication,
  add: applicationApi.addApplication,
  update: applicationApi.updateApplication,
  changeStatus: applicationApi.changeApplicationStatus,
  resetSecret: applicationApi.resetApplicationSecret,
  remove: applicationApi.delApplication,
  scopeOptions: applicationApi.getApplicationScopeOptions,
  clientOptions: applicationApi.getApplicationClientOptions,
}
const accessApi = computed(() => (props.platform ? platformApi : selfServiceApi))

const permissionPrefix = computed(() => (props.platform ? 'system:tenantApp' : 'app:application'))
const grantedPermissions = computed(() => baseStore.setting.userInfo.permissions || [])
const hasPermission = (action: string) => {
  const permissions = grantedPermissions.value
  return permissions.includes('*:*:*') || permissions.includes(`${permissionPrefix.value}:${action}`)
}
const hasRowActions = computed(() => ['edit', 'resetSecret', 'remove'].some(hasPermission))

const [scopeOptions] = useApi<undefined, ApplicationScopeOption[]>(
  () => accessApi.value.scopeOptions(),
  undefined,
  { immediate: true },
)
const scopeLabel = (scope: string) => scopeOptions.value?.find((item) => item.value === scope)?.label || scope

const [clientOptions, , clientOptionsLoading] = useApi<undefined, ApplicationClientOption[]>(
  () => accessApi.value.clientOptions(),
  undefined,
  { immediate: true },
)
const clientOptionLabel = (option: ApplicationClientOption) => {
  if (option.label) return option.label
  const grants = option.grantTypeList?.join(' / ')
  return [option.clientKey, option.deviceType, grants].filter(Boolean).join(' · ')
}

const [tenantOptions, fetchTenantOptions, tenantOptionsLoading] = useApi(
  tenantAppApi.searchTenantAppTenantOptions,
  undefined,
  { concurrency: 'takeLatest' },
)
const selectedTenant = ref<TenantAppTenantOption>()
const tenantSelectOptions = computed(() => {
  const options = tenantOptions.value || []
  const selected = selectedTenant.value
  const visibleOptions = selected && !options.some((item) => item.tenantId === selected.tenantId)
    ? [selected, ...options]
    : options
  return visibleOptions.map((item) => ({
    value: item.tenantId,
    label: `${item.tenantId} · ${item.tenantName}`,
  }))
})
const searchTenantOptions = useDebounceFn((keyword: string) => fetchTenantOptions(keyword), 250)
const rememberSelectedTenant = (tenantId: string) => {
  selectedTenant.value = tenantOptions.value?.find((item) => item.tenantId === tenantId)
}

const searchFormRef = ref<ZeFormInstance>()
const [searchForm, searchFormItems] = useForm({
  tenantId: {
    value: '',
    item: { type: 'text', plh: t('tenantId'), prefixIcon: 'el-search', hidden: !props.platform },
  },
  appName: { value: '', item: { type: 'text', plh: t('appName') } },
  appId: { value: '', item: { type: 'text', plh: t('appId') } },
  status: {
    value: '',
    item: { type: 'select', label: t('status'), options: sys_normal_disable, labelWidth: '50px' },
  },
})

const [listData, refresh, pagination, loading] = useTable<ApplicationQuery, ApplicationVO>(
  (query) => {
    if (props.platform) return accessApi.value.list(query)
    const { tenantId: _tenantId, ...selfServiceQuery } = query
    return accessApi.value.list(selfServiceQuery)
  },
  toReactive(searchForm),
  { immediate: true },
)

watchDebounced(searchForm, () => refreshFromFirstPage(), { deep: true, debounce: 500, maxWait: 2000 })

const [tableRef, filterColRef] = [ref(), ref()]
const refreshFromFirstPage = () => {
  pagination.pageNo = 1
  return refresh()
}
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  nextTick(() => refreshFromFirstPage())
}

const tableColumns = computed(() => [
  { prop: 'id', label: t('id'), hidden: true },
  ...(props.platform
    ? [
        { prop: 'tenantId', label: t('tenantId'), minWidth: 130, fixed: true },
        { prop: 'tenantName', label: t('tenantName'), minWidth: 180 },
      ]
    : []),
  { prop: 'appName', label: t('appName'), minWidth: 180, fixed: !props.platform },
  { prop: 'appId', label: t('appId'), minWidth: 230 },
  { prop: 'scopes', label: t('scopes'), minWidth: 220 },
  { prop: 'terminals', label: t('terminals'), minWidth: 240 },
  { prop: 'status', label: t('status'), width: 90 },
  { prop: 'lastAccessTime', label: t('lastAccessTime'), minWidth: 180 },
  { prop: 'secretRotatedTime', label: t('secretRotatedTime'), minWidth: 180 },
  { prop: 'createTime', label: t('createTime'), minWidth: 180 },
])

const isEdit = computed(() => editForm.value.id !== undefined && editForm.value.id !== '')
const [applicationDetail, fetchApplicationDetail, detailLoading] = useApi<{ id: ApplicationVO['id'] }, ApplicationVO>(
  ({ id }) => accessApi.value.get(id),
)
const editingApplicationId = ref<ApplicationVO['id']>()
watch(applicationDetail, (detail) => {
  if (!detail || editingApplicationId.value === undefined
    || String(detail.id) !== String(editingApplicationId.value)) return
  merge(editForm.value, detail)
  editForm.value.terminals = (detail.terminals || []).map((terminal) => ({
    authClientId: terminal.authClientId,
    channel: terminal.channel,
    status: terminal.status,
  }))
}, { deep: true })
watch(applicationDetail, (detail) => {
  if (props.platform && detail && editingApplicationId.value !== undefined
    && String(detail.id) === String(editingApplicationId.value)) {
    selectedTenant.value = { tenantId: detail.tenantId, tenantName: detail.tenantName || detail.tenantId }
  }
})

const [editRef, EditModal] = useModal({
  title: computed(() => (isEdit.value ? t('editTitle') : t('addTitle'))),
  submitting: computed(() => submitting.value),
  onOpen: (row?: ApplicationVO) => {
    if (row) {
      editingApplicationId.value = row.id
      if (props.platform) selectedTenant.value = { tenantId: row.tenantId, tenantName: row.tenantName || row.tenantId }
      return fetchApplicationDetail({ id: row.id })
    }
    editingApplicationId.value = undefined
    void initializeNewApplication()
    if (props.platform) {
      selectedTenant.value = undefined
      return fetchTenantOptions('')
    }
  },
  onConfirm: () => submitEdit(),
})

const [editForm, baseEditFormItems, editFormRules] = useForm({
  id: { value: undefined as number | string | undefined },
  tenantId: {
    value: '',
    item: { type: 'select', label: t('tenantId'), plh: t('tenantIdPlaceholder'), hidden: !props.platform },
    rule: props.platform ? [{ required: true, message: t('tenantIdRequired'), trigger: 'change' }] : [],
  },
  appName: {
    value: '',
    item: { type: 'text', label: t('appName'), plh: t('appNamePlaceholder'), maxlength: 100 },
    rule: [{ required: true, message: t('appNameRequired'), trigger: 'blur' }],
  },
  scopes: {
    value: [] as string[],
    item: {
      type: 'select',
      label: t('scopes'),
      plh: t('scopesPlaceholder'),
      options: [],
      multiple: true,
      collapseTags: true,
      collapseTagsTooltip: true,
    },
    rule: [{ required: true, message: t('scopesRequired'), trigger: 'change' }],
  },
  terminals: { value: [] as ApplicationTerminalForm[] },
  status: {
    value: '0',
    item: { type: 'radio', label: t('status'), options: sys_normal_disable },
  },
  remark: {
    value: '',
    item: { type: 'textarea', label: t('remark'), plh: t('remarkPlaceholder'), rows: 3, maxlength: 500 },
  },
})

const editFormItems = computed(() =>
  baseEditFormItems.value.map((item) => {
    if (item.prop === 'tenantId')
      return {
        ...item,
        disabled: isEdit.value,
        filterable: true,
        remote: true,
        remoteMethod: searchTenantOptions,
        loading: tenantOptionsLoading.value,
        options: tenantSelectOptions.value,
        onChange: rememberSelectedTenant,
      }
    if (item.prop === 'status') return { ...item, hidden: isEdit.value }
    if (item.prop === 'scopes') return { ...item, options: scopeOptions.value || [] }
    return item
  }),
)

const submitting = ref(false)
const MAX_TERMINALS = 16
const terminalRowKey = (terminal: ApplicationTerminalVO | ApplicationTerminalForm, index: number) =>
  'id' in terminal && terminal.id ? terminal.id : `terminal-${index}`

const newTerminal = (): ApplicationTerminalForm => {
  const options = clientOptions.value || []
  const preferred = options.find((option) => option.clientStatus === '0' && option.clientKey === 'app')
    || options.find((option) => option.clientStatus === '0')
  return {
    authClientId: preferred?.authClientId ?? '',
    channel: preferred?.clientKey || '',
    status: '0',
  }
}

const ensureDefaultTerminal = () => {
  if (!editForm.value.terminals.length) editForm.value.terminals.push(newTerminal())
}

const initializeNewApplication = async () => {
  // ZeModal 会在打开后的 nextTick 重置 ZeForm；再等一轮后写入默认终端。
  await nextTick()
  await nextTick()
  ensureDefaultTerminal()
}

const addTerminal = () => {
  if (editForm.value.terminals.length >= MAX_TERMINALS) return
  editForm.value.terminals.push({ authClientId: '', channel: '', status: '0' })
}

const removeTerminal = (index: number) => {
  if (editForm.value.terminals.length <= 1) return
  editForm.value.terminals.splice(index, 1)
}

const handleClientChange = (terminal: ApplicationTerminalForm, authClientId: string | number) => {
  const option = clientOptions.value?.find((item) => String(item.authClientId) === String(authClientId))
  if (option && !terminal.channel.trim()) terminal.channel = option.clientKey
}

const normalizeTerminals = (): ApplicationTerminalForm[] | undefined => {
  const terminals = editForm.value.terminals.map((terminal) => ({
    authClientId: terminal.authClientId,
    channel: terminal.channel.trim().toLowerCase(),
    status: terminal.status,
  }))
  if (!terminals.length) {
    ElMessage.error(t('terminalsRequired'))
    return undefined
  }
  if (terminals.length > MAX_TERMINALS) {
    ElMessage.error(t('terminalsMax', { max: MAX_TERMINALS }))
    return undefined
  }
  if (terminals.some((terminal) => terminal.authClientId === '' || terminal.authClientId === undefined)) {
    ElMessage.error(t('authClientRequired'))
    return undefined
  }
  if (terminals.some((terminal) => !/^[a-z][a-z0-9_-]{0,31}$/.test(terminal.channel))) {
    ElMessage.error(t('channelInvalid'))
    return undefined
  }
  if (new Set(terminals.map((terminal) => terminal.channel)).size !== terminals.length) {
    ElMessage.error(t('channelDuplicate'))
    return undefined
  }
  return terminals
}

const buildApplicationForm = (): ApplicationForm => {
  const scopes = [...new Set((editForm.value.scopes || []).map((scope) => scope.trim()).filter(Boolean))]
  const terminals = normalizeTerminals()
  if (!terminals) throw new Error('invalid terminals')
  return {
    ...(isEdit.value ? { id: editForm.value.id } : {}),
    ...(props.platform && !isEdit.value ? { tenantId: editForm.value.tenantId.trim() } : {}),
    appName: editForm.value.appName.trim(),
    scopes,
    terminals,
    ...(!isEdit.value ? { status: editForm.value.status } : {}),
    remark: editForm.value.remark?.trim(),
  }
}

const submitEdit = async () => {
  submitting.value = true
  try {
    const form = buildApplicationForm()
    if (isEdit.value) {
      await accessApi.value.update(form)
      editRef.value.close()
      ElMessage.success(t('saveSuccess'))
    } else {
      const response = await accessApi.value.add(form)
      editRef.value.close()
      openCredential(response.apiData)
      ElMessage.success(t('addSuccess'))
    }
    await refresh()
  } catch {
    // 请求层会展示后端返回的错误信息，并保留表单供用户修正。
  } finally {
    submitting.value = false
  }
}

const changingStatusId = ref<ApplicationVO['id']>()
const handleStatusChange = async (row: ApplicationVO) => {
  const action = row.status === '0' ? t('enable') : t('disable')
  const previousStatus = row.status === '0' ? '1' : '0'
  try {
    await ElMessageBox.confirm(t('statusConfirm', { action, appName: row.appName }), { type: 'warning' })
    changingStatusId.value = row.id
    await accessApi.value.changeStatus({ id: row.id, status: row.status })
    ElMessage.success(t('statusSuccess', { action }))
  } catch {
    row.status = previousStatus
  } finally {
    changingStatusId.value = undefined
  }
}

const resettingId = ref<ApplicationVO['id']>()
const handleResetSecret = async (row: ApplicationVO) => {
  try {
    await ElMessageBox.confirm(t('resetSecretConfirm', { appName: row.appName }), {
      type: 'warning',
      confirmButtonText: t('resetSecret'),
    })
    resettingId.value = row.id
    const response = await accessApi.value.resetSecret(row.id)
    openCredential(response.apiData)
    await refresh()
  } catch {
    // 用户取消或接口失败时不改变当前凭证。
  } finally {
    resettingId.value = undefined
  }
}

const deletingId = ref<ApplicationVO['id']>()
const handleDelete = async (row: ApplicationVO) => {
  deletingId.value = row.id
  try {
    await accessApi.value.remove(row.id)
    ElMessage.success(t('deleteSuccess'))
    await refresh()
  } catch {
    // 请求层会展示错误信息。
  } finally {
    deletingId.value = undefined
  }
}

const getRowActions = (row: ApplicationVO): ZeActionItem[] => {
  const actions: ZeActionItem[] = []
  if (hasPermission('edit')) actions.push({ content: t('edit'), onClick: () => editRef.value.open(row) })
  if (hasPermission('resetSecret'))
    actions.push({
      content: t('resetSecret'),
      loading: resettingId.value === row.id,
      onClick: () => handleResetSecret(row),
    })
  if (hasPermission('remove'))
    actions.push({
      content: t('delete'),
      loading: deletingId.value === row.id,
      confirm: { title: t('deleteConfirm', { appName: row.appName }) },
      onClick: () => handleDelete(row),
    })
  return actions
}

const [credentialRef, CredentialModal] = useModal({
  title: computed(() => t('credentialTitle')),
  showAction: false,
})
const oneTimeCredential = ref<ApplicationCredential>()
const credentialSaved = ref(false)

const openCredential = (credential: ApplicationCredential) => {
  oneTimeCredential.value = credential
  credentialSaved.value = false
  nextTick(() => credentialRef.value.open())
}
const closeCredential = () => credentialRef.value.close()
const clearCredential = () => {
  oneTimeCredential.value = undefined
  credentialSaved.value = false
}

const copyCredential = async (value: string, field: string) => {
  try {
    await copy(value)
    ElMessage.success(t('copySuccess', { field }))
  } catch {
    ElMessage.error(t('copyFailed'))
  }
}

const copyAllCredentials = () => {
  if (!oneTimeCredential.value) return
  const { appId, appSecret } = oneTimeCredential.value
  return copyCredential(`${t('appId')}: ${appId}\n${t('appSecret')}: ${appSecret}`, t('allCredentials'))
}
</script>

<style lang="scss" scoped>
.app-id-cell,
.credential-value,
.credential-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.app-id-cell code,
.credential-value code {
  overflow-wrap: anywhere;
  color: var(--el-text-color-primary);
}

.scope-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.terminal-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.terminal-editor {
  margin-top: 4px;
  padding: 16px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
}

.terminal-editor__header,
.terminal-editor__row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.terminal-editor__header {
  justify-content: space-between;
  margin-bottom: 14px;
}

.terminal-editor__title {
  color: var(--el-text-color-primary);
  font-weight: 600;
}

.terminal-editor__tip {
  margin-top: 4px;
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.terminal-editor__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.terminal-editor__client {
  width: 280px;
}

.terminal-editor__channel {
  flex: 1;
}

.empty-value {
  color: var(--el-text-color-placeholder);
}

.credential-panel {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.credential-details {
  width: 100%;
}

.credential-toolbar {
  display: flex;
  justify-content: flex-end;
}

.credential-tip {
  margin: 0;
  color: var(--el-text-color-secondary);
  line-height: 1.6;
}

.credential-footer {
  width: 100%;
}
</style>

<i18n lang="yaml">
en:
  columns: 'Show/hide columns'
  reset: 'Reset'
  add: 'Add'
  id: 'ID'
  tenantId: 'Tenant ID'
  tenantName: 'Tenant name'
  appName: 'Application name'
  appId: 'App ID'
  appSecret: 'Secret key'
  scopes: 'Scopes'
  terminals: 'Terminals'
  terminalsTip: 'Bind one or more authentication policies. Apps send the public channel code; internal client IDs stay on the server.'
  addTerminal: 'Add terminal'
  removeTerminal: 'Remove'
  authClientPlaceholder: 'Select an authentication policy'
  authClientRequired: 'Select an authentication policy for every terminal'
  channel: 'Channel'
  channelPlaceholder: 'app, h5, miniapp...'
  channelInvalid: 'Channel must start with a letter and contain only lowercase letters, numbers, _ or -'
  channelDuplicate: 'Channel codes must be unique within the application'
  terminalsRequired: 'Add at least one terminal'
  terminalsMax: 'An application can have at most {max} terminals'
  unknownClient: 'Unknown policy'
  enabled: 'Enabled'
  disabled: 'Disabled'
  status: 'Status'
  lastAccessTime: 'Last accessed at'
  secretRotatedTime: 'Secret rotated at'
  createTime: 'Created at'
  actions: 'Actions'
  copy: 'Copy'
  copyAppId: 'Copy App ID'
  edit: 'Edit'
  delete: 'Delete'
  resetSecret: 'Reset secret'
  addTitle: 'Add application access'
  editTitle: 'Edit application access'
  tenantIdPlaceholder: 'Search by tenant ID or company name'
  tenantIdRequired: 'Select a tenant'
  appNamePlaceholder: 'Enter an application name'
  appNameRequired: 'Application name is required'
  scopesPlaceholder: 'Select business modules under App management'
  scopesRequired: 'Select at least one business module'
  remark: 'Remark'
  remarkPlaceholder: 'Enter a remark'
  saveSuccess: 'Saved successfully'
  addSuccess: 'Created successfully'
  deleteSuccess: 'Deleted successfully'
  enable: 'enable'
  disable: 'disable'
  statusConfirm: 'Are you sure you want to {action} “{appName}”?'
  statusSuccess: '{action} succeeded'
  resetSecretConfirm: 'Reset the secret for “{appName}”? The old secret will stop working immediately.'
  deleteConfirm: 'Delete application “{appName}”?'
  credentialTitle: 'Save the application credential now'
  credentialWarning: 'The secret is shown only once. Copy it to a secure location before closing this window.'
  credentialTip: 'Public clients send App ID and a configured channel. Internal client IDs stay on the server; keep Secret Key on a trusted server only.'
  credentialSaved: 'I have saved the credential securely'
  savedAndClose: 'Saved, close window'
  copySuccess: '{field} copied'
  copyFailed: 'Copy failed. Please copy it manually.'
  copyAllCredentials: 'Copy App ID and Secret Key'
  allCredentials: 'App ID and Secret Key'
zh-CN:
  columns: '显示/隐藏列'
  reset: '重置'
  add: '新增'
  id: '编号'
  tenantId: '租户编号'
  tenantName: '租户名称'
  appName: '应用名称'
  appId: 'App ID'
  appSecret: 'Secret Key'
  scopes: '授权范围'
  terminals: '终端配置'
  terminalsTip: '为 App 绑定一个或多个认证策略；终端只传公开渠道码，内部客户端 ID 保留在服务端。'
  addTerminal: '添加终端'
  removeTerminal: '移除'
  authClientPlaceholder: '请选择认证策略'
  authClientRequired: '请为每个终端选择认证策略'
  channel: '渠道码'
  channelPlaceholder: '例如 app、h5、miniapp'
  channelInvalid: '渠道码须以字母开头，只能包含小写字母、数字、下划线或短横线'
  channelDuplicate: '同一 App 内的渠道码不能重复'
  terminalsRequired: '请至少添加一个终端'
  terminalsMax: '每个 App 最多可配置 {max} 个终端'
  unknownClient: '未知策略'
  enabled: '启用'
  disabled: '停用'
  status: '状态'
  lastAccessTime: '最后调用时间'
  secretRotatedTime: '密钥轮换时间'
  createTime: '创建时间'
  actions: '操作'
  copy: '复制'
  copyAppId: '复制 App ID'
  edit: '编辑'
  delete: '删除'
  resetSecret: '重置密钥'
  addTitle: '新增应用接入'
  editTitle: '编辑应用接入'
  tenantIdPlaceholder: '搜索租户编号或企业名称'
  tenantIdRequired: '请选择租户'
  appNamePlaceholder: '请输入应用名称'
  appNameRequired: '应用名称不能为空'
  scopesPlaceholder: '请选择 App 管理中的业务模块'
  scopesRequired: '请至少选择一个业务模块'
  remark: '备注'
  remarkPlaceholder: '请输入备注'
  saveSuccess: '保存成功'
  addSuccess: '创建成功'
  deleteSuccess: '删除成功'
  enable: '启用'
  disable: '停用'
  statusConfirm: '确认要{action}应用“{appName}”吗？'
  statusSuccess: '{action}成功'
  resetSecretConfirm: '确认重置应用“{appName}”的密钥吗？旧密钥会立即失效。'
  deleteConfirm: '确认删除应用“{appName}”吗？'
  credentialTitle: '请立即保存应用凭证'
  credentialWarning: 'Secret Key 仅展示一次，关闭前请复制并保存到安全位置。'
  credentialTip: '公开终端使用 App ID 和已配置的渠道码；内部客户端 ID 保留在服务端，Secret Key 只能保存在可信服务端。'
  credentialSaved: '我已将凭证保存到安全位置'
  savedAndClose: '已保存，关闭窗口'
  copySuccess: '{field} 已复制'
  copyFailed: '复制失败，请手动复制。'
  copyAllCredentials: '一键复制 App ID 和 Secret Key'
  allCredentials: 'App ID 和 Secret Key'
</i18n>
