<template>
  <div class="view-aside-page">
    <aside v-if="props.showAside && !isSmallScreen" class="page-aside" :style="{ width: asideWidthValue }">
      <div class="page-aside-content">
        <slot name="aside"></slot>
      </div>
    </aside>

    <el-drawer
      v-if="props.showAside && isSmallScreen"
      v-model="mobileAsideOpen"
      class="aside-drawer"
      direction="ltr"
      :size="drawerSize"
      :with-header="false"
    >
      <div class="aside-drawer-content">
        <slot name="aside"></slot>
      </div>
    </el-drawer>

    <VPage class="aside-body" content-class="aside-body-content">
      <template v-if="$slots.header || (props.showAside && isSmallScreen)" #header>
        <div class="aside-page-header">
          <el-button
            v-if="props.showAside && isSmallScreen"
            class="aside-toggle-button"
            text
            circle
            aria-label="打开侧栏"
            @click="mobileAsideOpen = true"
          >
            <svg-icon name="el-menu" />
          </el-button>
          <slot name="header"></slot>
        </div>
      </template>

      <slot></slot>

      <template v-if="$slots['content-footer']" #content-footer>
        <slot name="content-footer"></slot>
      </template>

      <template v-if="$slots.footer" #footer>
        <slot name="footer"></slot>
      </template>
    </VPage>
  </div>
</template>

<script lang="ts" setup>
import { useMediaQuery } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    asideWidth?: number
    showAside?: boolean
  }>(),
  {
    asideWidth: 240,
    showAside: true,
  },
)

const mobileAsideOpen = defineModel<boolean>('asideOpen', { default: false })
const isSmallScreen = useMediaQuery('(max-width: 767px)')
const asideWidthValue = computed(() => `${props.asideWidth}px`)
const drawerSize = computed(() => `${Math.min(props.asideWidth + 32, 320)}px`)
</script>

<style lang="scss" scoped>
.view-aside-page {
  display: flex;
  flex: 1 1 auto;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  background-color: var(--el-bg-color);

  #{$theme-default} {
    border: 1px solid var(--el-border-color-extra-light);
    border-radius: var(--ze-card-radius, 8px);
    box-shadow: var(--el-box-shadow-light);
  }

  #{$theme-argon} {
    border-radius: var(--ze-card-radius, var(--el-border-radius-base));
    box-shadow: var(--el-box-shadow);
  }

  .page-aside {
    flex: 0 0 auto;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
    border-right: 1px solid var(--el-border-color-lighter);

    .page-aside-content {
      box-sizing: border-box;
      height: 100%;
      min-height: 0;
      padding: 20px 16px;
      overflow: auto;
    }

    :deep(.el-tree-node__content) {
      min-height: 32px;
      border-radius: 6px;
    }
  }

  .aside-body {
    flex: 1 1 auto;
    width: auto;
    min-width: 0;
    min-height: 0;
    overflow: hidden;

    #{$theme-argon} {
      border-radius: 0;
      box-shadow: none;
    }

    #{$theme-default} {
      border: 0;
      border-radius: 0;
      box-shadow: none;
    }

    :deep(.aside-body-content) {
      display: flex;
      flex: 1 1 auto;
      flex-direction: column;
      min-width: 0;
      min-height: 0;
      overflow: auto;
    }
  }

  .aside-page-header {
    display: flex;
    align-items: flex-start;
    width: 100%;
    min-width: 0;
  }

  .aside-toggle-button {
    flex: 0 0 auto;
    margin-right: 8px;
  }
}

.aside-drawer-content {
  box-sizing: border-box;
  height: 100%;
  padding: 20px 16px;
  overflow: auto;
}

:global(.aside-drawer .el-drawer__body) {
  padding: 0;
}
</style>
