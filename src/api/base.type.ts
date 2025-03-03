import type { UserVO } from './user.type'

export type LoginForm = {
  username: string
  password: string
  clientId?: string
  grantType?: string
  rememberMe?: boolean
  tenantId?: string
  [property: string]: any
}

export interface LoginVo {
  /**
   * 授权令牌
   */
  access_token?: string
  /**
   * 应用id
   */
  client_id?: string
  /**
   * 授权令牌 access_token 的有效期
   */
  expire_in?: number
  /**
   * 用户 openid
   */
  openid?: string
  /**
   * 刷新令牌 refresh_token 的有效期
   */
  refresh_expire_in?: number
  /**
   * 刷新令牌
   */
  refresh_token?: string
  /**
   * 令牌权限
   */
  scope?: string
  [property: string]: any
}

export interface UserInfo {
  user: UserVO
  roles: string[]
  permissions: string[]
}
