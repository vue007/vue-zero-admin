import { baseApi } from '@/api/_index'

export type SocialAuthMode = 'login' | 'bind'

const SOCIAL_AUTH_SESSION_KEY = 'social-auth-context'

export interface SocialAuthContext {
  mode: SocialAuthMode
  source: string
  tenantId: string
  returnTo: string
}

export async function startSocialAuth(context: SocialAuthContext): Promise<void> {
  const response = await baseApi.getSocialAuthorizeUrl(context.source, context.tenantId, window.location.origin)
  sessionStorage.setItem(SOCIAL_AUTH_SESSION_KEY, JSON.stringify(context))
  window.location.assign(response.apiData)
}

export function readSocialAuthContext(): SocialAuthContext | undefined {
  const value = sessionStorage.getItem(SOCIAL_AUTH_SESSION_KEY)
  if (!value) return undefined
  try {
    return JSON.parse(value) as SocialAuthContext
  } catch {
    sessionStorage.removeItem(SOCIAL_AUTH_SESSION_KEY)
    return undefined
  }
}

export function clearSocialAuthContext(): void {
  sessionStorage.removeItem(SOCIAL_AUTH_SESSION_KEY)
}

export function getTenantIdFromSocialState(state: string): string | undefined {
  try {
    const normalized = state.replace(/ /g, '+').replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
    const binary = atob(padded)
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0))
    const payload = JSON.parse(new TextDecoder().decode(bytes)) as { tenantId?: string }
    return payload.tenantId
  } catch {
    return undefined
  }
}

const SOCIAL_PROVIDER_LABELS: Record<string, string> = {
  alipay_wallet: '支付宝',
  dingtalk: '钉钉',
  gitee: 'Gitee',
  gitea: 'Gitea',
  github: 'GitHub',
  gitlab: 'GitLab',
  maxkey: 'MaxKey',
  microsoft: 'Microsoft',
  qq: 'QQ',
  topiam: 'TopIAM',
  wechat_enterprise: '企业微信',
  wechat_open: '微信',
}

export function getSocialProviderLabel(source: string): string {
  return SOCIAL_PROVIDER_LABELS[source.toLowerCase()] || source
}
