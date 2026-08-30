import { compileTemplate } from '@vue/compiler-sfc'
import { describe, expect, it } from 'vitest'
import { inferZeFormItemProp } from './infer-form-item-prop.js'

const compile = (source: string) =>
  compileTemplate({
    source,
    filename: 'FormItemFixture.vue',
    id: 'form-item-fixture',
    compilerOptions: { nodeTransforms: [inferZeFormItemProp] },
  })

describe('inferZeFormItemProp', () => {
  it('infers a static property without changing caller syntax', () => {
    const result = compile('<ze-form-item v-model="form.age" type="number" />')

    expect(result.errors).toEqual([])
    expect(result.code).toContain('prop: "age"')
  })

  it('supports the existing camel-case component spelling', () => {
    const result = compile('<ze-formItem v-model="form.userName" />')

    expect(result.errors).toEqual([])
    expect(result.code).toContain('prop: "userName"')
  })

  it('preserves an explicitly supplied prop', () => {
    const result = compile('<ze-form-item v-model="form.age" prop="years" />')

    expect(result.errors).toEqual([])
    expect(result.code).toContain('prop: "years"')
    expect(result.code).not.toContain('prop: "age"')
  })

  it('does not guess a dynamic computed property', () => {
    const result = compile('<ze-form-item v-model="form[field]" />')

    expect(result.errors).toEqual([])
    expect(result.code).not.toContain('prop:')
  })
})
