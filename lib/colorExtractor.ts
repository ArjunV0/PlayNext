import ColorThief from "colorthief"

const FALLBACK_HSL = { h: 271, s: 81, l: 56 }
const LIGHTNESS_MIN = 25
const LIGHTNESS_MAX = 65
const SATURATION_FLOOR = 30
const CANVAS_SIZE = 64
const PALETTE_COUNT = 5

const colorCache = new Map<string, { h: number; s: number; l: number }>()

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rNorm = r / 255
  const gNorm = g / 255
  const bNorm = b / 255

  const max = Math.max(rNorm, gNorm, bNorm)
  const min = Math.min(rNorm, gNorm, bNorm)
  const delta = max - min

  const l = (max + min) / 2

  if (delta === 0) {
    return { h: 0, s: 0, l: Math.round(l * 100) }
  }

  const s = delta / (1 - Math.abs(2 * l - 1))

  let h = 0
  if (max === rNorm) {
    h = ((gNorm - bNorm) / delta) % 6
  } else if (max === gNorm) {
    h = (bNorm - rNorm) / delta + 2
  } else {
    h = (rNorm - gNorm) / delta + 4
  }

  h = Math.round((h * 60 + 360) % 360)

  return {
    h,
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export async function extractColor(artworkUrl: string): Promise<{ h: number; s: number; l: number }> {
  const cached = colorCache.get(artworkUrl)
  if (cached) {
    return cached
  }

  try {
    const proxiedUrl = `/api/image-proxy?url=${encodeURIComponent(artworkUrl)}`
    const img = await loadImage(proxiedUrl)

    const canvas = document.createElement("canvas")
    canvas.width = CANVAS_SIZE
    canvas.height = CANVAS_SIZE
    const ctx = canvas.getContext("2d")
    ctx?.drawImage(img, 0, 0, CANVAS_SIZE, CANVAS_SIZE)

    const palette = new ColorThief().getPalette(img, PALETTE_COUNT)

    let totalWeight = 0
    let weightedH = 0
    let weightedS = 0
    let weightedL = 0

    for (const [r, g, b] of palette) {
      const hsl = rgbToHsl(r, g, b)
      const weight = hsl.s + 1
      totalWeight += weight
      weightedH += hsl.h * weight
      weightedS += hsl.s * weight
      weightedL += hsl.l * weight
    }

    const avgH = Math.round(weightedH / totalWeight)
    const avgS = Math.round(weightedS / totalWeight)
    const avgL = Math.round(weightedL / totalWeight)

    const clampedL = Math.max(LIGHTNESS_MIN, Math.min(LIGHTNESS_MAX, avgL))
    const boostedS = Math.max(SATURATION_FLOOR, avgS)

    const result = { h: avgH, s: boostedS, l: clampedL }
    colorCache.set(artworkUrl, result)
    return result
  } catch {
    return FALLBACK_HSL
  }
}

export { FALLBACK_HSL }
