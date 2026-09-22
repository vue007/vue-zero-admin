<template>
  <ze-form-item v-if="visible" v-bind="formItemProps">
    <el-select
      v-model="tenantId"
      class="v-tenant-selector"
      filterable
      remote
      reserve-keyword
      :remote-method="onRemoteSearch"
      :loading="loading"
      :placeholder="selectPlaceholder"
      :disabled="disabled"
      :clearable="clearable"
      @change="onChange"
      @visible-change="onVisibleChange"
    >
      <el-option
        v-for="item in displayOptions"
        :key="item.tenantId"
        :label="formatTenantLabel(item)"
        :value="item.tenantId"
      />
    </el-select>
  </ze-form-item>
</template>

<script setup lang="ts">
import { tenantApi } from '@/api/_index'
import type { TenantOption } from '@/api/sys/tenant.types'
import { useBaseStore } from '@/stores/base.module'
import { useDebounceFn } from '@vueuse/core'

const SUPER_ADMIN_ROLE = 'superadmin'

type TenantSelectorSeed = Partial<TenantOption> & {
  tenantId?: string | number
  tenantName?: string
}

const props = withDefaults(
  defineProps<{
    prop?: string
    label?: string
    labelT?: string
    labelWidth?: string | number
    required?: boolean
    plh?: string
    placeholder?: string
    disabled?: boolean
    clearable?: boolean
    hidden?: boolean
    option?: TenantSelectorSeed
  }>(),
  { clearable: true },
)

defineOptions({ inheritAttrs: false })

const tenantId = defineModel<string>({ default: '' })
const { t } = useI18nLocal()
const baseStore = useBaseStore()
const isSuperAdmin = computed(() => baseStore.setting.userInfo.roles?.includes(SUPER_ADMIN_ROLE) ?? false)
const visible = computed(() => {
  if (props.hidden === true) return false
  if (props.hidden === false) return true
  return isSuperAdmin.value
})

const formItemProps = computed(() => ({
  prop: props.prop,
  label: props.label,
  labelT: props.labelT,
  labelWidth: props.labelWidth,
  required: props.required,
}))
const selectPlaceholder = computed(() => {
  const override = props.placeholder?.trim() || props.plh?.trim()
  return override || t('placeholder')
})

const selected = ref<TenantOption>()
const [options, fetchOptions, loading] = useApi(tenantApi.searchTenantOptions, undefined, {
  concurrency: 'takeLatest',
})

const normalizeOption = (option?: TenantSelectorSeed | null): TenantOption | undefined => {
  if (option?.tenantId === undefined || option.tenantId === null || option.tenantId === '') return undefined
  const id = String(option.tenantId)
  return {
    tenantId: id,
    companyName: option.companyName || option.tenantName || id,
  }
}

const formatTenantLabel = (option: TenantOption) => `${option.tenantId} · ${option.companyName}`

const remember = (option?: TenantOption) => {
  selected.value = option
}

const displayOptions = computed(() => {
  const list = options.value || []
  const current = selected.value
  if (current && !list.some((item) => item.tenantId === current.tenantId)) return [current, ...list]
  return list
})

const search = (keyword = '') => fetchOptions(keyword)
const onRemoteSearch = useDebounceFn((keyword: string) => search(keyword), 250)

const onVisibleChange = (open: boolean) => {
  if (open && visible.value && !props.disabled) search('')
}

const onChange = (value: string) => {
  if (!value) {
    remember(undefined)
    return
  }
  remember(displayOptions.value.find((item) => item.tenantId === value))
}

watch(
  () => props.option,
  (value) => {
    const next = normalizeOption(value)
    if (next) remember(next)
  },
  { immediate: true },
)

watch(
  tenantId,
  (value) => {
    if (!value) {
      if (!normalizeOption(props.option)) remember(undefined)
      return
    }
    if (selected.value?.tenantId === value) return
    const matched = displayOptions.value.find((item) => item.tenantId === value)
    if (matched) {
      remember(matched)
      return
    }
    const seeded = normalizeOption(props.option)
    if (seeded?.tenantId === value) remember(seeded)
    else if (visible.value) search(value)
  },
  { immediate: true },
)

watch(options, (list) => {
  if (!tenantId.value || selected.value?.tenantId === tenantId.value) return
  const matched = (list || []).find((item) => item.tenantId === tenantId.value)
  if (matched) remember(matched)
})

defineExpose({ search })
</script>

<style lang="scss" scoped>
.v-tenant-selector {
  min-width: 220px;
}
</style>

<i18n lang="yaml">
en:
  placeholder: Search by tenant ID or company name
zh-CN:
  placeholder: 请输入租户编号或企业名称
</i18n>
