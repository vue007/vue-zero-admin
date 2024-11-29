<template>
  <Teleport :to="props.to" defer>
    <div class="action cursor-pointer" v-tooltip="'full screen'">
      <svg-icon name="ze-full-screen" />
    </div>
    <div class="action" ref="sizeBtnRef"><svg-icon name="ze-font-size" /></div>
    <div class="action" ref="localeBtnRef"><svg-icon name="ze-language" /></div>
    <div class="action cursor-pointer" ref="themeBtnRef" @click="toggleTheme">
      <svg-icon :name="themeIcon" />
    </div>
    <div class="action cursor-pointer" ref="settingBtnRef" v-tooltip="'setting'"><svg-icon name="ze-setting" /></div>
    <el-avatar class="action cursor-pointer" :size="setting.size" shape="circle" src=""></el-avatar>
  </Teleport>

  <el-popover ref="sizePopRef" :virtual-ref="sizeBtnRef" virtual-triggering trigger="hover">
    <SizeCheckTag value="large" text="base.size.large" />
    <SizeCheckTag value="default" text="base.size.normal" />
    <SizeCheckTag value="small" text="base.size.small" />
  </el-popover>

  <el-popover ref="localePopRef" :virtual-ref="localeBtnRef" virtual-triggering trigger="hover">
    <LocaleCheckTag value="zh-CN" text="简中" />
    <LocaleCheckTag value="zh-TW" text="繁中" />
    <LocaleCheckTag value="en" text="English" />
  </el-popover>

  <el-popover ref="themePopRef" :virtual-ref="themeBtnRef" virtual-triggering trigger="hover">
    <ThemeCheckTag value="light" icon="ze-sunny" text="base.theme.light" />
    <ThemeCheckTag value="dark" icon="ze-moon" text="base.theme.dark" />
    <ThemeCheckTag value="auto" icon="ze-laptop" text="base.theme.auto" />
  </el-popover>
</template>

<script setup lang="tsx">
import { useBaseStore } from '@/stores/base.module'

const { t } = useI18nLocal()
const baseStore = useBaseStore()
const { setting } = baseStore

const props = defineProps({
  to: { type: String, default: '#header-right' },
})

const [localePopRef, localeBtnRef] = [ref(), ref()]
const [themePopRef, themeBtnRef] = [ref(), ref()]
const [sizePopRef, sizeBtnRef] = [ref(), ref()]

const ThemeCheckTag = ({ text, value, icon }) => (
  <el-check-tag class='check-item' checked={setting.theme === value} onChange={() => setting.setTheme(value)}>
    <svg-icon v-show={icon} class='mr-12' name={icon} />
    {t(text)}
  </el-check-tag>
)
const LocaleCheckTag = ({ text, value }) => (
  <el-check-tag class={`check-item`} checked={setting.local === value} onChange={() => setting.setLocale(value)}>
    {text}
  </el-check-tag>
)
const SizeCheckTag = ({ text, value }) => (
  <el-check-tag
    class='check-item items-start'
    style={{ fontSize: `var(--el-font-size-${value})` }}
    checked={setting.size === value}
    onChange={() => setting.setSize(value)}
    v-html={t(text)}
  />
)

const themeIcon = computed(() => {
  if ('light' === setting.theme) return 'el-sunny'
  if ('dark' === setting.theme) return 'el-moon'
  if ('auto' === setting.theme) return 'el-platform'
  return 'el-sunny'
})
const toggleTheme = () => {
  if ('auto' === setting.theme) return
  if ('light' === setting.theme) return setting.setTheme('dark')
  if ('dark' === setting.theme) return setting.setTheme('light')
}
</script>

<style lang="scss" scoped>
.action {
  font-size: 24px;
  margin-right: 12px;

  #{$size-large} {
    font-size: 28px;
  }
  #{$size-small} {
    font-size: 20px;
  }
}
.check-item {
  width: 100%;
  margin-bottom: 5px;
  padding: 0.4em 0.8em;
  @apply: flex-center;

  #{$size-large} {
    font-size: var(--el-font-size-large);
  }
  #{$size-small} {
    font-size: var(--el-font-size-extra-small);
  }
}
</style>
