<route lang="json5">
{ meta: { layout: 'blank', auth: false } }
</route>

<template>
  <div class="login-page">
    <aside class="login-aside relative">
      <div class="aside-title">
        <div class="mr-10">{{ t('welcome') }}</div>
        <div>Zero Admin</div>
      </div>
    </aside>
    <section class="login-section">
      <div class="section-content">
        <div class="login-form-box">
          <LoginForm />
        </div>
        <div class="login-form-title"></div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import LoginForm from './_views/LoginForm.vue'
const { t } = useI18nLocal()
</script>

<style lang="scss" scoped>
.login-page {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: row;
  min-width: 0;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;

  .login-aside {
    z-index: 1;
    width: 50vw;
    max-width: 632px;
    min-width: 300px;

    @screen lt-lg {
      @apply: min-w-full;
    }
  }

  .aside-title {
    @apply: absolute top-18vh left-60 text-40 c-white;

    @screen lt-lg {
      @apply: fixed flex justify-center w-full left-0 top-12vh text-32;
    }
  }

  .login-section {
    position: relative;
    z-index: 1;
    flex: 1;
    display: flex;
    justify-content: center;
    padding: 0 8px;
  }

  .section-content {
    @apply flex flex-col items-center;
    @screen lt-lg {
      @apply: fixed top-12vh left-0 right-0 bottom-0;
    }
  }

  .login-form-box {
    margin-top: 12vh;
    padding: 100px 40px;
    min-width: 450px;
    min-height: 560px;
    border-radius: 12px;
    background-color: var(--el-bg-color);
    box-shadow:
      0 8px 20px rgba(0, 0, 0, 0.08),
      0 12px 32px 4px rgba(0, 0, 0, 0.04);

    @screen lt-sm {
      padding: 50px 40px;
      min-width: 370px;
      min-height: 400px;
    }

    #{$theme-argon} {
      width: 446px;
      max-width: calc(100vw - 32px);
      min-width: 0;
      min-height: 0;
      padding: 48px;
      border: 1px solid color-mix(in srgb, var(--el-border-color) 65%, transparent);
      border-radius: 15px;
      box-shadow: var(--el-box-shadow-light);

      @screen lt-sm {
        padding: 32px 24px;
      }
    }
  }

  .login-form-title {
    margin-top: 20px;
    color: $text-color-secondary;
    font-size: 14px;

    #{$scheme-light},
    #{$theme-argon} {
      @screen lt-lg {
        color: #fff;
      }
    }
  }
}
</style>

<i18n lang="yaml">
en:
  welcome: 'Welcome to'

zh:
  welcome: '欢迎使用'
</i18n>
