import type { CameraError } from '../hooks/useCamera'

const MESSAGES: Record<CameraError, { title: string; body: string }> = {
  denied: {
    title: 'Camera access denied',
    body: 'Allow camera permission in your browser settings, then reload this page. In Chrome: click the lock icon in the address bar → Site settings → Camera → Allow.',
  },
  notfound: {
    title: 'No camera found',
    body: 'Connect a webcam or use a device with a front-facing camera, then try again.',
  },
  unsupported: {
    title: 'Camera not supported',
    body: 'Your browser does not support camera access. Try Chrome, Edge, Firefox, or Safari on a secure connection (HTTPS).',
  },
  unknown: {
    title: 'Could not start camera',
    body: 'Something went wrong while opening the camera. Close other apps using the camera and try again.',
  },
}

type PermissionErrorProps = {
  error: CameraError
  onRetry: () => void
  onBack: () => void
}

export function PermissionError({ error, onRetry, onBack }: PermissionErrorProps) {
  const { title, body } = MESSAGES[error]

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <h2 className="mb-3 text-2xl font-bold text-white">{title}</h2>
      <p className="mb-8 max-w-md text-zinc-400">{body}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="min-h-11 rounded-full bg-pink-500 px-6 py-2.5 font-semibold text-white hover:bg-pink-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
        >
          Try again
        </button>
        <button
          type="button"
          onClick={onBack}
          className="min-h-11 rounded-full border border-zinc-600 px-6 py-2.5 font-semibold text-zinc-300 hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
        >
          Back
        </button>
      </div>
    </div>
  )
}
