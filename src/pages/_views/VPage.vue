<template>
  <div class="view-page">
    <header class="page-header" :class="props.headerClass" v-if="$slots['header']">
      <slot name="header"></slot>
    </header>
    <section class="page-content" :class="props.contentClass">
      <slot></slot>
      <div v-if="$slots['content-footer']" class="content-footer">
        <slot name="content-footer"></slot>
      </div>
    </section>
    <div v-if="$slots.footer" class="page-footer" :class="props.footerClass">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  headerClass?: string
  contentClass?: string
  footerClass?: string
}>()
</script>

<style lang="scss" scoped>
.view-page {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  min-height: 0;
  background: var(--el-bg-color);
  padding: 24px;

  #{$theme-argon} {
    border-radius: var(--ze-card-radius, var(--el-border-radius-base));
    box-shadow: var(--el-box-shadow);
  }

  .page-header,
  .page-footer {
    flex: 0 0 auto;
    min-width: 0;
  }

  .page-content {
    flex: 1 1 auto;
    min-width: 0;
    min-height: 0;
    overflow: auto;
  }

  .content-footer {
    display: flex;
    margin-top: 10px;
  }
}
</style>
