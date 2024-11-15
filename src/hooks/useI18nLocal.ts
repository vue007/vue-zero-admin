import { cloneDeep } from 'es-toolkit'

export const useI18nLocal = (options?: object) => {
  return useI18n({ useScope: 'local', ...cloneDeep(options) })
}
