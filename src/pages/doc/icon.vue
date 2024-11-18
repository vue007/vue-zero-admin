<template>
  <div class="icon-list">
    <div
      class="icon-item"
      v-for="item in iconNameList.reverse()"
      :key="item"
      @click="() => copyIconName(item)"
    >
      <SvgIcon :name="item" />
      <span class="icon-name">{{ item }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

const iconModules = import.meta.glob('/src/icons/**/*.svg', { eager: true })

const iconNameList = Object.keys(iconModules).map((key) => {
  return key.replace('/src/icons/', '').replace('.svg', '').replace('/', '-')
})
const { copy } = useClipboard()
const copyIconName = (name) => {
  ElMessage.success('icon name is copid')
  copy(name)
}

onMounted(() => {
  console.log(iconNameList)
})
</script>

<style lang="scss" scoped>
.icon-list {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  font-size: 32px;

  .icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    box-sizing: padding-box;

    color: var(--el-text-color-primary);

    transition: transform 0.5s ease-in-out;

    &:hover {
      color: var(--el-color-primary);
      .svg-icon {
        transform: scale(1.2);
      }
    }
  }
  .icon-name {
    width: 60px;
    font-size: 12px;
    word-break: break-all;
    white-space: nowrap;
    // text-overflow: ellipsis;
    overflow: hidden;
    text-align: center;
  }
}
</style>
