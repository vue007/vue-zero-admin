import { isRef, type Ref } from 'vue'

type ExposeSource<T extends object> = T | Ref<T | null | undefined> | (() => T | null | undefined)

type ExposeSourceValue<T> =
  T extends Ref<infer V> ? NonNullable<V> : T extends () => infer V ? NonNullable<V> : NonNullable<T>

type UnionToIntersection<T> = (T extends unknown ? (value: T) => void : never) extends (
  value: infer TIntersection,
) => void
  ? TIntersection
  : never

export type ExposeProxy<TSources extends readonly ExposeSource<object>[]> = UnionToIntersection<
  ExposeSourceValue<TSources[number]>
>

/**
 * 将内部组件实例透明地暴露给调用方，并允许把增强能力放在更靠前的 source 中。
 *
 * source 按从左到右的优先级查找属性，因此：
 * createExposeProxy(enhancements, rawRef) = 原组件完整能力 + 可覆盖的增强能力。
 */
export function createExposeProxy<const TSources extends readonly ExposeSource<object>[]>(
  ...sources: TSources
): ExposeProxy<TSources> {
  const boundMethods = new WeakMap<object, Map<PropertyKey, { original: Function; bound: Function }>>()

  const resolveSource = (source: ExposeSource<object>): object | undefined => {
    if (isRef(source)) return (source.value as object | null | undefined) ?? undefined
    if (typeof source === 'function') return source() ?? undefined
    return source
  }

  const findOwner = (property: PropertyKey) => sources.map(resolveSource).find((source) => source && property in source)

  const bindMethod = (owner: object, property: PropertyKey, method: Function) => {
    let ownerMethods = boundMethods.get(owner)
    if (!ownerMethods) {
      ownerMethods = new Map()
      boundMethods.set(owner, ownerMethods)
    }

    const cached = ownerMethods.get(property)
    if (cached?.original === method) return cached.bound

    const bound = method.bind(owner)
    ownerMethods.set(property, { original: method, bound })
    return bound
  }

  return new Proxy(
    {},
    {
      get(_target, property) {
        const owner = findOwner(property)
        if (!owner) return undefined
        const value = Reflect.get(owner, property, owner)
        return typeof value === 'function' ? bindMethod(owner, property, value) : value
      },
      set(_target, property, value) {
        const owner = findOwner(property) ?? sources.map(resolveSource).find(Boolean)
        return owner ? Reflect.set(owner, property, value, owner) : false
      },
      has(_target, property) {
        return Boolean(findOwner(property))
      },
      ownKeys() {
        return [...new Set(sources.flatMap((source) => Reflect.ownKeys(resolveSource(source) ?? {})))]
      },
      getOwnPropertyDescriptor(_target, property) {
        const owner = findOwner(property)
        if (!owner) return undefined
        const descriptor = Reflect.getOwnPropertyDescriptor(owner, property)
        return descriptor ? { ...descriptor, configurable: true } : { configurable: true, enumerable: true }
      },
    },
  ) as ExposeProxy<TSources>
}
