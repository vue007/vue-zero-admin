export type IteratorObject<T extends object> = T & Iterable<T[keyof T]>

/**
 * 让一个返回对象同时支持两种由调用方决定的读取方式：
 * const { data, request } = result
 * const [data, request] = result
 *
 * keys 用来显式声明位置语义；不传时保持对象自身的属性插入顺序。
 */
export function iteratorObject<T extends object, K extends readonly (keyof T)[] = readonly (keyof T)[]>(
  obj: T,
  keys?: K,
): IteratorObject<T>
/** 保留原有 iteratorObject<ReturnType>(object) 的显式返回类型写法。 */
export function iteratorObject<TReturn>(obj: object, keys?: readonly PropertyKey[]): TReturn
export function iteratorObject(obj: object, keys?: readonly PropertyKey[]) {
  const orderedKeys = keys ? [...keys] : Object.keys(obj)

  Object.defineProperty(obj, Symbol.iterator, {
    configurable: true,
    enumerable: false,
    value: function* () {
      for (const key of orderedKeys) yield Reflect.get(obj, key)
    },
  })
  return obj
}
