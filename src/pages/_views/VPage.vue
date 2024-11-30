<template>
  <div class="view-page">
    <header class="page-header" v-if="$slots['header']">
      <slot name="header"></slot>
    </header>

    <section class="page-content">
      <slot></slot>

      <div class="page-content-footer">
        <slot name="content-footer"></slot>
      </div>
    </section>

    <div class="page-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
// const exportColumns = ref<any>([])
// provide('VPage_exportColumns', exportColumns)
</script>

<style lang="scss" scoped>
.view-page {
  padding: 10px;
  .page-header {
    @apply: flex justify-between;
    margin-bottom: 10px;
  }
  .page-content-footer {
    @apply: flex justify-end;
    margin-top: 20px;
  }
}
</style>
