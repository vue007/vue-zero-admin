<template>
  <div class="count ml-50 mt-20">{{ t('count') }}: {{ demoStore.demoObj.count }}</div>
</template>
<script setup lang="ts">
import { login } from '@/api/base.api'
import type { LoginForm } from '@/api/base.type'
import { useDemoStore } from '@/stores/demo.module'

const demoStore = useDemoStore()
const { t } = useI18nLocal()

const loginForm = reactive<LoginForm>({ username: '', password: '' })

const [userInfo, fetchLogin] = useApi(login, loginForm)
</script>
<style lang="scss" scoped>
.count {
  @apply: flex justify-center items-center;
}
</style>

<i18n lang="yaml">
en:
  count: count
zh-CN:
  count: 计数
zh-TW:
  count: 計數
</i18n>
