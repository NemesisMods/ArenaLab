import { strToU8, zipSync } from 'fflate'
import { describe, expect, it } from 'vitest'
import { arenaName } from '../src/arena'

const arena = (manifest: object) => zipSync({ 'manifest.json': strToU8(JSON.stringify(manifest)) })

describe('arena files', () => {
  it("names an arena from its manifest, else from its file name", () => {
    expect(arenaName('a.imperfectarena', arena({ arena: { display_name: ' Rooftops ' } }))).toBe('Rooftops')
    expect(arenaName('a.imperfectarena', arena({ display_name: 'Docks' }))).toBe('Docks')
    expect(arenaName('old_city-2.imperfectarena', arena({}))).toBe('OLD CITY 2')
    expect(arenaName('broken.imperfectarena', Uint8Array.of(1, 2, 3))).toBe('BROKEN')
  })
})