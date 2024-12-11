<template>
  <div>
    <header class="layout-header">
      <div class="header-left mr-auto" id="header-left">
        <div class="app-logo flex">
          <img class="w-36 h-36 lt-sm:w-28 lt-sm:h-28" src="@/assets/images/logo.png" alt="logo" />
        </div>
        <div class="app-title ml-16 flex lt-sm:ml-8"></div>
      </div>

      <div class="header-right" id="header-right" />
    </header>

    <section class="layout-body">
      <router-view></router-view>
    </section>
  </div>

  <LayoutActions :to="actionsPosition" :actions="['theme', 'locale']" />
</template>

<script setup lang="ts">
const { t } = useI18nLocal()
const actionsPosition = '#header-right'

onMounted(() => {
  console.log(t('header'))
})
</script>

<style lang="scss" scoped>
$header-height: 64px;
.layout-header {
  @apply: fixed top-0 left-0 w-100vw z-10;
  @apply: flex justify-between items-center;
  background-color: #fff;

  font-size: 32px;
  height: $header-height;
  box-shadow: var(--el-box-shadow);

  padding: 0 24px 0 30px;

  @screen lt-sm {
    padding: 0 8px 0 12px;
  }

  #{$theme-dark} {
    background-color: #141414;
    border-bottom: 1px solid #4c4d4f;
  }

  #{$size-large} {
    height: $header-height + 10px;
  }
  #{$size-small} {
    height: $header-height - 10px;
  }

  .app-title {
    #{$theme-dark} {
      filter: invert(100%);
    }
  }

  .header-left {
    @apply: flex-center;
  }

  .header-right {
    @apply: flex-center;
  }
}

.layout-body {
  padding-top: $header-height;
  #{$size-large} {
    padding-top: $header-height + 10px;
  }
  #{$size-small} {
    padding-top: $header-height - 10px;
  }

  @apply: flex;
  height: calc(100vh);
  overflow: hidden;
}
</style>

<i18n lang="yaml">
en:
  header: Header
zh-CN:
  header: 头部
zh-TW:
  header: 頭部
</i18n>
