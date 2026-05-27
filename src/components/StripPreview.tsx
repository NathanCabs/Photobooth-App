type StripPreviewProps = {
  stripUrl: string | null
  composing: boolean
  composeError: string | null
  onDownloadPng: () => void
  onDownloadJpeg: () => void
  onShare: () => void
  onRetake: () => void
  onBack: () => void
  canShare: boolean
}

export function StripPreview({
  stripUrl,
  composing,
  composeError,
  onDownloadPng,
  onDownloadJpeg,
  onShare,
  onRetake,
  onBack,
  canShare,
}: StripPreviewProps) {
  return (
    <div className="flex min-h-dvh flex-col items-center px-4 py-8">
      <h2 className="mb-6 text-2xl font-bold text-white">Your photostrip</h2>

      <div className="mb-6 flex min-h-[200px] items-center justify-center">
        {composing && (
          <p className="text-zinc-400">Composing your strip…</p>
        )}
        {!composing && composeError && (
          <p className="max-w-sm text-center text-sm text-red-400" role="alert">
            {composeError}
          </p>
        )}
        {!composing && !composeError && stripUrl && (
          <img
            src={stripUrl}
            alt="Your photobooth strip"
            className="max-h-[70dvh] w-auto max-w-full rounded-lg shadow-2xl shadow-black/50"
          />
        )}
      </div>

      <p className="mb-6 max-w-sm text-center text-sm text-zinc-500">
        On mobile Safari, if download opens in a new tab, long-press the image to
        save to your photos.
      </p>

      <div className="flex w-full max-w-md flex-col gap-3">
        <button
          type="button"
          onClick={onDownloadPng}
          disabled={!stripUrl || composing}
          className="min-h-11 rounded-full bg-pink-500 py-3 font-semibold text-white hover:bg-pink-400 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
        >
          Download PNG
        </button>
        <button
          type="button"
          onClick={onDownloadJpeg}
          disabled={!stripUrl || composing}
          className="min-h-11 rounded-full bg-zinc-700 py-3 font-semibold text-white hover:bg-zinc-600 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
        >
          Download JPEG
        </button>
        {canShare && (
          <button
            type="button"
            onClick={onShare}
            disabled={!stripUrl || composing}
            className="min-h-11 rounded-full border border-pink-500/50 py-3 font-semibold text-pink-300 hover:bg-pink-500/10 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
          >
            Share
          </button>
        )}
        <button
          type="button"
          onClick={onRetake}
          className="min-h-11 rounded-full border border-zinc-600 py-3 font-semibold text-zinc-300 hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
        >
          Retake
        </button>
        <button
          type="button"
          onClick={onBack}
          className="min-h-11 py-2 text-sm text-zinc-500 hover:text-zinc-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
        >
          Exit booth
        </button>
      </div>
    </div>
  )
}
