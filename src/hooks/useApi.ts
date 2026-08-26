import { isRef, nextTick, ref, type Ref } from 'vue'
import type { _AxiosResponse } from 'axios'
import { isFunction, isPlainObject, isString, merge } from 'es-toolkit'
import { isObject } from 'es-toolkit/compat'
import type { ApiDataOf, ApiError, ApiPromise, ApiResponse } from '@/api/_fetch'
import { iteratorObject } from '@/utils/iterator-object'
import type { BaseType, IteratorObjectReturn } from './_type'

export type UseApiOnSuccessFn<T> = (res?: _AxiosResponse<ApiResponse<T>>) => void
export type UseApiOnSubmitFn<T, X = T & { [prop: string]: any }> = (data: X) => Promise<boolean | X>
export type UseApiOnErrorFn = (err: ApiError) => void

type RequestExtraData = { [prop: string]: any } | (() => { [prop: string]: any })
type UseApiRequest<D> = (extraData?: RequestExtraData) => Promise<_AxiosResponse<ApiResponse<D>> | void>

type UseApiFields<D> = {
  data: Ref<D | undefined>
  request: UseApiRequest<D>
  loading: Ref<boolean>
}

export type UseApiReturn<D> = IteratorObjectReturn<
  UseApiFields<D>,
  [UseApiFields<D>['data'], UseApiFields<D>['request'], UseApiFields<D>['loading']]
>

type UseApiOptions<P, D> = {
  immediate?: boolean
  tipError?: boolean | string | Ref
  tipSuccess?: boolean | string | Ref
  onSuccess?: UseApiOnSuccessFn<D>
  onError?: UseApiOnErrorFn
  onFinally?: () => void
  onSubmit?: UseApiOnSubmitFn<P>
}

/**
 * useApi
 * @param api one of src/api fetch backend apis
 * @param params request params
 * @param options options
 * @returns [apiData, request, loading]
 *
 * @author Akai
 */
export function useApi<A extends (params: any) => ApiPromise<any>>(
  api: A,
  params?: any,
  options?: UseApiOptions<Parameters<A>[0], ApiDataOf<ReturnType<A>>>,
): UseApiReturn<ApiDataOf<ReturnType<A>>>
export function useApi<P, D>(
  api: (params: P) => ApiPromise<D>,
  params?: (Partial<P> | any) | (() => Partial<P> | any),
  options?: UseApiOptions<P, D>,
): UseApiReturn<D>
export function useApi<P, D>(
  api: (params: P) => ApiPromise<D>,
  params?: (Partial<P> | any) | (() => Partial<P> | any),
  options?: UseApiOptions<P, D>,
): UseApiReturn<D> {
  const loading = ref(false)
  const apiData = ref<D>()
  let latestRequestId = 0
  let activeRequestCount = 0

  const executeRequest: UseApiRequest<D> = async (extraData?: RequestExtraData) => {
    const requestId = ++latestRequestId
    activeRequestCount += 1
    loading.value = true
    let requestData = {} as P & { [prop: string]: any }

    const finishRequest = () => {
      activeRequestCount = Math.max(0, activeRequestCount - 1)
      loading.value = activeRequestCount > 0
      options?.onFinally?.()
    }

    try {
      const resolvedParams = isRef(params) ? params.value : params
      if (isFunction(resolvedParams) || isPlainObject(resolvedParams)) {
        if (params) Object.assign(requestData, isFunction(params) ? params() : resolvedParams)
      } else requestData = extraData as BaseType | any[] | any

      // Per-request data must take precedence over the hook's default parameters.
      if (extraData) Object.assign(requestData, isFunction(extraData) ? extraData() : extraData)
    } catch (error) {
      finishRequest()
      throw error
    }

    const _api = (data: P) =>
      Promise.resolve()
        .then(() => api(data))
        .then((res) => {
          if (requestId === latestRequestId) apiData.value = res.apiData
          options?.onSuccess?.(res)
          if (options?.tipSuccess)
            ElMessage.success(
              isString(options.tipSuccess)
                ? options.tipSuccess
                : isObject(options.tipSuccess)
                  ? options.tipSuccess.value
                  : '请求成功', // $t('request.success') TODO 国际化
            )
          return res
        })
        .catch((error) => {
          const err = normalizeApiError(error)
          options?.onError?.(err)
          if (options?.tipError) {
            const message = isString(options.tipError)
              ? options.tipError
              : isObject(options.tipError)
                ? options.tipError.value
                : err.data?.msg || err.message || '请求失败'
            ElMessage.error(message)
          }
          throw err
        })
        .finally(() => {
          finishRequest()
        })

    if (options?.onSubmit) {
      let result: boolean | (P & { [prop: string]: any })
      try {
        result = await options.onSubmit(requestData)
      } catch (e) {
        console.log(e)

        ElMessage.error('表单校验未通过') // TODO 国际化
        finishRequest()
        return
      }
      if (result === false) {
        finishRequest()
        return
      }
      if (isObject(result)) merge(requestData, result)
    }
    return _api(requestData)
  }

  const request: UseApiRequest<D> = (extraData?: RequestExtraData) => {
    const execution = executeRequest(extraData)
    // Mark ignored event-handler promises as handled while preserving rejection
    // for callers that await or attach their own catch handler.
    void execution.catch(() => undefined)
    return execution
  }

  if (options?.immediate) nextTick(() => request())

  return iteratorObject<UseApiReturn<D>>({ data: apiData, request, loading })
}

const normalizeApiError = (error: unknown): ApiError => {
  if (isObject(error)) return error as ApiError
  return Object.assign(new Error(String(error || '请求失败')), { data: undefined }) as unknown as ApiError
}
