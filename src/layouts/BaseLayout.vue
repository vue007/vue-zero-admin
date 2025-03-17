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
      <aside class="layout-aside">
        <div id="layout-aside-menu"></div>
        <div class="collapse-action" @click="baseStore.menu.toggleCollapse">
          <svg-icon name="el-fold" />
        </div>
      </aside>
      <div class="layout-page">
        <el-breadcrumb class="page-breadcrumb" separator="/">
          <el-breadcrumb-item v-for="item in menu.breadcrumb">{{ item }}</el-breadcrumb-item>
        </el-breadcrumb>

        <router-view v-slot="{ route, Component: Comp }">
          <keep-alive :max="10">
            <component v-if="needKeep" :is="Comp" ref="pageRef" :key="isTab ? route.matched[0].path : route.path" />
          </keep-alive>
          <component v-if="!needKeep" :is="Comp" ref="pageRef" :key="route.path" />
        </router-view>
      </div>
    </section>
  </div>

  <LayoutActions :to="actionsPosition" />
  <LayoutMenu :to="menuPosition" />
</template>

<script setup lang="ts">
import { useBaseStore } from '@/stores/base.module'
import { useMediaQuery, watchDebounced } from '@vueuse/core'

const { t } = useI18nLocal()
const baseStore = useBaseStore()
const { menu } = baseStore
const route = useRoute()

const isTab = computed(() => route.meta.isTab)
const needKeep = computed(() => isTab.value)
const pageRef = ref(null)

const actionsPosition = '#header-right'
const menuPosition = '#layout-aside-menu'

const isLargeScreen = useMediaQuery('(min-width: 1024px)')
watchDebounced(
  () => isLargeScreen.value,
  (val) => {
    baseStore.menu.setCollapse(!val)
  },
  { debounce: 200, maxWait: 500, immediate: true },
)

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
  height: 100vh;
  overflow: hidden;

  background-color: $bg-color-page;

  .page-breadcrumb {
    margin: 16px 0;

    .el-breadcrumb__item:last-child :deep(.el-breadcrumb__inner) {
      color: var(--el-text-color-primary);
    }
  }
}
.layout-aside {
  flex-shrink: 1;
  height: calc(100vh - $header-height);
  background-color: #fff;
  border-right: 1px solid #e4e7ed;
  position: relative;

  #{$theme-dark} {
    background-color: #0a0a0a;
    border-right: 1px solid #4c4d4f;
  }

  .collapse-action {
    position: absolute;
    width: 20px;
    height: 20px;
    bottom: 15px;
    left: 0;
    padding-left: 22px;
    padding-bottom: 15px;
  }
}
.layout-page {
  flex: 1;
  height: calc(100vh - $header-height);
  overflow-y: auto;

  padding: 0 24px;
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
