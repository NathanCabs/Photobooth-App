import { PHOTO_COUNT } from '../types'
import type { CustomFrameLayout } from '../utils/customFrameLayouts'

type PhotoGridProps = {
  photos: string[]
  currentShot: number
  customLayouts?: CustomFrameLayout[] | null
}

export function PhotoGrid({ photos, currentShot, customLayouts }: PhotoGridProps) {
  if (photos.length === 0 && currentShot === 0) return null

  return (
    <div className="w-full max-w-md">
      <p className="mb-2 text-sm text-zinc-500">
        {photos.length > 0
          ? `${photos.length} / ${PHOTO_COUNT} photos`
          : `Get ready…`}
      </p>
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: PHOTO_COUNT }, (_, i) => {
          const src = photos[i]
          const isNext = i === photos.length && currentShot > photos.length
          const layout = customLayouts?.[i]
          const aspectStyle = layout
            ? { aspectRatio: `${layout.holeBounds.w} / ${layout.holeBounds.h}` }
            : undefined
          const aspectClass = layout ? '' : 'aspect-[3/4]'

          return (
            <div
              key={i}
              className={`${aspectClass} overflow-hidden rounded-lg bg-zinc-800 ring-2 ${
                isNext ? 'ring-pink-400' : 'ring-transparent'
              }`}
              style={aspectStyle}
            >
              {src ? (
                <img src={src} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-zinc-600">
                  {i + 1}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
