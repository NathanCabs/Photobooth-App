/** Pixels with R,G,B all below this value are treated as the photo hole. */

export type HoleBounds = { x: number; y: number; w: number; h: number }

export type FrameMaskAssets = {
  holeMask: HTMLCanvasElement
  frameOverlay: HTMLCanvasElement
  holeBounds: HoleBounds
  width: number
  height: number
}

const maskCache = new Map<string, FrameMaskAssets>()

function isHolePixel(a:number): boolean {
  return a < 10
}

function computeHoleBounds(
  data: Uint8ClampedArray,
  width: number,
  height: number,
): HoleBounds | null {
  let minX = width
  let minY = height
  let maxX = 0
  let maxY = 0
  let found = false

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      if (isHolePixel(data[i + 3])) {
        found = true
        if (x < minX) minX = x
        if (y < minY) minY = y
        if (x > maxX) maxX = x
        if (y > maxY) maxY = y
      }
    }
  }

  if (!found) return null
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 }
}

function buildMaskAssets(frame: HTMLImageElement): FrameMaskAssets {
  const width = frame.naturalWidth
  const height = frame.naturalHeight

  const source = document.createElement('canvas')
  source.width = width
  source.height = height
  const sourceCtx = source.getContext('2d')
  if (!sourceCtx) {
    throw new Error('Could not create canvas context for frame mask')
  }
  sourceCtx.drawImage(frame, 0, 0)
  const imageData = sourceCtx.getImageData(0, 0, width, height)
  const { data } = imageData

  const holeBounds = computeHoleBounds(data, width, height)
  if (!holeBounds) {
    throw new Error('No photo hole detected in frame image')
  }

  const holeMask = document.createElement('canvas')
  holeMask.width = width
  holeMask.height = height
  const holeMaskCtx = holeMask.getContext('2d')
  if (!holeMaskCtx) {
    throw new Error('Could not create hole mask canvas')
  }

  const holeMaskData = holeMaskCtx.createImageData(width, height)
  for (let i = 0; i < data.length; i += 4) {
    const hole = isHolePixel(data[i + 3])
    holeMaskData.data[i] = 255
    holeMaskData.data[i + 1] = 255
    holeMaskData.data[i + 2] = 255
    holeMaskData.data[i + 3] = hole ? 255 : 0
  }
  holeMaskCtx.putImageData(holeMaskData, 0, 0)

  const frameOverlay = document.createElement('canvas')
  frameOverlay.width = width
  frameOverlay.height = height
  const overlayCtx = frameOverlay.getContext('2d')
  if (!overlayCtx) {
    throw new Error('Could not create frame overlay canvas')
  }

  const overlayData = overlayCtx.createImageData(width, height)
  for (let i = 0; i < data.length; i += 4) {
    const hole = isHolePixel(data[i + 3])
    overlayData.data[i] = data[i]
    overlayData.data[i + 1] = data[i + 1]
    overlayData.data[i + 2] = data[i + 2]
    overlayData.data[i + 3] = hole ? 0 : data[i + 3]
  }
  overlayCtx.putImageData(overlayData, 0, 0)

  return { holeMask, frameOverlay, holeBounds, width, height }
}

export function getFrameMaskAssets(
  frameSrc: string,
  frame: HTMLImageElement,
): FrameMaskAssets {
  const cached = maskCache.get(frameSrc)
  if (cached) return cached

  const assets = buildMaskAssets(frame)
  maskCache.set(frameSrc, assets)
  return assets
}
