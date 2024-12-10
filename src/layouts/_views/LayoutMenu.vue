<template>
  <Teleport :to="props.to" defer>
    <el-menu
      class="layout-menu"
      :defaultActive="menu.active"
      :collapse="menu.collapse"
      @select="handleMenuSelect"
      router
    >
      <el-menu-item index="/">
        <el-icon><svg-icon name="el-odometer" /></el-icon>
        <template #title>
          <span class="w-160">Dashboard</span>
        </template>
      </el-menu-item>

      <el-sub-menu index="/doc">
        <template #title>
          <el-icon><svg-icon name="el-cpu" /></el-icon>
          <span>Demo</span>
        </template>
        <el-menu-item index="/doc/icon">SvgIcon</el-menu-item>
        <el-menu-item index="/doc/modal">Modal</el-menu-item>
        <el-menu-item index="/doc/form">Form</el-menu-item>
        <el-menu-item index="/doc/table">Table</el-menu-item>
        <el-menu-item index="/doc/crud">CRUD</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </Teleport>
</template>

<script setup lang="tsx">
import { useBaseStore } from '@/stores/base.module'

const { t } = useI18nLocal()
const baseStore = useBaseStore()
const { menu } = baseStore
const route = useRoute()

const props = defineProps({
  to: { type: String, default: '#layout-aside' },
})

const handleMenuSelect = () => {}

watch(
  () => route.path,
  () => {
    let path = route.meta?.isTab ? route.matched[0].path : route.path
    menu.setActive(path)
  },
  { immediate: true },
)

onMounted(() => {})
</script>

<style lang="scss" scoped>
.layout-menu {
  border-right: unset;
  background-color: unset;
  margin-top: 12px;

  #{$size-large} {
    font-size: var(--el-font-size-large);
  }
  #{$size-small} {
    font-size: var(--el-font-size-extra-small);
  }
  :deep(.el-menu) {
    background-color: unset;
  }
}
</style>
