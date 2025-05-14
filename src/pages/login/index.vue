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
  flex: 1;
  display: flex;
  flex-direction: row;
  overflow-y: auto;
  overflow-x: hidden;

  .login-aside {
    width: 50vw;
    max-width: 632px;
    min-width: 300px;
    background-color: #1290fc;

    #{$theme-dark} {
      mix-blend-mode: screen;
      background-color: #0a0a0a;
      border-right: 1px solid #4c4d4f;
      img {
        filter: invert(36%) drop-shadow(0 0 40px #0b58dd) opacity(0.9);
      }
    }

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
    flex: 1;
    display: flex;
    justify-content: center;
    padding: 0 8px;

    #{$theme-dark} {
      background-color: #0a0a0a;
    }
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
    border-radius: 12px 12px 12px 12px;
    background-color: #fff;

    box-shadow:
      0px 8px 20px 0px rgba(#000, 0.08),
      0px 12px 32px 4px rgba(#000, 0.04);

    @screen lt-sm {
      padding: 50px 40px;
      min-width: 370px;
      min-height: 400px;
    }

    #{$theme-dark} {
      background-color: #141414;
    }
  }

  .login-form-title {
    margin-top: 20px;
    color: $text-color-secondary;
    font-size: 14px;

    #{$theme-light} {
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
