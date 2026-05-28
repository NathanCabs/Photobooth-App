import type { RefObject } from 'react'
import type { FilterId } from '../types'
import type { CustomFrameLayout } from '../utils/customFrameLayouts'
import { getFilterCss } from '../utils/filters'

//Cameras props
type CameraStageProps = {
  videoRef: RefObject<HTMLVideoElement | null>
  filterId: FilterId
  customLayouts: CustomFrameLayout[] | null
  currentShot: number
  //capturedCount: number
  ready: boolean
  loading: boolean
  countdown: number | null
  flash: boolean
  capturing: boolean
}

/**
   
 
function getActiveShotIndex(currentShot: number, photoCount: number): number {
  if (currentShot > 0) return Math.min(currentShot - 1, 3)
  return Math.min(photoCount, 3)
}**/

export function CameraStage({
  videoRef,
  filterId,
  customLayouts,
  currentShot,
  //capturedCount,
  ready,
  loading,
  countdown,
  flash,
  capturing,
}: CameraStageProps) {
  const shotIndex = currentShot
  const customLayout = customLayouts ? customLayouts[shotIndex] : null

  const stageStyle = customLayout
    ? {
        width: `${customLayout.frameWidth}px`,
        maxWidth: '100%',
        aspectRatio: `${customLayout.frameWidth} / ${customLayout.frameHeight}`,
      }
    : undefined

  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-black ring-2 ring-zinc-700"
      style={stageStyle}
    >
      {customLayout && (
        <div
          className="absolute overflow-hidden"
          style={{
            left: customLayout.holeBox.left,
            top: customLayout.holeBox.top,
            width: customLayout.holeBox.width,
            height: customLayout.holeBox.height,
          }}
        >
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className="h-full w-full object-cover"
            style={{
              transform: 'scaleX(-1)',
              filter: getFilterCss(filterId),
            }}
          />
        </div>
      )}

      {customLayout && (
        <img
          src={customLayout.overlayUrl}
          alt=""
          className="pointer-events-none absolute inset-0 z-10 h-full w-full"
          aria-hidden
        />
      )}

      {!customLayout && <div className="aspect-[516/600] w-full max-w-md bg-zinc-900" />}

      {!customLayout && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-900/80">
          <p className="text-sm text-zinc-400">Loading frames…</p>
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70">
          <p className="text-sm text-zinc-300">Starting camera…</p>
        </div>
      )}

      {!ready && !loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-zinc-900">
          <p className="text-sm text-zinc-500">Camera preview</p>
        </div>
      )}

      {countdown !== null && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/40"
          aria-live="assertive"
          aria-atomic
        >
          <span className="text-8xl font-bold text-white motion-reduce:animate-none animate-ping">
            {countdown}
          </span>
        </div>
      )}

      {capturing && countdown === null && (
        <div className="absolute bottom-3 left-3 z-20 rounded-full bg-black/60 px-3 py-1 text-sm text-white">
          Capturing…
        </div>
      )}

      {flash && (
        <div className="pointer-events-none absolute inset-0 z-30 bg-white/90 transition-opacity" />
      )}
    </div>
  )
}
