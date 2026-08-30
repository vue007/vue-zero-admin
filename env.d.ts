/// <reference types="vite/client" />

declare global {
  const ElMessage: (typeof import('element-plus'))['ElMessage']
  const ElMessageBox: (typeof import('element-plus'))['ElMessageBox']
  const ElNotification: (typeof import('element-plus'))['ElNotification']
  const ElLoading: (typeof import('element-plus'))['ElLoading']
}

import type { ApiError } from '@/api/_fetch'
import type { PromiseErr } from '@/utils/primise-error'
import type { AxiosResponse } from 'axios'
type AxiosResponseWithApiData<T> = AxiosResponse<T> & {
  apiData: T extends { data: infer D } ? D : never
}
declare module 'axios' {
  export interface _AxiosResponse<T> extends AxiosResponseWithApiData<T> {}
}

export interface AxiosPromiseE<T = any, E = ApiError> extends PromiseErr<_AxiosResponse<T>, E> {}
