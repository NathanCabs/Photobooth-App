type LandingProps = {
  onStart: () => void
}

export function Landing({ onStart }: LandingProps) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-gradient-to-b from-zinc-900 via-[#0f0f14] to-zinc-950 px-6 text-center">
      <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-pink-500/20 ring-2 ring-pink-400/40">
        <span className="text-4xl" aria-hidden>
          📸
        </span>
      </div>
      <h1 className="mb-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
        LOVE&POP Photobooth
      </h1>
      <p className="mb-10 max-w-md text-lg text-zinc-400">
        A simple project made by WAV. <br/>Take a classic 4-photo strip using our custom Love&Pop frames.
      </p>
      <button
        type="button"
        onClick={onStart}
        className="min-h-11 rounded-full bg-pink-500 px-10 py-3 text-lg font-semibold text-white shadow-lg shadow-pink-500/30 transition hover:bg-pink-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
      >
        Start booth
      </button>
      <p className="mt-8 text-sm text-zinc-500">
        Camera access required · Works on HTTPS or localhost
      </p>

      <footer className="mt-8 text-sm text-zinc-500">
        <p>Made with ❤️ by <a href="https://x.com/DRealGahyeongum" target="_blank" className="text-white" rel="noopener noreferrer">Gum</a></p>
        <p>Frames made with ❤️ by <a href="https://x.com/civacious" target="_blank" className="text-white" rel="noopener noreferrer">civv²⁴</a></p>
      </footer>
    </div>
  )
}
