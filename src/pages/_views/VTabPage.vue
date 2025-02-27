<template>
  <VPage class="pt-6!">
    <template #header>
      <el-tabs v-model="indexTab" @tab-click="handleTabClick">
        <el-tab-pane
          v-for="(tab, index) in authTabs"
          :key="index"
          :label="tab.label"
          :name="`${props.prefix}${tab.path === 'index' ? '' : '-' + tab.path}`"
        ></el-tab-pane>
      </el-tabs>
    </template>

    <slot></slot>
    <RouterView />
  </VPage>
</template>

<script lang="ts" setup>
import type { TabsPaneContext } from 'element-plus'

type TabPageItem = {
  label: string
  path: string
}

const router = useRouter()
const route = useRoute()

const props = defineProps({
  tabs: { type: Array<TabPageItem>, default: () => [] },
  prefix: { type: String, required: true },
  id: { type: Number, default: null },
})

const authTabs = computed(() => props.tabs)

const indexTab = ref('')
onMounted(() => {
  refresh()
  router.push(route.path)
})

const refresh = () => {
  indexTab.value = route.name?.toString() || ''
}

watch(
  () => route.path,
  () => refresh(),
)
const handleTabClick = (tab: TabsPaneContext) => {
  if (tab.props.name === indexTab.value) return
  indexTab.value = tab.props.label.toString()
  router.push({ name: tab.props.name?.toString().replace(/-index$/, '') })
}
</script>
<style lang="scss" scoped>
:deep(.el-tabs__header) {
  margin-bottom: 0;
}
</style>
