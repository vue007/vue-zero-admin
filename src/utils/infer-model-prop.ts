/**
 * 从 Vue 生成的 v-model 更新函数中读取静态属性名。
 * 这是未启用项目模板 transform 时的兼容路径；正常构建使用编译期推导。
 */
export const inferPropFromModelUpdate = (handler: unknown): string => {
  if (typeof handler !== 'function') return ''

  const source = Function.prototype.toString.call(handler)
  const assignment = source.match(
    /(?:\.([$_\p{ID_Start}][$_\p{ID_Continue}]*)|\[\s*(['"])([^'"\\]+)\2\s*\])\s*\)*\s*=\s*[$_\p{ID_Start}]/u,
  )
  return assignment?.[1] || assignment?.[3] || ''
}
