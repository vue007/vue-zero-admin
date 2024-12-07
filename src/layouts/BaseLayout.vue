<template>
  <div>
    <header class="layout-header">
      <div class="header-left mr-auto" id="header-left">
        <div class="app-title">{{ t('header') }}</div>
      </div>

      <div class="header-right" id="header-right" />
    </header>

    <section class="layout-body">
      <aside class="layout-aside" id="layout-aside"></aside>
      <div class="layout-page">
        <router-view v-slot="{ route, Component: Comp }">
          <keep-alive :max="10">
            <component v-if="needKeep" :is="Comp" ref="pageRef" :key="route.path" />
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

const { t } = useI18nLocal()

const needKeep = computed(() => false) // add keep-alive toggle logic
const pageRef = ref(null)

const actionsPosition = '#header-right'
const menuPosition = '#layout-aside'

onMounted(() => {
  console.log(t('header'))
})
</script>

<style lang="scss" scoped>
$header-height: 64px;
.layout-header {
  @apply: fixed top-0 left-0 w-100vw z-10;
  @apply: flex justify-between items-center;

  padding: 0 30px;
  padding-right: 30px;
  padding-left: 40px;

  font-size: 32px;
  height: $header-height;
  background-color: var(--el-color-primary-light-9);
  box-shadow: var(--el-box-shadow);

  #{$size-large} {
    height: $header-height + 10px;
  }
  #{$size-small} {
    height: $header-height - 10px;
  }

  .app-title {
    #{$size-large} {
      font-size: 1.2em;
    }
    #{$size-small} {
      font-size: 0.8em;
    }
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
}
.layout-aside {
  width: 216px;
  height: 100vh;
  background-color: var(--el-color-primary-light-8);
}
.layout-page {
  flex: 1;
  height: 100vh;
  overflow-y: auto;

  padding: 10px;
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
