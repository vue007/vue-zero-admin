import { createEnumList } from './_enums'

export enum MenuTypeEnum {
  /**
   * 目录
   */
  FOLD = 'M', // F ; 1
  /**
   * 菜单
   */
  MENU = 'C', // M ; 2
  /**
   * 按钮
   */
  BTN = 'F', // B ; 3
}

export const MenuTypeEnumMap = {
  [MenuTypeEnum.FOLD]: '目录',
  [MenuTypeEnum.MENU]: '菜单',
  [MenuTypeEnum.BTN]: '按钮',
}

export const MenuTypeEnumList = createEnumList(MenuTypeEnumMap)
