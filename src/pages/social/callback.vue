<route lang="json5">
{ meta: { layout: 'blank', auth: false, title: '第三方登录' } }
</route>

<template>
  <main class="social-callback-page">
    <el-result :icon="status" :title="title" :sub-title="detail">
      <template v-if="status === 'error'" #extra>
        <el-button type="primary" @click="router.replace(fallbackPath)">{{ t('back') }}</el-button>
      </template>
    </el-result>
  </main>
</template>

<script setup lang="ts">
import { baseApi } from '@/api/_index'
import { getToken, setToken } from '@/utils/auth'
import {
  clearSocialAuthContext,
  getTenantIdFromSocialState,
  readSocialAuthContext,
} from '@/utils/social-auth'

const { t } = useI18nLocal()
const route = useRoute()
const router = useRouter()
const context = readSocialAuthContext()
const fallbackPath = computed(() => context?.returnTo || (getToken() ? '/system/user/profile' : '/login'))
const status = ref<'info' | 'success' | 'error'>('info')
const title = ref(t('processing'))
const detail = ref(t('please_wait'))

const queryValue = (value: unknown): string => (Array.isArray(value) ? String(value[0] || '') : String(value || ''))

onMounted(async () => {
  const source = queryValue(route.query.source) || context?.source || ''
  const socialCode = queryValue(route.query.code)
  const socialState = queryValue(route.query.state)
  const providerError = queryValue(route.query.error_description) || queryValue(route.query.error)

  if (providerError) {
    status.value = 'error'
    title.value = t('failed')
    detail.value = providerError
    return
  }
  if (!source || !socialCode || !socialState) {
    status.value = 'error'
    title.value = t('failed')
    detail.value = t('invalid_callback')
    return
  }

  try {
    const mode = context?.mode || (getToken() ? 'bind' : 'login')
    if (mode === 'bind') {
      await baseApi.bindSocialAccount({ source, socialCode, socialState })
      status.value = 'success'
      title.value = t('bind_success')
    } else {
      const tenantId = getTenantIdFromSocialState(socialState) || context?.tenantId
      if (!tenantId) throw new Error(t('tenant_missing'))
      const response = await baseApi.socialLogin({
        clientId: import.meta.env.VITE_APP_CLIENT_ID,
        grantType: 'social',
        tenantId,
        source,
        socialCode,
        socialState,
      })
      setToken(response.apiData.access_token || '')
      status.value = 'success'
      title.value = t('login_success')
    }
    detail.value = t('redirecting')
    clearSocialAuthContext()
    window.setTimeout(() => router.replace(context?.returnTo || '/'), 800)
  } catch (error) {
    status.value = 'error'
    title.value = t('failed')
    detail.value = error instanceof Error ? error.message : t('retry')
  }
})
</script>

<style scoped>
.social-callback-page {
  display: grid;
  min-height: 100vh;
  place-items: center;
  padding: 24px;
  background: var(--el-bg-color-page);
}
</style>

<i18n lang="yaml">
en:
  processing: 'Completing authorization'
  please_wait: 'Please wait while we verify the provider response.'
  failed: 'Authorization failed'
  invalid_callback: 'The callback is missing required authorization parameters.'
  tenant_missing: 'The tenant could not be identified.'
  bind_success: 'Account linked'
  login_success: 'Signed in successfully'
  redirecting: 'Redirecting…'
  retry: 'Please return and try again.'
  back: 'Go back'
zh:
  processing: '正在完成第三方授权'
  please_wait: '正在校验第三方平台返回结果，请稍候。'
  failed: '第三方授权失败'
  invalid_callback: '回调缺少必要的授权参数。'
  tenant_missing: '无法识别登录租户。'
  bind_success: '第三方账号绑定成功'
  login_success: '第三方登录成功'
  redirecting: '即将跳转…'
  retry: '请返回后重试。'
  back: '返回'
</i18n>
