<template>
  <el-container>
    <el-header class="layout-header">
      <div class="mr-auto">{{ t('header') }}</div>

      <el-radio-group v-model="baseStore.setting.size" @change="setSize" class="mr-10">
        <el-radio-button :label="$t('base.size.large')" value="large" size="large" />
        <el-radio-button :label="$t('base.size.normal')" value="default" size="default" />
        <el-radio-button :label="$t('base.size.small')" value="small" size="small" />
      </el-radio-group>

      <el-radio-group v-model="baseStore.setting.local" @change="setLocale" class="mr-10">
        <el-radio-button label="简中" value="zh-CN" />
        <el-radio-button label="繁中" value="zh-TW" />
        <el-radio-button label="English" value="en" />
      </el-radio-group>

      <el-radio-group v-model="baseStore.setting.theme" @change="setTheme">
        <el-radio-button :label="$t('base.theme.light')" value="light" />
        <el-radio-button :label="$t('base.theme.dark')" value="dark" />
        <el-radio-button :label="$t('base.theme.auto')" value="auto" />
      </el-radio-group>
    </el-header>

    <el-main class="layout-body">
      <router-view v-slot="{ route, Component: Page }">
        <keep-alive :max="10">
          <component v-if="needKeep" :is="Page" ref="pageRef" :key="route.path" />
        </keep-alive>
        <component v-if="!needKeep" :is="Page" ref="pageRef" :key="route.path" />
      </router-view>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { useBaseStore } from '@/stores/base.module'

// const { t } = useI18n({ useScope: 'local' })
const { t } = useI18nLocal()
const baseStore = useBaseStore()

const setLocale = (locale) => baseStore.setLocale(locale)
const setTheme = (theme) => baseStore.setTheme(theme)
const setSize = (size) => baseStore.setSize(size)

const needKeep = computed(() => false) // add keep-alive toggle logic
const pageRef = ref(null)

onMounted(() => {
  console.log(t('header'))
})
</script>

<style lang="scss" scoped>
$header-height: 60px;

.layout-header {
  @apply: flex justify-between items-center;
  @apply: fixed top-0 left-0 w-full z-10;
  font-size: 32px;
  height: $header-height;
  background-color: var(--el-color-primary-light-9);
}

.layout-body {
  padding-top: $header-height;
}
</style>

<i18n lang="yaml">
en:
  header: Header
zh-CN:
  header: 头部
zh-TW:
  header: 頭部
</i18n>
