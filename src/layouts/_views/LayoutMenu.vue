<template>
  <Teleport :to="props.to" defer>
    <div class="action" ref="sizeBtnRef"><SvgIcon name="ze-font-size" /></div>
    <div class="action" ref="localeBtnRef"><SvgIcon name="ze-language" /></div>
    <div class="action" ref="themeBtnRef"><SvgIcon name="ze-theme" /></div>
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

  <el-popover ref="themePopRef" :virtual-ref="themeBtnRef" virtual-triggering trigger="hover" width="100">
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

const ThemeCheckTag = (props) => (
  <el-check-tag class='min-w-128 mb-5' checked={setting.theme == props.value} onChange={() => setting.setTheme(props.value)} size={setting.size}>
    <svg-icon v-show={props.icon} class='mr-8' name={props.icon} />
    {t(props.text)}
  </el-check-tag>
)
const LocaleCheckTag = (props) => (
  <el-check-tag class='min-w-128 mb-5' checked={setting.local == props.value} onChange={() => setting.setLocale(props.value)} size={setting.size}>
    {props.text}
  </el-check-tag>
)
const SizeCheckTag = (props) => (
  <el-check-tag class='min-w-128 mb-5' checked={setting.size == props.value} onChange={() => setting.setSize(props.value)} size={props.value}>
    {t(props.text)}
  </el-check-tag>
)
</script>

<style lang="scss" scoped>
.action {
  font-size: 28px;
  margin-right: 10px;
}
</style>
