/** Frame JPEGs for shots 1–4 (First → Fourth). */
export const FRAME_ASSETS = [
  '/frames/frame-1.jpg',
  '/frames/frame-2.jpg',
  '/frames/frame-3.jpg',
  '/frames/frame-4.jpg',
] as const

/** Strip width for custom frame compositing (widest frame asset). */
export const CUSTOM_STRIP_WIDTH = 516

/** Default capture size when not using custom hole bounds (legacy / tests). */
export const PHOTO_SLOT_WIDTH = 320
export const PHOTO_SLOT_HEIGHT = 427
