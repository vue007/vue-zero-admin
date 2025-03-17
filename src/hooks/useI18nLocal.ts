import i18n from '@/i18n'
import { cloneDeep } from 'es-toolkit'

export const useI18nLocal = (options?: object): { t: any } => {
  try {
    return useI18n({ useScope: 'local', ...cloneDeep(options) })
  } catch (error) {
    return i18n.global
  }
}
