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
import wavLogo from './assets/WAV.png'

export default function App() {
  // State management  
  // Phase state, filter state 
  const [phase, setPhase] = useState<BoothPhase>('landing')
  const [filterId, setFilterId] = useState<FilterId>('none')

  // Camera hook
  // Video reference, ready state, loading state, error state, start camera function, stop camera function if phase is booth
  const { videoRef, ready, loading, error, startCamera, stopCamera } =
    useCamera(phase === 'booth')

  // Custom frame layouts hook
  // Custom frame layouts, error state if phase is booth
  const { layouts: customLayouts } = useCustomFrameLayouts(phase === 'booth')

  // Capture hook
  // Capture status, countdown, photos, current shot, flash state, run capture function, reset function
  const { status, countdown, photos, currentShot, flash, runCapture, reset } =
    useCapture()

  // Photostrip hook
  // Strip URL, composing state, compose error, download function, share function if phase is preview and photos is not empty else empty array
  const { stripUrl, composing, composeError, download, share } = usePhotostrip(
    phase === 'preview' ? photos : [],
  )

  // Event handlers
  // Handle start button click set phase to booth
  const handleStart = useCallback(() => {
    setPhase('booth')
  }, [])

  // Handle back button click
  // Reset capture, stop camera, set phase to landing 
  const handleBack = useCallback(() => {
    reset()
    stopCamera()
    setPhase('landing')
  }, [reset, stopCamera])

  // Handle capture button click
  // Run capture function, set phase to preview if capture is completed
  const handleCapture = useCallback(() => {
    const video = videoRef.current
    if (!video || !ready) return
    void runCapture(video, filterId, customLayouts).then((result) => {
      if (result === 'completed') {
        setPhase('preview')
      }
    })
  }, [videoRef, ready, runCapture, filterId, customLayouts])

  // Handle retake button click
  // Reset capture, set phase to booth
  const handleRetake = useCallback(() => {
    reset()
    setPhase('booth')
  }, [reset])

  // Capture busy state if status is countdown or capturing
  // Custom frames loading state if custom layouts is not loaded
  // Capture disabled state if ready is false or capture busy or custom frames loading
  const captureBusy = status === 'countdown' || status === 'capturing'
  const customFramesLoading = !customLayouts
  const captureDisabled = !ready || captureBusy || customFramesLoading

  // Can share state
  // If navigator is defined and share and can share functions are defined
  const canShare =
    typeof navigator !== 'undefined' &&
    typeof navigator.share === 'function' &&
    typeof navigator.canShare === 'function'

  // Landing phase
  // Return landing component if phase is landing 
  if (phase === 'landing') {
    return <Landing onStart={handleStart} />
  }

  // Preview phase
  // Return strip preview component if phase is preview
  // Strip URL, composing state, compose error, download function, share function, retake function, back function, can share state 
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

  // Return permission error component if error is defined
  // Error state, start camera function, back function
  if (error) {
    return (
      // Permission error component
      <PermissionError
        error={error}
        onRetry={() => void startCamera()}
        onBack={handleBack}
      />
    )
  }

  return (
    /* Main container */
    <div className="min-h-dvh bg-[#0f0f14] px-4 py-6">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between lg:-mt-10">
      <h1 className="lg:text-xl text-l font-bold text-white">
        Love&Pop Photobooth made by <img src={wavLogo} alt="WAV" className="h-[5em] w-auto inline-block" /> 
      </h1>
        {/* Exit button */}
        <button
          type="button"
          onClick={handleBack}
          className="min-h-11 px-3 text-sm text-zinc-400 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
        >
          Exit
        </button>
      </header>
      
    {/* Desktop */}
      <div className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-8 lg:grid-cols-[240px_1fr] lg:gap-6">
        <div className="hidden lg:block">
          <FilterPanel
            filterId={filterId}
            onFilterChange={setFilterId}
            captureDisabled={captureDisabled}
          />
        </div>

    {/* Mobile */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-full max-w-md flex flex-col gap-4 lg:hidden">
            <FilterPanel
              filterId={filterId}
              onFilterChange={setFilterId}
              captureDisabled={captureDisabled}
            />
          </div>

          {/* Camera stage */}
          <CameraStage
            videoRef={videoRef}
            filterId={filterId}
            customLayouts={customLayouts}
            currentShot={currentShot}
            //capturedCount={photos.length}
            ready={ready}
            loading={loading}
            countdown={countdown}
            flash={flash}
            capturing={captureBusy}
          />

          {/* Photo grid */}
          <PhotoGrid
            photos={photos}
            currentShot={currentShot}
            customLayouts={customLayouts}
          />

          {/* Capture panel */}
          <CapturePanel
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
