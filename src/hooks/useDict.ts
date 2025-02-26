import type { DictDataOption } from '@/api/_type'
import { getDicts } from '@/api/sys/dict.api'
import useDictStore from '@/stores/dict.module'
/**
 * 获取字典数据
 * @author Akai
 */
export const useDict = (...args: string[]): { [key: string]: DictDataOption[] } => {
  const res = ref<{
    [key: string]: DictDataOption[]
  }>({})
  return (() => {
    args.forEach(async (dictType) => {
      res.value[dictType] = []
      const dicts = useDictStore().getDict(dictType)
      if (dicts) {
        res.value[dictType] = dicts
      } else {
        await getDicts(dictType).then((resp) => {
          res.value[dictType] = resp.apiData.map(
            (p): DictDataOption => ({
              label: p.dictLabel,
              value: p.dictValue,
              elTagType: p.listClass,
              elTagClass: p.cssClass,
            }),
          )
          useDictStore().setDict(dictType, res.value[dictType])
        })
      }
    })
    return res.value
  })()
}
