import { useEffect, useMemo, useState } from 'react'
import { KLANKEN_GROUPS, splitIntoKlanken } from './klanken.js'
import { WOORDEN } from './words.js'
import { version as APP_VERSION } from '../package.json'

const ALL_KLANKEN = KLANKEN_GROUPS.flatMap((g) => g.klanken)
const GROUP_CLASS = {
  'Korte klinkers': 'is-korte-klinker',
  'Lange klinkers': 'is-lange-klinker',
  'Andere klinkers': 'is-andere-klinker',
  Medeklinkers: 'is-medeklinker',
  Medeklinkerclusters: 'is-cluster',
}

export default function App() {
  const [selected, setSelected] = useState(() => new Set())
  const [updateAvailable, setUpdateAvailable] = useState(false)

  useEffect(() => {
    const onUpdate = () => setUpdateAvailable(true)
    window.addEventListener('lezen:update-available', onUpdate)
    return () => window.removeEventListener('lezen:update-available', onUpdate)
  }, [])

  const toggle = (k) =>
    setSelected((s) => {
      const next = new Set(s)
      if (next.has(k)) next.delete(k)
      else next.add(k)
      return next
    })

  const selectAll = () => setSelected(new Set(ALL_KLANKEN))
  const clearAll = () => setSelected(new Set())

  const words = useMemo(() => {
    if (selected.size === 0) return []
    return WOORDEN.map((word) => ({ word, klanken: splitIntoKlanken(word) }))
      .filter(({ klanken }) => klanken.every((k) => selected.has(k)))
      .sort((a, b) => a.word.length - b.word.length || a.word.localeCompare(b.word, 'nl'))
  }, [selected])

  return (
    <div className="shell">
      <header className="top">
        <h1>Ik leer lezen</h1>
        <p className="subtitle">Kies klanken, vind woordjes om samen te lezen.</p>
      </header>

      <section className="klanken-picker">
        <div className="klanken-actions">
          <button className="btn" onClick={selectAll}>
            Alles aan
          </button>
          <button className="btn btn-quiet" onClick={clearAll}>
            Alles uit
          </button>
        </div>

        {KLANKEN_GROUPS.map((g) => (
          <div key={g.title} className="klanken-group">
            <h2>{g.title}</h2>
            <div className="klanken-row">
              {g.klanken.map((k) => (
                <button
                  key={k}
                  className={
                    selected.has(k) ? `klank ${GROUP_CLASS[g.title]} is-on` : `klank ${GROUP_CLASS[g.title]}`
                  }
                  onClick={() => toggle(k)}
                  aria-pressed={selected.has(k)}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="results">
        <h2 className="results-title">
          {selected.size === 0
            ? 'Kies eerst een paar klanken hierboven'
            : `${words.length} woordje${words.length === 1 ? '' : 's'} om te lezen`}
        </h2>

        {selected.size > 0 && words.length === 0 && (
          <p className="empty">Nog geen woordjes met deze klanken. Kies er nog een paar.</p>
        )}

        <ul className="word-list">
          {words.map(({ word, klanken }) => (
            <li key={word} className="word-card">
              {klanken.map((k, i) => (
                <span key={i} className={i % 2 === 0 ? 'klank-part' : 'klank-part is-alt'}>
                  {k}
                </span>
              ))}
            </li>
          ))}
        </ul>
      </section>

      <footer className="foot">
        <p>v{APP_VERSION}</p>
      </footer>

      {updateAvailable && (
        <div className="update-toast" role="status">
          <span>Nieuwe versie beschikbaar</span>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Vernieuw
          </button>
        </div>
      )}
    </div>
  )
}
