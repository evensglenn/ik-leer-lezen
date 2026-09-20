// Eenvoudige, veelvoorkomende woordjes voor een beginnende lezer. Bewust geen
// samengestelde woorden (zoals "aardappel" of "vliegtuig") omdat de klanken
// daarvan over een woorddeel-grens heen kunnen samenvallen (bv. "aan" + "geven"
// zou dan verkeerd als "aa-ng-e-ven" gelezen worden in plaats van "aa-n-g-e-ven").
const RUWE_WOORDEN = [
  // Dieren
  'kat', 'hond', 'vis', 'vogel', 'muis', 'beer', 'aap', 'geit', 'koe', 'paard',
  'schaap', 'konijn', 'kip', 'haan', 'eend', 'uil', 'wolf', 'vos', 'egel', 'mier',
  'bij', 'spin', 'slak', 'kikker', 'krokodil', 'olifant', 'giraf', 'zebra', 'leeuw',
  'tijger', 'panda', 'dolfijn', 'haai', 'kwal', 'krab', 'mus', 'duif', 'kraai',
  'zwaan', 'otter', 'das', 'ree', 'hert', 'stier', 'ezel', 'kameel', 'koala',
  'kangoeroe', 'big', 'geitje', 'lam', 'veulen', 'kuiken', 'poes', 'pup',

  // Lichaam
  'hoofd', 'oog', 'oor', 'neus', 'mond', 'tand', 'haar', 'hand', 'voet', 'been',
  'buik', 'rug', 'arm', 'vinger', 'teen', 'nek', 'kin', 'wang', 'lip', 'knie',
  'pols', 'huid', 'nagel', 'borst', 'keel', 'schouder',

  // Eten en drinken
  'appel', 'peer', 'banaan', 'aardbei', 'druif', 'kers', 'citroen', 'tomaat',
  'wortel', 'ui', 'kool', 'brood', 'kaas', 'melk', 'boter', 'ei', 'koek', 'taart',
  'snoep', 'ijs', 'soep', 'pasta', 'rijst', 'worst', 'patat', 'friet', 'saus',
  'honing', 'jam', 'yoghurt', 'pizza', 'chocolade', 'water', 'sap', 'thee',
  'suiker', 'peper', 'zout', 'boon', 'erwt', 'sla', 'komkommer', 'paprika',
  'druiven', 'noot',

  // Huis en spullen
  'huis', 'deur', 'raam', 'tafel', 'stoel', 'bed', 'kast', 'lamp', 'boek', 'bal',
  'pop', 'auto', 'trein', 'fiets', 'boot', 'step', 'bus', 'tas', 'doos', 'mand',
  'emmer', 'schep', 'schaar', 'pen', 'papier', 'verf', 'kwast', 'bord', 'kom',
  'beker', 'lepel', 'vork', 'mes', 'servet', 'zeep', 'kam', 'borstel', 'spiegel',
  'klok', 'sleutel', 'bril', 'muts', 'sjaal', 'jas', 'broek', 'trui', 'hemd',
  'sok', 'schoen', 'laars', 'riem', 'hoed', 'pet', 'bank', 'trap', 'muur', 'dak',
  'tuin', 'schuur', 'hek', 'brievenbus', 'schilderij', 'kussen', 'deken', 'gordijn',

  // Familie
  'mama', 'papa', 'oma', 'opa', 'broer', 'zus', 'baby', 'tante', 'oom', 'neef',
  'nicht', 'kind',

  // Kleuren
  'rood', 'blauw', 'groen', 'geel', 'wit', 'zwart', 'bruin', 'roze', 'grijs', 'paars',

  // Getallen
  'een', 'twee', 'drie', 'vier', 'vijf', 'zes', 'zeven', 'acht', 'negen', 'tien',
  'elf', 'twaalf',

  // Natuur en weer
  'zon', 'maan', 'ster', 'wolk', 'regen', 'sneeuw', 'wind', 'storm', 'bliksem',
  'donder', 'mist', 'vorst', 'hitte', 'kou', 'lente', 'zomer', 'herfst', 'winter',
  'bos', 'berg', 'zee', 'rivier', 'strand', 'duin', 'weide', 'veld', 'boom',
  'blad', 'tak', 'bloem', 'gras', 'steen', 'zand', 'modder', 'plas', 'regenboog',

  // Gevoelens
  'blij', 'boos', 'bang', 'moe', 'trots', 'gek', 'lief', 'stil', 'druk', 'zacht',

  // Werkwoorden
  'lopen', 'rennen', 'springen', 'zwemmen', 'vliegen', 'zingen', 'dansen',
  'spelen', 'lezen', 'schrijven', 'tekenen', 'bouwen', 'koken', 'eten', 'drinken',
  'slapen', 'dromen', 'lachen', 'huilen', 'kijken', 'luisteren', 'praten', 'roepen',
  'fietsen', 'zwaaien', 'knuffelen', 'wachten', 'zoeken', 'vinden', 'geven',
  'nemen', 'helpen', 'werken', 'wassen', 'poetsen', 'kammen', 'kussen',

  // Klank ch / ng / nk / sch (extra oefenwoorden)
  'nacht', 'licht', 'dicht', 'zacht', 'lachen', 'acht', 'ring', 'tong', 'jong',
  'long', 'vinger', 'koning', 'eng', 'streng', 'zingen', 'bank', 'tank', 'dank',
  'wenk', 'pink', 'link', 'school', 'schaap', 'schoen', 'schaal', 'schip',
  'schrik', 'schuur',

  // Nog wat losse, veelgebruikte korte woordjes
  'ja', 'nee', 'hoi', 'dag', 'nu', 'hier', 'daar', 'op', 'in', 'uit', 'aan',
  'af', 'mee', 'weg', 'bij', 'van', 'met', 'en', 'of', 'maar', 'die', 'dat',
  'wie', 'wat', 'hoe', 'nog', 'wel', 'niet', 'zo', 'te', 'toe',

  // Speelgoed en buiten spelen
  'schommel', 'glijbaan', 'zandbak', 'emmertje', 'vlieger', 'knikker', 'puzzel',
  'blokken', 'poppenhuis', 'skelter', 'wip', 'trampoline', 'bal', 'net', 'doel',

  // Vervoer
  'vrachtwagen', 'brandweerwagen', 'politieauto', 'ambulance', 'vliegtuig',
  'helikopter', 'motor', 'kar', 'wagen',

  // Extra, om ook de zeldzamere klanken (ooi, oei, ieuw, q, x) te oefenen
  'mooi', 'kooi', 'boei', 'nieuw', 'quiz', 'taxi', 'vuur', 'uur', 'duur',

  // Rijtjes van korte woordjes per klankfamilie (a), zodat er van élke
  // combinatie veel te lezen valt, niet enkel losse thema-woorden.
  'an', 'mat', 'rat', 'lat', 'man', 'kan', 'pan', 'ban', 'dan', 'plan', 'bak',
  'zak', 'vak', 'hak', 'kak', 'lak', 'pak', 'jak', 'dal', 'hal', 'mal', 'pal',
  'tal', 'wal', 'zal', 'kap', 'lap', 'rap', 'tap', 'dam', 'ram', 'tam', 'gas',
  'kas', 'was', 'pad', 'rad', 'laf',

  // (e)
  'el', 'ben', 'den', 'hen', 'ken', 'wen', 'ren', 'men', 'bel', 'fel', 'zet',

  // (i)
  'ik', 'lik', 'pik', 'tik', 'mik', 'kik', 'prik', 'strik', 'klik', 'min', 'vin',
  'zit', 'pit', 'lid',

  // (o)
  'kok', 'bok', 'dok', 'hok', 'lok', 'mok', 'rok', 'nok', 'jok', 'brok', 'kon',
  'ton', 'kop', 'stop', 'mos', 'pot', 'tot', 'bol', 'dol', 'hol', 'mol', 'wol',
  'dom', 'log',

  // (u)
  'duf', 'stuk', 'trek', 'vlak', 'vlek', 'krap', 'plak', 'geluk',

  // Voornaamwoorden — komen in bijna elke zin voor
  'jij', 'hij', 'zij', 'wij', 'ze', 'we', 'jullie', 'mijn', 'jouw', 'zijn',
  'ons', 'deze', 'dit',
]

// Sommige woorden passen thematisch in meerdere lijstjes hierboven (bv. "bij"
// als insect en als voorzetsel) — hier maar één keer tonen.
export const WOORDEN = Array.from(new Set(RUWE_WOORDEN))
