/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare global {
  const ElMessage: (typeof import('element-plus'))['ElMessage']
  const ElMessageBox: (typeof import('element-plus'))['ElMessageBox']
  const ElNotification: (typeof import('element-plus'))['ElNotification']
  const ElLoading: (typeof import('element-plus'))['ElLoading']
}

import type { ApiError } from '@/api/_fetch'
import type { PromiseErr } from '@/utils/primise-error'
import type { AxiosResponse } from 'axios'
type _AxiosResponse<T> = AxiosResponse<T> & {
  apiData: T['data']
}
declare module 'axios' {
  export interface _AxiosResponse<T> extends _AxiosResponse<T> {}
}

export interface AxiosPromiseE<T = any, E = ApiError> extends PromiseErr<_AxiosResponse<T>, E> {}
