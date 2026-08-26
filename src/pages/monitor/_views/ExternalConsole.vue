<template>
  <VPage class="external-console-page p-0!">
    <template #header>
      <div class="flex items-center justify-between gap-12 w-full px-20 pt-16">
        <div>
          <div class="text-16 font-600">{{ title }}</div>
          <div class="mt-4 text-13 color-[var(--el-text-color-secondary)]">{{ description }}</div>
        </div>
        <ze-actions
          :actions="[
            { icon: 'el-refresh', content: t('reload'), onClick: reload },
            { icon: 'el-top-right', content: t('openWindow'), onClick: openWindow },
          ]"
        />
      </div>
    </template>

    <div v-if="url" v-loading="loading" class="console-container">
      <iframe
        v-if="frameUrl"
        :key="`${frameKey}:${frameUrl}`"
        class="console-frame"
        :src="frameUrl"
        :title="title"
        referrerpolicy="same-origin"
        @load="loading = false"
      />
    </div>
    <el-empty v-else :description="t('notConfigured')" />
  </VPage>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  description: string
  url: string
}>()

const { t } = useI18nLocal()
const loading = ref(true)
const frameKey = ref(0)
const frameUrl = ref('')
let loadSequence = 0

const reload = async () => {
  const sequence = ++loadSequence
  loading.value = true
  frameUrl.value = ''
  await nextTick()
  if (sequence !== loadSequence) return

  if (!props.url) {
    loading.value = false
    return
  }

  frameKey.value += 1
  frameUrl.value = props.url
}

watch(() => props.url, reload, { immediate: true })

onActivated(() => {
  if (frameUrl.value) reload()
})

const openWindow = () => {
  if (props.url) window.open(props.url, '_blank', 'noopener,noreferrer')
}
</script>

<style scoped lang="scss">
.external-console-page {
  overflow: hidden;
}

.console-container {
  margin-top: 14px;
  height: calc(100vh - 174px);
  min-height: 520px;
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--el-border-radius-base);
  overflow: hidden;
}

.console-frame {
  display: block;
  width: 100%;
  height: 100%;
  background: var(--el-bg-color);
}
</style>

<i18n lang="yaml">
en:
  reload: 'Reload'
  openWindow: 'Open in new window'
  notConfigured: 'The console URL is not configured'
zh:
  reload: '重新加载'
  openWindow: '新窗口打开'
  notConfigured: '尚未配置控制台地址'
</i18n>
