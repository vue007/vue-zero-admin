import { useThrottleFn } from '@vueuse/core'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import axios, { HttpStatusCode } from 'axios'

import type { AxiosPromiseE } from 'env'
import { PromiseErr } from '@/utils/primise-error'
import { getToken } from '@/utils/auth'
// ------------------------------- Begin 类型定义 -------------------------------

/** 分页查询表单 */
export interface ApiPageForm {
  pageNo?: number
  pageSize?: number
}
export type PageQuery = ApiPageForm

export class ApiPagination implements ApiPageForm {
  pageNo!: 1
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
  rows!: Array<T>

  public static isFinished(page: ApiPage<any>): boolean {
    return page.pageNo * page.pageSize >= page.total
  }
  public static mergeNextPage(page: ApiPage<any>, data: ApiPage<any>): ApiPage<any> {
    page.pageNo = data.pageNo
    page.pageSize = data.pageSize
    page.total = data.total
    page.totalPage = data.totalPage
    page.rows = page.rows.concat(data.rows)
    return page
  }
}

export interface ApiError extends AxiosError {
  data: ApiResponse<any>
}

export type ApiPromise<T> = AxiosPromiseE<ApiResponse<T>, ApiError>
export type ApiPromisePage<T> = AxiosPromiseE<ApiResponse<ApiPage<T>>, ApiError>
// ------------------------------- End 类型定义 -------------------------------

const baseURL: string = import.meta.env.VITE_APP_BASE_API
const apifoxToken: string = import.meta.env.VITE_APP_APIFOX_TOKEN

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
axios.defaults.headers['lang'] = 'zh-CN'

export const ENCRYPT_HEADER = 'encrypt-key'
export const TOKEN_KEY = 'ADMIN_TOKEN_KEY'
export const globalApiHeaders = () => {
  return {
    Authorization: 'Bearer ' + getToken(),
    clientid: import.meta.env.VITE_APP_CLIENT_ID,
  }
}

const fetch = axios.create({
  withCredentials: true,
  baseURL,
  timeout: 50000,
})

// request拦截器,在请求之前做一些处理
fetch.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // lang
    config.headers['lang'] = localStorage.getItem('setting.local') || 'zh-CN'
    const isToken = config.headers?.isToken === false

    if (getToken() && !isToken) {
      config.headers['Authorization'] = globalApiHeaders().Authorization
      config.headers['clientid'] = globalApiHeaders().clientid // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    if (import.meta.env.DEV) {
      config.headers['apifoxToken'] = apifoxToken
    }

    return config
  },
  (error) => {
    return PromiseErr.reject(error)
  },
)

// TODO i18n
export const errorCode: any = {
  '401': '认证失败，无法访问系统资源',
  '403': '当前操作没有权限',
  '404': '访问资源不存在',
  default: '系统未知错误，请反馈给管理员',
}

// 配置成功后的拦截器
fetch.interceptors.response.use(
  (res) => {
    try {
      // 未设置状态码则默认成功状态
      const code = Number(res.data.code || HttpStatusCode.Ok)
      // 获取错误信息
      const msg = errorCode[code] || res.data.msg || errorCode['default']

      if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
        return res.data
      }

      // 成功
      console.log(HttpStatusCode.Ok, res.data.code, 'HttpStatusCode.Ok === res.data.code')

      if (HttpStatusCode.Ok === res.data.code) {
        console.log(res, res.request, res.config, 'asdfasdf')
        if (res.config && res.config.params) {
          const { pageNo, pageSize } = res.config.params
          if (pageNo) res.data.data['pageNo'] = pageNo
          if (pageSize) res.data.data['pageSize'] = pageSize
        }
        return PromiseErr.resolve({
          ...res,
          apiData: res.data.data,
          isSuccess: true,
        })
      } else {
        if (HttpStatusCode.Unauthorized === code) {
          redirectToLogin()
          throw new Error('need-login')
        }
        if (601 === code) {
          ElMessage.warning(msg)
          throw new Error('warning')
        }
        ElMessage.error(msg)
        return PromiseErr.reject({
          data: res.data,
          message: msg,
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

export { fetch }
