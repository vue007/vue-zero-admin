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
    ) : null}
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
      background: var(--el-bg-color-overlay);
      box-shadow: var(--el-box-shadow-lighter);
      color: var(--el-color-primary);
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
      color: var(--el-text-color-secondary);
      font-size: 16px;

      svg {
        width: 16px;
        height: 16px;
      }
    }

    &.el-menu--collapse {
      width: 100%;

      :deep(.el-menu-item),
      :deep(.el-sub-menu__title) {
        display: flex;
        justify-content: center;
        padding: 0 !important;
      }

      :deep(.el-menu-item > .el-icon),
      :deep(.el-sub-menu__title > .el-icon:not(.el-sub-menu__icon-arrow)) {
        flex: 0 0 32px;
        margin-right: 0;
      }

      :deep(.el-menu-item > span),
      :deep(.el-sub-menu__title > span) {
        flex: 0 0 0;
        width: 0;
        min-width: 0;
        margin: 0;
      }

      :deep(.el-sub-menu__icon-arrow) {
        display: none;
      }
    }

    :deep(.el-menu-item.is-active) {
      background-color: var(--el-fill-color-light);
      color: var(--el-text-color-primary);

      .el-icon {
        background: var(--el-color-primary);
        color: #fff;
        box-shadow: var(--el-box-shadow-light);
      }

      span {
        color: var(--el-text-color-primary);
      }
    }
  }
}
</style>
