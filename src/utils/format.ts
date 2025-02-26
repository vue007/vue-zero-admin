/**
 *
 * @param second  秒数
 * @returns  格式化后的时间 1小时1分钟1秒
 */
export const formatSeconds = (second: number) => {
  const h = Math.floor(second / 3600)
  const m = Math.floor((second % 3600) / 60)
  const s = Math.floor(second % 60)
  return `${h > 0 ? `${h}时` : ''}${m > 0 ? `${m}分` : ''}${s > 0 ? `${s}秒` : ''}` || '-'
}
