import type { BorderId } from '../types'

export const BORDER_OPTIONS: { id: BorderId; label: string; swatch: string }[] = [
  { id: 'classic', label: 'Classic', swatch: 'bg-white' },
  { id: 'polaroid', label: 'Polaroid', swatch: 'bg-zinc-100' },
  { id: 'film', label: 'Film', swatch: 'bg-zinc-800' },
  { id: 'branded', label: 'Branded', swatch: 'bg-red-400' },
]

export const STRIP_WIDTH = 400
export const PHOTO_SLOT_WIDTH = 320
export const PHOTO_SLOT_HEIGHT = 427
export const STRIP_PADDING = 24
export const PHOTO_GAP = 12
export const HEADER_HEIGHT = 36
export const FOOTER_HEIGHT = 28
