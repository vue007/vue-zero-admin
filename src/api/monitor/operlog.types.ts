import type { PageQuery } from '../_fetch'

export interface LogTimeQuery {
  params?: {
    beginTime?: string
    endTime?: string
  }
}

export interface OperLogQuery extends PageQuery, LogTimeQuery {
  title?: string
  businessType?: number | string
  operName?: string
  operIp?: string
  status?: number | string
}

export interface OperLogVO {
  operId: number | string
  tenantId: string
  title: string
  businessType: number
  method: string
  requestMethod: string
  operatorType: number
  operName: string
  deptName: string
  operUrl: string
  operIp: string
  operLocation: string
  operParam: string
  jsonResult: string
  status: number
  errorMsg: string
  operTime: string
  costTime: number
}
