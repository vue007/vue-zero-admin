<template>
  <div class="view-page">
    <header class="page-header" v-if="$slots['header']">
      <slot name="header"></slot>
    </header>
    <section class="page-content">
      <slot></slot>
      <div class="content-footer">
        <slot name="content-footer"></slot>
      </div>
    </section>
    <div class="page-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.view-page {
  background: var(--el-bg-color);
  padding: 24px;

  #{$scheme-argon} {
    border-radius: var(--el-border-radius-base);
    box-shadow: var(--el-box-shadow);
  }

  .content-footer {
    display: flex;
    margin-top: 10px;
  }
}
</style>
