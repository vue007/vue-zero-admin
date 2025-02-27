<template>
  <div class="view-page-form-card">
    <div class="clalist card-title">{{ props.title }}</div>
    <el-card class="clalist" shadow="never" v-bind="$attrs">
      <slot></slot>
    </el-card>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: { type: String, default: '' },
})
</script>

<style lang="scss" scoped>
.view-page-form-card {
  .clalist {
    @apply: w-80vw max-w-816 min-w-500 lt-sm:min-w-320;
  }

  .card-title {
    border-left: 3px solid var(--el-color-primary);
    height: 16px;
    line-height: 16px;
    padding-left: 8px;
    font-weight: bold;
    margin-bottom: 24px;
  }

  & + & {
    margin-top: 16px;
  }
}
</style>
