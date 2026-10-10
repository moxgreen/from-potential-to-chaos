# Dal potenziale al caos – canovaccio di lezione

10 ottobre 2026 · Ivan Molineris

## Come usare questo canovaccio

In nove tappe si va dalla legge di Coulomb ai bacini di attrazione frattali, usando un solo strumento: il [Laboratorio del potenziale elettrostatico](https://claude.ai/artifact/JBUKU3S2H6ZyMqB8o5mJRk).

Ogni punto esiste in tre livelli, con la stessa numerazione:

- **Canovaccio** (sempre visibile): cosa dire, in ordine, e cosa fare sul laboratorio.
- **Note per il relatore** (pannello apribile sotto ogni tappa): fisica, conti di controllo, errori tipici degli studenti.
- **Testo per lo studente** (secondo pannello apribile): spiegazione da leggere da soli, con figure e istruzioni per il simulatore.

Tempi indicativi:

| Incontro | Tappe | Durata | Scheda del laboratorio |
| --- | --- | --- | --- |
| A | 1–3 · Il potenziale | 60 min | 1 · Il potenziale |
| B | 4–5 · Cariche in moto | 60 min | 2 · Cariche in moto |
| C | 6–9 · Sistemi dinamici e caos | 90 min, o due ore da 45 | 3 · Sistemi dinamici e caos |

- **Prerequisiti:** legge di Coulomb, lavoro ed energia, moto circolare uniforme; per la tappa 1 l'integrale di 1/r².
- **Materiale:** il laboratorio proiettato a schermo intero (tasto F). Il link resta privato finché non lo condividi; in alternativa usa il file HTML, che funziona anche offline.
- **Convenzioni del laboratorio:** posizioni in cm, cariche in nC, potenziale in V; la carica di prova vale 1 nC e ha massa 1 g.
- **Legenda:** le righe *Laboratorio* indicano l'azione da fare sul simulatore.

@@PERCORSO@@

Ogni incontro corrisponde a una scheda del laboratorio; le tappe si leggono dall'alto in basso, colonna per colonna.

## 1 · Dalla legge di Coulomb al potenziale

Incontro A, circa 20 minuti. Il potenziale nasce da una sola proprietà: il lavoro della forza elettrica non dipende dal percorso.

- **1.1 Dalla forza al campo.** F = k q q₀ / r²; il campo E = F / q₀ è una proprietà del punto, non della carica di prova.
- **1.2 Il campo è conservativo.** Il lavoro da A a B dipende solo dalle distanze: W = k q q₀ (1/r\_A − 1/r\_B).
- **1.3 Energia potenziale e potenziale.** U = k q q₀ / r, con zero all'infinito; V = U / q₀ = k q / r, energia per unità di carica, in volt.
- **1.4 Sovrapposizione.** V è uno scalare: i contributi di più cariche si sommano come numeri.
- **Laboratorio:** configurazione «Carica singola» (+2 nC); la sonda a 2 cm legge circa 899 V, a 4 cm circa 449 V. Raddoppiando la distanza il potenziale si dimezza.
- **Domanda guida:** perché al potenziale basta un numero per punto, mentre al campo ne servono due?

## 2 · Leggere il potenziale: isoipse e superficie

Incontro A, circa 20 minuti. Il potenziale si legge come una carta topografica: le isoipse sono le curve di livello, la superficie 3D è il rilievo.

- **2.1 Isoipse.** Linee che uniscono punti con lo stesso V; tra due isoipse vicine c'è sempre lo stesso ΔV.
- **2.2 Superficie.** V come altezza: cariche positive = picchi, cariche negative = pozzi, lontano dalle cariche una pianura a quota zero.
- **2.3 Densità delle isoipse.** Isoipse fitte = pendio ripido = potenziale che cambia in fretta.
- **2.4 Due casi da confrontare.** Dipolo: V = 0 lungo l'asse y. Due cariche uguali: al centro un punto di sella.
- **Laboratorio:** «Dipolo», poi «Due cariche uguali»; passare la sonda e far notare l'isoipsa tratteggiata che la segue. Cambiare ΔV con il cursore «Isoipse per segno».
- **Laboratorio:** aggiungere una terza carica con un clic e chiedere di prevedere la nuova mappa prima di guardarla.
- **Domanda guida:** perché due isoipse non possono mai incrociarsi?

## 3 · Campo e potenziale

Incontro A, circa 20 minuti. Campo e potenziale sono la stessa informazione: il campo è la «discesa più ripida» del potenziale.

- **3.1 E è perpendicolare alle isoipse.** Lungo un'isoipsa il lavoro è nullo, quindi la forza non ha componente lungo di essa.
- **3.2 Verso e intensità.** E punta verso i potenziali decrescenti; |E| ≈ ΔV / Δs, dove Δs è la distanza tra due isoipse vicine.
- **3.3 Linee di campo.** Escono dalle cariche positive ed entrano nelle negative; il loro numero è proporzionale alla carica.
- **3.4 Lettura sulla superficie.** In ogni punto E indica la direzione in cui la superficie scende più ripida.
- **Laboratorio:** «Dipolo», Campo elettrico → «Linee di campo», poi «Vettori E». Misurare Δs tra due isoipse vicine, calcolare ΔV/Δs e confrontarlo con |E| della sonda.
- **Domanda guida (ponte verso la tappa 4):** una carica lasciata libera seguirà una linea di campo?

## 4 · Una carica che si muove

Incontro B, circa 25 minuti. La forza dice come cambia la velocità, non dove va la carica: per questo la traiettoria non segue la linea di campo.

- **4.1 Dinamica.** F = q₀E, a = q₀E / m. Nel laboratorio: q₀ = 1 nC, m = 1 g, moto nel piano senza attrito.
- **4.2 Il calcolo passo dopo passo.** Il computer applica la seconda legge della dinamica a intervalli di tempo molto brevi: è così che si risolvono quasi tutti i problemi reali.
- **4.3 Conservazione dell'energia.** K + U resta costante, con U = q₀V: dove V scende (per q₀ > 0) la carica accelera.
- **4.4 Traiettoria e linea di campo.** Partendo da ferma la carica parte lungo la linea di campo, poi l'inerzia la porta fuori.
- **Laboratorio:** scheda 2, «Partenza da ferma nel dipolo»: confrontare la traccia con la linea tratteggiata. Mostrare nella tabella che K + U non cambia.
- **Laboratorio:** «Posiziona una carica di prova», clic e trascinamento per dare la velocità iniziale; far prevedere la traiettoria prima di premere Avvia.
- **Domanda guida:** perché nel 3D la carica positiva si comporta come una pallina che rotola, e cosa cambia se q₀ è negativa?

## 5 · Orbite e diffusione

Incontro B, circa 35 minuti. La forza di Coulomb ha la stessa forma della gravità di Newton, quindi produce le stesse orbite.

- **5.1 Orbita circolare.** k|qQ| / r² = m v² / r. Con Q = −2 nC e r = 5 cm: v ≈ 1,90 cm/s, periodo ≈ 16,6 s.
- **5.2 Ellissi.** Stesso punto di partenza, velocità minori: ellissi più allungate, come nelle leggi di Keplero.
- **5.3 Rosetta.** Due cariche al centro: la forza non è più esattamente ∝ 1/r² e l'orbita non si chiude.
- **5.4 Rutherford (1911).** Carica repulsiva: traiettorie iperboliche. Con +4 nC e v = 7 cm/s la carica lanciata frontalmente torna indietro a circa 1,5 cm dal centro.
- **5.5 Deflessione.** Tra due file di cariche opposte il campo è quasi uniforme: le traiettorie sono quasi parabole e le cariche più veloci deviano meno.
- **Laboratorio:** scheda 2, i preset nell'ordine: Orbita circolare, Orbite ellittiche, Rosetta, Rutherford, Deflessione. Tenere aperta la tabella dell'energia.
- **Domanda guida:** perché Rutherford, dalle poche particelle che tornavano indietro, dedusse che la carica positiva dell'atomo è concentrata in un nucleo?

## 6 · Sistemi dinamici e spazio delle fasi

Incontro C, circa 15 minuti. Cambia il punto di vista: invece di una traiettoria alla volta, si guardano tutti i moti possibili insieme.

- **6.1 Stato.** Quattro numeri (x, y, vₓ, v\_y) bastano a determinare tutto il futuro della carica.
- **6.2 Sistema dinamico.** Una regola che, dato lo stato, dice come cambia: qui è la seconda legge della dinamica.
- **6.3 Spazio delle fasi.** L'insieme di tutti gli stati; ogni moto è una curva al suo interno. Da uno stato passa una sola curva.
- **6.4 Moto periodico = curva chiusa.** L'orbita circolare della tappa 5, vista in (x, vₓ), è un'ellisse percorsa sempre uguale.
- **Laboratorio:** scheda 2, «Orbita circolare», poi in alto a destra «Spazio delle fasi». Confrontare con «Orbite ellittiche»: tre curve chiuse diverse.
- **Avvertenza da dire subito:** il grafico è una proiezione di uno spazio a quattro dimensioni, quindi le curve possono sembrare incrociarsi.
- **Domanda guida:** se cambio di poco la velocità iniziale, l'orbita circolare cambia di poco o di tanto?

## 7 · Attrattori regolari: punto fisso e ciclo limite

Incontro C, circa 20 minuti. Con l'attrito il sistema «dimentica» da dove è partito: le traiettorie convergono verso un attrattore.

- **7.1 Attrito viscoso.** F = −mγv: l'energia K + U diminuisce sempre.
- **7.2 Punto fisso stabile.** Carica positiva dentro un anello di cariche positive: al centro la forza è nulla e ogni traiettoria vi arriva a spirale.
- **7.3 Attrattore.** L'insieme verso cui tendono le traiettorie, indipendentemente (entro certi limiti) da dove partono.
- **7.4 Attrito attivo.** F = mγ(1 − v²/v\*²)v: spinge la carica quando è lenta e la frena quando è veloce. Il sistema riceve e cede energia.
- **7.5 Ciclo limite.** Da dentro e da fuori la carica finisce sullo stesso giro (raggio circa 3,1 cm). È diverso dalle orbite della tappa 5, che cambiano con la velocità iniziale.
- **Laboratorio:** scheda 3, «Prova: il punto fisso», poi «Prova: il ciclo limite», con lo spazio delle fasi a destra. Indicare la spirale verso un punto e le curve che convergono su un anello.
- **Domanda guida:** quali oggetti di tutti i giorni hanno un ciclo limite? (orologio a pendolo, cuore, archetto del violino)

## 8 · Caos e attrattori strani

Incontro C, circa 30 minuti. Un sistema perfettamente deterministico può essere imprevedibile in pratica: è il caos.

- **8.1 Non tutto è caotico.** Il moto attorno a due cariche fisse si risolve esattamente (problema di Eulero); con tre ostacoli non più.
- **8.2 Sensibilità alle condizioni iniziali.** Nel «biliardo elettrico» due partenze distanti 0,2 mm dopo circa un minuto seguono traiettorie del tutto diverse. La distanza cresce in modo esponenziale.
- **8.3 Ordine e caos insieme.** Nello stesso sistema una partenza un po' più lenta resta su un moto regolare.
- **8.4 Senza attrito niente attrattori.** L'energia si conserva e i volumi nello spazio delle fasi non si contraggono (teorema di Liouville).
- **8.5 Attrattore strano.** Attrito attivo + tre ostacoli: da ogni partenza la carica finisce nella stessa regione aggrovigliata, ma partenze vicine si separano e il moto non si ripete. È l'analogo dell'attrattore di Lorenz (1963).
- **Laboratorio:** scheda 3, «Prova: il biliardo elettrico» a 4×: seguire P1 e P2 che si separano, P3 che resta ordinata. Poi «Prova: l'attrattore strano» a 8×, lasciato correre due minuti a schermo intero sullo spazio delle fasi.
- **Domanda guida:** se misuro la posizione iniziale dieci volte meglio, di quanto si allunga il tempo in cui posso prevedere il moto?

## 9 · Bacini di attrazione frattali

Incontro C, circa 25 minuti. Anche quando ogni moto finisce in modo semplice, prevedere quale fine avrà può essere impossibile: i confini tra i destini sono frattali.

- **9.1 Più attrattori.** Tre cariche negative, A, B e C, e attrito viscoso: la carica di prova finisce sempre su una delle tre.
- **9.2 Prima la scommessa, poi la mappa.** Qualche prova libera: un clic, la carica parte da ferma e il punto di partenza si colora come la carica su cui finisce. Poi si scommette sui punti sfida, prima quelli ovvi (1–3), poi quelli ingannevoli (4–6): partono vicini a una carica e finiscono su quella più lontana. Infine il centro (7), dove la carica resta ferma, e due partenze a 1 cm l'una dall'altra (8–9) che finiscono su cariche diverse.
- **9.3 Bacino di attrazione.** L'insieme dei punti di partenza che portano allo stesso attrattore. La mappa fa lo stesso lavoro delle prove a mano su 10 000 punti, ognuno simulato fino alla fine.
- **9.4 Due zone.** Vicino alle cariche, bacini grandi e regolari. Lontano, strisce dei tre colori intrecciate a ogni scala.
- **9.5 Frattale.** Ingrandendo un confine compaiono sempre nuovi dettagli: è un oggetto con dimensione non intera.
- **9.6 Conseguenza.** Vicino a un confine un errore piccolissimo sul punto di partenza cambia il destino finale, anche se il moto non è caotico per sempre.
- **Laboratorio:** scheda 3, «Prova: tre attrattori». Prima cinque minuti di prove libere, poi la «Scommessa»: «Evidenzia» un punto, si vota per alzata di mano su A, B o C, uno studente clicca sull'anello numerato. Solo dopo, «Calcola la mappa» (circa 10 secondi): ogni punto provato cade nella zona del suo colore. Infine «Ingrandisci un riquadro» su un confine lontano dalle cariche e «Calcola la mappa qui»: le strisce si ripetono.
- **Collegamenti:** il pendolo magnetico, i bacini del metodo di Newton per z³ = 1, l'insieme di Mandelbrot.
- **Domanda guida:** che cosa hanno in comune un pendolo magnetico e le previsioni del tempo?

## Chiusura

Ultimi 10 minuti dell'incontro C. Il filo del percorso si riassume in tre frasi da far ripetere agli studenti:

1. Il potenziale è un paesaggio di energia; il campo ne indica la discesa.
2. Una carica non scende lungo il campo ma si muove secondo F = ma, conservando l'energia o perdendola per attrito.
3. Leggi semplici e deterministiche possono generare moti imprevedibili e confini frattali.

- **Discussione:** determinismo e prevedibilità sono la stessa cosa? (il «demone di Laplace» contro il caos)
- **Verifica:** le domande sono nel pannello «Testo per lo studente» qui sotto, le soluzioni nel pannello «Note per il relatore».
- **Per chi vuole proseguire:** misurare l'orizzonte di prevedibilità con due cariche sempre più vicine; costruire con le cariche un proprio «pendolo magnetico» e calcolarne la mappa dei bacini.
