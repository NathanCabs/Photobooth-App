import type { FilterId } from '../types'
import { FILTER_OPTIONS } from '../utils/filters'

type FilterPanelProps = {
  filterId: FilterId
  onFilterChange: (id: FilterId) => void
  captureDisabled: boolean
  className?: string
}

export function FilterPanel({
  filterId,
  onFilterChange,
  captureDisabled,
  className,
}: FilterPanelProps) {
  return (
    <div
      className={`w-full rounded-2xl bg-zinc-900/40 p-4 ring-1 ring-zinc-800 ${
        className ?? ''
      }`}
    >
      <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-zinc-500">
        Filter
      </h3>
      <div className="flex flex-col gap-2" role="group" aria-label="Filter options">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onFilterChange(opt.id)}
            disabled={captureDisabled}
            className={`shrink-0 min-h-11 rounded-full px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 ${
              filterId === opt.id
                ? 'bg-pink-500 text-white'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            } disabled:opacity-50`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

type CapturePanelProps = {
  showDate: boolean
  onShowDateChange: (value: boolean) => void
  showDateOption?: boolean
  onCapture: () => void
  captureDisabled: boolean
  captureLabel: string
  className?: string
}

export function CapturePanel({
  showDate,
  onShowDateChange,
  showDateOption = true,
  onCapture,
  captureDisabled,
  captureLabel,
  className,
}: CapturePanelProps) {
  return (
    <div
      className={`flex w-full max-w-md flex-col gap-4 rounded-2xl bg-zinc-900/40 p-4 ring-1 ring-zinc-800 ${
        className ?? ''
      }`}
    >
      {showDateOption && (
        <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-zinc-300">
          <input
            type="checkbox"
            checked={showDate}
            onChange={(e) => onShowDateChange(e.target.checked)}
            disabled={captureDisabled}
            className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-pink-500 focus:ring-pink-400"
          />
          Add date stamp on strip
        </label>
      )}

      <button
        type="button"
        onClick={onCapture}
        disabled={captureDisabled}
        className="min-h-12 w-full rounded-full bg-pink-500 py-3 text-lg font-semibold text-white shadow-lg shadow-pink-500/25 hover:bg-pink-400 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
      >
        {captureLabel}
      </button>
    </div>
  )
}

