// Eenmalig gebruikt om kandidaat-woorden uit een externe basiswoordenlijst te
// filteren en te controleren vooraleer ze manueel in words.js opgenomen worden.
import { readFileSync } from 'node:fs'
import { splitIntoKlanken } from '../src/klanken.js'
import { WOORDEN } from '../src/words.js'

const raw = readFileSync('/tmp/basiswoorden-raw.txt', 'utf8')
const kandidaten = raw
  .split(',')
  .map((w) => w.trim().toLowerCase())
  .filter(Boolean)

// Op uitdrukkelijke vraag: enkel echt ongewenste (gewelddadige) thema's
// uitsluiten. Het gaat om leesoefening, niet om woordenschat-niveau — de rest
// mag gewoon mee, ook al is het wat abstracter dan een kind actief gebruikt.
const UITSLUITEN = new Set([
  'moord', 'moorden', 'wapen', 'pistool', 'oorlog', 'gevangenis', 'vijand',
  'straffen', 'vernietigen', 'veroveren', 'bedreiging', 'overvallen', 'sex',
  // Leenwoorden waarvan de uitspraak niet uit de Nederlandse spelling is af
  // te leiden (klinkt niet zoals de klanken-regels voorspellen) — dit is
  // geen inhoudelijke uitsluiting, maar voorkomt een fout klankvoorbeeld.
  'team', 'instrument', 'één', 'privé', 'titel',
  // Samengestelde woorden waarbij de klankopdeling per ongeluk over de
  // naad tussen de twee delen heen loopt (bv. "binnen"+"kort" -> "nk"
  // i.p.v. apart "n" en "k").
  'binnenkort', 'ongeluk',
])

const bekend = new Set(WOORDEN)
const geldig = /^[a-zé]+$/

const nieuw = kandidaten.filter((w) => {
  if (!geldig.test(w)) return false
  if (w.length < 2 || w.length > 10) return false
  if (UITSLUITEN.has(w)) return false
  if (bekend.has(w)) return false
  return true
})

console.log('kandidaten:', kandidaten.length, '-> nieuw na filter:', nieuw.length)
console.log('')
for (const w of nieuw) {
  const toks = splitIntoKlanken(w)
  console.log(w.padEnd(16), toks.map((t) => t.tekst).join('-'), '|', toks.map((t) => t.klank).join('-'))
}

import { writeFileSync } from 'node:fs'
writeFileSync('/tmp/final-words.json', JSON.stringify(nieuw, null, 2))
