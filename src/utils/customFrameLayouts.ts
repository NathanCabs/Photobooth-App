import { FRAME_ASSETS } from './borders'
import { getFrameMaskAssets, type HoleBounds } from './frameMask'

/** Hole region as % of full frame — used for preview + video crop box. */
export type HoleBoxPercent = {
  left: string
  top: string
  width: string
  height: string
}

export type CustomFrameLayout = {
  src: string
  frameWidth: number
  frameHeight: number
  holeBounds: HoleBounds
  holeBox: HoleBoxPercent
  overlayUrl: string
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load frame: ${src}`))
    img.src = src
  })
}

export function holeBoxFromBounds(
  frameWidth: number,
  frameHeight: number,
  hole: HoleBounds,
): HoleBoxPercent {
  return {
    left: `${(hole.x / frameWidth) * 100}%`,
    top: `${(hole.y / frameHeight) * 100}%`,
    width: `${(hole.w / frameWidth) * 100}%`,
    height: `${(hole.h / frameHeight) * 100}%`,
  }
}

function layoutFromImage(src: string, img: HTMLImageElement): CustomFrameLayout {
  const { width, height, holeBounds, frameOverlay } = getFrameMaskAssets(src, img)
  return {
    src,
    frameWidth: width,
    frameHeight: height,
    holeBounds,
    holeBox: holeBoxFromBounds(width, height, holeBounds),
    overlayUrl: frameOverlay.toDataURL('image/png'),
  }
}

export async function loadCustomFrameLayouts(): Promise<CustomFrameLayout[]> {
  const images = await Promise.all(FRAME_ASSETS.map(loadImage))
  return FRAME_ASSETS.map((src, i) => layoutFromImage(src, images[i]))
}
