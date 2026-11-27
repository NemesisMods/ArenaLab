import { type Entry, getList, newId, setList, subscribe } from '@nemesismods/workspace'
import { useEffect, useRef, useState } from 'react'
import { arenaName, EXT, FIRST_STAGE, MAX_ARENAS } from './arena'

export default function App() {
  const [arenas, setArenas] = useState<Entry[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [over, setOver] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const room = MAX_ARENAS - arenas.length

  useEffect(() => {
    const load = () => void getList('arenas').then(setArenas, (e) => setMessage(String(e)))
    load()
    return subscribe('arenas', load)
  }, [])

  const save = (next: Entry[]) => {
    setArenas(next)
    setList('arenas', next).catch((e) => setMessage(String(e)))
  }

  const add = async (files: File[]) => {
    const good = files.filter((f) => f.name.toLowerCase().endsWith(EXT))
    const bad = files.filter((f) => !good.includes(f))
    const added: Entry[] = []
    for (const f of good.slice(0, room)) {
      const bytes = new Uint8Array(await f.arrayBuffer())
      added.push({ id: newId(), name: arenaName(f.name, bytes), source: f.name, bytes })
    }
    if (added.length) save([...arenas, ...added])
    const notes: string[] = []
    if (bad.length) notes.push(`${bad.map((f) => f.name).join(', ')}: only ${EXT} files can be added.`)
    if (good.length > room) notes.push(`The list holds ${MAX_ARENAS} arenas: ${good.length - room} left out.`)
    setMessage(notes.length ? notes.join(' ') : null)
  }

  const move = (i: number, d: number) => {
    const j = i + d
    if (j < 0 || j >= arenas.length) return
    const next = [...arenas];
    [next[i], next[j]] = [next[j], next[i]]
    save(next)
  }

  return (
    <main className="arena-lab">
      <header>
        <h1>Arena Lab</h1>
        <p className="muted">Ready-made arenas ({EXT} files), in the order they take the stage slots after the 7 originals. Lab Builder puts them into a port.</p>
      </header>
      <div
        className={`card drop ${over ? 'over' : ''}`}
        onDragOver={(e) => { if (e.dataTransfer.types.includes('Files')) { e.preventDefault(); setOver(true) } }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); void add([...e.dataTransfer.files]) }}
      >
        <p>Drop {EXT} files here, or</p>
        <button onClick={() => input.current?.click()} disabled={room <= 0}>Add arena files...</button>
        <input ref={input} type="file" accept={EXT} multiple hidden onChange={(e) => { void add([...(e.target.files ?? [])]); e.target.value = '' }} />
      </div>
      {message && <p className="bad">{message}</p>}
      <h2>Arenas <span className="muted">{arenas.length} of {MAX_ARENAS}</span></h2>
      {arenas.length === 0 ? <p className="muted">None yet.</p> : (
        <table>
          <thead><tr><th>Stage</th><th>Arena</th><th>File</th><th /></tr></thead>
          <tbody>
            {arenas.map((a, i) => (
              <tr key={a.id}>
                <td className="muted">{FIRST_STAGE + i}</td>
                <td>{a.name}</td>
                <td className="muted">{a.source}</td>
                <td className="actions">
                  <button aria-label="Move up" onClick={() => move(i, -1)} disabled={i === 0}>↑</button>
                  <button aria-label="Move down" onClick={() => move(i, 1)} disabled={i === arenas.length - 1}>↓</button>
                  <button aria-label="Remove" onClick={() => save(arenas.filter((_, k) => k !== i))}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}