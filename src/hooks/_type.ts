export type ExtractFields<T> = {
  [K in keyof T]: T[K] extends { [key: string]: infer V } ? V : never
}

export type ExtractObject<T extends object[]> = T extends [infer First, ...infer Rest extends object[]]
  ? First & ExtractObject<Rest>
  : {}

export type IteratorObjctType<T extends object[]> = ExtractFields<T> & ExtractObject<T>

export type BaseType = number | string | boolean
