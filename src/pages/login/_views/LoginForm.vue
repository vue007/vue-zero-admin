<route lang="json5">
{ meta: { layout: 'blank', auth: false } }
</route>

<template>
  <div class="mb-40 text-24 font-bold">登录</div>

  <ze-form v-model="loginForm" v-bind="{ items, rules, labelWidth: '0px' }" ref="loginFormRef">
    <template #item-username#prefix><svg-icon name="el-user" /></template>
    <template #item-password#prefix><svg-icon class="cursor-pointer" name="el-lock" /></template>
  </ze-form>

  <el-button class="w-full mt-8" type="primary" size="large" @click="submitLogin" :loading="submitting">
    立即登录
  </el-button>
</template>

<script setup lang="ts">
// import { baseApi } from '@/api/_index'
import { setToken } from '@/utils/auth'
import { useThrottleFn } from '@vueuse/core'

const router = useRouter()

const [loginForm, items, rules] = useForm({
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
})
const submitting = ref(false)
const loginFormRef = ref()
// const [, fetchLogin, submitting] = useApi(baseApi.login, loginForm, {
//   onSubmit: async (data) => {
//     await loginFormRef.value?.validate()

//     data['clientId'] = import.meta.env.VITE_APP_CLIENT_ID
//     data['rememberMe'] = false

//     return data
//   },
//   onSuccess: (res) => {
//     console.log(res?.apiData.access_token)
//     setToken(res?.apiData.access_token || '')
//     setTimeout(() => router.push('/'), 1000)
//   },
//   onError: (err) => {
//     console.log(err.code)
//   },
//   onFinally: () => {
//     console.log('finally')
//   },
//   tipSuccess: '登录成功',
// })

const submitLogin = useThrottleFn(() => {
  setTimeout(() => router.push('/'), 1000)
  // fetchLogin()
}, 1000)
</script>

<style lang="scss" scoped></style>
