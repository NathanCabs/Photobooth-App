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

      {/* Responsive grid instead of fixed 4 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {Array.from({ length: PHOTO_COUNT }, (_, i) => {
          const src = photos[i]

          // safer next-shot logic
          const isNext = i === photos.length && photos.length < PHOTO_COUNT

          const layout = customLayouts?.[i]

          // FIXED: proper numeric aspect ratio (no string math)
          const aspectStyle = layout
            ? {
                aspectRatio:
                  layout.holeBounds.w / layout.holeBounds.h,
              }
            : undefined

          return (
            <div
  key={i}
  className={`
    relative overflow-hidden rounded-lg bg-zinc-800 ring-2
    ${isNext ? 'ring-pink-400' : 'ring-transparent'}
    ${!layout ? 'aspect-[3/4]' : ''}
  `}
  style={aspectStyle}
>
  {/* BASE PHOTO */}
  {src ? (
    <img
      src={src}
      alt={`Photo ${i + 1}`}
      className="absolute inset-0 z-0 h-full w-full object-cover"
    />
  ) : (
    <div className="flex h-full items-center justify-center text-xs text-zinc-600">
      {i + 1}
    </div>
  )}

  {/* FRAME OVERLAY (THIS IS THE KEY FIX) */}
  {layout?.overlayUrl && src && (
    <img
      src={layout.overlayUrl}
      alt=""
      className="absolute inset-0 z-10 h-full w-full object-fill pointer-events-none"
    />
  )}
</div>
          )
        })}
      </div>
    </div>
  )
}