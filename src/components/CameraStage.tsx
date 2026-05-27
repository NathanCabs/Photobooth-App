import type { RefObject } from 'react'
import type { FilterId } from '../types'
import { getFilterCss } from '../utils/filters'

type CameraStageProps = {
  videoRef: RefObject<HTMLVideoElement | null>
  filterId: FilterId
  ready: boolean
  loading: boolean
  countdown: number | null
  flash: boolean
  capturing: boolean
}

export function CameraStage({
  videoRef,
  filterId,
  ready,
  loading,
  countdown,
  flash,
  capturing,
}: CameraStageProps) {
  return (
    <div className="relative aspect-[3/4] w-full max-w-2xl overflow-hidden rounded-2xl bg-black ring-2 ring-zinc-700 lg:max-w-3xl">
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

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
          <p className="text-sm text-zinc-300">Starting camera…</p>
        </div>
      )}

      {!ready && !loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
          <p className="text-sm text-zinc-500">Camera preview</p>
        </div>
      )}

      {countdown !== null && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/40"
          aria-live="assertive"
          aria-atomic
        >
          <span className="text-8xl font-bold text-white motion-reduce:animate-none animate-ping">
            {countdown}
          </span>
        </div>
      )}

      {capturing && countdown === null && (
        <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-sm text-white">
          Capturing…
        </div>
      )}

      {flash && (
        <div className="pointer-events-none absolute inset-0 bg-white/90 transition-opacity" />
      )}
    </div>
  )
}
