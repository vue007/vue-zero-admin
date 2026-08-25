<template>
  <div class="view-page-form-card" :class="{ 'is-fluid': props.fluid }" v-bind="$attrs">
    <div class="card-section card-title">{{ props.title }}</div>
    <el-card class="card-section card-body" shadow="never">
      <slot></slot>
    </el-card>
  </div>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = defineProps({
  title: { type: String, default: '' },
  fluid: { type: Boolean, default: false },
})
</script>

<style lang="scss" scoped>
.view-page-form-card {
  display: flex;
  min-width: 0;
  flex-direction: column;

  .card-section {
    @apply: w-80vw max-w-816 min-w-500 lt-sm:min-w-320;
  }

  &.is-fluid {
    width: 100%;

    .card-section {
      width: 100%;
      min-width: 0;
      max-width: none;
    }
  }

  .card-body {
    flex: 1;
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
