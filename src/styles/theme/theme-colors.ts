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

export type BaseThemeColor = (typeof BASE_THEME_COLORS)[number]['name']
export type ResolvedScheme = 'light' | 'dark'

export const isBaseThemeColor = (value: unknown): value is BaseThemeColor =>
  BASE_THEME_COLORS.some((item) => item.name === value)

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
