import type { BorderId, FilterId } from '../types'
import { BORDER_OPTIONS } from '../utils/borders'
import { FILTER_OPTIONS } from '../utils/filters'

type ControlPanelProps = {
  filterId: FilterId
  borderId: BorderId
  showDate: boolean
  onFilterChange: (id: FilterId) => void
  onBorderChange: (id: BorderId) => void
  onShowDateChange: (value: boolean) => void
  onCapture: () => void
  captureDisabled: boolean
  captureLabel: string
}

export function ControlPanel({
  filterId,
  borderId,
  showDate,
  onFilterChange,
  onBorderChange,
  onShowDateChange,
  onCapture,
  captureDisabled,
  captureLabel,
}: ControlPanelProps) {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <div>
        <h3 className="mb-2 text-sm font-medium uppercase tracking-wide text-zinc-500">
          Filter
        </h3>
        <div
          className="chip-scroll flex gap-2 overflow-x-auto"
          role="group"
          aria-label="Filter options"
        >
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

      <div>
        <h3 className="mb-2 text-sm font-medium uppercase tracking-wide text-zinc-500">
          Border
        </h3>
        <div
          className="chip-scroll flex gap-2 overflow-x-auto"
          role="group"
          aria-label="Border options"
        >
          {BORDER_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onBorderChange(opt.id)}
              disabled={captureDisabled}
              className={`flex shrink-0 min-h-11 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 ${
                borderId === opt.id
                  ? 'bg-pink-500 text-white'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              } disabled:opacity-50`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-sm ring-1 ring-zinc-600 ${opt.swatch}`}
                aria-hidden
              />
              {opt.label}
            </button>
          ))}
        </div>
      </div>

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
