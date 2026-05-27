import { useCallback, useEffect, useRef, useState } from 'react'

export type CameraError = 'denied' | 'notfound' | 'unsupported' | 'unknown'

const MAX_ATTACH_FRAMES = 60

function attachStreamToVideo(
  stream: MediaStream,
  video: HTMLVideoElement,
): Promise<void> {
  video.srcObject = stream
  return video.play().then(() => undefined)
}

export function useCamera(active: boolean) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<CameraError | null>(null)

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    setReady(false)
    setError(null)
  }, [])

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('unsupported')
      return
    }

    setLoading(true)
    setError(null)
    stopCamera()

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      })
      streamRef.current = stream

      const tryAttach = async (): Promise<boolean> => {
        const video = videoRef.current
        if (!video) return false
        await attachStreamToVideo(stream, video)
        setReady(true)
        return true
      }

      if (await tryAttach()) return

      await new Promise<void>((resolve, reject) => {
        let frames = 0

        const tick = () => {
          void tryAttach().then((ok) => {
            if (ok) {
              resolve()
            } else if (frames >= MAX_ATTACH_FRAMES) {
              stream.getTracks().forEach((t) => t.stop())
              streamRef.current = null
              setError('unknown')
              reject(new Error('Video element not available'))
            } else {
              frames++
              requestAnimationFrame(tick)
            }
          })
        }

        requestAnimationFrame(tick)
      })
    } catch (err) {
      const name = err instanceof DOMException ? err.name : ''
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        setError('denied')
      } else if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
        setError('notfound')
      } else if (!(err instanceof Error && err.message === 'Video element not available')) {
        setError('unknown')
      }
    } finally {
      setLoading(false)
    }
  }, [stopCamera])

  useEffect(() => {
    if (active) {
      void startCamera()
    } else {
      stopCamera()
    }
    return () => stopCamera()
  }, [active, startCamera, stopCamera])

  return {
    videoRef,
    ready,
    loading,
    error,
    startCamera,
    stopCamera,
  }
}
