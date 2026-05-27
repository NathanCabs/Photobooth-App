import { useCallback, useRef, useState } from 'react'
import type { CaptureStatus, FilterId } from '../types'
import { COUNTDOWN_SECONDS, PHOTO_COUNT } from '../types'
import { canvasToDataUrl, captureFrame, waitForVideoDimensions } from '../utils/canvas'
import type { CustomFrameLayout } from '../utils/customFrameLayouts'

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

export type CaptureResult = 'completed' | 'cancelled'

export function useCapture() {
  const [status, setStatus] = useState<CaptureStatus>('idle')
  const [countdown, setCountdown] = useState<number | null>(null)
  const [photos, setPhotos] = useState<string[]>([])
  const [currentShot, setCurrentShot] = useState(0)
  const [flash, setFlash] = useState(false)
  const abortRef = useRef(false)
  const capturingRef = useRef(false)

  const clearCaptureUi = useCallback(() => {
    setStatus('idle')
    setCountdown(null)
    setPhotos([])
    setCurrentShot(0)
    setFlash(false)
  }, [])

  const reset = useCallback(() => {
    abortRef.current = true
    capturingRef.current = false
    clearCaptureUi()
  }, [clearCaptureUi])

  const runCapture = useCallback(
    async (
      video: HTMLVideoElement,
      filterId: FilterId,
      customLayouts: CustomFrameLayout[] | null,
    ): Promise<CaptureResult> => {
      if (capturingRef.current) {
        return 'cancelled'
      }

      capturingRef.current = true
      abortRef.current = false

      const finishCancelled = (): CaptureResult => {
        clearCaptureUi()
        return 'cancelled'
      }

      const runCountdown = async (): Promise<boolean> => {
        setStatus('countdown')
        for (let i = COUNTDOWN_SECONDS; i >= 1; i--) {
          if (abortRef.current) return false
          setCountdown(i)
          await delay(1000)
        }
        setCountdown(null)
        return !abortRef.current
      }

      try {
        setPhotos([])
        setCurrentShot(0)

        try {
          await waitForVideoDimensions(video)
        } catch {
          return finishCancelled()
        }

        if (abortRef.current) return finishCancelled()

        if (!customLayouts) {
          return finishCancelled()
        }

        const captured: string[] = []

        for (let shot = 0; shot < PHOTO_COUNT; shot++) {
          if (abortRef.current) return finishCancelled()

          if (!(await runCountdown())) return finishCancelled()

          setStatus('capturing')
          setCurrentShot(shot + 1)
          setFlash(true)
          await delay(80)
          setFlash(false)

          if (abortRef.current) return finishCancelled()

          if (video.videoWidth === 0 || video.videoHeight === 0) {
            return finishCancelled()
          }

          const { holeBounds } = customLayouts[shot]
          const frame = captureFrame(video, filterId, {
            width: holeBounds.w,
            height: holeBounds.h,
          })
          captured.push(canvasToDataUrl(frame))
          setPhotos([...captured])
        }

        if (abortRef.current) return finishCancelled()

        setStatus('done')
        return 'completed'
      } finally {
        capturingRef.current = false
      }
    },
    [clearCaptureUi],
  )

  return {
    status,
    countdown,
    photos,
    currentShot,
    flash,
    runCapture,
    reset,
  }
}
