import { useEffect, useMemo, useState } from 'react'
import { KLANKEN_GROUPS, KLANK_LABELS, splitIntoKlanken } from './klanken.js'
import { WOORDEN } from './words.js'
import { version as APP_VERSION } from '../package.json'

const ALL_KLANKEN = KLANKEN_GROUPS.flatMap((g) => g.klanken)
const GROUP_CLASS = {
  'Korte klinkers': 'is-korte-klinker',
  'Lange klinkers': 'is-lange-klinker',
  'Open lettergreep (1 letter, klinkt lang)': 'is-open-lettergreep',
  'Andere klinkers': 'is-andere-klinker',
  Medeklinkers: 'is-medeklinker',
  Medeklinkerclusters: 'is-cluster',
}

// Aantallen die aangeboden worden om 1 voor 1 te oefenen — altijd aangevuld
// met "alle woorden die er nu zijn", zelfs als dat er minder dan 10 zijn.
const OEFEN_AANTALLEN = [10, 20, 50]

function shuffle(lijst) {
  const kopie = [...lijst]
  for (let i = kopie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[kopie[i], kopie[j]] = [kopie[j], kopie[i]]
  }
  return kopie
}

function KlankenWoord({ klanken }) {
  return klanken.map(({ tekst }, i) => (
    <span key={i} className={i % 2 === 0 ? 'klank-part' : 'klank-part is-alt'}>
      {tekst}
    </span>
  ))
}

function Oefenen({ reeks, index, onVorige, onVolgende, onStop }) {
  const { klanken } = reeks[index]
  const isLaatste = index === reeks.length - 1

  return (
    <section className="oefenen">
      <p className="oefenen-voortgang">
        {index + 1} / {reeks.length}
      </p>

      <div className="oefenen-kaart">
        <KlankenWoord klanken={klanken} />
      </div>

      <div className="oefenen-knoppen">
        <button className="btn btn-quiet" onClick={onVorige} disabled={index === 0}>
          Vorige
        </button>
        {isLaatste ? (
          <button className="btn btn-primary" onClick={onStop}>
            Klaar!
          </button>
        ) : (
          <button className="btn btn-primary" onClick={onVolgende}>
            Volgende
          </button>
        )}
      </div>

      <button className="btn btn-quiet btn-stop-oefenen" onClick={onStop}>
        Stop met oefenen
      </button>
    </section>
  )
}

export default function App() {
  const [selected, setSelected] = useState(() => new Set())
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [oefenReeks, setOefenReeks] = useState(null)
  const [oefenIndex, setOefenIndex] = useState(0)

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
      .filter(({ klanken }) => klanken.every(({ klank }) => selected.has(klank)))
      .sort((a, b) => a.word.length - b.word.length || a.word.localeCompare(b.word, 'nl'))
  }, [selected])

  const oefenOpties = useMemo(() => {
    const opties = OEFEN_AANTALLEN.filter((n) => n < words.length)
    opties.push(words.length)
    return opties
  }, [words])

  const startOefenen = (aantal) => {
    setOefenReeks(shuffle(words).slice(0, aantal))
    setOefenIndex(0)
  }
  const stopOefenen = () => setOefenReeks(null)

  return (
    <div className="shell">
      <header className="top">
        <h1>Ik leer lezen</h1>
        <p className="subtitle">Kies klanken, vind woordjes om samen te lezen.</p>
      </header>

      {oefenReeks ? (
        <Oefenen
          reeks={oefenReeks}
          index={oefenIndex}
          onVorige={() => setOefenIndex((i) => Math.max(i - 1, 0))}
          onVolgende={() => setOefenIndex((i) => Math.min(i + 1, oefenReeks.length - 1))}
          onStop={stopOefenen}
        />
      ) : (
        <>
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
                        selected.has(k)
                          ? `klank ${GROUP_CLASS[g.title]} is-on`
                          : `klank ${GROUP_CLASS[g.title]}`
                      }
                      onClick={() => toggle(k)}
                      aria-pressed={selected.has(k)}
                    >
                      {KLANK_LABELS[k] ?? k}
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

            {words.length > 0 && (
              <div className="oefenen-start">
                <span className="oefenen-start-label">Oefen ze 1 voor 1:</span>
                <div className="oefenen-start-knoppen">
                  {oefenOpties.map((n) => (
                    <button key={n} className="btn" onClick={() => startOefenen(n)}>
                      {n === words.length ? `Alle ${n}` : n}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <ul className="word-list">
              {words.map(({ word, klanken }) => (
                <li key={word} className="word-card">
                  <KlankenWoord klanken={klanken} />
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

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
