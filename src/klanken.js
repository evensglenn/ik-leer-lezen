// Alle klanken waarmee een woord kan zijn opgebouwd, gegroepeerd zoals een kind
// ze aangeleerd krijgt. De volgorde binnen KLANKEN_GROUPS bepaalt hoe ze getoond
// worden; de tokenizer hieronder kijkt naar ALLE_KLANKEN (van lang naar kort)
// om een woord in klanken op te delen.
export const KLANKEN_GROUPS = [
  {
    title: 'Korte klinkers',
    klanken: ['a', 'e', 'i', 'o', 'u'],
  },
  {
    title: 'Lange klinkers',
    klanken: ['aa', 'ee', 'oo', 'uu'],
  },
  {
    title: 'Klinkt anders dan het staat',
    klanken: ['a-lang', 'e-lang', 'o-lang', 'u-lang', 'e-zwak'],
  },
  {
    title: 'Andere klinkers',
    klanken: ['ie', 'oe', 'eu', 'ui', 'ei', 'ij', 'au', 'ou', 'ooi', 'aai', 'oei', 'ieuw', 'eeuw'],
  },
  {
    title: 'Medeklinkers',
    klanken: [
      'b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm',
      'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z',
    ],
  },
  {
    title: 'Medeklinkerclusters',
    klanken: ['ch', 'ng', 'nk', 'sch'],
  },
]

// Leesbare knoptekst voor klanken waarvan de code (bv. "o-lang") niet is wat
// er echt op de knop moet staan.
export const KLANK_LABELS = {
  'a-lang': 'a (aa)',
  'e-lang': 'e (ee)',
  'o-lang': 'o (oo)',
  'u-lang': 'u (uu)',
  'e-zwak': 'e (u)',
}

// Voor de tokenizer tellen enkel de klanken die ook echt als losse letters in
// een woord kunnen voorkomen — de "open lettergreep"-klanken hieronder zijn
// een aparte, afgeleide classificatie en worden dus hier bewust niet in
// meegenomen (anders zou de tokenizer naar een letterlijke reeks "a-lang"
// in de tekst gaan zoeken, wat natuurlijk nooit voorkomt).
const MATCHBARE_KLANKEN = KLANKEN_GROUPS.flatMap((g) => g.klanken).filter((k) => !k.includes('-'))
// Van lang naar kort, zodat de tokenizer eerst "sch" probeert vóór "s".
const ALLE_KLANKEN = [...MATCHBARE_KLANKEN].sort((a, b) => b.length - a.length)
const MAX_KLANK_LENGTE = ALLE_KLANKEN[0].length
const KLANKEN_SET = new Set(ALLE_KLANKEN)

// De "open lettergreep"-regel: een korte klinker gevolgd door precies één
// medeklinker en dan weer een klinker, klinkt lang — bv. de "o" in "ko-ken"
// (vergelijk met "kok", waar de o wél kort blijft omdat er niets op volgt, of
// "pot-ten", waar de dubbele t de lettergreep juist gesloten houdt). Zo'n
// woord wordt dus nog altijd met één letter geschreven, maar telt als een
// eigen, apart aan te vinken klank (zie "Open lettergreep" hierboven) — niet
// zomaar hetzelfde vakje als de dubbel geschreven lange klinker ("oo"), want
// dat ene letter zien en toch lang lezen is een aparte vaardigheid. "i" hoort
// hier niet bij: een losse "i" in een open lettergreep komt in het
// Nederlands niet voor (dat wordt altijd als "ie" geschreven).
const OPEN_LETTERGREEP_KLINKERS = new Set(['a', 'e', 'o', 'u'])
const MEDEKLINKER_DAN_KLINKER = /^([bcdfghjklmnpqrstvwxz]+)([aeiouy])/

// De "stomme e": een onbeklemtoonde "e" aan het einde van een woord op "-en"
// (bv. "kam-men", "ren-nen") klinkt niet als de volle "e" van "pet", maar als
// een doffe uh — heel anders dan de klank die een kind bij de korte "e"
// aanleert. Vandaar een eigen klank in plaats van gewoon dezelfde korte "e".
// Enkel van toepassing als er al een andere klinker aan vooraf ging: in een
// woord van 1 lettergreep zoals "pen" of "ben" is de "e" wél gewoon kort.
const STOMME_E = /^n$/
const KLINKERLETTER = /[aeiouy]/

// Deelt een woord op in klanken door telkens de langst mogelijke gekende klank
// te nemen ("sch" vóór "s", "eeuw" vóór "ee"). Werkt goed voor de korte,
// niet-samengestelde woordjes die een beginnende lezer krijgt; bij een
// onbekend teken (bv. een accent) wordt dat teken als losse "klank" bewaard,
// zodat zo'n woord vanzelf afvalt zolang niemand net dat teken aanvinkt.
//
// Elk token heeft een "tekst" (wat er echt staat, voor de weergave — nooit
// wijzigen, anders leert een kind een verkeerde spelling) en een "klank"
// (welk vakje moet aangevinkt zijn, bv. "oo" voor de "o" in "koken").
export function splitIntoKlanken(woord) {
  const w = woord.toLowerCase()
  const tokens = []
  let i = 0
  while (i < w.length) {
    let match = null
    for (let len = Math.min(MAX_KLANK_LENGTE, w.length - i); len >= 1; len--) {
      const piece = w.slice(i, i + len)
      if (KLANKEN_SET.has(piece)) {
        match = piece
        break
      }
    }
    const tekst = match ?? w[i]

    let klank = tekst
    if (
      match?.length === 1 &&
      tekst === 'e' &&
      KLINKERLETTER.test(w.slice(0, i)) &&
      STOMME_E.test(w.slice(i + 1))
    ) {
      klank = 'e-zwak'
    } else if (match?.length === 1 && OPEN_LETTERGREEP_KLINKERS.has(tekst)) {
      const rest = w.slice(i + 1).match(MEDEKLINKER_DAN_KLINKER)
      // "x" is eigenlijk twee medeklinkers ineen ("ks"), sluit de lettergreep
      // dus af net als een dubbele medeklinker — vandaar de uitzondering.
      if (rest && rest[1].length === 1 && rest[1] !== 'x') klank = tekst + '-lang'
    }

    tokens.push({ tekst, klank })
    i += match ? match.length : 1
  }
  return tokens
}

// Een woord is "leesbaar" met een set gekozen klanken zodra elke klank waaruit
// het is opgebouwd, in die set zit.
export function isReadable(woord, gekozenKlanken) {
  return splitIntoKlanken(woord).every(({ klank }) => gekozenKlanken.has(klank))
}
