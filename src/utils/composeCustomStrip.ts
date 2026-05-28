import { CUSTOM_STRIP_WIDTH } from './borders'
import { FRAME_ASSETS } from '../data/frameAssets'
import { getFrameMaskAssets } from './frameMask'
import type { HoleBounds } from './frameMask'

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    img.src = src
  })
}

function drawCoverCropped(
  ctx: CanvasRenderingContext2D,
  photo: HTMLImageElement,
  bounds: HoleBounds,
) {
  const { x, y, w, h } = bounds
  const photoAspect = photo.naturalWidth / photo.naturalHeight
  const holeAspect = w / h

  let sx = 0
  let sy = 0
  let sw = photo.naturalWidth
  let sh = photo.naturalHeight

  if (photoAspect > holeAspect) {
    sw = photo.naturalHeight * holeAspect
    sx = (photo.naturalWidth - sw) / 2
  } else {
    sh = photo.naturalWidth / holeAspect
    sy = (photo.naturalHeight - sh) / 2
  }

  ctx.drawImage(photo, sx, sy, sw, sh, x, y, w, h)
}

async function composeFramedCell(
  photo: HTMLImageElement,
  frameSrc: string,
  frame: HTMLImageElement,
): Promise<HTMLCanvasElement> {
  const { holeMask, frameOverlay, holeBounds, width, height } =
    getFrameMaskAssets(frameSrc, frame)

  const cell = document.createElement('canvas')
  cell.width = width
  cell.height = height
  const ctx = cell.getContext('2d')
  if (!ctx) return cell

  drawCoverCropped(ctx, photo, holeBounds)
  ctx.globalCompositeOperation = 'destination-in'
  ctx.drawImage(holeMask, 0, 0)
  ctx.globalCompositeOperation = 'source-over'
  ctx.drawImage(frameOverlay, 0, 0)

  return cell
}

function scaleCellToWidth(
  cell: HTMLCanvasElement,
  targetWidth: number,
): HTMLCanvasElement {
  if (cell.width === targetWidth) return cell

  const scale = targetWidth / cell.width
  const scaled = document.createElement('canvas')
  scaled.width = targetWidth
  scaled.height = Math.round(cell.height * scale)
  const ctx = scaled.getContext('2d')
  if (!ctx) return cell
  ctx.drawImage(cell, 0, 0, scaled.width, scaled.height)
  return scaled
}

export async function composeCustomStrip(
  photoDataUrls: string[],
): Promise<HTMLCanvasElement> {
  const count = Math.min(photoDataUrls.length, FRAME_ASSETS.length)
  if (count === 0) {
    const empty = document.createElement('canvas')
    empty.width = CUSTOM_STRIP_WIDTH
    empty.height = 1
    return empty
  }

  const frameSrcs = FRAME_ASSETS.slice(0, count)
  const [photos, frames] = await Promise.all([
    Promise.all(photoDataUrls.slice(0, count).map(loadImage)),
    Promise.all(frameSrcs.map(loadImage)),
  ])

  const cells = await Promise.all(
    photos.map((photo, i) => composeFramedCell(photo, frameSrcs[i], frames[i])),
  )

  const scaledCells = cells.map((cell) => scaleCellToWidth(cell, CUSTOM_STRIP_WIDTH))
  const stripHeight = scaledCells.reduce((sum, c) => sum + c.height, 0)

  const strip = document.createElement('canvas')
  strip.width = CUSTOM_STRIP_WIDTH
  strip.height = stripHeight
  const ctx = strip.getContext('2d')
  if (!ctx) return strip

  let y = 0
  for (const cell of scaledCells) {
    ctx.drawImage(cell, 0, y)
    y += cell.height
  }

  return strip
}
