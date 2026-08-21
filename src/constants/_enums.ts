/**
 * 通过map转成方便枚举的list
 * @param enumMap
 * @author Akai
 */
export const createEnumList = (enumMap: {}) => {
  const list: { value: string; label: any }[] = []
  for (const [key, value] of Object.entries(enumMap)) {
    list.push({ value: key, label: value })
  }

  return list
}
