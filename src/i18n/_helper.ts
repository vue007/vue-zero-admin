export const SupportLanguageList = ['zh-CN', 'zh-TW', 'en']

export function i18nMsgItem(...args: string[]) {
  const box: any = new Array() // 为了区分普通节点 和 子节点
  for (let i = 0; i < SupportLanguageList.length; i++) {
    box[SupportLanguageList[i]] = args[i]
  }
  return box
}

export function generateI18nMsg(datas: any) {
  const msg: any = {}

  SupportLanguageList.forEach((l) => {
    msg[l] = {}
    for (const key in datas) msg[l][key] = gItem(datas[key], l)
  })
  function gItem(data: any, l: string) {
    const _m: any = {}
    for (const item in data) {
      _m[item] = data[item] instanceof Array ? data[item][l] : gItem(data[item], l)
    }
    return _m
  }

  return msg
}
