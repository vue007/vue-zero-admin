<template>
  <header class="login-form-heading" :class="{ 'is-argon': isArgon }">
    <h1>{{ t('title') }}</h1>
    <p v-if="isArgon">{{ t('subtitle') }}</p>
  </header>

  <ze-form
    ref="loginFormRef"
    v-model="loginForm"
    class="login-form"
    :class="{ 'is-argon': isArgon }"
    v-bind="{ items, rules, labelWidth: '0px' }"
  >
    <template #item-code#append>
      <suspense>
        <template #default>
          <component
            v-show="captchaData?.img"
            is="img"
            class="captcha-image cursor-pointer"
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
      <label v-if="isArgon" class="remember-switch">
        <el-switch v-model="loginForm.rememberMe" />
        <span>{{ t('remember_me') }}</span>
      </label>
      <el-checkbox v-else v-model="loginForm.rememberMe" :label="t('remember_me')" />
    </template>
  </ze-form>

  <el-button
    class="login-submit"
    :class="{ 'is-argon': isArgon }"
    prop="submit"
    type="primary"
    :loading="submitting"
    @click="submitLogin"
  >
    {{ t('login_btn') }}
  </el-button>
</template>

<script setup lang="ts">
import { baseApi } from '@/api/_index'
import { useBaseStore } from '@/stores/base.module'
import { setToken } from '@/utils/auth'
import { useThrottleFn } from '@vueuse/core'

const { t } = useI18nLocal()
const router = useRouter()
const { setting } = useBaseStore()
const isArgon = computed(() => setting.theme === 'argon')

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

<style lang="scss" scoped>
.login-form-heading {
  margin-bottom: 40px;

  h1 {
    margin: 0;
    color: var(--el-text-color-primary);
    font-size: 24px;
    font-weight: 700;
    line-height: 1.4;
  }

  &.is-argon {
    margin-bottom: 24px;

    h1 {
      font-size: 30px;
      line-height: 1.37;
      letter-spacing: -0.8px;
    }

    p {
      margin: 24px 0 0;
      color: var(--el-text-color-secondary);
      font-size: var(--el-font-size-base);
      line-height: 1.42;
    }
  }
}

.login-form {
  :deep(.el-form-item) {
    margin-right: 0;
    margin-bottom: 24px;
  }

  .is-argon {
    --argon-field-padding-inline: 20px;

    #{$size-small} {
      --argon-field-padding-inline: 16px;
    }

    :deep(.el-form-item__content) {
      min-width: 0;
    }

    :deep(.el-input),
    :deep(.el-select) {
      width: 100%;
      max-width: 100%;
    }

    :deep(.el-input__wrapper),
    :deep(.el-select__wrapper) {
      padding-right: var(--argon-field-padding-inline);
      padding-left: var(--argon-field-padding-inline);
    }

    :deep(.el-input-group__append) {
      padding-right: 12px;
      padding-left: 12px;
    }

    :deep(.el-form-item__error) {
      padding-top: 3px;
    }
  }
}

.captcha-image {
  display: block;
  width: auto;
  height: min(30px, calc(var(--el-component-size) - 8px));
}

.remember-switch {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--el-text-color-primary);
  font-size: 14px;
  cursor: pointer;
}

.login-submit {
  width: 100%;
  margin-top: 8px;

  &.is-argon {
    margin-top: 0;
    font-weight: 700;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
  }
}
</style>

<i18n lang="yaml">
en:
  title: 'Sign in'
  subtitle: 'Enter your account and password to sign in'
  welcome: 'Welcome to'
  refresh_captcha: 'Refresh Captcha'
  login: 'Login'
  register: 'Register'
  forget_password: 'Forget Password'
  remember_me: 'Remember Me'
  username: 'Username'
  password: 'Password'
  login_btn: 'Sign in'
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
  subtitle: '请输入您的账号和密码登录系统'
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
