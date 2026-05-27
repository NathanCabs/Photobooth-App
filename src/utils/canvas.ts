import { getFilterCss } from './filters'
import type { FilterId } from '../types'
import { PHOTO_SLOT_HEIGHT, PHOTO_SLOT_WIDTH } from './borders'

export function waitForVideoDimensions(
  video: HTMLVideoElement,
  timeoutMs = 5000,
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (video.videoWidth > 0 && video.videoHeight > 0) {
      resolve()
      return
    }

    const cleanup = () => {
      clearTimeout(timeout)
      video.removeEventListener('loadedmetadata', onUpdate)
      video.removeEventListener('resize', onUpdate)
    }

    const onUpdate = () => {
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        cleanup()
        resolve()
      }
    }

    const timeout = setTimeout(() => {
      cleanup()
      reject(new Error('Video dimensions not available'))
    }, timeoutMs)

    video.addEventListener('loadedmetadata', onUpdate)
    video.addEventListener('resize', onUpdate)
  })
}

export function captureFrame(
  video: HTMLVideoElement,
  filterId: FilterId,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = PHOTO_SLOT_WIDTH
  canvas.height = PHOTO_SLOT_HEIGHT
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas

  const vw = video.videoWidth
  const vh = video.videoHeight
  if (vw === 0 || vh === 0) return canvas

  const targetAspect = PHOTO_SLOT_WIDTH / PHOTO_SLOT_HEIGHT
  const videoAspect = vw / vh

  let sx = 0
  let sy = 0
  let sw = vw
  let sh = vh

  if (videoAspect > targetAspect) {
    sw = vh * targetAspect
    sx = (vw - sw) / 2
  } else {
    sh = vw / targetAspect
    sy = (vh - sh) / 2
  }

  ctx.filter = getFilterCss(filterId)
  ctx.translate(PHOTO_SLOT_WIDTH, 0)
  ctx.scale(-1, 1)
  ctx.drawImage(video, sx, sy, sw, sh, 0, 0, PHOTO_SLOT_WIDTH, PHOTO_SLOT_HEIGHT)
  ctx.setTransform(1, 0, 0, 1, 0, 0)

  return canvas
}

export function canvasToDataUrl(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL('image/jpeg', 0.92)
}

export function downloadCanvas(
  canvas: HTMLCanvasElement,
  filename: string,
  mime: 'image/png' | 'image/jpeg' = 'image/png',
) {
  canvas.toBlob(
    (blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    },
    mime,
    mime === 'image/jpeg' ? 0.92 : undefined,
  )
}

export async function shareCanvas(canvas: HTMLCanvasElement): Promise<boolean> {
  if (!navigator.share || !navigator.canShare) return false

  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        resolve(false)
        return
      }
      const file = new File([blob], `photobooth-${Date.now()}.png`, {
        type: 'image/png',
      })
      if (!navigator.canShare({ files: [file] })) {
        resolve(false)
        return
      }
      try {
        await navigator.share({ files: [file], title: 'Photobooth strip' })
        resolve(true)
      } catch {
        resolve(false)
      }
    }, 'image/png')
  })
}
