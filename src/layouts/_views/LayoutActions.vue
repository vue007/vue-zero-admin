<template>
  <Teleport :to="props.to" defer>
    <template v-for="action in resolvedActions" :key="action">
      <div v-if="'fullscreen' === action" class="action cursor-pointer" v-tooltip="'full screen'">
        <svg-icon name="ze-full-screen" />
      </div>

      <el-popover v-if="'wallpaper' === action && showWallpaperAction" trigger="click" :width="300">
        <template #reference>
          <div class="action cursor-pointer"><svg-icon name="el-picture" /></div>
        </template>
        <div class="wallpaper-panel">
          <div class="wallpaper-panel-title">{{ t('base.wallpaper.title') }}</div>
          <div class="wallpaper-options">
            <button
              v-for="item in BASE_WALLPAPERS"
              :key="item"
              type="button"
              class="wallpaper-option"
              :class="{ 'is-selected': setting.wallpaper === item }"
              @click="setting.setWallpaper(item)"
            >
              <span class="wallpaper-preview" :class="`is-${item.toLowerCase()}`" />
              <span>{{ t(`base.wallpaper.${item}`) }}</span>
            </button>
          </div>
          <div class="wallpaper-opacity-header">
            <span>{{ t('base.wallpaper.opacity') }}</span>
            <span>{{ wallpaperOpacityPercent }}%</span>
          </div>
          <el-slider v-model="wallpaperOpacityPercent" :min="10" :max="100" :step="1" />
        </div>
      </el-popover>

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
        <SchemeCheckTag value="auto" icon="ze-laptop" text="base.scheme.auto" />
      </el-popover>

      <el-popover v-if="'theme' === action" trigger="hover" :width="288">
        <template #reference>
          <div class="action"><svg-icon name="ze-theme" /></div>
        </template>
        <section class="theme-section">
          <div class="theme-section-title">{{ t('base.theme.style') }}</div>
          <div class="theme-style-list">
            <ThemeCheckTag value="argon" text="base.theme.argon" />
            <ThemeCheckTag value="default" text="base.theme.default" />
          </div>
        </section>
        <el-divider class="theme-divider" />
        <section class="theme-section">
          <div class="theme-section-title">{{ t('base.theme.primary') }}</div>
          <div class="theme-color-list">
            <button
              v-for="item in BASE_THEME_COLORS"
              :key="item.name"
              type="button"
              class="theme-color-item"
              :class="{ 'is-selected': setting.themeColor === item.name }"
              :style="{ backgroundColor: item.color }"
              :title="item.name"
              :aria-label="item.name"
              :aria-pressed="setting.themeColor === item.name"
              @click="setting.setThemeColor(item.name)"
            />
          </div>
        </section>
        <el-divider class="theme-divider" />
        <section class="theme-section">
          <div class="theme-section-title">{{ t('base.theme.surface') }}</div>
          <div class="theme-color-list">
            <button
              v-for="item in BASE_THEME_SURFACES"
              :key="item.name"
              type="button"
              class="theme-color-item"
              :class="{ 'is-selected': resolvedThemeSurface === item.name }"
              :style="{ backgroundColor: item.palette[6] }"
              :title="item.name"
              :aria-label="item.name"
              :aria-pressed="resolvedThemeSurface === item.name"
              @click="setting.setThemeSurface(item.name)"
            />
          </div>
        </section>
      </el-popover>

      <el-popover v-if="'locale' === action" trigger="hover">
        <template #reference>
          <div class="action"><svg-icon name="ze-language" /></div>
        </template>
        <LocaleCheckTag value="zh-CN" text="简中" />
        <LocaleCheckTag value="en" text="English" />
      </el-popover>

      <el-dropdown v-if="'dropdown' === action" trigger="click">
        <div class="user-entry">
          <el-avatar
            class="user-entry__avatar w-28! h28! lt-sm:w-24! lt-sm:h-24!"
            shape="circle"
            :src="currentUser?.avatar || ''"
          />
          <span class="user-entry__name lt-sm:hidden" :title="currentUserName">
            {{ currentUserName }}
          </span>

          <div class="user-entry__arrow lt-sm:hidden">
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
import { BASE_WALLPAPERS, useBaseStore } from '@/stores/base.module'
import { BASE_THEME_COLORS, BASE_THEME_SURFACES, getThemeSurfaceFallback } from '@/styles/theme/theme-colors'
import { useMediaQuery } from '@vueuse/core'
import { includes } from 'es-toolkit/compat'

const { t } = useI18nLocal()
const baseStore = useBaseStore()
const route = useRoute()
const { setting } = baseStore
const currentUser = computed(() => setting.userInfo.user)
const currentUserName = computed(() => currentUser.value?.userName || currentUser.value?.nickName || '-')

const ACTION_LIST = ['ALL', 'fullscreen', 'size', 'wallpaper', 'locale', 'scheme', 'theme', 'dropdown'] as const
export type ActionType = (typeof ACTION_LIST)[number]
const props = defineProps({
  to: { type: String, default: '#header-right' },

  actions: {
    type: Array as PropType<Array<ActionType>>,
    default: () => ['ALL'],
  },
})

const DEFAULT_ACTION_LIST: ActionType[] = ['fullscreen', 'size', 'locale', 'scheme', 'theme', 'dropdown']
const resolvedActions = computed(() => (props.actions.includes('ALL') ? DEFAULT_ACTION_LIST : props.actions))
const showWallpaperAction = computed(() => route.path === '/login' || setting.theme === 'argon')

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
const ThemeCheckTag = ({ text, value }) => (
  <el-check-tag class='theme-style-item' checked={setting.theme === value} onChange={() => setting.setTheme(value)}>
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
  if ('auto' === setting.scheme) return 'el-platform'
  return 'el-sunny'
})
const systemDark = useMediaQuery('(prefers-color-scheme: dark)')
const resolvedThemeSurface = computed(() => {
  if (setting.themeSurface) return setting.themeSurface
  const isDark = setting.scheme === 'dark' || (setting.scheme === 'auto' && systemDark.value)
  return getThemeSurfaceFallback(setting.theme, isDark ? 'dark' : 'light')
})
const toggleScheme = () => {
  if ('auto' === setting.scheme) return
  if ('light' === setting.scheme) return setting.setScheme('dark')
  if ('dark' === setting.scheme) return setting.setScheme('light')
}

const wallpaperOpacityPercent = computed({
  get: () => Math.round(setting.wallpaperOpacity * 100),
  set: (value: number) => setting.setWallpaperOpacity(value / 100),
})
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
.user-entry {
  display: flex;
  align-items: center;
  min-width: 0;
  padding: 4px 7px 4px 4px;
  border: 1px solid transparent;
  border-radius: 999px;
  color: var(--el-text-color-primary);
  cursor: pointer;
  outline: none;
  transition: background-color 0.2s ease, border-color 0.2s ease;

  &:hover {
    border-color: var(--el-border-color-light);
    background: var(--el-fill-color-light);
  }

  #{$theme-argon} {
    color: #fff;

    &:hover {
      border-color: rgba(255, 255, 255, 0.22);
      background: rgba(255, 255, 255, 0.12);
    }
  }
}
.user-entry__avatar {
  flex: none;
  border: 2px solid color-mix(in srgb, currentColor 24%, transparent);
  background: var(--el-fill-color);
}
.user-entry__name {
  max-width: 120px;
  margin-left: 8px;
  overflow: hidden;
  color: inherit;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.user-entry__arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-left: 6px;
  color: inherit;
  opacity: 0.72;

  :deep(.svg-icon) {
    width: 12px;
    height: 12px;
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
.theme-divider {
  margin: 12px 0;
}
.theme-section-title {
  margin-bottom: 8px;
  color: var(--el-text-color-secondary);
  font-size: var(--el-font-size-small);
}
.theme-style-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}
.theme-style-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  padding: 7px 10px;
}
.theme-color-list {
  display: grid;
  grid-template-columns: repeat(8, 24px);
  gap: 8px;
}
.theme-color-item {
  width: 24px;
  height: 24px;
  padding: 0;
  border: 2px solid transparent;
  border-radius: 50%;
  box-shadow: 0 0 0 1px var(--el-border-color-light);
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: scale(1.08);
  }
  &.is-selected {
    box-shadow:
      0 0 0 2px var(--el-bg-color-overlay),
      0 0 0 4px var(--el-text-color-primary);
    transform: scale(1.08);
  }
}
.wallpaper-panel-title {
  margin-bottom: 10px;
  color: var(--el-text-color-primary);
  font-weight: 600;
}
.wallpaper-options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
.wallpaper-option {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 5px;
  border: 2px solid transparent;
  border-radius: 10px;
  background: var(--el-fill-color-extra-light);
  color: var(--el-text-color-regular);
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    border-color: var(--el-border-color);
    color: var(--el-text-color-primary);
    transform: translateY(-1px);
  }

  &.is-selected {
    border-color: var(--el-color-primary);
    color: var(--el-color-primary);
  }
}
.wallpaper-preview {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 7px;

  &.is-wavy {
    background:
      radial-gradient(90% 80% at 20% 85%, var(--el-color-primary-dark-2), transparent 64%),
      radial-gradient(85% 75% at 80% 15%, var(--el-color-primary-light-3), transparent 65%),
      linear-gradient(145deg, var(--el-color-primary-light-9), var(--el-color-primary));
  }

  &.is-ballpit {
    background:
      radial-gradient(circle at 18% 30%, #ec4899 0 12%, transparent 13%),
      radial-gradient(circle at 62% 62%, var(--el-color-primary) 0 18%, transparent 19%),
      radial-gradient(circle at 86% 25%, #06b6d4 0 14%, transparent 15%),
      radial-gradient(circle at 25% 88%, #f59e0b 0 10%, transparent 11%), var(--el-fill-color-light);
  }
}
.wallpaper-opacity-header {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  color: var(--el-text-color-secondary);
  font-size: var(--el-font-size-small);
}
</style>
