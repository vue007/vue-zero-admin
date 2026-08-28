export type BgPerfTier = 'low' | 'mid' | 'high'

const FRAME_DELAY_MS: Record<BgPerfTier, number> = {
  low: 66,
  mid: 50,
  high: 33,
}

let cachedTier: BgPerfTier | undefined

/** Lightweight animation tier shared by the login wallpapers. */
export function getBgPerfTier(): BgPerfTier {
  if (cachedTier) return cachedTier
  if (typeof window === 'undefined') return 'mid'
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return 'low'

  const cores = navigator.hardwareConcurrency || 4
  cachedTier = cores <= 4 ? 'low' : cores >= 8 ? 'high' : 'mid'
  return cachedTier
}

export function getBgFrameDelayMs() {
  return FRAME_DELAY_MS[getBgPerfTier()]
}
