import type { FilterId } from '../types'

export const FILTER_OPTIONS: { id: FilterId; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'grayscale', label: 'B&W' },
  { id: 'sepia', label: 'Sepia' },
  { id: 'vintage', label: 'Vintage' },
  { id: 'cool', label: 'Cool' },
  { id: 'warm', label: 'Warm' },
]

export const FILTER_CSS: Record<FilterId, string> = {
  none: 'none',
  grayscale: 'grayscale(100%)',
  sepia: 'sepia(80%)',
  vintage: 'sepia(40%) contrast(1.1) brightness(1.05)',
  cool: 'saturate(1.2) hue-rotate(15deg)',
  warm: 'saturate(1.3) hue-rotate(-15deg)',
}

export function getFilterCss(filterId: FilterId): string {
  return FILTER_CSS[filterId]
}
