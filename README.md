# Photobooth Web App

A client-side photobooth that runs in your browser. Take a 4-photo strip with countdown, apply filters and borders, then download or share the result — no server required.

## Features

- Live camera preview (mirrored for selfies, un-mirrored in exports)
- 3-second countdown, then 4 sequential photos
- Filters: None, B&W, Sepia, Vintage, Cool, Warm
- Borders: Classic, Polaroid, Film strip, Branded
- Optional date stamp on the strip
- Download as PNG or JPEG
- Share on supported mobile browsers

## Requirements

- Modern browser (Chrome, Edge, Firefox, Safari 14.3+)
- **HTTPS** or **localhost** (required for camera access)
- Webcam or front-facing camera

## Quick start

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Test on your phone (same Wi‑Fi)

```bash
npm run dev -- --host
```

Use your computer’s LAN IP, e.g. `http://192.168.1.10:5173`. Camera on phones may still require HTTPS in some browsers; for production, deploy to Vercel/Netlify (HTTPS by default).

## Build for production

```bash
npm run build
npm run preview
```

Deploy the `dist/` folder to any static host (Vercel, Netlify, GitHub Pages, etc.).

## Project structure

- `src/hooks/` — camera, capture sequence, strip composition
- `src/utils/` — canvas capture, filters, borders, strip layout
- `src/components/` — UI phases (landing, booth, preview)

## Browser notes

- If camera access is denied, use the in-app tips or allow camera in site settings.
- On iOS Safari, “Download” may open the image in a new tab — long-press to save to Photos.
- Close other tabs/apps using the camera if the stream fails to start.
