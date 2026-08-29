<template>
  <div>
    <header class="layout-header">
      <div class="header-left mr-auto" id="header-left">
        <div class="app-logo flex">
          <AppLogo class="w-36 h-36 lt-sm:w-28 lt-sm:h-28" />
        </div>
        <div class="app-title ml-16 flex lt-sm:ml-8"></div>
      </div>

      <div class="header-right" id="header-right" />
    </header>

    <section class="layout-body">
      <aside class="layout-aside" :class="{ 'is-collapse': menu.collapse }">
        <div id="layout-aside-menu"></div>
        <button class="collapse-action" type="button" @click="baseStore.menu.toggleCollapse">
          <svg-icon :name="menu.collapse ? 'el-expand' : 'el-fold'" />
        </button>
      </aside>
      <div class="layout-page" :class="{ 'without-breadcrumb': !menu.breadcrumb.length }">
        <el-breadcrumb v-if="menu.breadcrumb.length" class="page-breadcrumb" separator="/">
          <el-breadcrumb-item v-for="item in menu.breadcrumb" :key="item">{{ item }}</el-breadcrumb-item>
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
import AppLogo from '@/components/AppLogo.vue'
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
  background-color: var(--el-bg-color);

  font-size: 32px;
  height: $header-height;
  box-shadow: var(--el-box-shadow);

  padding: 0 24px 0 30px;

  @screen lt-sm {
    padding: 0 8px 0 12px;
  }
  #{$theme-argon} {
    background: transparent;
    box-shadow: none;
    color: #fff;

    .app-title {
      filter: brightness(0) invert(1);
    }

    .header-right {
      color: #fff;

      :deep(svg) {
        color: inherit;
      }
    }
  }

  #{$theme-default} {
    border-bottom: 1px solid var(--el-border-color-extra-light);
    box-shadow: var(--el-box-shadow-lighter);
  }

  #{$size-large} {
    height: $header-height + 10px;
  }
  #{$size-small} {
    height: $header-height - 10px;
  }
  .app-title {
    #{$scheme-dark} {
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

  #{$theme-argon} {
    position: relative;
    background-color: transparent;
  }

  .page-breadcrumb {
    margin: 16px 0;

    .el-breadcrumb__item:last-child :deep(.el-breadcrumb__inner) {
      color: var(--el-text-color-primary);
    }

    #{$theme-argon} {
      :deep(.el-breadcrumb__inner),
      :deep(.el-breadcrumb__separator) {
        color: rgba(255, 255, 255, 0.75);
      }
      .el-breadcrumb__item:last-child :deep(.el-breadcrumb__inner) {
        color: #fff;
      }
    }
  }
}
.layout-aside {
  --layout-aside-width: 240px;
  --layout-aside-collapsed-width: 64px;

  flex: 0 0 var(--layout-aside-width);
  width: var(--layout-aside-width);
  min-width: var(--layout-aside-width);
  height: 100%;
  background-color: var(--el-bg-color);
  border-right: 1px solid var(--el-border-color-light);
  position: relative;
  z-index: 1;
  transition:
    width 0.2s ease,
    min-width 0.2s ease,
    flex-basis 0.2s ease;

  &.is-collapse {
    flex-basis: var(--layout-aside-collapsed-width);
    width: var(--layout-aside-collapsed-width);
    min-width: var(--layout-aside-collapsed-width);
  }

  #layout-aside-menu {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding-bottom: 56px;
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: contain;
    scrollbar-color: var(--el-border-color) transparent;
    scrollbar-width: thin;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background: var(--el-border-color);
    }
  }

  #{$scheme-dark} {
    background-color: var(--el-bg-color-page);
  }

  #{$theme-default} {
    --layout-aside-width: 256px;
    --layout-aside-collapsed-width: 72px;

    background-color: #fff;
    border-right-color: #e9ecef;
    box-shadow: 4px 0 24px rgba(17, 38, 146, 0.04);
  }

  #{$theme-argon} {
    --layout-aside-width: 260px;
    --layout-aside-collapsed-width: 68px;

    background-color: var(--el-bg-color);
    height: calc(100% - 24px);
    margin: 12px 0 12px 16px;
    border: none;
    border-radius: var(--ze-sidenav-radius, 12px);
    box-shadow: var(--el-box-shadow);
    overflow: hidden;
  }

  .collapse-action {
    position: absolute;
    bottom: 12px;
    left: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    border: 0;
    border-radius: 8px;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
    cursor: pointer;
    transform: translateX(-50%);
    transition:
      color 0.2s ease,
      background-color 0.2s ease;

    :deep(.svg-icon) {
      width: 20px;
      height: 20px;
    }

    &:hover {
      background: var(--el-fill-color);
      color: var(--el-color-primary);
    }

    #{$theme-default} {
      border-radius: 50%;
      background: var(--el-color-primary);
      color: #fff;
      box-shadow: 0 4px 12px rgba(var(--el-color-primary-rgb), 0.24);

      &:hover {
        background: var(--el-color-primary-dark-2);
        color: #fff;
      }
    }
  }
}
.layout-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  height: 100%;
  overflow-y: auto;
  position: relative;
  z-index: 1;

  padding: 0 24px;

  #{$theme-default} {
    padding-bottom: 24px;
  }

  #{$theme-argon} {
    padding-bottom: 12px;
  }
}
.layout-page.without-breadcrumb {
  #{$theme-argon} {
    padding-top: 12px;
  }
}
</style>

<i18n lang="yaml">
en:
  header: Header
zh-CN:
  header: 头部
</i18n>
