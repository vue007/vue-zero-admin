<template>
  <div v-loading="loading" class="social-accounts">
    <el-empty v-if="!providers?.length" :description="t('not_configured')" />
    <div v-else class="social-accounts__list">
      <div v-for="source in providers" :key="source" class="social-account">
        <div class="social-account__main">
          <el-avatar :size="42" :src="accountBySource[source.toLowerCase()]?.avatar">
            {{ getSocialProviderLabel(source).slice(0, 1) }}
          </el-avatar>
          <div class="min-w-0">
            <div class="font-600">{{ getSocialProviderLabel(source) }}</div>
            <div class="social-account__description">
              {{
                accountBySource[source.toLowerCase()]?.nickName ||
                accountBySource[source.toLowerCase()]?.userName ||
                t('not_bound')
              }}
            </div>
          </div>
        </div>
        <el-button
          v-if="accountBySource[source.toLowerCase()]"
          type="danger"
          plain
          :loading="pendingSource === source"
          @click="unbind(source)"
        >
          {{ t('unbind') }}
        </el-button>
        <el-button v-else type="primary" plain :loading="pendingSource === source" @click="bind(source)">
          {{ t('bind') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { baseApi } from '@/api/_index'
import type { SocialAccount } from '@/api/base.type'
import { getSocialProviderLabel, startSocialAuth } from '@/utils/social-auth'

const props = defineProps<{ tenantId: string }>()
const { t } = useI18nLocal()
const [providers, refreshProviders, providersLoading] = useApi(baseApi.getSocialProviders, undefined, {
  immediate: true,
  tipError: true,
})
const [accounts, refreshAccounts, accountsLoading] = useApi(baseApi.getSocialAccounts, undefined, {
  immediate: true,
  tipError: true,
})
const loading = computed(() => providersLoading.value || accountsLoading.value)
const pendingSource = ref('')
const accountBySource = computed<Record<string, SocialAccount | undefined>>(() =>
  Object.fromEntries((accounts.value || []).map((account) => [account.source.toLowerCase(), account])),
)

const bind = async (source: string) => {
  pendingSource.value = source
  try {
    await startSocialAuth({
      mode: 'bind',
      source,
      tenantId: props.tenantId,
      returnTo: '/system/user/profile',
    })
  } catch {
    // 请求拦截器已展示服务端错误。
  } finally {
    pendingSource.value = ''
  }
}

const unbind = async (source: string) => {
  const account = accountBySource.value[source.toLowerCase()]
  if (!account) return
  try {
    await ElMessageBox.confirm(t('unbind_confirm', { provider: getSocialProviderLabel(source) }), t('notice'), {
      type: 'warning',
    })
  } catch {
    return
  }
  pendingSource.value = source
  try {
    await baseApi.unbindSocialAccount(account.id)
    ElMessage.success(t('unbind_success'))
    await refreshAccounts()
  } catch {
    // 请求拦截器已展示服务端错误。
  } finally {
    pendingSource.value = ''
  }
}

onActivated(() => {
  refreshProviders()
  refreshAccounts()
})
</script>

<style scoped>
.social-accounts__list {
  display: grid;
  gap: 12px;
  max-width: 680px;
}

.social-account {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: var(--el-border-radius-base);
}

.social-account__main {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 12px;
}

.social-account__description {
  overflow: hidden;
  margin-top: 3px;
  color: var(--el-text-color-secondary);
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

<i18n lang="yaml">
en:
  not_configured: 'No social identity provider has been configured.'
  not_bound: 'Not linked'
  bind: 'Link'
  unbind: 'Unlink'
  unbind_confirm: 'Unlink your {provider} account?'
  unbind_success: 'Account unlinked'
  notice: 'Notice'
zh:
  not_configured: '尚未配置第三方身份平台'
  not_bound: '未绑定'
  bind: '绑定'
  unbind: '解绑'
  unbind_confirm: '确认解绑 {provider} 账号吗？'
  unbind_success: '解绑成功'
  notice: '提示'
</i18n>
