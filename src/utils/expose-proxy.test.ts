import { ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { createExposeProxy } from './expose-proxy'

describe('createExposeProxy', () => {
  it('preserves the complete base instance and adds enhancements', () => {
    const base = {
      count: 1,
      increment() {
        this.count += 1
        return this.count
      },
    }
    const rawRef = ref(base)
    const exposed = createExposeProxy({ reset: () => (base.count = 0) }, rawRef)

    expect(exposed.increment).toBe(exposed.increment)
    expect(exposed.increment()).toBe(2)
    expect(base.count).toBe(2)
    expect(exposed.reset()).toBe(0)
    expect('increment' in exposed).toBe(true)
  })

  it('uses left-to-right priority for intentional overrides', () => {
    const exposed = createExposeProxy({ mode: 'enhanced' }, ref({ mode: 'base', original: true }))

    expect(exposed.mode).toBe('enhanced')
    expect(exposed.original).toBe(true)
    expect(Reflect.ownKeys(exposed)).toEqual(expect.arrayContaining(['mode', 'original']))
  })
})
