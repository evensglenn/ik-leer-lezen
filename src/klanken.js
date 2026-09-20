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

// Van lang naar kort, zodat de tokenizer eerst "sch" probeert vóór "s".
const ALLE_KLANKEN = KLANKEN_GROUPS.flatMap((g) => g.klanken).sort((a, b) => b.length - a.length)
const MAX_KLANK_LENGTE = ALLE_KLANKEN[0].length
const KLANKEN_SET = new Set(ALLE_KLANKEN)

// Deelt een woord op in klanken door telkens de langst mogelijke gekende klank
// te nemen ("sch" vóór "s", "eeuw" vóór "ee"). Werkt goed voor de korte,
// niet-samengestelde woordjes die een beginnende lezer krijgt; bij een
// onbekend teken (bv. een accent) wordt dat teken als losse "klank" bewaard,
// zodat zo'n woord vanzelf afvalt zolang niemand net dat teken aanvinkt.
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
    tokens.push(match ?? w[i])
    i += match ? match.length : 1
  }
  return tokens
}

// Een woord is "leesbaar" met een set gekozen klanken zodra elke klank waaruit
// het is opgebouwd, in die set zit.
export function isReadable(woord, gekozenKlanken) {
  return splitIntoKlanken(woord).every((k) => gekozenKlanken.has(k))
}
