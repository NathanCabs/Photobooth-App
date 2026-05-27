import { useEffect, useState } from 'react'
import {
  loadCustomFrameLayouts,
  type CustomFrameLayout,
} from '../utils/customFrameLayouts'

export function useCustomFrameLayouts(enabled: boolean) {
  const [layouts, setLayouts] = useState<CustomFrameLayout[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) {
      setLayouts(null)
      setError(null)
      return
    }

    let cancelled = false
    setLayouts(null)
    setError(null)

    void loadCustomFrameLayouts()
      .then((loaded) => {
        if (!cancelled) setLayouts(loaded)
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load custom frames')
      })

    return () => {
      cancelled = true
    }
  }, [enabled])

  return { layouts, error }
}
