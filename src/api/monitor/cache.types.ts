export interface CacheCommandStat {
  name: string
  value: number
}

export interface CacheInfoVO {
  info: Record<string, string>
  dbSize: number
  commandStats: CacheCommandStat[]
}

export interface CacheGroupVO {
  cacheName: string
  remark: string
  keyCount: number
}
