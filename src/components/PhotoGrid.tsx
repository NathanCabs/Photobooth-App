import { PHOTO_COUNT } from '../types'

type PhotoGridProps = {
  photos: string[]
  currentShot: number
}

export function PhotoGrid({ photos, currentShot }: PhotoGridProps) {
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
          return (
            <div
              key={i}
              className={`aspect-[3/4] overflow-hidden rounded-lg bg-zinc-800 ring-2 ${
                isNext ? 'ring-pink-400' : 'ring-transparent'
              }`}
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
