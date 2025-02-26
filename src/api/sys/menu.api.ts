import { fetch, type ApiPromise } from '../_fetch'
import type { MenuForm, MenuQuery, MenuTreeOption, MenuVO, RoleMenuTree } from './menu.type'

// 查询菜单列表
export function listMenu(query?: MenuQuery): ApiPromise<MenuVO[]> {
  return fetch({
    url: '/system/menu/list',
    method: 'get',
    params: query,
  })
}

// 查询菜单详细
export function getMenu(menuId: string | number): ApiPromise<MenuVO> {
  return fetch({
    url: '/system/menu/' + menuId,
    method: 'get',
  })
}

// 查询菜单下拉树结构
export function treeselect(): ApiPromise<MenuTreeOption[]> {
  return fetch({
    url: '/system/menu/treeselect',
    method: 'get',
  })
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect(roleId: string | number): ApiPromise<RoleMenuTree> {
  return fetch({
    url: '/system/menu/roleMenuTreeselect/' + roleId,
    method: 'get',
  })
}

// 根据角色ID查询菜单下拉树结构
export function tenantPackageMenuTreeselect(packageId: string | number): ApiPromise<RoleMenuTree> {
  return fetch({
    url: '/system/menu/tenantPackageMenuTreeselect/' + packageId,
    method: 'get',
  })
}

// 新增菜单
export function addMenu(data: MenuForm): ApiPromise<void> {
  return fetch({
    url: '/system/menu',
    method: 'post',
    data: data,
  })
}

// 修改菜单
export function updateMenu(data: MenuForm): ApiPromise<void> {
  return fetch({
    url: '/system/menu',
    method: 'put',
    data: data,
  })
}

// 删除菜单
export function delMenu({ menuId }: Pick<MenuForm, 'menuId'>): ApiPromise<void> {
  return fetch({
    url: '/system/menu/' + menuId,
    method: 'delete',
  })
}
