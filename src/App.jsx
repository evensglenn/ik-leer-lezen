import { useEffect, useMemo, useRef, useState } from 'react'
import { KLANKEN_GROUPS, KLANK_LABELS, splitIntoKlanken, heeftMedeklinkerCluster } from './klanken.js'
import { WOORDEN } from './words.js'
import { version as APP_VERSION } from '../package.json'

const ALL_KLANKEN = KLANKEN_GROUPS.flatMap((g) => g.klanken)
const MEDEKLINKERCLUSTER_KLANKEN = KLANKEN_GROUPS.find((g) => g.title === 'Medeklinkerclusters').klanken

// Zodat een pagina-refresh niet de hele klankenselectie wist.
const KLANKEN_OPSLAG_SLEUTEL = 'ik-leer-lezen:geselecteerde-klanken'

function laadOpgeslagenKlanken() {
  try {
    const ruw = localStorage.getItem(KLANKEN_OPSLAG_SLEUTEL)
    const lijst = ruw ? JSON.parse(ruw) : []
    return new Set(Array.isArray(lijst) ? lijst.filter((k) => ALL_KLANKEN.includes(k)) : [])
  } catch {
    return new Set()
  }
}

// Voor een beginnende lezer: woordjes met medeklinkerclusters (bv. "klik",
// "trap") of een dubbel geschreven medeklinker (bv. "bakken") overslaan.
const CLUSTERS_OPSLAG_SLEUTEL = 'ik-leer-lezen:geen-medeklinkerclusters'

function laadGeenClusters() {
  try {
    return localStorage.getItem(CLUSTERS_OPSLAG_SLEUTEL) === 'true'
  } catch {
    return false
  }
}
const GROUP_CLASS = {
  'Korte klinkers': 'is-korte-klinker',
  'Lange klinkers': 'is-lange-klinker',
  'Klinkt anders dan het staat': 'is-open-lettergreep',
  'Andere klinkers': 'is-andere-klinker',
  Medeklinkers: 'is-medeklinker',
  Medeklinkerclusters: 'is-cluster',
}

// Aantallen die aangeboden worden om 1 voor 1 te oefenen. Bij een kleine
// woordenlijst wordt dit aangevuld met "alle woorden die er nu zijn"; bij
// een grote lijst (bv. alle klanken aan) is honderd al meer dan genoeg voor
// één oefensessie, dus dan blijft de hoogste optie op 100 staan in plaats
// van "alle 1240".
const OEFEN_AANTALLEN = [10, 20, 50, 100]

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
function OefenKaart({ klanken, onDecision, triggerOordeel }) {
  const [sleep, setSleep] = useState({ x: 0, actief: false })
  const startX = useRef(0)
  const vertrokken = useRef(false)
  // Het oordeel waarmee deze kaart is opgestart (bv. al ingevuld omdat je met
  // "Vorige" terugging naar een woord dat al beoordeeld was) mag nooit
  // vanzelf een nieuwe vlucht starten — enkel een ECHTE wijziging erna (een
  // klik/swipe terwijl deze kaart al in beeld is) mag dat.
  const laatstGezienOordeel = useRef(triggerOordeel)

  useEffect(() => {
    if (triggerOordeel !== laatstGezienOordeel.current) {
      laatstGezienOordeel.current = triggerOordeel
      if (triggerOordeel) vliegWeg(triggerOordeel)
    }
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
    setTimeout(() => onDecision(oordeel), 160)
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
  // Enkel een lokale, tijdelijke "actie hangende"-vlag: wordt bij elke
  // nieuwe index teruggezet naar null. Een kaartje dat een woord opnieuw
  // toont (bv. na "Vorige") start dus altijd onbeoordeeld, ook al werd dat
  // woord al eerder beoordeeld — OefenKaart zelf negeert toch elk oordeel
  // waarmee het al gemount werd, dus een kortstondig stale prop-waarde hier
  // is onschadelijk.
  const [kaartOordeel, setKaartOordeel] = useState(null)

  useEffect(() => {
    setKaartOordeel(null)
  }, [index])

  const triggerKaartOordeel = (uitkomst) => {
    if (kaartOordeel !== null) return
    setKaartOordeel(uitkomst)
  }

  const handleKaartOordeel = (uitkomst) => {
    onOordeel(uitkomst)
  }

  return (
    <section className="oefenen">
      <div className="oefenen-header">
        <div className="oefenen-progress">
          <div className="oefenen-progress-bar" style={{ width: `${(index / totaal) * 100}%` }} />
        </div>
        <p className="oefenen-voortgang">
          {index + 1} / {totaal}
        </p>
      </div>

      <OefenKaart
        key={index}
        klanken={woord.klanken}
        onDecision={handleKaartOordeel}
        triggerOordeel={kaartOordeel}
      />

      <div className="oefenen-feedback">
        <span className="oefenen-hint">Veeg naar rechts = juist, naar links = fout</span>
      </div>

      <div className="oefenen-knoppen">
        <button className="btn btn-quiet" onClick={onVorige} disabled={index === 0} aria-label="Vorige woord">
          Vorige
        </button>
        <button
          className="btn btn-fout"
          onClick={() => triggerKaartOordeel('fout')}
          disabled={kaartOordeel !== null}
          aria-label="Markeer woord als fout"
        >
          ✗ Fout
        </button>
        <button
          className="btn btn-juist"
          onClick={() => triggerKaartOordeel('juist')}
          disabled={kaartOordeel !== null}
          aria-label="Markeer woord als juist"
        >
          ✓ Juist
        </button>
      </div>

      <button className="btn btn-quiet btn-stop-oefenen" onClick={onStop}>
        Stop met oefenen
      </button>
    </section>
  )
}

// Toont niet alleen de kale cijfers, maar ook een boodschap die meeschaalt
// met de score — voelt voor een kind belonender aan dan enkel een telling.
function resultaatBeoordeling(percentage) {
  if (percentage === 100) return { emoji: '🎉', boodschap: 'Perfect!' }
  if (percentage >= 80) return { emoji: '👏', boodschap: 'Heel goed gedaan!' }
  if (percentage >= 50) return { emoji: '💪', boodschap: 'Goed geoefend!' }
  return { emoji: '🌱', boodschap: 'Blijven oefenen, dat lukt zo!' }
}

function OefenResultaat({ aantalJuist, aantalFout, onOpnieuwFout, onTerug }) {
  const totaal = aantalJuist + aantalFout
  const percentage = totaal > 0 ? Math.round((aantalJuist / totaal) * 100) : 0
  const { emoji, boodschap } = resultaatBeoordeling(percentage)

  return (
    <section className="oefenen oefenen-resultaat">
      <span className="resultaat-emoji" aria-hidden="true">
        {emoji}
      </span>
      <h2>{boodschap}</h2>
      <p className="resultaat-score">{percentage}%</p>
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
  const [selected, setSelected] = useState(laadOpgeslagenKlanken)
  const [geenClusters, setGeenClusters] = useState(laadGeenClusters)
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

  useEffect(() => {
    try {
      localStorage.setItem(KLANKEN_OPSLAG_SLEUTEL, JSON.stringify([...selected]))
    } catch {
      // localStorage niet beschikbaar (bv. privénavigatie) — negeer stilzwijgend
    }
  }, [selected])

  useEffect(() => {
    try {
      localStorage.setItem(CLUSTERS_OPSLAG_SLEUTEL, String(geenClusters))
    } catch {
      // localStorage niet beschikbaar (bv. privénavigatie) — negeer stilzwijgend
    }
  }, [geenClusters])

  // Medeklinkerclusters (ch, ng, nk, sch) horen niet bij "eenvoudige
  // woordjes" — zodra die stand aan gaat (of al aan staat bij het opstarten,
  // door de opgeslagen voorkeur), mogen ze niet meer aangevinkt blijven.
  useEffect(() => {
    if (!geenClusters) return
    setSelected((s) => {
      if (!MEDEKLINKERCLUSTER_KLANKEN.some((k) => s.has(k))) return s
      const next = new Set(s)
      for (const k of MEDEKLINKERCLUSTER_KLANKEN) next.delete(k)
      return next
    })
  }, [geenClusters])

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
      .filter(({ klanken }) => !geenClusters || !heeftMedeklinkerCluster(klanken))
      .sort((a, b) => a.word.length - b.word.length || a.word.localeCompare(b.word, 'nl'))
  }, [selected, geenClusters])

  const oefenOpties = useMemo(() => {
    const hoogsteTrap = OEFEN_AANTALLEN[OEFEN_AANTALLEN.length - 1]
    const opties = OEFEN_AANTALLEN.filter((n) => n < words.length)
    if (words.length <= hoogsteTrap) opties.push(words.length)
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
            {KLANKEN_GROUPS.map((g, i) => (
              <div key={g.title}>
                <div className={i === 0 ? 'klanken-group is-eerste' : 'klanken-group'}>
                  <div className="klanken-group-kop">
                    <h2>{g.title}</h2>
                    {i === 0 && (
                      <div className="klanken-actions">
                        <button className="btn" onClick={selectAll}>
                          Alles aan
                        </button>
                        <button className="btn btn-quiet" onClick={clearAll}>
                          Alles uit
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="klanken-row">
                    {g.klanken.map((k) => {
                      const uitgeschakeld = geenClusters && g.title === 'Medeklinkerclusters'
                      return (
                        <button
                          key={k}
                          className={
                            selected.has(k)
                              ? `klank ${GROUP_CLASS[g.title]} is-on`
                              : `klank ${GROUP_CLASS[g.title]}`
                          }
                          onClick={() => toggle(k)}
                          disabled={uitgeschakeld}
                          aria-pressed={selected.has(k)}
                        >
                          {KLANK_LABELS[k] ?? k}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {g.title === 'Medeklinkers' && (
                  <label className="niveau-toggle">
                    <input
                      type="checkbox"
                      checked={geenClusters}
                      onChange={(e) => setGeenClusters(e.target.checked)}
                    />
                    <span>
                      Enkel eenvoudige woordjes <em>(geen "kl", "tr", "bakken", ...)</em>
                    </span>
                  </label>
                )}
              </div>
            ))}
          </section>

          <section className="results">
            <div className="results-header">
              <h2 className="results-title">
                {selected.size === 0
                  ? 'Kies eerst een paar klanken hierboven'
                  : `${words.length} woordje${words.length === 1 ? '' : 's'} om te lezen`}
              </h2>
              {selected.size > 0 && (
                <button className="btn btn-quiet btn-small" onClick={clearAll}>
                  Reset
                </button>
              )}
            </div>

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

            {words.length > 0 && (
              <div className="word-list-marquee">
                <ul
                  className="word-list"
                  style={{ animationDuration: `${Math.max(words.length * 2, 15)}s` }}
                >
                  {/* Lijst wordt verdubbeld zodat de animatie naadloos in een lus
                      kan lopen: op de helft (-50%) staat de kopie exact op de
                      plek van het origineel. De kopie is aria-hidden zodat een
                      schermlezer de woorden niet dubbel voorleest. */}
                  {[...words, ...words].map(({ word, klanken }, i) => (
                    <li key={`${word}-${i}`} className="word-card" aria-hidden={i >= words.length}>
                      <KlankenWoord klanken={klanken} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
