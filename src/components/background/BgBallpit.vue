<template>
  <div
    ref="containerRef"
    class="bg-ballpit relative h-full w-full overflow-hidden"
    :class="props.className"
    :style="{ backgroundColor: canvasBg }"
  >
    <svg
      ref="svgRef"
      class="bg-ballpit__svg"
      :viewBox="`0 0 ${VIEW_W} ${VIEW_H}`"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <filter
          v-for="layer in layerConfigs"
          :id="layer.filterId"
          :key="layer.filterId"
          x="-2"
          y="-2"
          width="5"
          height="5"
          color-interpolation-filters="sRGB"
        >
          <feGaussianBlur :stdDeviation="layer.blur" />
        </filter>
      </defs>

      <g
        v-for="layer in layerConfigs"
        :key="layer.id"
        :data-depth="layer.id"
        :filter="`url(#${layer.filterId})`"
      >
        <circle
          v-for="ball in ballsByLayer[layer.id]"
          :key="ball.id"
          :data-ball-id="ball.id"
          :cx="ball.x"
          :cy="ball.y"
          :r="ball.radius"
          :fill="ball.color"
          :fill-opacity="ball.opacity"
          :transform="ball.initialTransform"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            :values="ball.motionValues"
            :dur="ball.motionDuration"
            :begin="ball.motionBegin"
            repeatCount="indefinite"
            calcMode="spline"
            :keyTimes="MOTION_KEY_TIMES"
            :keySplines="MOTION_KEY_SPLINES"
          />
        </circle>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { getBgFrameDelayMs } from '@/utils/bgPerformance'

type NumericColor = number | string

/** 保留旧 Ballpit 参数，避免已存在的外部调用在迁移 SVG 后失效。 */
interface MaterialParams {
  metalness?: number
  roughness?: number
  clearcoat?: number
  clearcoatRoughness?: number
  envMapIntensity?: number
}

interface Props {
  className?: string
  followCursor?: boolean
  count?: number
  colors?: NumericColor[]
  backgroundColor?: NumericColor
  dark?: boolean
  speed?: number
  duration?: number
  movement?: number
  blurriness?: number
  radius?: number
  seed?: number
  paused?: boolean

  /** 旧版 Three.js Ballpit 兼容字段。 */
  ambientColor?: NumericColor
  ambientIntensity?: number
  lightIntensity?: number
  materialParams?: MaterialParams
  minSize?: number
  maxSize?: number
  size0?: number
  gravity?: number
  friction?: number
  wallBounce?: number
  maxVelocity?: number
  maxX?: number
  maxY?: number
  maxZ?: number
  controlSphere0?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  className: '',
  followCursor: false,
  count: 64,
  colors: () => [0xa78bfa, 0xffcdfd, 0xff7a59, 0x8fe8ff, 0x6ee7b7, 0xfff08f],
  dark: false,
  speed: 0.1,
  duration: 10,
  movement: 16,
  blurriness: 0.1,
  radius: 0.7,
  seed: 37,
  paused: false,

  ambientIntensity: 1,
  lightIntensity: 200,
  materialParams: () => ({}),
  minSize: 0.5,
  maxSize: 1,
  size0: 1,
  gravity: 0.22,
  friction: 0.9975,
  wallBounce: 0.95,
  maxVelocity: 0.15,
  maxX: 5,
  maxY: 5,
  maxZ: 2,
  controlSphere0: false,
})

const VIEW_W = 1563
const VIEW_H = 1149
const TAU = Math.PI * 2
const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
const containerRef = useTemplateRef<HTMLDivElement>('containerRef')
const svgRef = useTemplateRef<SVGSVGElement>('svgRef')

type DepthId = 0 | 1 | 2 | 3 | 4 | 5

interface BallData {
  id: number
  depth: DepthId
  x: number
  y: number
  radius: number
  color: string
  opacity: number
  initialTransform: string
  motionValues: string
  motionDuration: string
  motionBegin: string
}

let requestedPlay = !props.paused
let inViewport = true
let intersectionObserver: IntersectionObserver | undefined
let mounted = false
let running = false
let rafId = 0
let timeoutId: number | undefined
let timeline = 0
let lastTimestamp = 0

const MOTION_STEPS = 8
const MOTION_KEY_TIMES = Array.from({ length: MOTION_STEPS + 1 }, (_, index) =>
  (index / MOTION_STEPS).toFixed(3),
).join(';')
const MOTION_KEY_SPLINES = Array.from({ length: MOTION_STEPS }, () => '0.45 0 0.55 1').join(';')

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function toCssColor(value: NumericColor | undefined, fallback: string) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `#${Math.max(0, Math.min(0xffffff, Math.round(value))).toString(16).padStart(6, '0')}`
  }
  if (typeof value === 'string' && value.trim()) return value
  return fallback
}

function stableRandom(index: number, salt: number) {
  const x = Math.sin((index + 1) * 127.1 + (salt + props.seed) * 311.7) * 43758.5453
  return x - Math.floor(x)
}

function createMotion(id: number) {
  const movement = clamp(Number(props.movement) || 0, 0, 100)
  const phase = stableRandom(id, 23) * TAU
  const direction = stableRandom(id, 29) > 0.5 ? 1 : -1
  const xScale = 0.58 + stableRandom(id, 31) * 0.42
  const yScale = 0.58 + stableRandom(id, 37) * 0.42
  const wobble = 0.08 + stableRandom(id, 41) * 0.1
  const wobblePhase = stableRandom(id, 43) * TAU

  const points = Array.from({ length: MOTION_STEPS + 1 }, (_, step) => {
    const theta = phase + direction * (step / MOTION_STEPS) * TAU
    const x = movement * (xScale * Math.cos(theta) + wobble * Math.sin(theta * 2 + wobblePhase))
    const y = movement * (yScale * Math.sin(theta) + wobble * Math.cos(theta * 2 + wobblePhase))
    return `${clamp(x, -movement, movement).toFixed(2)} ${clamp(y, -movement, movement).toFixed(2)}`
  })

  const baseDuration = Math.max(1, Number(props.duration) || 10)
  const duration = baseDuration * (0.88 + stableRandom(id, 47) * 0.24)
  const begin = -(stableRandom(id, 53) * duration)

  return {
    initialTransform: `translate(${points[0]})`,
    motionValues: points.join(';'),
    motionDuration: `${duration.toFixed(2)}s`,
    motionBegin: `${begin.toFixed(2)}s`,
  }
}

const canvasBg = computed(() =>
  toCssColor(
    props.backgroundColor ?? props.ambientColor,
    props.dark ? '#05080e' : '#ffffff',
  ),
)

const palette = computed(() => {
  const colors = (props.colors ?? [])
    .map((color) => toCssColor(color, ''))
    .filter(Boolean)

  const source = colors.length
    ? colors
    : ['#a78bfa', '#ffcdfd', '#ff7a59', '#8fe8ff', '#6ee7b7', '#fff08f']
  return Array.from({ length: 6 }, (_, index) => {
    const sourceIndex = Math.round((index / 5) * (source.length - 1))
    return source[sourceIndex]!
  })
})

const blurValues = computed(() => {
  const blur = clamp(Number(props.blurriness) || 0, 0, 1)
  return [blur * 200, blur * 140, blur * 90, blur * 50, blur * 25, blur * 10]
})

const layerConfigs = computed(() =>
  (
    [
      { id: 0 as const, opacity: 0.5, blur: blurValues.value[0]! },
      { id: 1 as const, opacity: 0.47, blur: blurValues.value[1]! },
      { id: 2 as const, opacity: 0.44, blur: blurValues.value[2]! },
      { id: 3 as const, opacity: 0.4, blur: blurValues.value[3]! },
      { id: 4 as const, opacity: 0.35, blur: blurValues.value[4]! },
      { id: 5 as const, opacity: 0.3, blur: blurValues.value[5]! },
    ] satisfies Array<{ id: DepthId; opacity: number; blur: number }>
  ).map((layer) => ({
    ...layer,
    filterId: `ballpit-blur-${uid}-${layer.id}`,
  })),
)

const balls = computed<BallData[]>(() => {
  const count = clamp(Math.round(props.count), 4, 100)
  const baseRadius = Math.min(VIEW_W, VIEW_H) * 0.088 * clamp(props.radius, 0.08, 5)
  const depthScale = [0.32, 0.44, 0.58, 0.72, 0.9, 1.08]
  const depthOpacity = [0.5, 0.47, 0.44, 0.4, 0.35, 0.3]

  return Array.from({ length: count }, (_, id) => {
    const ratio = (id + 0.5) / count
    let depth: DepthId = 5
    if (ratio < 0.12) depth = 0
    else if (ratio < 0.26) depth = 1
    else if (ratio < 0.42) depth = 2
    else if (ratio < 0.59) depth = 3
    else if (ratio < 0.78) depth = 4
    const randomRadius = 0.62 + stableRandom(id, 3) * 0.76

    // Loading.io 的参考 SVG 会把大量圆分布在画布左右之外，当前帧只露出约 40%。
    // 保留这段超出范围的“流带”，避免所有圆都挤在视口里。
    const x = -VIEW_W * 0.72 + stableRandom(id, 5) * VIEW_W * 2.44
    const y = -VIEW_H * 0.08 + stableRandom(id, 7) * VIEW_H * 1.16
    const motion = createMotion(id)

    return {
      id,
      depth,
      x,
      y,
      radius: baseRadius * depthScale[depth]! * randomRadius,
      color: palette.value[depth]!,
      opacity: depthOpacity[depth]!,
      ...motion,
    }
  })
})

const ballsByLayer = computed<Record<DepthId, BallData[]>>(() => {
  const grouped: Record<DepthId, BallData[]> = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [] }
  balls.value.forEach((ball) => grouped[ball.depth].push(ball))
  return grouped
})

function canAnimate() {
  return requestedPlay && inViewport && !document.hidden
}

function speedScale() {
  // loading.io 的 Speed 默认值是 0.1；全局速度变化只改变时间轴倍率，不重建圆节点。
  return Math.max(0.01, Number(props.speed) || 0.1) / 0.1
}

function stopLoop() {
  const svg = svgRef.value
  running = false
  cancelAnimationFrame(rafId)
  rafId = 0
  if (timeoutId !== undefined) {
    clearTimeout(timeoutId)
    timeoutId = undefined
  }
  lastTimestamp = 0
  svg?.pauseAnimations?.()
}

function renderTimeline(timestamp: number) {
  const svg = svgRef.value
  if (!running || !svg) return

  if (lastTimestamp) timeline += ((timestamp - lastTimestamp) / 1000) * speedScale()
  lastTimestamp = timestamp
  svg.setCurrentTime?.(timeline)

  timeoutId = window.setTimeout(() => {
    if (running) rafId = requestAnimationFrame(renderTimeline)
  }, getBgFrameDelayMs())
}

function startLoop() {
  const svg = svgRef.value
  if (!mounted || !svg || running) return

  // 原生 SMIL 保持暂停，由单一时间轴推进；速度变化不会修改 animateTransform 属性。
  svg.pauseAnimations?.()
  if (typeof svg.setCurrentTime !== 'function') {
    svg.unpauseAnimations?.()
    return
  }

  running = true
  lastTimestamp = 0
  rafId = requestAnimationFrame(renderTimeline)
}

function syncLoop() {
  if (canAnimate()) startLoop()
  else stopLoop()
}

function play() {
  requestedPlay = true
  syncLoop()
}

function pause() {
  requestedPlay = false
  syncLoop()
}

function handleVisibilityChange() {
  syncLoop()
}

watch(balls, () => nextTick(() => syncLoop()))
watch(
  () => props.paused,
  (paused) => {
    if (paused) pause()
    else play()
  },
)
onMounted(() => {
  mounted = true
  document.addEventListener('visibilitychange', handleVisibilityChange)
  if (containerRef.value) {
    intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        inViewport = entry?.isIntersecting ?? true
        syncLoop()
      },
      { threshold: 0 },
    )
    intersectionObserver.observe(containerRef.value)
  }

  nextTick(() => {
    syncLoop()
  })
})

onBeforeUnmount(() => {
  mounted = false
  requestedPlay = false
  stopLoop()
  intersectionObserver?.disconnect()
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})

defineExpose({ pause, play })
</script>

<style scoped lang="scss">
.bg-ballpit {
  pointer-events: none;
}

.bg-ballpit__svg {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  shape-rendering: auto;
}
</style>
