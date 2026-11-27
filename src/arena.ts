import { unzipSync } from 'fflate'

export const EXT = '.imperfectarena'
export const MAX_ARENAS = 17 // 2 x 12 venue grid, minus the 7 originals
export const FIRST_STAGE = 8

export function arenaName(file: string, data: Uint8Array): string {
  try {
    const m = unzipSync(data, { filter: (f) => f.name === 'manifest.json' })['manifest.json']
    if (m) {
      const j = JSON.parse(new TextDecoder().decode(m))
      const n = j?.arena?.display_name ?? j?.display_name
      if (typeof n === 'string' && n.trim()) return n.trim()
    }
  } catch {
    // fall back to the file name
  }
  return file.slice(0, file.length - EXT.length).replace(/[_-]+/g, ' ').trim().toUpperCase()
}