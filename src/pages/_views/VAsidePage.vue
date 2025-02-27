<template>
  <div class="view-aside-page">
    <aside class="page-aside">
      <slot name="aside"></slot>
    </aside>

    <VPage class="aside-body">
      <template #header>
        <slot name="header"></slot>
      </template>

      <slot></slot>

      <template #content-footer>
        <slot name="content-footer"></slot>
      </template>

      <template #footer>
        <slot name="footer"></slot>
      </template>
    </VPage>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
$aside-width: 200px;

.view-aside-page {
  display: flex;
  background-color: var(--el-bg-color);

  .page-aside {
    min-width: $aside-width;
    flex-shrink: 0;
    border-right: 1px solid var(--el-border-color);

    padding-top: 24px;
    padding-right: 12px;

    @screen lt-sm {
      display: none;
    }

    :deep(.el-tree-node__content) {
      height: 30px;
    }
  }
  .aside-body {
    width: calc(100% - $aside-width);

    @screen lt-sm {
      width: 100%;
    }
  }
}
</style>
