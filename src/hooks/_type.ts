/**
 * An object that can also be destructured in the order used by iteratorObject.
 * Keep the object and positional types explicit so refs are not accidentally
 * flattened by conditional type inference.
 */
export type IteratorObjectReturn<TObject extends object, TValues extends unknown[]> = TObject & TValues

export type BaseType = number | string | boolean
