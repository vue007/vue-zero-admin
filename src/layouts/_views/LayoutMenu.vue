<!-- <template>
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
</template> -->
<template>
  <Teleport :to="props.to" defer>
    <el-menu
      class="layout-menu"
      :defaultActive="menu.active"
      :collapse="menu.collapse"
      :collapse-transition="false"
      @select="handleMenuSelect"
      router
    >
      <LayoutMenuItem v-for="item in menuList" v-bind="item" :key="item.path"></LayoutMenuItem>
    </el-menu>
  </Teleport>
</template>

<script setup lang="tsx">
import { useBaseStore } from '@/stores/base.module'

const LayoutMenuItem = (props) =>
  props?.children?.length ? (
    <el-sub-menu index={props.path}>
      {{
        title: <LayoutMenuItemSpan {...props} />,
        default: props.children.map((item) => (
          <LayoutMenuItem key={item.path} {...item} path={`${props.path}/${item.path}`} />
        )),
      }}
    </el-sub-menu>
  ) : (
    <el-menu-item index={props.path}>
      <LayoutMenuItemSpan {...props} />
    </el-menu-item>
  )

const LayoutMenuItemSpan = (props) => (
  <>
    {props.meta?.icon ? (
      <el-icon>
        <svg-icon name={props.meta.icon} />
      </el-icon>
    ) : (
      <span class='menu-item-dot' aria-hidden='true' />
    )}
    <span>{props.meta?.title}</span>
  </>
)

const { t } = useI18nLocal()
const route = useRoute()
const baseStore = useBaseStore()
const { menu, setting } = baseStore
const filterVisibleMenus = (routes: any[] = []): any[] =>
  routes
    .filter((item) => !item.hidden)
    .map((item) => ({ ...item, children: filterVisibleMenus(item.children) }))
const menuList = computed(() => filterVisibleMenus(menu.treeList))

const props = defineProps({
  to: { type: String, default: '#layout-aside' },
})

const handleMenuSelect = () => {}

watch(
  () => [route.path, menu.routeMeta[route.path]],
  () => {
    const currentMeta = menu.routeMeta[route.path] || route.meta
    const activeMenu = currentMeta?.activeMenu
    const path = typeof activeMenu === 'string' ? activeMenu : route.meta?.isTab ? route.matched[0].path : route.path
    menu.setActive(path)
    menu.setBreadcrumb((currentMeta?.breadcrumb || []) as string[])
  },
  { immediate: true },
)

onMounted(() => {
  setting.fetchUserInfo().then(() => {
    menu.initMenuList()
  })
})
</script>

<style lang="scss" scoped>
.layout-menu {
  --el-menu-text-color: var(--el-text-color-secondary);
  --el-menu-hover-text-color: var(--el-text-color-primary);
  --el-menu-hover-bg-color: var(--el-fill-color-light);

  box-sizing: border-box;
  width: 100%;
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

  :deep(.el-menu-item:hover),
  :deep(.el-sub-menu__title:hover) {
    background-color: var(--el-menu-hover-bg-color);
    color: var(--el-menu-hover-text-color);
  }

  :deep(.el-sub-menu.is-active > .el-sub-menu__title) {
    color: var(--el-menu-active-color);
  }

  :deep(.el-menu-item.is-active) {
    background-color: var(--el-color-primary);
    color: #fff;
    box-shadow: 0 10px 15px rgba(var(--el-color-primary-rgb), 0.08);
  }

  #{$theme-default} {
    --el-menu-base-level-padding: 24px;
    --el-menu-level-padding: 16px;
    --el-menu-icon-width: 24px;

    margin-top: 16px;

    :deep(.el-menu-item),
    :deep(.el-sub-menu__title) {
      height: var(--el-menu-item-height);
      margin: 2px 12px;
      border-radius: 4px;
      line-height: var(--el-menu-item-height);
    }

    :deep(.el-menu-item > .el-icon),
    :deep(.el-sub-menu__title > .el-icon:not(.el-sub-menu__icon-arrow)) {
      width: 24px;
      height: 24px;
      margin-right: 16px;
      color: inherit;
      font-size: 24px;

      svg {
        width: 24px;
        height: 24px;
      }
    }
  }

  #{$theme-argon} {
    padding: 8px;

    :deep(.el-menu-item),
    :deep(.el-sub-menu__title) {
      margin: 2px 0;
      border-radius: 8px;
      height: var(--el-menu-sub-item-height);
      line-height: var(--el-menu-sub-item-height);
    }

    :deep(.el-menu-item > .el-icon),
    :deep(.el-sub-menu__title > .el-icon:not(.el-sub-menu__icon-arrow)) {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      margin-right: 10px;
      border-radius: 8px;
      background: color-mix(in srgb, currentColor 8%, transparent);
      box-shadow: var(--el-box-shadow-lighter);
      color: inherit;
      font-size: 18px;

      svg {
        width: 18px;
        height: 18px;
      }
    }

    :deep(.el-sub-menu__icon-arrow) {
      top: 50%;
      right: 14px;
      width: 16px;
      height: 16px;
      margin: -8px 0 0;
      padding: 0;
      border-radius: 0;
      background: transparent;
      box-shadow: none;
      color: inherit;
      font-size: 16px;

      svg {
        width: 16px;
        height: 16px;
      }
    }

    :deep(.el-menu-item.is-active) {
      background: transparent;
      color: var(--el-menu-active-color);
      box-shadow: none;

      > .el-icon {
        background: var(--el-color-primary);
        color: #fff;
        box-shadow: var(--el-box-shadow-light);
      }
    }
  }

  &.el-menu--collapse.el-menu--collapse {
    width: 100%;
    padding: 4px;

    :deep(.el-menu-item.el-menu-item),
    :deep(.el-sub-menu__title.el-sub-menu__title) {
      justify-content: center;
      height: var(--el-menu-item-height);
      margin: 2px 4px;
      padding: 0 !important;
      line-height: var(--el-menu-item-height);
    }

    :deep(.el-menu-item > .el-icon),
    :deep(.el-sub-menu__title > .el-icon:not(.el-sub-menu__icon-arrow)) {
      flex: 0 0 40px;
      width: 40px;
      height: 40px;
      margin-right: auto;
      margin-left: auto;
    }

    :deep(.menu-item-dot.menu-item-dot) {
      display: block;
      visibility: visible;
      flex: 0 0 6px;
      width: 6px;
      height: 6px;
      margin-right: auto;
      margin-left: auto;
    }

    :deep(.el-sub-menu__icon-arrow) {
      display: none;
    }

    :deep(.el-sub-menu.is-active > .el-sub-menu__title > .el-icon:not(.el-sub-menu__icon-arrow)) {
      box-sizing: border-box;
      border: 1px solid var(--el-color-primary);
      border-radius: var(--el-border-radius-base);
      background: transparent;
      color: var(--el-color-primary);
      box-shadow: none;
    }

    :deep(.el-sub-menu.is-active > .el-sub-menu__title > .menu-item-dot) {
      color: var(--el-color-primary);
      box-shadow: 0 0 0 6px rgba(var(--el-color-primary-rgb), 0.16);
    }
  }

  :deep(.menu-item-dot) {
    flex: 0 0 auto;
    width: 6px;
    height: 6px;
    margin-right: 16px;
    border-radius: 50%;
    background-color: currentColor;
    opacity: 0.82;
  }
}
</style>
