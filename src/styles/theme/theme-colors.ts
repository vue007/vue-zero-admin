export const BASE_THEME_COLORS = [
  { name: 'emerald', color: '#10b981' },
  { name: 'green', color: '#22c55e' },
  { name: 'lime', color: '#84cc16' },
  { name: 'orange', color: '#f97316' },
  { name: 'amber', color: '#f59e0b' },
  { name: 'yellow', color: '#eab308' },
  { name: 'teal', color: '#14b8a6' },
  { name: 'cyan', color: '#06b6d4' },
  { name: 'sky', color: '#0ea5e9' },
  { name: 'dodgerblue', color: '#1677ff' },
  // Keep the Figma Argon primary as this project's default indigo.
  { name: 'indigo', color: '#596cff' },
  { name: 'violet', color: '#8b5cf6' },
  { name: 'purple', color: '#a855f7' },
  { name: 'fuchsia', color: '#d946ef' },
  { name: 'pink', color: '#ec4899' },
  { name: 'rose', color: '#f43f5e' },
] as const

export const BASE_THEME_SURFACES = [
  {
    name: 'slate',
    palette: ['#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b', '#475569', '#334155', '#1e293b', '#0f172a', '#020617'],
  },
  {
    name: 'gray',
    palette: ['#ffffff', '#f9fafb', '#f3f4f6', '#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280', '#4b5563', '#374151', '#1f2937', '#111827', '#030712'],
  },
  {
    name: 'zinc',
    palette: ['#ffffff', '#fafafa', '#f4f4f5', '#e4e4e7', '#d4d4d8', '#a1a1aa', '#71717a', '#52525b', '#3f3f46', '#27272a', '#18181b', '#09090b'],
  },
  {
    name: 'neutral',
    palette: ['#ffffff', '#fafafa', '#f5f5f5', '#e5e5e5', '#d4d4d4', '#a3a3a3', '#737373', '#525252', '#404040', '#262626', '#171717', '#0a0a0a'],
  },
  {
    name: 'stone',
    palette: ['#ffffff', '#fafaf9', '#f5f5f4', '#e7e5e4', '#d6d3d1', '#a8a29e', '#78716c', '#57534e', '#44403c', '#292524', '#1c1917', '#0c0a09'],
  },
  {
    name: 'soho',
    palette: ['#ffffff', '#ececec', '#dedfdf', '#c4c4c6', '#adaeb0', '#97979b', '#7f8084', '#6a6b70', '#55565b', '#3f4046', '#2c2c34', '#16161d'],
  },
  {
    name: 'viva',
    palette: ['#ffffff', '#f3f3f3', '#e7e7e8', '#cfd0d0', '#b7b8b9', '#9fa1a1', '#87898a', '#6e7173', '#565a5b', '#3e4244', '#262b2c', '#0e1315'],
  },
  {
    name: 'ocean',
    palette: ['#ffffff', '#fbfcfc', '#f7f9f8', '#eff3f2', '#dadedd', '#b1b7b6', '#828787', '#5f7274', '#415b61', '#29444e', '#183240', '#0c1920'],
  },
] as const

export type BaseThemeColor = (typeof BASE_THEME_COLORS)[number]['name']
export type BaseThemeSurface = (typeof BASE_THEME_SURFACES)[number]['name']
export type ResolvedScheme = 'light' | 'dark'

export const isBaseThemeColor = (value: unknown): value is BaseThemeColor =>
  BASE_THEME_COLORS.some((item) => item.name === value)
export const isBaseThemeSurface = (value: unknown): value is BaseThemeSurface =>
  BASE_THEME_SURFACES.some((item) => item.name === value)

const hexToRgb = (hex: string) => {
  const value = Number.parseInt(hex.slice(1), 16)
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255] as const
}

const rgbToHex = (rgb: readonly number[]) =>
  `#${rgb.map((channel) => Math.round(channel).toString(16).padStart(2, '0')).join('')}`

const mixHex = (color: string, target: string, targetWeight: number) => {
  const sourceRgb = hexToRgb(color)
  const targetRgb = hexToRgb(target)
  return rgbToHex(sourceRgb.map((channel, index) => channel * (1 - targetWeight) + targetRgb[index] * targetWeight))
}

/** Apply an Element Plus primary palette without coupling to a component-library theme engine. */
export function applyThemeColor(name: BaseThemeColor, scheme: ResolvedScheme) {
  const item = BASE_THEME_COLORS.find((color) => color.name === name) ?? BASE_THEME_COLORS[10]
  const root = document.documentElement
  const rgb = hexToRgb(item.color)
  const lightTarget = scheme === 'dark' ? '#000000' : '#ffffff'
  const darkTarget = scheme === 'dark' ? '#ffffff' : '#000000'

  root.setAttribute('data-theme-color', item.name)
  root.style.setProperty('--el-color-primary', item.color)
  root.style.setProperty('--el-color-primary-rgb', rgb.join(', '))
  ;[3, 5, 7, 8, 9].forEach((step) => {
    root.style.setProperty(`--el-color-primary-light-${step}`, mixHex(item.color, lightTarget, step / 10))
  })
  root.style.setProperty('--el-color-primary-dark-2', mixHex(item.color, darkTarget, 0.2))

  // Argon's header remains recognizable while following the selected primary.
  root.style.setProperty('--ze-banner', item.color)
  root.style.setProperty(
    '--ze-banner-gradient',
    `linear-gradient(310deg, ${item.color} 0%, ${mixHex(item.color, '#825ee4', 0.38)} 58%, ${mixHex(item.color, '#11cdef', 0.58)} 125%)`,
  )
}

/** Map a neutral Surface palette to Element Plus semantic surface variables. */
export function applyThemeSurface(name: BaseThemeSurface, scheme: ResolvedScheme) {
  const item = BASE_THEME_SURFACES.find((surface) => surface.name === name) ?? BASE_THEME_SURFACES[0]
  const [s0, s50, s100, s200, s300, s400, s500, s600, s700, s800, s900, s950] = item.palette
  const root = document.documentElement
  const variables =
    scheme === 'dark'
      ? {
          '--el-bg-color': s900,
          '--el-bg-color-page': s950,
          '--el-bg-color-overlay': s800,
          '--el-text-color-primary': s50,
          '--el-text-color-regular': s200,
          '--el-text-color-secondary': s400,
          '--el-text-color-placeholder': s500,
          '--el-text-color-disabled': s600,
          '--el-border-color': s700,
          '--el-border-color-light': s800,
          '--el-border-color-lighter': s800,
          '--el-border-color-extra-light': s900,
          '--el-border-color-dark': s600,
          '--el-border-color-darker': s500,
          '--el-fill-color': s700,
          '--el-fill-color-light': s800,
          '--el-fill-color-lighter': s800,
          '--el-fill-color-extra-light': s900,
          '--el-fill-color-dark': s600,
          '--el-fill-color-darker': s500,
          '--el-fill-color-blank': s900,
          '--el-menu-text-color': s200,
          '--el-menu-hover-text-color': s50,
          '--el-menu-hover-bg-color': s800,
          '--el-menu-active-color': s50,
        }
      : {
          '--el-bg-color': s0,
          '--el-bg-color-page': s50,
          '--el-bg-color-overlay': s0,
          '--el-text-color-primary': s900,
          '--el-text-color-regular': s700,
          '--el-text-color-secondary': s500,
          '--el-text-color-placeholder': s400,
          '--el-text-color-disabled': s300,
          '--el-border-color': s200,
          '--el-border-color-light': s100,
          '--el-border-color-lighter': s100,
          '--el-border-color-extra-light': s50,
          '--el-border-color-dark': s300,
          '--el-border-color-darker': s400,
          '--el-fill-color': s100,
          '--el-fill-color-light': s50,
          '--el-fill-color-lighter': s50,
          '--el-fill-color-extra-light': s0,
          '--el-fill-color-dark': s200,
          '--el-fill-color-darker': s300,
          '--el-fill-color-blank': s0,
          '--el-menu-text-color': s700,
          '--el-menu-hover-text-color': s900,
          '--el-menu-hover-bg-color': s50,
          '--el-menu-active-color': s900,
        }

  root.setAttribute('data-theme-surface', item.name)
  Object.entries(variables).forEach(([key, value]) => root.style.setProperty(key, value))
}
