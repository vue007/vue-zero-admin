<template>
  <div class="view-page">
    <header class="page-header" v-if="$slots['header']">
      <slot name="header"></slot>
    </header>
    <section class="page-content">
      <slot></slot>
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

<style lang="scss" scoped></style>
