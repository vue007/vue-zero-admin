import { describe, expect, it } from 'vitest'
import { getSocialProviderLabel, getTenantIdFromSocialState } from './social-auth'

describe('social auth state', () => {
  it('extracts the tenant id from the server state payload', () => {
    const state = btoa(JSON.stringify({ tenantId: '000000', domain: 'http://localhost:3030', state: 'nonce' }))

    expect(getTenantIdFromSocialState(state)).toBe('000000')
  })

  it('accepts URL-safe base64 without padding', () => {
    const state = btoa(JSON.stringify({ tenantId: 'tenant-01' }))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')

    expect(getTenantIdFromSocialState(state)).toBe('tenant-01')
  })

  it('fails closed for a malformed state', () => {
    expect(getTenantIdFromSocialState('not-base64')).toBeUndefined()
  })
})

describe('social provider labels', () => {
  it('uses a friendly label when available and preserves unknown sources', () => {
    expect(getSocialProviderLabel('github')).toBe('GitHub')
    expect(getSocialProviderLabel('custom_oidc')).toBe('custom_oidc')
  })
})
