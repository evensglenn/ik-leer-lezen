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
  'mama', 'mam', 'papa', 'oma', 'opa', 'broer', 'zus', 'baby', 'tante', 'oom',
  'neef', 'nicht', 'kind', 'seppe', 'kim',

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
  'blij', 'bang', 'moe', 'trots', 'gek', 'lief', 'stil', 'druk', 'zacht',

  // Werkwoorden
  'lopen', 'rennen', 'springen', 'zwemmen', 'vliegen', 'zingen', 'dansen',
  'spelen', 'lezen', 'schrijven', 'tekenen', 'bouwen', 'koken', 'eten', 'drinken',
  'slapen', 'dromen', 'lachen', 'kijken', 'luisteren', 'praten', 'roepen',
  'fietsen', 'zwaaien', 'knuffelen', 'wachten', 'zoeken', 'vinden', 'geven',
  'nemen', 'helpen', 'werken', 'wassen', 'poetsen', 'kammen', 'kussen',

  // Klank ch / ng / nk / sch (extra oefenwoorden)
  'nacht', 'licht', 'dicht', 'zacht', 'lachen', 'acht', 'ring', 'tong', 'jong',
  'long', 'vinger', 'koning', 'eng', 'streng', 'zingen', 'bank', 'tank', 'dank',
  'wenk', 'pink', 'link', 'klank', 'klak', 'school', 'schaap', 'schoen', 'schaal', 'schip',
  'schrik', 'schuur', 'schil',

  // Nog wat losse, veelgebruikte korte woordjes
  'ja', 'nee', 'hoi', 'dag', 'nu', 'hier', 'daar', 'op', 'in', 'uit', 'aan',
  'af', 'mee', 'weg', 'bij', 'van', 'met', 'en', 'of', 'maar', 'die', 'dat',
  'wie', 'wat', 'hoe', 'nog', 'wel', 'niet', 'zo', 'te', 'toe',

  // Speelgoed en buiten spelen
  'schommel', 'glijbaan', 'zandbak', 'emmertje', 'vlieger', 'knikker', 'puzzel',
  'blokken', 'poppenhuis', 'skelter', 'wip', 'trampoline', 'bal', 'net', 'doel',

  // Vervoer
  'bus', 'tram', 'fiets', 'brommer', 'scooter', 'vliegtuig', 'helikopter',
  'motor', 'kar', 'wagen', 'trein', 'boot', 'step', 'luchtballon',

  // Veelvoorkomende, veilige Nederlandstalige basiswoorden voor dagelijks taalgebruik
  'algemeen', 'alleen', 'alles', 'altijd', 'ander', 'andere', 'anders', 'antwoord',
  'apotheek', 'avond', 'bakker', 'bal', 'bank', 'bed', 'beeld', 'beetje', 'begin',
  'belangrijk', 'bericht', 'beslissen', 'best', 'bezoek', 'bijna', 'binnen', 'bloem',
  'boek', 'boom', 'bord', 'bos', 'bouwen', 'brand', 'breed', 'brengen', 'brug', 'buiten',
  'bureau', 'dag', 'daarom', 'deken', 'deel', 'dichtbij', 'dingen', 'doen', 'dragen',
  'draad', 'drinken', 'droog', 'duim', 'echt', 'eigen', 'eiland', 'einde', 'elk',
  'erg', 'even', 'familie', 'feest', 'fijn', 'fles', 'foto', 'fris', 'fruit', 'gaan',
  'gebeuren', 'gebied', 'gebruiken', 'geel', 'geheugen', 'geld', 'gemak', 'genoeg',
  'gerecht', 'geschikt', 'gezicht', 'gezond', 'glas', 'goud', 'groen', 'groep', 'grond',
  'groot', 'haar', 'hallo', 'hard', 'hart', 'haven', 'hebben', 'heel', 'hemd', 'het',
  'hier', 'hobby', 'hoek', 'hoeveel', 'hoofd', 'hotel', 'houden', 'huis', 'idee',
  'ieder', 'iemand', 'iets', 'insect', 'jaar', 'jagen', 'jongen', 'kaart', 'kamer',
  'kant', 'kantoor', 'keuken', 'kind', 'kleding', 'klein', 'klok', 'koek', 'koffer',
  'kopen', 'kort', 'kost', 'koud', 'kraan', 'kracht', 'krijgen', 'kussen', 'laag',
  'laat', 'land', 'lang', 'langs', 'laten', 'leerling', 'leider', 'leiden', 'leuk',
  'leven', 'licht', 'liefde', 'liggen', 'links', 'lokaal', 'lopen', 'luchthaven', 'maand',
  'machine', 'maken', 'makkelijk', 'markt', 'meerdere', 'meisje', 'mensen', 'midden',
  'mijn', 'minuut', 'moeder', 'morgen', 'muziek', 'na', 'naam', 'naar', 'natuurlijk',
  'nieuw', 'niets', 'nummer', 'object', 'ochtend', 'onder', 'onderwijs', 'onze', 'open',
  'ouders', 'over', 'paar', 'pagina', 'park', 'partner', 'passeren', 'persoon', 'pijn',
  'plaat', 'plaats', 'plant', 'plein', 'plus', 'poetsen', 'poort', 'potlood', 'praktijk',
  'prijs', 'probleem', 'product', 'publiek', 'punt', 'raad', 'radio', 'rechtdoor', 'rechts',
  'regel', 'reizen', 'restaurant', 'resultaat', 'richting', 'rijden', 'rijk', 'rond',
  'samen', 'schaar', 'school', 'schoon', 'snel', 'soms', 'soort', 'spelen', 'sport',
  'spreken', 'stad', 'start', 'station', 'sterk', 'stil', 'straat', 'student', 'taal',
  'tak', 'tand', 'tassen', 'tegen', 'teken', 'telefoon', 'terug', 'thuis', 'tijd', 'titel',
  'toekomst', 'toen', 'tonen', 'trainen', 'trekken', 'tussen', 'uitleggen', 'uitvinden',
  'vakantie', 'vallen', 'vandaag', 'vangen', 'vanmorgen', 'varken', 'vast', 'veel', 'veilig',
  'ver', 'veranderen', 'verdienen', 'verenigen', 'verhaal', 'verkeerd', 'vertellen',
  'vertrouwen', 'vierkant', 'vlees', 'vlieg', 'vloer', 'vogel', 'volgende', 'voor',
  'voorbeeld', 'vraag', 'vragen', 'vrij', 'vrijdag', 'vrouw', 'waar', 'wat', 'week',
  'weer', 'welkom', 'werk', 'wereld', 'west', 'wetenschap', 'wij', 'winkel', 'wonen',
  'woord', 'zaak', 'zand', 'zeer', 'zeggen', 'zeker', 'zelfde', 'zien', 'zilver', 'zingen',
  'zitten', 'zoals', 'zoet', 'zonder', 'zonnig', 'zorg', 'zorgen', 'zuid', 'zullen',
  'zwemmen',

  // Extra, om ook de zeldzamere klanken (ooi, oei, ieuw, q, x) te oefenen
  'mooi', 'kooi', 'boei', 'nieuw', 'quiz', 'taxi', 'uur', 'duur',

  // Rijtjes van korte woordjes per klankfamilie (a), zodat er van élke
  // combinatie veel te lezen valt, niet enkel losse thema-woorden.
  'an', 'al', 'ak', 'mat', 'rat', 'lat', 'man', 'kan', 'pan', 'ban', 'dan',
  'plan', 'bak', 'zak', 'vak', 'hak', 'kak', 'lak', 'pak', 'jak', 'dal', 'hal',
  'mal', 'pal', 'tal', 'wal', 'zal', 'kap', 'lap', 'rap', 'tap', 'dam', 'ram',
  'tam', 'gas', 'kas', 'was', 'pad', 'rad', 'laf',

  // (e)
  'el', 'ek', 'ben', 'den', 'hen', 'ken', 'wen', 'ren', 'men', 'bel', 'fel', 'zet',

  // (i)
  'ik', 'lik', 'pik', 'tik', 'mik', 'kik', 'mil', 'prik', 'strik', 'klik', 'min', 'vin',
  'zit', 'pit', 'lid',

  // (o)
  'on', 'ok', 'kok', 'bok', 'dok', 'hok', 'lok', 'mok', 'rok', 'nok', 'jok',
  'brok', 'kon', 'ton', 'kop', 'stop', 'mos', 'pot', 'tot', 'bol', 'dol', 'hol',
  'mol', 'wol', 'dom', 'log', 'kook', 'look',

  // (ee)
  'keek',

  // (u)
  'duf', 'stuk', 'trek', 'vlak', 'vlek', 'krap', 'plak', 'geluk',

  // Voornaamwoorden — komen in bijna elke zin voor
  'jij', 'hij', 'zij', 'wij', 'ze', 'we', 'jullie', 'mijn', 'jouw', 'zijn',
  'ons', 'deze', 'dit',

  // Meervoud op "-en" — mooie extra oefening voor de "e (u)"-klank
  'katten', 'honden', 'vissen', 'konijnen', 'kippen', 'eenden', 'schapen',
  'muizen', 'beren', 'geiten', 'bomen', 'dozen', 'potten', 'bedden', 'messen',
  'pennen', 'ballen', 'poppen',

  // Uit een grote, algemene Nederlandse basiswoordenlijst (WikiWoordenboeks
  // "1000 basiswoorden"), gefilterd op eenvoudige spelling — enkel duidelijk
  // ongewenste (gewelddadige) thema's en een handvol technische
  // uitzonderingen (leenwoorden die niet volgens de klankregels klinken,
  // samengestelde woorden waarvan de klankopdeling per ongeluk over de naad
  // heen liep) zijn eruit gehaald.
  'aanbod', 'aanraken', 'aardappel', 'aarde', 'aardig', 'achter', 'actief',
  'activiteit', 'ademen', 'afgelopen', 'afhangen', 'afmaken', 'afname', 'afspraak', 'afval',
  'algemeen', 'alleen', 'alles', 'als', 'altijd', 'ander', 'andere', 'anders',
  'antwoord', 'antwoorden', 'avond', 'avondeten', 'baan', 'bad', 'basis',
  'bedekken', 'bedreven', 'beest', 'beetje', 'begin', 'begrijpen', 'begrip', 'behalve',
  'beide', 'belangrijk', 'bellen', 'belofte', 'beneden', 'benzine', 'beroemd', 'beroep',
  'bescherm', 'beslissen', 'best', 'betalen', 'beter', 'bevatten', 'bewegen', 'bewolkt',
  'bezoek', 'bieden', 'bijna', 'bijten', 'bijzonder', 'binnen', 'blazen', 'blijven',
  'bodem', 'boerderij', 'boete', 'boord', 'bot', 'boven',
  'branden', 'brandstof', 'breed', 'breken', 'brengen', 'brief', 'brug', 'bruikbaar',
  'bruiloft', 'bui', 'buiten', 'bureau', 'buren', 'buurman', 'buurvrouw', 'cadeau',
  'cirkel', 'compleet', 'computer', 'conditie', 'controle', 'cool', 'correct', 'daarom',
  'dapper', 'de', 'deel', 'deksel', 'delen', 'derde', 'dichtbij', 'dienen',
  'diep', 'dier', 'dik', 'ding', 'dochter', 'doen', 'donker',
  'door', 'dorp', 'draad', 'draaien', 'dragen', 'drijven', 'drogen', 'droog',
  'dubbel', 'dun', 'dus', 'duwen', 'echt', 'eenheid', 'eenzaam', 'eerste',
  'eeuw', 'effect', 'eigen', 'eiland', 'einde', 'eis', 'elektrisch', 'elk',
  'enkele', 'erg', 'even', 'examen', 'extreem', 'falen', 'familie', 'feest',
  'feit', 'fijn', 'film', 'fit', 'fles', 'foto', 'fout', 'fris',
  'fruit', 'gaan', 'gat', 'gebeuren', 'gebied', 'geboorte', 'geboren', 'gebruik',
  'gebruiken', 'gedrag', 'gedragen', 'geen', 'geld', 'geliefde', 'gelijk', 'geloof',
  'geluid', 'gemak', 'gemeen', 'genieten', 'genoeg', 'genot', 'gerecht', 'geschikt',
  'gespannen', 'geur', 'gewicht', 'gewoon', 'gezicht',
  'gezond', 'gif', 'gisteren', 'glad', 'glas', 'glimlach', 'god', 'goed',
  'goedkoop', 'goud', 'graf', 'grap', 'grappig', 'grens', 'groeien', 'groente',
  'groep', 'grof', 'grond', 'groot', 'grootvader', 'haast', 'halen', 'half',
  'hallo', 'hamer', 'hard', 'hart', 'haten', 'hebben', 'heel', 'heet',
  'helder', 'helft', 'help', 'hem', 'hemel', 'herinneren', 'het', 'heuvel',
  'hobby', 'hoek', 'hoeveel', 'hoewel', 'honderd', 'honger', 'hoog', 'hoogte',
  'hoop', 'horen', 'hotel', 'houden', 'hun', 'huren', 'hut', 'huur',
  'idee', 'ieder', 'iedereen', 'iemand', 'iets', 'ijzer', 'jaar', 'jagen',
  'jongen', 'kaars', 'kaart', 'kamer', 'kans', 'kant', 'kantoor', 'kasteel',
  'kennen', 'kennis', 'keuken', 'keus', 'kiezen', 'kist', 'klaar', 'klas',
  'klasse', 'kleden', 'klein', 'kleren', 'kleur', 'klimmen', 'kloppen', 'klopt',
  'knippen', 'koers', 'koffer', 'koffie', 'komen', 'koningin', 'koorts', 'kopen',
  'kort', 'kost', 'kosten', 'koud', 'kraam', 'kracht', 'krant', 'krijgen',
  'kruis', 'kuil', 'kunnen', 'kunst', 'laag', 'laat', 'laatst', 'lach',
  'ladder', 'laken', 'land', 'lang', 'langs', 'langzaam', 'laten', 'leeftijd',
  'leeg', 'leerling', 'leger', 'leiden', 'lenen', 'lengte', 'leren', 'les',
  'leuk', 'leven', 'lichaam', 'liefde', 'liegen', 'liggen', 'lijk', 'lijken',
  'liniaal', 'links', 'list', 'lomp', 'lood', 'los', 'lot', 'lucht',
  'lui', 'lunch', 'maag', 'maal', 'maaltijd', 'maand', 'maat', 'machine',
  'maken', 'makkelijk', 'manier', 'map', 'markeren', 'markt', 'me', 'medicijn',
  'meel', 'meer', 'meerdere', 'meest', 'meisje', 'meneer', 'mengsel', 'mensen',
  'meubel', 'mevrouw', 'middel', 'midden', 'mij', 'miljoen', 'minder', 'minuut',
  'mis', 'missen', 'mits', 'model', 'modern', 'moeder', 'moeilijk', 'moeten',
  'mogelijk', 'mogen', 'moment', 'morgen', 'munt', 'muziek', 'na', 'naald',
  'naam', 'naar', 'naast', 'nat', 'natuur', 'natuurlijk', 'neer', 'netjes',
  'niets', 'nieuws', 'nobel', 'noch', 'nodig', 'noemen', 'nood', 'nooit',
  'noord', 'normaal', 'nul', 'nummer', 'object', 'oceaan', 'ochtend', 'oefening',
  'offer', 'olie', 'om', 'onder', 'onderwerp', 'onderzoek', 'oneven', 'ontsnappen',
  'ontbijt', 'ontdekken', 'ontmoeten', 'ontvangen', 'onze', 'ooit', 'ook', 'oorzaak',
  'oost', 'opeens', 'open', 'openlijk', 'opleiding', 'opnemen', 'oranje', 'orde',
  'oud', 'ouder', 'over', 'overal', 'overleden', 'paar', 'pagina', 'park',
  'partner', 'pas', 'passeren', 'per', 'perfect', 'periode', 'persoon', 'piano',
  'pijn', 'plaat', 'plaatje', 'plaats', 'plafond', 'plank', 'plant', 'plastic',
  'plat', 'plein', 'plus', 'poort', 'populair', 'positie', 'postzegel',
  'potlood', 'prijs', 'prins', 'prinses', 'proberen', 'probleem', 'product', 'provincie',
  'publiek', 'punt', 'raak', 'radio', 'raken', 'rapport', 'recht', 'rechtdoor',
  'rechts', 'redden', 'reeds', 'reiken', 'reizen', 'repareren', 'rest', 'restaurant',
  'resultaat', 'richting', 'rijk', 'rijzen', 'rond', 'rook', 'rots', 'rubber',
  'ruiken', 'ruimte', 'samen', 'schaduw', 'scheiden', 'scherp', 'schetsen',
  'schijnen', 'schoon', 'seconde', 'signaal', 'simpel',
  'sinds', 'slaapkamer', 'slecht', 'slim', 'slot', 'sluiten', 'smaak', 'smal',
  'snel', 'snelheid', 'snijden', 'soms', 'soort', 'sorry', 'speciaal', 'spel',
  'sport', 'spreken', 'staal', 'stad', 'stap', 'start', 'station',
  'stem', 'stempel', 'sterk', 'steun', 'stilte', 'stof', 'stoffig', 'stom',
  'straat', 'structuur', 'student', 'studie', 'succes', 'taal', 'tamelijk', 'tegen',
  'teken', 'telefoon', 'televisie', 'tellen', 'tennis', 'terug', 'terugkomst', 'terwijl',
  'test', 'tevreden', 'thuis', 'tijd', 'titel', 'toekomst', 'toen', 'toename',
  'totaal', 'traan', 'tram', 'trekken', 'trouwen', 'tussen', 'tweede', 'uitleggen',
  'uitnodigen', 'uitvinden', 'uitzoeken', 'vaak', 'vaarwel', 'vader', 'vakantie', 'vallen',
  'vals', 'vandaag', 'vangen', 'vanmorgen', 'vannacht', 'varken', 'vast',
  'veel', 'veer', 'veilig', 'ver', 'veranderen', 'verder', 'verdienen', 'verdrietig',
  'verenigen', 'vergeten', 'vergeven', 'vergissen', 'verhaal', 'verhoging', 'verjaardag', 'verkeerd',
  'verkopen', 'verlaten', 'verleden', 'verliezen', 'verrassen', 'vers', 'verschil', 'verstand',
  'verstoppen', 'versturen', 'vertellen', 'vertrekken', 'vertrouwen', 'verwachten', 'verzamelen', 'vet',
  'vierkant', 'vies', 'vijver', 'vlag', 'vlees', 'vlieg', 'vloer', 'voeden',
  'voedsel', 'voelen', 'voetbal', 'vol', 'volgende', 'volgorde', 'voor', 'voorbeeld',
  'voorkomen', 'voorzien', 'vorm', 'vouwen', 'vraag', 'vragen', 'vrede', 'vreemd',
  'vreemde', 'vriend', 'vriezen', 'vrij', 'vrijheid', 'vroeg', 'vroeger', 'vrouw',
  'vullen', 'waar', 'waarom', 'wakker', 'wanneer', 'want', 'warm', 'week',
  'weer', 'welke', 'welkom', 'wens', 'wereld', 'werelddeel', 'werk', 'west',
  'wetenschap', 'wiel', 'wijn', 'wijs', 'wild', 'willen', 'winkel', 'winnen',
  'wissen', 'wonder', 'woord', 'woud', 'zaak', 'zeer', 'zeggen',
  'zeil', 'zeker', 'zelfde', 'zetten', 'ziek', 'ziekenhuis', 'ziel', 'zien',
  'zilver', 'zinken', 'zitten', 'zoals', 'zoet', 'zonder', 'zonnig', 'zoon',
  'zorg', 'zorgen', 'zou', 'zuid', 'zulke', 'zullen', 'zwaar', 'zwak',
  'zwembad',
]

// Sommige woorden passen thematisch in meerdere lijstjes hierboven (bv. "bij"
// als insect en als voorzetsel) — hier maar één keer tonen.
export const WOORDEN = Array.from(new Set(RUWE_WOORDEN))
