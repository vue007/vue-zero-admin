export function iteratorObject<T>(obj) {
  obj[Symbol.iterator] = function* () {
    yield* Object.values(obj)
  }
  return obj as T
}
