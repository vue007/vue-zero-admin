import { ref, type Ref } from 'vue'
import type { _AxiosResponse } from 'env'
import { isFunction, isPlainObject, isString, merge } from 'es-toolkit'
import { isObject } from 'es-toolkit/compat'
import type { ApiError, ApiPromise, ApiResponse } from '@/api/_fetch'
import { iteratorObject } from '@/utils/iterator-object'
import type { BaseType, IteratorObjctType } from './_type'

export type UseApiOnSuccessFn<T> = (res?: _AxiosResponse<ApiResponse<T>>) => void
export type UseApiOnSubmitFn<T, X = T & { [prop: string]: any }> = (data: X) => Promise<boolean | X>
export type UseApiOnErrorFn = (err: ApiError) => void

type ReturnFields<D> = [
  {
    data: Ref<D | undefined>
  },
  { request: Function },
  { loading: Ref<boolean> },
]

export type UseApiReturn<D> = IteratorObjctType<ReturnFields<D>>

/**
 * useApi
 * @param api one of src/api fetch backend apis
 * @param params request params
 * @param options options
 * @returns [apiData, request, loading]
 *
 * @author Akai
 */
export function useApi<P, D>(
  api: (params: P) => ApiPromise<D>,
  params?: (Partial<P> | any) | (() => Partial<P> | any),
  options?: {
    immediate?: boolean
    tipError?: boolean | string | Ref
    tipSuccess?: boolean | string | Ref
    onSuccess?: UseApiOnSuccessFn<D>
    onError?: UseApiOnErrorFn
    onFinally?: () => void
    onSubmit?: UseApiOnSubmitFn<P>
  },
): UseApiReturn<D> {
  const loading = ref(false)
  const apiData = ref<D>()

  const request = async (extraData?: { [prop: string]: any } | (() => { [prop: string]: any })) => {
    loading.value = true
    let requestData = {} as P & { [prop: string]: any }

    if (extraData) Object.assign(requestData, isFunction(extraData) ? extraData() : extraData)

    const resolvedParams = isRef(params) ? params.value : params
    if (isFunction(resolvedParams) || isPlainObject(resolvedParams)) {
      if (params) Object.assign(requestData, isFunction(params) ? params() : resolvedParams)
    } else requestData = extraData as BaseType | any[] | any

    const _api = (data: P) =>
      api(data)
        .then((res) => {
          apiData.value = res.apiData
          if (options?.onSuccess) options?.onSuccess(res)
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
        .catch((err) => {
          if (options?.onError) options?.onError(err)
          if (options?.tipError) {
            const message = isString(options.tipError)
              ? options.tipError
              : isObject(options.tipError)
                ? options.tipError.value
                : err.msg
            // : $t(`error.${err.code}`)
            ElMessage.error(message === `error.${err.code}` ? err.message : message)
          }
        })
        .finally(() => {
          loading.value = false
          if (options?.onFinally) options?.onFinally()
        })

    if (options?.onSubmit) {
      try {
        const result = await options.onSubmit(requestData)
        if (isObject(result)) merge(requestData, result)
        return _api(requestData)
      } catch (e) {
        console.log(e)

        ElMessage.error('表单校验未通过') // TODO 国际化
        loading.value = false
        return
      }
    } else {
      return _api(requestData)
    }
  }

  if (options?.immediate) nextTick(() => request())

  return iteratorObject({ data: apiData, request, loading })
}
