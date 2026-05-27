import type { BorderId } from '../types'
import {
  FOOTER_HEIGHT,
  HEADER_HEIGHT,
  PHOTO_GAP,
  PHOTO_SLOT_HEIGHT,
  PHOTO_SLOT_WIDTH,
  STRIP_PADDING,
  STRIP_WIDTH,
} from './borders'

/** polaroid pad (12 top + 12 bottom) + bottomExtra (36) — matches drawPhotoCell */
const POLAROID_EXTRA_PER_PHOTO = 60

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function drawSprocketHoles(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  height: number,
) {
  const holeR = 5
  const spacing = 28
  let cy = y + 16
  while (cy < y + height - 16) {
    ctx.beginPath()
    ctx.arc(x, cy, holeR, 0, Math.PI * 2)
    ctx.fill()
    cy += spacing
  }
}

function drawPhotoCell(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  borderId: BorderId,
) {
  const cellW = PHOTO_SLOT_WIDTH
  const cellH = PHOTO_SLOT_HEIGHT

  if (borderId === 'polaroid') {
    const pad = 12
    const bottomExtra = 36
    ctx.fillStyle = '#fafafa'
    ctx.fillRect(x - pad, y - pad, cellW + pad * 2, cellH + pad + bottomExtra)
    ctx.drawImage(img, x, y, cellW, cellH)
    return
  }

  if (borderId === 'film') {
    ctx.fillStyle = '#18181b'
    ctx.fillRect(x - 8, y - 4, cellW + 16, cellH + 8)
    ctx.fillStyle = '#27272a'
    ctx.fillRect(x, y, cellW, cellH)
    ctx.drawImage(img, x, y, cellW, cellH)
    return
  }

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(x - 4, y - 4, cellW + 8, cellH + 8)
  ctx.drawImage(img, x, y, cellW, cellH)

  if (borderId === 'classic') {
    ctx.strokeStyle = '#e4e4e7'
    ctx.lineWidth = 2
    ctx.strokeRect(x, y, cellW, cellH)
  }
}

export async function composeStrip(
  photoDataUrls: string[],
  borderId: BorderId,
  options: { showDate?: boolean; title?: string } = {},
): Promise<HTMLCanvasElement> {
  const images = await Promise.all(photoDataUrls.map(loadImage))
  const photoCount = images.length
  const innerW = PHOTO_SLOT_WIDTH
  const photoX = (STRIP_WIDTH - innerW) / 2

  const extraPerPhoto = borderId === 'polaroid' ? POLAROID_EXTRA_PER_PHOTO : 0

  const photosBlockHeight =
    photoCount * PHOTO_SLOT_HEIGHT + (photoCount - 1) * PHOTO_GAP + photoCount * extraPerPhoto

  const headerH = options.showDate || options.title ? HEADER_HEIGHT : 0
  const footerH = options.showDate ? FOOTER_HEIGHT : 0
  const stripHeight = STRIP_PADDING * 2 + headerH + photosBlockHeight + footerH

  const canvas = document.createElement('canvas')
  canvas.width = STRIP_WIDTH
  canvas.height = stripHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas

  if (borderId === 'branded') {
    ctx.fillStyle = '#fdf2f8'
    ctx.fillRect(0, 0, STRIP_WIDTH, stripHeight)
    ctx.fillStyle = '#f472b6'
    ctx.fillRect(0, 0, STRIP_WIDTH, 8)
    ctx.fillRect(0, stripHeight - 8, STRIP_WIDTH, 8)
  } else if (borderId === 'film') {
    ctx.fillStyle = '#09090b'
    ctx.fillRect(0, 0, STRIP_WIDTH, stripHeight)
    ctx.fillStyle = '#3f3f46'
    drawSprocketHoles(ctx, 14, STRIP_PADDING, stripHeight - STRIP_PADDING * 2)
    drawSprocketHoles(ctx, STRIP_WIDTH - 14, STRIP_PADDING, stripHeight - STRIP_PADDING * 2)
  } else {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, STRIP_WIDTH, stripHeight)
  }

  let y = STRIP_PADDING + headerH

  if (options.title) {
    ctx.fillStyle = borderId === 'film' ? '#fafafa' : '#18181b'
    ctx.font = 'bold 16px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(options.title, STRIP_WIDTH / 2, STRIP_PADDING + 22)
  } else if (options.showDate) {
    ctx.fillStyle = borderId === 'film' ? '#a1a1aa' : '#52525b'
    ctx.font = '14px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(
      new Date().toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      STRIP_WIDTH / 2,
      STRIP_PADDING + 22,
    )
  }

  for (const img of images) {
    drawPhotoCell(ctx, img, photoX, y, borderId)
    y += PHOTO_SLOT_HEIGHT + PHOTO_GAP + extraPerPhoto
  }

  if (options.showDate && footerH > 0) {
    ctx.fillStyle = borderId === 'film' ? '#71717a' : '#a1a1aa'
    ctx.font = '11px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('photobooth', STRIP_WIDTH / 2, stripHeight - STRIP_PADDING / 2)
  }

  return canvas
}
