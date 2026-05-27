import { composeCustomStrip } from './composeCustomStrip'

export async function composeStrip(photoDataUrls: string[]): Promise<HTMLCanvasElement> {
  return composeCustomStrip(photoDataUrls)
}
