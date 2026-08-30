import type { CompilerOptions } from '@vue/compiler-sfc'

type TemplateNodeTransform = NonNullable<CompilerOptions['nodeTransforms']>[number]

const ELEMENT_NODE = 1
const ATTRIBUTE_NODE = 6
const DIRECTIVE_NODE = 7

const isZeFormItem = (tag: string) => tag.replaceAll('-', '').toLowerCase() === 'zeformitem'

const inferStaticProperty = (expression: string): string | undefined => {
  const source = expression.trim()
  const bracketProperty = source.match(/\[\s*(['"])([^'"\\]+)\1\s*\]$/u)?.[2]
  if (bracketProperty) return bracketProperty

  return source.match(/(?:^|\.)([$_\p{ID_Start}][$_\p{ID_Continue}]*)$/u)?.[1]
}

/**
 * 将 <ze-form-item v-model="form.age"> 在模板编译期补全为 prop="age"。
 *
 * 仅处理可以静态证明的成员属性；动态下标、显式 prop 和 v-bind 对象保持原样，
 * 避免编译器替调用方猜测运行时语义。
 */
export const inferZeFormItemProp: TemplateNodeTransform = (node) => {
  if (node.type !== ELEMENT_NODE || !isZeFormItem(node.tag)) return

  const hasExplicitProp = node.props.some(
    (property) =>
      (property.type === ATTRIBUTE_NODE && property.name === 'prop') ||
      (property.type === DIRECTIVE_NODE && property.name === 'bind' && property.arg?.loc.source === 'prop'),
  )
  const hasObjectBinding = node.props.some(
    (property) => property.type === DIRECTIVE_NODE && property.name === 'bind' && !property.arg,
  )
  if (hasExplicitProp || hasObjectBinding) return

  const model = node.props.find(
    (property) => property.type === DIRECTIVE_NODE && property.name === 'model' && !property.arg,
  )
  if (!model || model.type !== DIRECTIVE_NODE || !model.exp) return

  const field = inferStaticProperty(model.exp.loc.source)
  if (!field) return

  node.props.push({
    type: ATTRIBUTE_NODE,
    name: 'prop',
    nameLoc: model.loc,
    value: {
      type: 2,
      content: field,
      loc: { ...model.exp.loc, source: field },
    },
    loc: model.loc,
  })
}
