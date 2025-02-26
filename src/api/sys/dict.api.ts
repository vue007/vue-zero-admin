import { fetch, type ApiPromise, type ApiPromisePage } from '../_fetch'
import type { DictDataForm, DictDataQuery, DictDataVO, DictTypeForm, DictTypeQuery, DictTypeVO } from './dict.types'

// 查询字典类型列表
export function listType(query: DictTypeQuery): ApiPromisePage<DictTypeVO> {
  return fetch({
    url: '/system/dict/type/list',
    method: 'get',
    params: query,
  })
}

// 查询字典类型详细
export function getType({ dictId }: { dictId: number | string }): ApiPromise<DictTypeVO> {
  return fetch({
    url: '/system/dict/type/' + dictId,
    method: 'get',
  })
}

// 新增字典类型
export function addType(data: DictTypeForm): ApiPromise<DictTypeVO> {
  return fetch({
    url: '/system/dict/type',
    method: 'post',
    data: data,
  })
}

// 修改字典类型
export function updateType(data: DictTypeForm): ApiPromise<DictTypeVO> {
  return fetch({
    url: '/system/dict/type',
    method: 'put',
    data: data,
  })
}

// 删除字典类型
export function delType({ dictId }: Pick<DictTypeForm, 'dictId'>) {
  return fetch({
    url: '/system/dict/type/' + dictId,
    method: 'delete',
  })
}

// 刷新字典缓存
export function refreshCache() {
  return fetch({
    url: '/system/dict/type/refreshCache',
    method: 'delete',
  })
}

// 获取字典选择框列表
export function optionselect(): ApiPromise<DictTypeVO[]> {
  return fetch({
    url: '/system/dict/type/optionselect',
    method: 'get',
  })
}

// dict data

export function getDicts(dictType: string): ApiPromise<DictDataVO[]> {
  return fetch({
    url: '/system/dict/data/type/' + dictType,
    method: 'get',
  })
}

// 查询字典数据列表
export function listData(query: DictDataQuery): ApiPromisePage<DictDataVO> {
  return fetch({
    url: '/system/dict/data/list',
    method: 'get',
    params: query,
  })
}

// 查询字典数据详细
export function getData(dictCode: string | number): ApiPromise<DictDataVO> {
  return fetch({
    url: '/system/dict/data/' + dictCode,
    method: 'get',
  })
}

// 新增字典数据
export function addData(data: DictDataForm): ApiPromise<void> {
  return fetch({
    url: '/system/dict/data',
    method: 'post',
    data: data,
  })
}

// 修改字典数据
export function updateData(data: DictDataForm): ApiPromise<void> {
  return fetch({
    url: '/system/dict/data',
    method: 'put',
    data: data,
  })
}

// 删除字典数据
export function delData(dictCodes: DictDataVO['dictCode'][]): ApiPromise<void> {
  return fetch({
    url: '/system/dict/data/' + dictCodes.join(','),
    method: 'delete',
  })
}
