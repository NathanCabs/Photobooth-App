export type FilterId =
  | 'none'
  | 'grayscale'
  | 'sepia'
  | 'vintage'
  | 'cool'
  | 'warm'

export type BorderId = 'classic' | 'polaroid' | 'film' | 'branded'

export type BoothPhase = 'landing' | 'booth' | 'preview'

export type CaptureStatus = 'idle' | 'countdown' | 'capturing' | 'done'

export const PHOTO_COUNT = 4
export const COUNTDOWN_SECONDS = 3
