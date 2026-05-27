import { useCallback, useState } from 'react'
import { CameraStage } from './components/CameraStage'
import { CapturePanel, FilterPanel } from './components/ControlPanel'
import { Landing } from './components/Landing'
import { PermissionError } from './components/PermissionError'
import { PhotoGrid } from './components/PhotoGrid'
import { StripPreview } from './components/StripPreview'
import { useCamera } from './hooks/useCamera'
import { useCapture } from './hooks/useCapture'
import { useCustomFrameLayouts } from './hooks/useCustomFrameLayouts'
import { usePhotostrip } from './hooks/usePhotostrip'
import type { BoothPhase, FilterId } from './types'

export default function App() {
  const [phase, setPhase] = useState<BoothPhase>('landing')
  const [filterId, setFilterId] = useState<FilterId>('none')

  const { videoRef, ready, loading, error, startCamera, stopCamera } =
    useCamera(phase === 'booth')

  const { layouts: customLayouts } = useCustomFrameLayouts(phase === 'booth')

  const { status, countdown, photos, currentShot, flash, runCapture, reset } =
    useCapture()

  const { stripUrl, composing, composeError, download, share } = usePhotostrip(
    phase === 'preview' ? photos : [],
  )

  const handleStart = useCallback(() => {
    setPhase('booth')
  }, [])

  const handleBack = useCallback(() => {
    reset()
    stopCamera()
    setPhase('landing')
  }, [reset, stopCamera])

  const handleCapture = useCallback(() => {
    const video = videoRef.current
    if (!video || !ready) return
    void runCapture(video, filterId, customLayouts).then((result) => {
      if (result === 'completed') {
        setPhase('preview')
      }
    })
  }, [videoRef, ready, runCapture, filterId, customLayouts])

  const handleRetake = useCallback(() => {
    reset()
    setPhase('booth')
  }, [reset])

  const captureBusy = status === 'countdown' || status === 'capturing'
  const customFramesLoading = !customLayouts
  const captureDisabled = !ready || captureBusy || customFramesLoading

  const canShare =
    typeof navigator !== 'undefined' &&
    typeof navigator.share === 'function' &&
    typeof navigator.canShare === 'function'

  if (phase === 'landing') {
    return <Landing onStart={handleStart} />
  }

  if (phase === 'preview') {
    return (
      <StripPreview
        stripUrl={stripUrl}
        composing={composing}
        composeError={composeError}
        onDownloadPng={() => download('png')}
        onDownloadJpeg={() => download('jpeg')}
        onShare={() => void share()}
        onRetake={handleRetake}
        onBack={handleBack}
        canShare={canShare}
      />
    )
  }

  if (error) {
    return (
      <PermissionError
        error={error}
        onRetry={() => void startCamera()}
        onBack={handleBack}
      />
    )
  }

  return (
    <div className="min-h-dvh bg-[#0f0f14] px-4 py-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Photobooth</h1>
        <button
          type="button"
          onClick={handleBack}
          className="min-h-11 px-3 text-sm text-zinc-400 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
        >
          Exit
        </button>
      </header>

      <div className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-8 lg:grid-cols-[240px_1fr] lg:gap-6">
        <div className="hidden lg:block">
          <FilterPanel
            filterId={filterId}
            onFilterChange={setFilterId}
            captureDisabled={captureDisabled}
          />
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="w-full max-w-md flex flex-col gap-4 lg:hidden">
            <FilterPanel
              filterId={filterId}
              onFilterChange={setFilterId}
              captureDisabled={captureDisabled}
            />
          </div>

          <CameraStage
            videoRef={videoRef}
            filterId={filterId}
            customLayouts={customLayouts}
            currentShot={currentShot}
            capturedCount={photos.length}
            ready={ready}
            loading={loading}
            countdown={countdown}
            flash={flash}
            capturing={captureBusy}
          />
          <PhotoGrid
            photos={photos}
            currentShot={currentShot}
            customLayouts={customLayouts}
          />

          <CapturePanel
            showDate={false}
            onShowDateChange={() => {}}
            showDateOption={false}
            onCapture={handleCapture}
            captureDisabled={captureDisabled}
            captureLabel={
              captureBusy
                ? status === 'countdown'
                  ? 'Get ready…'
                  : 'Capturing…'
                : customFramesLoading
                  ? 'Loading frames…'
                  : 'Take photos'
            }
          />
        </div>
      </div>
    </div>
  )
}
