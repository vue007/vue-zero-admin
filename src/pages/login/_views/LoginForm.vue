<template>
  <div class="mb-40 text-24 font-bold">{{ t('title') }}</div>

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
          <el-button class="ml-4" type="text" @click="() => fetchCaptcha()">{{ t('refresh_captcha') }}</el-button>
        </template>
      </suspense>
    </template>
    <template #item-rememberMe>
      <el-checkbox v-model="loginForm.rememberMe" :label="t('remember_me')" />
    </template>
  </ze-form>

  <el-button class="w-full mt-8" prop="submit" type="primary" size="large" @click="submitLogin" :loading="submitting">
    {{ t('login_btn') }}
  </el-button>
</template>

<script setup lang="ts">
import { baseApi } from '@/api/_index'
// import { useBaseStore } from '@/stores/base.module'
import { setToken } from '@/utils/auth'
import { useThrottleFn } from '@vueuse/core'

const { t } = useI18nLocal()
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
    item: { type: 'text', plh: t('username_plh') },
    rule: [{ required: true, message: '请输入您的账号' }],
  },
  password: {
    value: import.meta.env.DEV ? 'admin123' : '',
    item: { type: 'password', plh: t('password_plh'), showPassword: true },
    rule: [{ required: true, message: '请输入您的密码' }],
  },
  code: {
    value: '',
    item: { type: 'text', plh: t('captcha_plh') },
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
  onError: () => refreshCaptcha(),
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
const refreshCaptcha = useThrottleFn(() => fetchCaptcha(), 1000)

const submitLogin = useThrottleFn(() => {
  fetchLogin()
}, 1000)
</script>

<style lang="scss" scoped></style>

<i18n lang="yaml">
en:
  title: 'Login'
  welcome: 'Welcome to'
  refresh_captcha: 'Refresh Captcha'
  login: 'Login'
  register: 'Register'
  forget_password: 'Forget Password'
  remember_me: 'Remember Me'
  username: 'Username'
  password: 'Password'
  login_btn: 'Login'
  register_btn: 'Register'
  forget_password_btn: 'Forget Password'
  login_success: 'Login Success'
  login_fail: 'Login Failed'
  username_plh: 'Please enter your username'
  password_plh: 'Please enter your password'
  captcha_plh: 'Please enter the captcha'
  username_error: 'Username cannot be empty'
  password_error: 'Password cannot be empty'
zh:
  title: '登录'
  welcome: '欢迎使用'
  refresh_captcha: '刷新验证码'
  login: '登录'
  register: '注册'
  forget_password: '忘记密码'
  remember_me: '记住我'
  username: '用户名'
  password: '密码'
  login_btn: '立即登录'
  register_btn: '注册'
  forget_password_btn: '忘记密码'
  login_success: '登录成功'
  login_fail: '登录失败'
  username_plh: '请输入用户名'
  password_plh: '请输入密码'
  captcha_plh: '请输入验证码'
  username_error: '用户名不能为空'
  password_error: '密码不能为空'
</i18n>
