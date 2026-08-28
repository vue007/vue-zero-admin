<template>
  <div
    class="bg-wavys absolute top-0 left-0 isolate h-full w-full overflow-hidden"
    :class="cls"
    :style="{ backgroundColor: canvasBg }"
  >
    <svg
      ref="svgRef"
      class="bg-wavys__svg"
      :viewBox="`0 0 ${VIEW_W} ${VIEW_H}`"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          v-for="wave in waves"
          :id="wave.gradId"
          :key="wave.gradId"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="0"
          :y2="VIEW_H"
        >
          <stop offset="0" :stop-color="wave.from" />
          <stop offset="1" :stop-color="wave.to" />
        </linearGradient>
      </defs>
      <path
        v-for="wave in waves"
        :key="wave.id"
        :data-layer="wave.i"
        :fill="`url(#${wave.gradId})`"
        :fill-opacity="layerOpacity"
        :d="wave.d0"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { getBgFrameDelayMs, getBgPerfTier } from '@/utils/bgPerformance'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const cls = computed(() => attrs.class as string)

interface WavyBackgroundProps {
  colors?: string[]
  bgColor?: string
  speed?: number
  waveOpacity?: number
  waveWidth?: number
  top?: number
  blur?: number
  /** loading.io: number of wave layers (1–10) */
  layer?: number
  /** loading.io: half-waves across the width (2–20) */
  peak?: number
  /** loading.io: how much layers differ in phase (0–1) */
  diverge?: number
  /** loading.io: left–right tilt (-1–1) */
  slope?: number
  /** loading.io: amplitude as a fraction of height (0–1) */
  scale?: number
  /** loading.io: vertical pack position (0–1) */
  offset?: number
  dark?: boolean
  paused?: boolean
  [key: string]: any
}

const props = withDefaults(defineProps<WavyBackgroundProps>(), {
  colors: () => ['#e0f2fe', '#67e8f9', '#22d3ee', '#0ea5e9', '#164e63', '#0f172a', '#020617'],
  bgColor: '#e0f2fe',
  speed: 1,
  waveOpacity: 0.82,
  waveWidth: 52,
  top: 0.4,
  blur: 0,
  layer: 6,
  peak: 5,
  diverge: 0.41,
  slope: 0.21,
  scale: 0.32,
  offset: 0.4,
  dark: true,
  paused: false,
})

const VIEW_W = 1824
const VIEW_H = 1305
const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
const svgRef = useTemplateRef<SVGSVGElement>('svgRef')

const running = ref(false)
let rafId = 0
let timeoutId: number | undefined
let phase = 0
let lastStamp = 0
const TIME_SCALE = 0.085

const canvasBg = computed(() => props.colors?.[0] || props.bgColor || '#e0f2fe')
const opacity = computed(() => Math.min(1, Math.max(0.1, props.waveOpacity ?? 0.88)))
const layerCount = computed(() => {
  const max = getBgPerfTier() === 'low' ? 4 : 8
  return Math.max(1, Math.min(max, Math.round(props.layer ?? 6)))
})
/**
 * waveOpacity 表示所有波浪叠加后的目标不透明度。
 * 如果每层都直接使用该值，多层重叠会趋近实色，形成突兀的矩形分层。
 */
const layerOpacity = computed(() => 1 - (1 - opacity.value) ** (1 / layerCount.value))
const peakCount = computed(() => Math.max(2, Math.min(20, Math.round(props.peak ?? 5))))

function fmt(n: number) {
  return n.toFixed(2)
}

/** Stable 0–1 noise from layer index so speed jitter doesn't change every frame. */
function layerRand(i: number, salt: number) {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453
  return x - Math.floor(x)
}

function layerWave(i: number, x: number, time: number) {
  const n = layerCount.value
  const u = n <= 1 ? 1 : i / (n - 1)
  const peak = peakCount.value
  const offset = props.offset ?? 0.4
  const scale = props.scale ?? 0.32
  const slope = props.slope ?? 0.21
  const diverge = props.diverge ?? 0.41

  const top = VIEW_H * (0.2 + (offset - 0.4) * 0.25)
  const bot = VIEW_H * (0.9 + (offset - 0.4) * 0.15)
  const mid = top + (bot - top) * u
  const amp = VIEW_H * scale * 0.62 * (0.55 + 0.45 * u)

  const baseSpeed = 0.45 + (n <= 1 ? 0.55 : i * (1.05 / (n - 1)))
  const speedMul = baseSpeed * (0.82 + layerRand(i, 1) * 0.44)

  // Standing-wave mix: crests morph in place instead of sliding L→R.
  const harmonics = [
    { k: peak * 0.48, a: 1, w: 0.48 },
    { k: peak * 0.86, a: 0.55, w: 0.76 },
    { k: peak * 1.18, a: 0.22, w: 1.12 },
    { k: peak * 0.24, a: 0.48, w: 0.33 },
  ]

  let wave = 0
  let dWave = 0
  let weight = 0
  for (let h = 0; h < harmonics.length; h++) {
    const spec = harmonics[h]!
    const rx = layerRand(i, 11 + h)
    const rt = layerRand(i, 21 + h)
    const k = Math.PI * spec.k * (0.82 + rx * 0.4)
    const w = speedMul * spec.w * (0.7 + rt * 0.55)
    const px = rx * Math.PI * 2 + i * diverge * 0.55
    const pt = rt * Math.PI * 2 + i * 0.85
    const spatial = Math.sin(k * x + px)
    const temporal = Math.sin(w * time + pt)
    wave += spec.a * spatial * temporal
    dWave += spec.a * k * Math.cos(k * x + px) * temporal
    weight += spec.a
  }
  const gain = 1.32
  wave = (wave / weight) * gain
  dWave = (dWave / weight) * gain

  // Slow standing envelope: mild thickness variation, not sharp spikes.
  const ek = Math.PI * (0.95 + layerRand(i, 31) * 0.45)
  const ew = speedMul * (0.18 + layerRand(i, 32) * 0.12)
  const epx = layerRand(i, 33) * Math.PI * 2
  const ept = layerRand(i, 34) * Math.PI * 2
  const eSpatial = Math.sin(ek * x + epx)
  const eTemporal = Math.sin(ew * time + ept)
  const env = 0.64 + 0.42 * (0.5 + 0.5 * eSpatial * eTemporal)
  const dEnv = 0.42 * 0.5 * ek * Math.cos(ek * x + epx) * eTemporal

  const tilt = slope * (x - 0.5) * VIEW_H
  return {
    y: mid + amp * env * wave + tilt,
    dy: amp * (dEnv * wave + env * dWave) + slope * VIEW_H,
  }
}

/** Hermite cubics along a sine: C1 at every join, no quadratic kinks. */
function buildPath(i: number, time: number) {
  const peak = peakCount.value
  const steps = peak * 4
  const p0 = layerWave(i, 0, time)

  let d = `M 0 ${fmt(p0.y)}`
  for (let s = 0; s < steps; s++) {
    const t0 = s / steps
    const t1 = (s + 1) / steps
    const a = s === 0 ? p0 : layerWave(i, t0, time)
    const b = layerWave(i, t1, time)
    const dt = t1 - t0
    const dx = dt * VIEW_W
    const c1x = t0 * VIEW_W + dx / 3
    const c1y = a.y + (a.dy * dt) / 3
    const c2x = t1 * VIEW_W - dx / 3
    const c2y = b.y - (b.dy * dt) / 3
    d += ` C ${fmt(c1x)} ${fmt(c1y)} ${fmt(c2x)} ${fmt(c2y)} ${fmt(t1 * VIEW_W)} ${fmt(b.y)}`
  }
  d += ` L ${VIEW_W} ${VIEW_H} L 0 ${VIEW_H} Z`
  return d
}

const waves = computed(() => {
  const stops = [...(props.colors ?? [])]
  const n = layerCount.value
  while (stops.length < n + 1) stops.push(stops[stops.length - 1] || '#081c54')

  return Array.from({ length: n }, (_, i) => ({
    i,
    id: `${uid}-${i}`,
    gradId: `swell-${uid}-${i}`,
    from: stops[i]!,
    to: stops[i + 1]!,
    d0: buildPath(i, 0),
  }))
})

function nowSec() {
  return performance.now() / 1000
}

function speedNow() {
  return Math.max(0.08, Number(props.speed) || 1)
}

function advancePhase() {
  const t = nowSec()
  if (running.value && lastStamp) {
    phase += (t - lastStamp) * speedNow() * TIME_SCALE
  }
  lastStamp = running.value ? t : 0
  return phase
}

function paint() {
  const time = advancePhase()
  const svg = svgRef.value
  if (!svg) return
  const paths = svg.querySelectorAll('path[data-layer]')
  paths.forEach((node) => {
    const i = Number((node as SVGPathElement).dataset.layer)
    if (Number.isNaN(i)) return
    node.setAttribute('d', buildPath(i, time))
  })
}

function render() {
  if (!running.value) return
  paint()
  timeoutId = window.setTimeout(() => {
    if (!running.value) return
    rafId = requestAnimationFrame(render)
  }, getBgFrameDelayMs())
}

function pause() {
  if (!running.value) return
  advancePhase()
  running.value = false
  lastStamp = 0
  cancelAnimationFrame(rafId)
  if (timeoutId !== undefined) {
    clearTimeout(timeoutId)
    timeoutId = undefined
  }
  paint()
}

function play() {
  if (running.value) return
  lastStamp = nowSec()
  running.value = true
  render()
}

watch(waves, () => nextTick(() => paint()))
watch(
  () => props.paused,
  (paused) => {
    if (paused) pause()
    else play()
  },
)

onMounted(() => {
  nextTick(() => {
    paint()
    if (!props.paused) play()
  })
})

onBeforeUnmount(() => {
  pause()
})

defineExpose({
  pause,
  play,
})
</script>

<style scoped lang="scss">
.bg-wavys__svg {
  position: absolute;
  inset: 0;
  z-index: 0;
  display: block;
  width: 100%;
  height: 100%;
  pointer-events: none;
  shape-rendering: auto;
  transform: scaleY(-1);
  transform-origin: center;
}
</style>
