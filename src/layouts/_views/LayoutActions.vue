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

      <el-popover v-if="'scheme' === action" trigger="hover">
        <template #reference>
          <div class="action cursor-pointer" @click="toggleScheme">
            <svg-icon :name="schemeIcon" />
          </div>
        </template>
        <SchemeCheckTag value="light" icon="ze-sunny" text="base.scheme.light" />
        <SchemeCheckTag value="dark" icon="ze-moon" text="base.scheme.dark" />
        <SchemeCheckTag value="argon" icon="ze-theme" text="base.scheme.argon" />
        <SchemeCheckTag value="auto" icon="ze-laptop" text="base.scheme.auto" />
      </el-popover>

      <el-popover v-if="'locale' === action" trigger="hover">
        <template #reference>
          <div class="action"><svg-icon name="ze-language" /></div>
        </template>
        <LocaleCheckTag value="zh-CN" text="简中" />
        <LocaleCheckTag value="en" text="English" />
      </el-popover>

      <el-dropdown v-if="'dropdown' === action" trigger="click">
        <div class="flex items-center">
          <el-avatar
            class="cursor-pointer mr-8 w-28! h28! lt-sm:w-24! lt-sm:h-24!"
            shape="circle"
            :src="currentUser?.avatar || ''"
          />
          <span
            class="max-w-120 truncate color-[var(--el-text-color-primary)] lt-sm:hidden"
            :title="currentUserName"
          >
            {{ currentUserName }}
          </span>

          <div class="ml-10 ml-auto lt-sm:hidden">
            <svg-icon name="el-arrow-down-bold" />
          </div>
        </div>

        <template #dropdown>
          <el-dropdown-menu class="min-w-140">
            <el-dropdown-item @click="() => $router.push('/system/user/profile')">
              <svg-icon class="mr-10" name="el-user" />
              个人中心
            </el-dropdown-item>
            <el-dropdown-item divided @click="() => handleLogout()">
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
import { logout } from '@/api/base.api'
import { useBaseStore } from '@/stores/base.module'
import { includes } from 'es-toolkit/compat'

const { t } = useI18nLocal()
const baseStore = useBaseStore()
const { setting } = baseStore
const currentUser = computed(() => setting.userInfo.user)
const currentUserName = computed(() => currentUser.value?.userName || currentUser.value?.nickName || '-')

const ACTION_LIST = ['ALL', 'fullscreen', 'size', 'locale', 'scheme', 'dropdown'] as const
export type ActionType = (typeof ACTION_LIST)[number]
const props = defineProps({
  to: { type: String, default: '#header-right' },

  actions: {
    type: Array as PropType<Array<ActionType>>,
    default: () => 'ALL',
  },
})

const [, handleLogout] = useApi(logout, undefined, {
  onSuccess: () => {
    window.location.href = '/login'
  },
})

const hasAction = (action: ActionType) => includes(props.actions, action) || includes(props.actions, 'ALL')

const SchemeCheckTag = ({ text, value, icon }) => (
  <el-check-tag class='check-item' checked={setting.scheme === value} onChange={() => setting.setScheme(value)}>
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

const schemeIcon = computed(() => {
  if ('light' === setting.scheme) return 'el-sunny'
  if ('dark' === setting.scheme) return 'el-moon'
  if ('argon' === setting.scheme) return 'ze-theme'
  if ('auto' === setting.scheme) return 'el-platform'
  return 'el-sunny'
})
const toggleScheme = () => {
  if ('auto' === setting.scheme || 'argon' === setting.scheme) return
  if ('light' === setting.scheme) return setting.setScheme('dark')
  if ('dark' === setting.scheme) return setting.setScheme('light')
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
