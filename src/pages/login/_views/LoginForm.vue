<template>
  <div class="mb-40 text-24 font-bold">登录</div>

  <ze-form v-model="loginForm" v-bind="{ items, rules, labelWidth: '0px' }" ref="loginFormRef">
    <template #item-username#prefix><svg-icon name="el-user" /></template>
    <template #item-password#prefix><svg-icon class="cursor-pointer" name="el-lock" /></template>
    <template #item-code#append>
      <suspense>
        <template #default>
          <component
            v-show="captchaData?.img"
            is="img"
            class="cursor-pointer h-30"
            :src="`data:image/gif;base64,${captchaData?.img}`"
            @click="fetchCaptcha"
          />
        </template>
        <template #fallback>
          <el-button class="ml-4" type="text" @click="() => fetchCaptcha()">刷新验证码</el-button>
        </template>
      </suspense>
    </template>
    <template #item-rememberMe>
      <el-checkbox v-model="loginForm.rememberMe" label="保持登录" />
    </template>
  </ze-form>

  <el-button class="w-full mt-8" type="primary" size="large" @click="submitLogin" :loading="submitting">
    立即登录
  </el-button>
</template>

<script setup lang="ts">
import { baseApi } from '@/api/_index'
// import { useBaseStore } from '@/stores/base.module'
import { setToken } from '@/utils/auth'
import { useThrottleFn } from '@vueuse/core'

const router = useRouter()

const [tenantData] = useApi(baseApi.getTenantList, {}, { immediate: true })

const [loginForm, items, rules] = useForm({
  tenantId: {
    value: '000000',
    item: {
      type: 'select',
      options: computed(() =>
        tenantData.value?.voList.map((item) => ({ label: item.companyName, value: item.tenantId })),
      ),
    },
  },
  username: {
    value: import.meta.env.DEV ? 'admin' : '',
    item: { type: 'text', plh: '用户名' },
    rule: [{ required: true, message: '请输入您的账号' }],
  },
  password: {
    value: import.meta.env.DEV ? 'admin123' : '',
    item: { type: 'password', plh: '密码', showPassword: true },
    rule: [{ required: true, message: '请输入您的密码' }],
  },
  code: {
    value: '',
    item: { type: 'text', plh: '验证码' },
    rule: [{ required: true, message: '请输入验证码' }],
  },
  rememberMe: { value: false },
})

const loginFormRef = ref()
const [, fetchLogin, submitting] = useApi(baseApi.login, loginForm, {
  onSubmit: async (data) => {
    await loginFormRef.value?.validate()

    data['clientId'] = import.meta.env.VITE_APP_CLIENT_ID
    data['grantType'] = 'password'
    data['uuid'] = captchaData.value?.uuid

    return data
  },
  onSuccess: (res) => {
    setToken(res?.apiData.access_token || '')
    setTimeout(() => router.replace('/'), 1000)
  },
  onError: (err) => {
    console.log(err.message)
  },
  tipSuccess: '登录成功',
})

const [captchaData, fetchCaptcha] = useApi(
  baseApi.getCaptcha,
  {},
  {
    immediate: true,
    onSuccess: (res) => {
      console.log(res)
    },
  },
)

const submitLogin = useThrottleFn(() => {
  fetchLogin()
}, 1000)
</script>

<style lang="scss" scoped></style>
