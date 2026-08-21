/** UnoCSS @screen / responsive-vars 共用断点（单源） */
export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  '3xl': '1920px',
  '4xl': '2560px',
  '5xl': '3840px',
} as const

export type Breakpoint = keyof typeof breakpoints

/** 生成 `$responsive-screens` SCSS map */
export function breakpointsScssAdditionalData() {
  const entries = Object.entries(breakpoints).map(([key, value]) => {
    const scssKey = /^[a-z]+$/.test(key) ? key : `'${key}'`
    return `  ${scssKey}: ${value}`
  })

  return `$responsive-screens: (\n${entries.join(',\n')}\n);`
}
