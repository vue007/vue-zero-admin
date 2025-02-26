import { createEnumList } from './_enums'

export enum RoleScopeEnum {
  ALL = '1',
  COUSTOM = '2',
  DEPT_ONLY = '3',
  DEPT = '4',
  SELF = '5',
}

export const RoleScopeEnumMap = {
  [RoleScopeEnum.ALL]: '全部数据权限',
  [RoleScopeEnum.COUSTOM]: '自定数据权限',
  [RoleScopeEnum.DEPT_ONLY]: '本部门数据权限',
  [RoleScopeEnum.DEPT]: '本部门及以下数据权限',
  [RoleScopeEnum.SELF]: '仅本人数据权限',
}

export const RoleScopeEnumList = createEnumList(RoleScopeEnumMap)
