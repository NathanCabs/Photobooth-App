import { useCallback, useEffect, useState } from 'react'
import { composeStrip } from '../utils/composeStrip'
import { downloadCanvas, shareCanvas } from '../utils/canvas'

export function usePhotostrip(photos: string[]) {
  const [stripCanvas, setStripCanvas] = useState<HTMLCanvasElement | null>(null)
  const [stripUrl, setStripUrl] = useState<string | null>(null)
  const [composing, setComposing] = useState(false)
  const [composeError, setComposeError] = useState<string | null>(null)

  useEffect(() => {
    if (photos.length === 0) {
      setStripCanvas(null)
      setStripUrl(null)
      setComposeError(null)
      return
    }

    let cancelled = false
    setComposing(true)
    setComposeError(null)

    void composeStrip(photos)
      .then((canvas) => {
        if (cancelled) return
        setStripCanvas(canvas)
        setStripUrl(canvas.toDataURL('image/png'))
        setComposing(false)
      })
      .catch((err) => {
        if (cancelled) return
        console.error('composeStrip failed:', err)
        setComposeError('Failed to compose your strip. Please try retaking.')
        setComposing(false)
      })

    return () => {
      cancelled = true
    }
  }, [photos])

  const download = useCallback(
    (format: 'png' | 'jpeg') => {
      if (!stripCanvas) return
      const ext = format === 'jpeg' ? 'jpg' : 'png'
      const mime = format === 'jpeg' ? 'image/jpeg' : 'image/png'
      downloadCanvas(
        stripCanvas,
        `photobooth-${Date.now()}.${ext}`,
        mime,
      )
    },
    [stripCanvas],
  )

  const share = useCallback(async () => {
    if (!stripCanvas) return false
    return shareCanvas(stripCanvas)
  }, [stripCanvas])

  return { stripCanvas, stripUrl, composing, composeError, download, share }
}
