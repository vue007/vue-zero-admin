<template>
  <el-button type="primary" @click="handleClick">{{ $t('base.button') }}</el-button>
  <InnerComp />
  <br />

  <div class="flex items-center mt-20">
    <SvgIcon name="WMV" :size="32" />
    <RouterLink to="/doc/icon" class="ml-5">
      {{ t('check all icons') }}
    </RouterLink>
  </div>
  <br />
</template>

<script setup lang="tsx">
import { login } from '@/api/base.api'
import type { LoginForm } from '@/api/base.type'
import { useThrottleFn } from '@vueuse/core'
import { cloneDeep } from 'es-toolkit'
import { RouterLink } from 'vue-router'
const { t } = useI18n({ useScope: 'local' })

const InnerComp = defineComponent({
  setup: () => () => <el-button onClick={handleClick}>InnerCompButton</el-button>,
})

let count = 1
const handleClick = () => ElMessage.success('You have just clicked me! ' + count++)

const loginForm = reactive<LoginForm>({ username: '', password: '' })
const info = ref({})
onMounted(() => {
  login(loginForm)
    .then((res) => {
      res.data.data == res.apiData
    })
    .catch((err) => {})
})

const [userInfo, fetchLogin] = useApi(login, loginForm)

const [userInfoOpt, fetchLoginOpt, submitting] = useApi(login, loginForm, {
  onSubmit: async (data) => {
    console.log(data)
    if (!data) return false

    // way 1
    // data.password = data.password.trim()
    // return true

    // way 2
    const formData = cloneDeep(data)
    formData.password = formData.password.trim()
    formData['secretKey'] = 'akjwe3Gkj'

    return formData
  },
  onSuccess: (res) => {
    console.log(res?.apiData)
  },
  onError: (err) => {
    console.log(err.code)
  },
  onFinally: () => {
    console.log('finally')
  },
  tipError: '登录失败',
  tipSuccess: true,
})

// 再次组合 combinding once more
const throttleLogin = useThrottleFn(() => fetchLogin(), 3000)
</script>

<i18n lang="yaml">
en:
  check all icons: check all icons
zh-CN:
  check all icons: 查看所有图标
zh-TW:
  check all icons: 查看所有圖標
</i18n>
<!-- json type -->
<!-- <i18n lang="json">
{
  "en": { "check all icons": "check all icons" },
  "zh-CN": { "check all icons": "查看所有图标" },
  "zh-TW": { "check all icons": "查看所有圖標" }
}
</i18n> -->
