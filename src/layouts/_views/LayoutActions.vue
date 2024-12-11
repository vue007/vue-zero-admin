<template>
  <Teleport :to="props.to" defer>
    <template v-for="action in actions.includes('ALL') ? ACTION_LIST : actions" :key="action">
      <div v-if="'fullscreen' === action" class="action cursor-pointer" v-tooltip="'full screen'">
        <svg-icon name="ze-full-screen" />
      </div>

      <el-popover v-if="'size' === action" trigger="hover">
        <template #reference>
          <div class="action"><svg-icon name="ze-font-size" /></div>
        </template>
        <SizeCheckTag value="large" text="base.size.large" />
        <SizeCheckTag value="default" text="base.size.normal" />
        <SizeCheckTag value="small" text="base.size.small" />
      </el-popover>

      <el-popover v-if="'theme' === action" trigger="hover">
        <template #reference>
          <div class="action cursor-pointer" @click="toggleTheme">
            <svg-icon :name="themeIcon" />
          </div>
        </template>
        <ThemeCheckTag value="light" icon="ze-sunny" text="base.theme.light" />
        <ThemeCheckTag value="dark" icon="ze-moon" text="base.theme.dark" />
        <ThemeCheckTag value="auto" icon="ze-laptop" text="base.theme.auto" />
      </el-popover>

      <el-popover v-if="'locale' === action" trigger="hover">
        <template #reference>
          <div class="action"><svg-icon name="ze-language" /></div>
        </template>
        <LocaleCheckTag value="zh-CN" text="简中" />
        <LocaleCheckTag value="zh-TW" text="繁中" />
        <LocaleCheckTag value="en" text="English" />
      </el-popover>

      <el-dropdown v-if="'dropdown' === action" trigger="click">
        <div class="flex items-center">
          <el-avatar class="cursor-pointer mr-8 w-28! h28! lt-sm:w-24! lt-sm:h-24!" shape="circle" src=""></el-avatar>
          <span class="w-84 color-[var(--el-text-color-primary)] lt-sm:hidden">Admin</span>

          <div class="ml-10 ml-auto lt-sm:hidden">
            <svg-icon name="el-arrow-down-bold" />
          </div>
        </div>

        <template #dropdown>
          <el-dropdown-menu class="min-w-140">
            <!-- <el-dropdown-item @click="() => $router.push('/sys/user/setting')">
            <svg-icon class="mr-10" name="el-setting" />
            个人设置
          </el-dropdown-item> -->
            <el-dropdown-item divided @click="() => $router.push('/login')">
              <svg-icon class="mr-10" name="el-switch-button" />
              退出
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>
  </Teleport>
</template>

<script setup lang="tsx">
import { useBaseStore } from '@/stores/base.module'
import { includes } from 'es-toolkit/compat'

const { t } = useI18nLocal()
const baseStore = useBaseStore()
const { setting } = baseStore

const ACTION_LIST = ['ALL', 'fullscreen', 'size', 'locale', 'theme', 'dropdown'] as const
export type ActionType = (typeof ACTION_LIST)[number]
const props = defineProps({
  to: { type: String, default: '#header-right' },

  actions: {
    type: Array as PropType<Array<ActionType>>,
    default: () => 'ALL',
  },
})

const hasAction = (action: ActionType) => includes(props.actions, action) || includes(props.actions, 'ALL')

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
  font-size: 20px;
  margin-right: 12px;

  #{$size-large} {
    font-size: 24px;
  }
  #{$size-small} {
    font-size: 18px;
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
