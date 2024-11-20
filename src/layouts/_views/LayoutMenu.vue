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
        <template #title>Dashboard</template>
      </el-menu-item>

      <el-sub-menu index="/doc">
        <template #title>Demo</template>
        <el-menu-item index="/doc/icon">SvgIcon</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </Teleport>
</template>

<script setup lang="tsx">
import { useBaseStore } from '@/stores/base.module'

const { t } = useI18nLocal()
const baseStore = useBaseStore()
const { setting, menu } = baseStore
const route = useRoute()
const router = useRouter()

const props = defineProps({
  to: { type: String, default: '#layout-aside' },
})

const handleMenuSelect = () => {}
onMounted(() => {})
router.afterEach(() => {
  menu.active = route.path
})
</script>

<style lang="scss" scoped>
.layout-menu {
  border-right: unset;
  background-color: unset;
}
</style>
