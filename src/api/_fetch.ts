import { useThrottleFn } from '@vueuse/core'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'

// TODO: 同步生成后端接口 interface

import type { AxiosPromiseE } from 'env'
import { PromiseErr } from '@/utils/primise-error'
// ------------------------------- Begin 类型定义 -------------------------------

/** 分页查询表单 */
export interface ApiPageForm {
  pageNum: number
  pageSize: number
}

export class ApiPagination implements ApiPageForm {
  pageNum!: 1
  pageSize!: 10
  total!: 0 | number
  totalPage?: 0 | number
}

/** 后端接口返回数据结构 */
export interface ApiResponse<T> {
  code: number | string
  msg: string
  data: T
}

/** 分页数据体 */
export class ApiPage<T> extends ApiPagination {
  list!: Array<T>

  public static isFinished(page: ApiPage<any>): boolean {
    return page.pageNum * page.pageSize >= page.total
  }
  public static mergeNextPage(page: ApiPage<any>, data: ApiPage<any>): ApiPage<any> {
    page.pageNum = data.pageNum
    page.pageSize = data.pageSize
    page.total = data.total
    page.totalPage = data.totalPage
    page.list = page.list.concat(data.list)
    return page
  }
}

export interface ApiError extends AxiosError {
  data: ApiResponse<any>
}

export type ApiPromise<T> = AxiosPromiseE<ApiResponse<T>, ApiError>
export type ApiPromisePage<T> = AxiosPromiseE<ApiResponse<ApiPage<T>>, ApiError>
// ------------------------------- End 类型定义 -------------------------------

export const TOKEN_KEY = 'ADMIN_TOKEN_KEY'
const SKIP401 = 'skip401'

const baseURL: string = import.meta.env.VITE_APP_BASE_API

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
axios.defaults.headers['lang'] = 'zh-CN'
// axios.defaults.headers['clientid'] = import.meta.env.VITE_APP_CLIENT_ID

const fetch = axios.create({
  withCredentials: true,
  baseURL,
  timeout: 50000,
})

// request拦截器,在请求之前做一些处理
fetch.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // openLoading()
    // config.headers['Authorization'] = useSystemStore().user.info.token // TODO 用户token
    return config
  },
  (error) => {
    return PromiseErr.reject(error)
  },
)

// 配置成功后的拦截器
fetch.interceptors.response.use(
  (res) => {
    try {
      // closeLaoding()
      // 成功
      if ([200].includes(res.data.code)) {
        const { pageNum, pageSize } = res.request.data
        if (pageNum) res.data.data['pageNum'] = pageNum
        if (pageSize) res.data.data['pageSize'] = pageSize
        return PromiseErr.resolve({
          ...res,
          apiData: res.data.data,
          isSuccess: true,
        })
      } else {
        if (Number(res.data.code) === 401) {
          redirectToLogin()
          throw new Error('need-login')
        }
        ElMessage.error(res.data.msg)
        return PromiseErr.reject({
          data: res.data,
          message: res.data.msg,
          code: res.data.code + '',
          response: res,
        })
      }
    } catch (err) {
      if (Number(res.data.code) === 401) {
        redirectToLogin()
        throw new Error('need-login')
      }
      return PromiseErr.reject(err || new Error('request error!'))
    } finally {
      // closeLaoding()
    }
  },
  (error: AxiosError) => {
    console.log(error)
    // closeLaoding()
    return PromiseErr.reject({ ...error })
  },
)

const redirectToLogin = useThrottleFn(() => {
  ElMessage.closeAll()
  window.localStorage.clear()
  // useSystemStore().menu.history = []
  ElMessage.warning('请先登录')
  setTimeout(() => {
    window.location.href = '/login'
  }, 3000)
}, 5000)

export { fetch, SKIP401 }
