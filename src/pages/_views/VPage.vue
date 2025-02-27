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
  background: #fff;
  padding: 24px;

  #{ $theme-dark } {
    background: #141414;
  }

  .content-footer {
    display: flex;
    margin-top: 10px;
  }
}
</style>
