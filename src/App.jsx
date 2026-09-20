import { useEffect, useMemo, useRef, useState } from 'react'
import { KLANKEN_GROUPS, KLANK_LABELS, splitIntoKlanken } from './klanken.js'
import { WOORDEN } from './words.js'
import { version as APP_VERSION } from '../package.json'

const ALL_KLANKEN = KLANKEN_GROUPS.flatMap((g) => g.klanken)
const GROUP_CLASS = {
  'Korte klinkers': 'is-korte-klinker',
  'Lange klinkers': 'is-lange-klinker',
  'Klinkt anders dan het staat': 'is-open-lettergreep',
  'Andere klinkers': 'is-andere-klinker',
  Medeklinkers: 'is-medeklinker',
  Medeklinkerclusters: 'is-cluster',
}

// Aantallen die aangeboden worden om 1 voor 1 te oefenen — altijd aangevuld
// met "alle woorden die er nu zijn", zelfs als dat er minder dan 10 zijn.
const OEFEN_AANTALLEN = [10, 20, 50]

// Hoeveel pixels er gesleept moet worden voordat een sleep als "geveegd"
// telt in plaats van terug te veren naar het midden.
const SWIPE_DREMPEL = 80

const WIT = [255, 255, 255]
const GROEN = [26, 158, 92]
const ROOD = [209, 51, 44]
const meng = (van, naar, t) => van.map((c, i) => Math.round(c + (naar[i] - c) * t))

function shuffle(lijst) {
  const kopie = [...lijst]
  for (let i = kopie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[kopie[i], kopie[j]] = [kopie[j], kopie[i]]
  }
  return kopie
}

// In de woordenlijst kleuren de klanken om de opbouw te tonen; tijdens het
// oefenen (eenKleur) is dat net niet de bedoeling — daar lees je het woord
// gewoon zoals het is, zonder kleurhints.
function KlankenWoord({ klanken, wit, eenKleur }) {
  return klanken.map(({ tekst }, i) => (
    <span
      key={i}
      className={
        wit
          ? 'klank-part is-wit'
          : eenKleur
            ? 'klank-part is-enkel'
            : i % 2 === 0
              ? 'klank-part'
              : 'klank-part is-alt'
      }
    >
      {tekst}
    </span>
  ))
}

// Eén kaartje: kan met de vinger/muis naar rechts (juist) of links (fout)
// geveegd worden, of via de knoppen onderaan bevestigd worden — allebei
// roepen dezelfde onOordeel("juist" | "fout") aan. Tijdens het slepen kleurt
// de hele kaart mee en verschijnt er een groot vinkje/kruisje, zodat het
// oordeel ook op een boogje van een tablet meteen duidelijk is.
function OefenKaart({ klanken, onOordeel, triggerOordeel }) {
  const [sleep, setSleep] = useState({ x: 0, actief: false })
  const startX = useRef(0)
  const vertrokken = useRef(false)

  useEffect(() => {
    if (triggerOordeel) vliegWeg(triggerOordeel)
  }, [triggerOordeel])

  const pointerDown = (e) => {
    startX.current = e.clientX
    vertrokken.current = false
    setSleep({ x: 0, actief: true })
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const pointerMove = (e) => {
    if (!sleep.actief) return
    setSleep({ x: e.clientX - startX.current, actief: true })
  }

  const vliegWeg = (oordeel) => {
    if (vertrokken.current) return
    vertrokken.current = true
    setSleep({ x: oordeel === 'juist' ? 640 : -640, actief: false })
    setTimeout(() => onOordeel(oordeel), 160)
  }

  const pointerUp = () => {
    if (vertrokken.current) return
    if (sleep.x > SWIPE_DREMPEL) vliegWeg('juist')
    else if (sleep.x < -SWIPE_DREMPEL) vliegWeg('fout')
    else setSleep({ x: 0, actief: false })
  }

  const rotatie = Math.max(-12, Math.min(12, sleep.x / 12))
  const voortgang = Math.min(Math.abs(sleep.x) / SWIPE_DREMPEL, 1)
  const richting = sleep.x > 8 ? 'juist' : sleep.x < -8 ? 'fout' : null
  const achtergrond = richting ? meng(WIT, richting === 'juist' ? GROEN : ROOD, voortgang) : WIT
  const isGetint = voortgang > 0.15

  return (
    <div className="oefenen-kaart-wrap">
      <div
        className={sleep.actief ? 'oefenen-kaart is-slepen' : 'oefenen-kaart'}
        style={{
          transform: `translateX(${sleep.x}px) rotate(${rotatie}deg)`,
          backgroundColor: `rgb(${achtergrond.join(',')})`,
        }}
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
        onPointerCancel={pointerUp}
      >
        <span className="oefenen-woord">
          <KlankenWoord klanken={klanken} wit={isGetint} eenKleur />
        </span>
        {richting && (
          <span className="oefenen-icoon" style={{ opacity: voortgang * 0.5 }} aria-hidden="true">
            {richting === 'juist' ? '✓' : '✗'}
          </span>
        )}
      </div>
    </div>
  )
}

function Oefenen({ woord, index, totaal, onOordeel, onVorige, onStop }) {
  const [kaartOordeel, setKaartOordeel] = useState(null)

  useEffect(() => {
    setKaartOordeel(null)
  }, [index])

  const handleKaartOordeel = (uitkomst) => {
    setKaartOordeel(uitkomst)
  }

  return (
    <section className="oefenen">
      <p className="oefenen-voortgang">
        {index + 1} / {totaal}
      </p>

      <OefenKaart
        key={index}
        klanken={woord.klanken}
        onOordeel={onOordeel}
        triggerOordeel={kaartOordeel}
      />

      <p className="oefenen-hint">Veeg naar rechts = juist, naar links = fout</p>

      <div className="oefenen-knoppen">
        <button className="btn btn-quiet" onClick={onVorige} disabled={index === 0}>
          Vorige
        </button>
        <button className="btn btn-fout" onClick={() => handleKaartOordeel('fout')}>
          ✗ Fout
        </button>
        <button className="btn btn-juist" onClick={() => handleKaartOordeel('juist')}>
          ✓ Juist
        </button>
      </div>

      <button className="btn btn-quiet btn-stop-oefenen" onClick={onStop}>
        Stop met oefenen
      </button>
    </section>
  )
}

function OefenResultaat({ aantalJuist, aantalFout, onOpnieuwFout, onTerug }) {
  return (
    <section className="oefenen oefenen-resultaat">
      <h2>Klaar!</h2>
      <p className="oefenen-telling">
        <span className="is-juist">{aantalJuist} juist</span>
        <span className="telling-scheiding">·</span>
        <span className="is-fout">{aantalFout} fout</span>
      </p>

      {aantalFout > 0 && (
        <button className="btn btn-primary" onClick={onOpnieuwFout}>
          Oefen de {aantalFout} foute woordjes opnieuw
        </button>
      )}
      <button className="btn btn-quiet" onClick={onTerug}>
        Terug naar klanken
      </button>
    </section>
  )
}

export default function App() {
  const [selected, setSelected] = useState(() => new Set())
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [oefenReeks, setOefenReeks] = useState(null)
  const [oefenOordelen, setOefenOordelen] = useState([])
  const [oefenIndex, setOefenIndex] = useState(0)
  const [oefenKlaar, setOefenKlaar] = useState(false)

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

  const startOefenen = (aantal, bron = words) => {
    const reeks = shuffle(bron).slice(0, aantal)
    setOefenReeks(reeks)
    setOefenOordelen(Array(reeks.length).fill(null))
    setOefenIndex(0)
    setOefenKlaar(false)
  }
  const stopOefenen = () => setOefenReeks(null)

  const oordeel = (verdict) => {
    setOefenOordelen((arr) => {
      const next = [...arr]
      next[oefenIndex] = verdict
      return next
    })
    if (oefenIndex >= oefenReeks.length - 1) setOefenKlaar(true)
    else setOefenIndex((i) => i + 1)
  }

  const opnieuwFout = () => {
    const fouteWoorden = oefenReeks.filter((_, i) => oefenOordelen[i] === 'fout')
    startOefenen(fouteWoorden.length, fouteWoorden)
  }

  return (
    <div className="shell">
      <header className="top">
        <h1>Ik leer lezen</h1>
        <p className="subtitle">Kies klanken &amp; vind woordjes om samen te lezen.</p>
      </header>

      {oefenReeks ? (
        oefenKlaar ? (
          <OefenResultaat
            aantalJuist={oefenOordelen.filter((o) => o === 'juist').length}
            aantalFout={oefenOordelen.filter((o) => o === 'fout').length}
            onOpnieuwFout={opnieuwFout}
            onTerug={stopOefenen}
          />
        ) : (
          <Oefenen
            woord={oefenReeks[oefenIndex]}
            index={oefenIndex}
            totaal={oefenReeks.length}
            onOordeel={oordeel}
            onVorige={() => setOefenIndex((i) => Math.max(i - 1, 0))}
            onStop={stopOefenen}
          />
        )
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
