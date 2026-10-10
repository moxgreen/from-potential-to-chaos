# Dal potenziale al caos – testo per lo studente

Questo testo accompagna il Laboratorio del potenziale elettrostatico: leggi una sezione, poi prova sul simulatore quello che hai letto.

## Come usare il laboratorio

Il laboratorio è una pagina web che calcola il potenziale e il moto delle cariche mentre le sposti. A sinistra trovi la mappa vista dall'alto, a destra un secondo grafico (la superficie 3D oppure lo spazio delle fasi), sotto una barra di comandi e sulla destra tre schede che corrispondono alle parti di questo testo.

&#91;image: L'interfaccia del laboratorio\]

*Figura 0 – Il laboratorio con il dipolo: mappa delle isoipse a sinistra, superficie 3D al centro, schede dei comandi a destra.*

| Se vuoi… | fai così |
| --- | --- |
| aggiungere una carica | clic su un punto vuoto della mappa (scheda 1, «Il clic sulla mappa posiziona: Nuova carica») |
| spostare una carica | trascinala; con le frecce della tastiera la sposti di 1 mm |
| cambiare il valore di una carica | rotella del mouse sopra la carica, oppure il cursore nella scheda 1 |
| misurare V e il campo in un punto | passa con il mouse sulla mappa: i valori compaiono sotto la mappa |
| ruotare la superficie 3D | trascina il grafico di destra; la rotella fa lo zoom |
| far partire una simulazione | «Avvia» nella barra sotto i grafici, oppure la barra spaziatrice |
| vedere un solo grafico in grande | «Solo 2D» o «Solo 3D», poi «Schermo intero» (tasto F, Esc per uscire) |

Le unità sono sempre le stesse: distanze in centimetri, cariche in nanocoulomb (1 nC = 10⁻⁹ C), potenziale in volt, campo in V/m.

## 1 · Dalla forza di Coulomb al potenziale

Due cariche si attirano o si respingono con la forza di Coulomb:

```latex
F = k\,\frac{q\,q_0}{r^2}, \qquad k = 8{,}99\cdot 10^9\ \text{N·m}^2/\text{C}^2
```

Se dividiamo la forza per la carica di prova q₀ otteniamo il **campo elettrico** E = F / q₀: una proprietà del punto dello spazio, che esiste anche se lì non c'è nessuna carica a «sentirla».

**Il lavoro non dipende dal percorso.** Sposta una carica di prova da un punto A a un punto B: la forza elettrica compie un lavoro. Il fatto sorprendente è che questo lavoro dipende solo dalle distanze iniziale e finale dalla carica che genera il campo, non dalla strada seguita. Un campo con questa proprietà si dice **conservativo**, e per lui si può definire un'energia potenziale:

```latex
U = k\,\frac{q\,q_0}{r} \qquad \text{(zero quando la carica di prova è infinitamente lontana)}
```

**Il potenziale.** L'energia potenziale dipende da entrambe le cariche. Se la dividiamo per q₀ resta una grandezza che dipende solo dal punto: il **potenziale elettrico**, misurato in volt (1 V = 1 J/C).

```latex
V = \frac{U}{q_0} = k\,\frac{q}{r}
```

Il potenziale dice quanta energia avrebbe ogni coulomb di carica messo in quel punto. Il lavoro della forza elettrica tra A e B è W = q₀ (V\_A − V\_B).

**Più cariche: si sommano numeri.** Il potenziale prodotto da più cariche è la somma dei potenziali di ciascuna (principio di sovrapposizione). Poiché V è un numero e non un vettore, la somma è molto più semplice di quella dei campi.

&#91;image: Una carica singola e la sonda\]

*Figura 1 – Una carica di +2 nC. La sonda, a 2 cm dalla carica, legge V ≈ +899 V.*

> **Prova sul laboratorio.** Scheda 1 → «Carica singola». Porta la sonda a 2 cm dalla carica e leggi V; poi portala a 4 cm. Il valore si dimezza? Ora calcola V a 2 cm con la formula, ricordando che 2 cm = 0,02 m e 2 nC = 2·10⁻⁹ C, e confronta.

## 2 · Leggere il potenziale: isoipse e superficie

Il potenziale assegna un numero a ogni punto del piano. Ci sono due modi per «vederlo», gli stessi che si usano per il rilievo di una montagna.

**Le isoipse.** Su una carta topografica le curve di livello uniscono i punti alla stessa quota. Allo stesso modo le **isoipse** (o linee equipotenziali) uniscono i punti con lo stesso potenziale. Nel laboratorio tra due isoipse vicine c'è sempre la stessa differenza di potenziale ΔV, scritta nella scheda 1.

**La superficie.** Se usiamo V come altezza otteniamo un paesaggio: ogni carica positiva diventa un picco, ogni carica negativa un pozzo, e lontano dalle cariche il terreno è una pianura a quota zero.

&#91;image: Il dipolo in due e tre dimensioni\]

*Figura 2 – Il dipolo (+2 nC a sinistra, −2 nC a destra). A sinistra le isoipse: quella evidenziata passa per la sonda, dove V ≈ +122 V. A destra la stessa informazione come superficie: un picco e un pozzo.*

Tre cose da notare nella figura:

1. Dove le isoipse sono fitte la superficie è ripida: il potenziale cambia in fretta.
2. Sull'asse verticale, esattamente a metà tra le due cariche, V = 0: i contributi delle due cariche si annullano.
3. Due isoipse diverse non si incrociano mai: in un punto il potenziale ha un solo valore.

La superficie è «tagliata» in cima e in fondo: vicino a una carica V diventa grandissimo e non starebbe nel grafico. Il limite è il valore V\_max della scheda 1.

> **Prova sul laboratorio.** Scheda 1 → «Due cariche uguali». Prima di guardare, disegna sul quaderno le isoipse che ti aspetti. Poi confronta. Al centro trovi un punto di sella: lungo la congiungente delle cariche il centro è il punto più basso, nella direzione perpendicolare è il più alto, come su una sella da cavallo.

> **Prova sul laboratorio.** Aggiungi una terza carica con un clic. Indovina come cambia la mappa, poi trascina la carica e osserva.

## 3 · Campo e potenziale

Campo e potenziale non sono due cose diverse: sono due modi di descrivere la stessa situazione. Il campo indica la direzione in cui il potenziale scende più rapidamente.

**Il campo è perpendicolare alle isoipse.** Spostando una carica lungo un'isoipsa il potenziale non cambia, quindi la forza elettrica non compie lavoro. Una forza che non compie lavoro è perpendicolare allo spostamento: il campo «attraversa» le isoipse ad angolo retto.

**Verso e intensità.** Il campo punta da potenziali alti a potenziali bassi, e la sua intensità si stima con la distanza Δs tra due isoipse vicine:

```latex
|E| \approx \frac{\Delta V}{\Delta s}
```

Isoipse fitte significano campo intenso, isoipse rade campo debole. Sulla superficie 3D: il campo è la direzione in cui una pallina appoggiata scenderebbe, e la sua intensità è la ripidità del pendio.

**Le linee di campo.** Sono linee che in ogni punto hanno la direzione del campo. Escono dalle cariche positive ed entrano in quelle negative; nel laboratorio il loro numero è proporzionale al valore della carica.

&#91;image: Linee di campo e isoipse del dipolo\]

*Figura 3 – Linee di campo (in grigio scuro, con la freccia) e isoipse (colorate) del dipolo: si incontrano sempre ad angolo retto.*

> **Prova sul laboratorio.** Scheda 1 → «Dipolo», poi Campo elettrico → «Linee di campo». Controlla che le linee taglino le isoipse ad angolo retto. Passa a «Vettori E»: dove le frecce sono più scure, il campo è più intenso.

> **Misura.** Vicino all'origine, tra due isoipse vicine ci sono 100 V. Stima a occhio la loro distanza usando la griglia (un quadretto = 1 cm), calcola ΔV/Δs in V/m e confronta con il valore |E| che la sonda legge nell'origine.

**Una domanda per la prossima sezione.** Se lasci libera una carica, si muoverà lungo una linea di campo? Prova a rispondere prima di leggere oltre.

## 4 · Una carica in movimento

Ora le cariche fisse creano il campo e una **carica di prova** si muove al suo interno. Nel laboratorio è una piccola sfera con q₀ = 1 nC e massa m = 1 g, che scivola senza attrito sul piano.

**La dinamica.** Sulla carica di prova agisce la forza F = q₀E, quindi la sua accelerazione è:

```latex
\vec a = \frac{q_0\,\vec E}{m}
```

Il laboratorio calcola il moto «a piccoli passi»: conosce posizione e velocità, calcola la forza, avanza di un centesimo di secondo, e ripete. È il modo in cui si risolvono quasi tutti i problemi di dinamica reali, dalle orbite dei satelliti alle previsioni del tempo.

**L'energia si conserva.** Senza attrito la somma dell'energia cinetica e dell'energia potenziale resta costante:

```latex
K + U = \tfrac12 m v^2 + q_0 V = \text{costante}
```

Quando una carica positiva va verso potenziali più bassi, perde energia potenziale e guadagna velocità: sulla superficie 3D è come una pallina che scende da un pendio.

**La traiettoria non è la linea di campo.** La forza dice come cambia la velocità, non dove va la carica. Lungo una curva la carica avrebbe bisogno di una forza verso l'interno della curva (la forza centripeta), ma la forza elettrica è diretta lungo la linea di campo, non verso il suo interno. Partendo da ferma, la carica imbocca la linea di campo, poi l'inerzia la porta fuori.

&#91;image: Traiettoria e linea di campo nel dipolo\]

*Figura 4 – Una carica partita da ferma nel dipolo. La linea punteggiata è la linea di campo che passa per il punto di partenza; la traccia scura è la traiettoria vera, che se ne allontana. Le frecce mostrano velocità (scura) e forza (rosa).*

> **Prova sul laboratorio.** Scheda 2 → «Partenza da ferma nel dipolo». Durante il moto guarda la tabella dell'energia: K e U cambiano, la loro somma no.

> **Prova sul laboratorio.** Premi «Posiziona una carica di prova», poi clicca sulla mappa e, senza rilasciare, trascina: la freccia che disegni è la velocità iniziale. Prevedi la traiettoria, poi premi Avvia (o la barra spaziatrice).

## 5 · Orbite e diffusione

La forza di Coulomb diminuisce come 1/r², esattamente come la gravità di Newton. Per questo una carica di prova attirata da una carica fissa si muove come un pianeta attorno al Sole.

**Orbita circolare.** Se la forza elettrica fa da forza centripeta:

```latex
k\,\frac{|q\,Q|}{r^2} = \frac{m v^2}{r} \quad\Rightarrow\quad v = \sqrt{\frac{k\,|q\,Q|}{m\,r}}
```

*Esempio.* Con Q = −2 nC, q₀ = 1 nC, m = 1 g e r = 5 cm si ottiene v ≈ 0,019 m/s = 1,9 cm/s; un giro dura T = 2πr/v ≈ 16,6 s.

**Orbite ellittiche.** Partendo più lentamente, la carica «cade» verso il centro e descrive un'ellisse, con la carica fissa in un fuoco: valgono le leggi di Keplero. Con due cariche vicine al centro, invece, la forza non è più esattamente ∝ 1/r² e l'orbita non si chiude: ruota lentamente e disegna una rosetta.

**Diffusione di Rutherford.** Se le cariche si respingono le traiettorie sono iperboli. Nel 1911 Rutherford, osservando che alcune particelle alfa lanciate contro una sottile lamina d'oro tornavano indietro, capì che la carica positiva dell'atomo è concentrata in un nucleo piccolissimo.

&#91;image: Orbite ellittiche e diffusione di Rutherford\]

*Figura 5 – A sinistra: tre orbite ellittiche che partono dallo stesso punto con velocità diverse. A destra: un fascio di cariche contro una carica positiva di +4 nC; quella lanciata dritta al centro torna indietro.*

> **Prova sul laboratorio.** Scheda 2, nell'ordine: «Orbita circolare», «Orbite ellittiche», «Rosetta», «Esperimento di Rutherford», «Deflessione tra due file di cariche». Per ognuna, prima di avviare, prova a prevedere che cosa succederà.

> **Misura.** Nell'orbita circolare usa il cronometro (t, nella barra in basso) per misurare il periodo e confrontalo con 16,6 s. Attenzione alla velocità di riproduzione: a 4× il tempo indicato è comunque quello simulato.

## 6 · Sistemi dinamici e spazio delle fasi

Fin qui abbiamo seguito una traiettoria alla volta. Ora cambiamo punto di vista e ci chiediamo: come si comportano **tutti** i moti possibili?

**Lo stato.** Per prevedere il futuro della carica di prova bastano quattro numeri: la posizione (x, y) e la velocità (vₓ, v\_y). Questi quattro numeri sono lo **stato** del sistema.

**Il sistema dinamico.** Una regola che, dato lo stato in un istante, dice come cambierà: qui è la seconda legge della dinamica. Un sistema descritto così si chiama **sistema dinamico**, ed è **deterministico**: lo stesso stato iniziale porta sempre allo stesso futuro.

**Lo spazio delle fasi.** L'insieme di tutti gli stati possibili. Ogni moto è una curva in questo spazio, e da ogni stato passa una sola curva. Lo spazio delle fasi della nostra carica ha quattro dimensioni: il laboratorio ne mostra una «ombra» a due dimensioni, con la posizione x in orizzontale e la velocità vₓ in verticale. Per questo nel grafico le curve possono sembrare incrociarsi: è l'ombra che si sovrappone, non il moto vero.

**Un moto periodico è una curva chiusa.** Nell'orbita circolare la carica ripassa sempre per gli stessi stati: nello spazio delle fasi percorre un'ellisse, sempre la stessa.

&#91;image: Orbita circolare nello spazio delle fasi\]

*Figura 6 – L'orbita circolare: a sinistra la traiettoria nel piano, a destra la stessa orbita nello spazio delle fasi (x, vₓ), un'ellisse percorsa sempre uguale.*

Nelle prossime sezioni incontreremo quattro comportamenti tipici. La figura seguente li riassume in modo schematico: ogni riquadro è uno spazio delle fasi.

&#91;image: Quattro comportamenti a lungo termine\]

*Figura 7 – Schemi qualitativi. Senza attrito: una curva chiusa per ogni energia. Con attrito: tutto converge in un punto. Con «motore» e attrito: tutto converge su una curva chiusa (ciclo limite). Infine l'attrattore strano di Lorenz.*

> **Prova sul laboratorio.** Scheda 2 → «Orbita circolare», poi nel grafico di destra scegli «Spazio delle fasi». Prova poi «Orbite ellittiche»: tre curve chiuse diverse, una per ogni velocità iniziale. Cambiando di poco la velocità iniziale, l'orbita cambia di poco: resta su un'ellisse vicina.

## 7 · Punto fisso e ciclo limite

Senza attrito un sistema «ricorda» per sempre come è partito: la sua energia resta quella iniziale. Con l'attrito invece dimentica, e moti partiti in modi diversi possono finire nello stesso modo. Il comportamento finale verso cui tendono si chiama **attrattore**.

**Attrito viscoso.** Nel laboratorio (scheda 3) puoi aggiungere una forza F = −mγv, opposta alla velocità, come la resistenza dell'aria: l'energia K + U diminuisce sempre.

**Il punto fisso.** Mettiamo la carica di prova positiva dentro un anello di cariche positive: al centro le spinte si bilanciano e la forza è nulla. Con l'attrito, da qualunque punto parta, la carica finisce ferma al centro. Nello spazio delle fasi lo stato «carica ferma al centro» è un punto, e le traiettorie vi arrivano a spirale: è un **punto fisso stabile**.

&#91;image: Il punto fisso\]

*Figura 8 – Tre cariche di prova partite da punti diversi dentro l'anello. A destra, nello spazio delle fasi, tre spirali che finiscono nello stesso punto.*

**Il ciclo limite.** Ora sostituiamo l'attrito con un «motore»: una forza che spinge la carica quando è più lenta di una velocità v\* e la frena quando è più veloce. Il sistema riceve energia quando ne ha poca e la cede quando ne ha troppa. Risultato: partendo da dentro o da fuori, la carica finisce sempre sullo stesso giro, un cerchio di circa 3,1 cm di raggio percorso esattamente a velocità v\*. Questa orbita isolata che attira le altre è un **ciclo limite**.

&#91;image: Il ciclo limite\]

*Figura 9 – Tre partenze diverse, una vicino al centro e due lontane: nello spazio delle fasi tutte le curve si avvolgono sulla stessa curva chiusa.*

Attenzione alla differenza con le orbite della sezione 5: lì ogni velocità iniziale dava un'orbita diversa; qui l'orbita finale è sempre la stessa. Il battito del cuore, il ticchettio di un orologio a pendolo e il suono di una corda di violino strofinata dall'archetto sono cicli limite.

> **Prova sul laboratorio.** Scheda 3 → «Prova: il punto fisso», poi «Prova: il ciclo limite». Il grafico di destra passa da solo allo spazio delle fasi. Poi aggiungi tu una carica di prova in un punto qualsiasi dentro l'anello: dove finisce?

> **Curiosità.** Nello spazio a tre dimensioni nessuna disposizione di cariche ferme può tenere un'altra carica in equilibrio stabile (teorema di Earnshaw). Qui funziona perché la carica è costretta a restare sul piano.

## 8 · Caos e attrattori strani

Un sistema dinamico è deterministico: lo stesso stato iniziale dà sempre lo stesso futuro. Ma nessuna misura è perfetta, e in certi sistemi un errore piccolissimo cresce fino a rendere il futuro imprevedibile. Questo è il **caos**.

**Non tutto è caotico.** Il moto attorno a una o due cariche fisse è regolare: si può prevedere per sempre. Con tre ostacoli al centro di un anello di cariche, il «biliardo elettrico», le cose cambiano.

**Sensibilità alle condizioni iniziali.** Lanciamo nel biliardo due cariche che partono a 0,2 mm di distanza, con la stessa velocità. Per un po' viaggiano appaiate, poi le loro strade si separano del tutto.

&#91;image: Il biliardo elettrico\]

*Figura 10 – Il biliardo elettrico: P1 e P2 partono quasi dallo stesso punto e finiscono su traiettorie diversissime; P3, un po' più lenta, resta su un moto ordinato.*

Il grafico seguente misura la distanza tra due cariche partite a solo 10⁻⁶ cm l'una dall'altra. La scala verticale è logaritmica: ogni tacca vale dieci volte la precedente.

&#91;image: Crescita della distanza tra due traiettorie vicine\]

*Figura 11 – In rosso, due partenze nella zona caotica: dopo circa 40 s la distanza cresce in modo esponenziale e in meno di 20 s si moltiplica per più di 100 000. In blu, due partenze nella zona regolare: la distanza resta piccolissima.*

Quando l'errore cresce in modo esponenziale, migliorare la misura serve poco: misurare la posizione iniziale dieci volte meglio fa guadagnare solo pochi secondi di previsione, non dieci volte tanto. È per questo che le previsioni del tempo valgono solo per pochi giorni.

**Senza attrito, niente attrattori.** Nel biliardo l'energia si conserva, quindi ogni partenza resta per sempre al proprio livello di energia: le traiettorie non possono convergere verso uno stesso insieme.

**L'attrattore strano.** Aggiungiamo al biliardo il «motore» della sezione 7. Ora succedono due cose insieme: da qualunque punto parta, la carica finisce sempre nella stessa regione dello spazio delle fasi (c'è un attrattore), ma su questa regione il moto è caotico e non si ripete mai. Un attrattore così, intricato e caotico, si chiama **attrattore strano**. Il più famoso è quello scoperto da Edward Lorenz nel 1963 studiando un modello dell'atmosfera, a forma di farfalla (figura 7).

&#91;image: L'attrattore strano del laboratorio\]

*Figura 12 – Dopo circa 230 s simulati: a sinistra le traiettorie nel piano, a destra lo spazio delle fasi riempito da una struttura intricata ma limitata.*

> **Prova sul laboratorio.** Scheda 3 → «Prova: il biliardo elettrico», velocità 4×. Segui P1 e P2: dopo quanto tempo si separano? E P3?

> **Prova sul laboratorio.** Scheda 3 → «Prova: l'attrattore strano», velocità 8×, schermo intero con «Solo fasi». Lascialo correre due minuti e guarda la forma che si costruisce. Poi aggiungi una nuova carica di prova in un punto lontano: finisce nella stessa regione?

## 9 · Bacini di attrazione frattali

Ci sono sistemi in cui ogni moto finisce in modo semplice, eppure è impossibile prevedere **quale** fine avrà. È l'ultima sorpresa del percorso, e porta ai frattali.

**Più attrattori.** Dentro l'anello di cariche positive mettiamo tre cariche negative. Con l'attrito, la carica di prova lasciata ferma in un punto qualsiasi finisce sempre su una delle tre: ci sono tre attrattori.

**Il bacino di attrazione.** L'insieme dei punti di partenza che portano allo stesso attrattore si chiama **bacino di attrazione**. Per disegnarlo il laboratorio fa partire una carica da ognuno di 10 000 punti (o 22 500 nella versione «Fine»), segue ogni moto fino alla fine e colora il punto di partenza con il colore della carica su cui la carica di prova è caduta.

&#91;image: La mappa dei bacini nel laboratorio\]

*Figura 13 – Mappa dei bacini (150 × 150 partenze). Ogni colore è l'insieme dei punti di partenza che finiscono sulla stessa carica negativa.*

Guarda la mappa: vicino a ogni carica c'è una zona grande di un solo colore, dove il destino è sicuro. Più lontano i tre colori si alternano in strisce sottili. Ingrandendo un pezzo di confine, le strisce non diventano mai lisce: compaiono strisce sempre più sottili, e spesso tra due strisce se ne infila una del terzo colore.

&#91;image: Ingrandimento di un confine tra bacini\]

*Figura 14 – Un quadrato di 2 × 2 cm vicino all'anello, ricalcolato con 32 400 partenze: il confine è formato da strisce sempre più fini. È un frattale.*

**Un frattale** è una figura che mostra nuovi dettagli a ogni ingrandimento. Il confine tra i bacini è di questo tipo: per quanto precisa sia la misura del punto di partenza, vicino al confine l'errore può bastare per cambiare il destino finale. Lo stesso disegno compare nel «pendolo magnetico», un pendolo che oscilla sopra tre calamite, e perfino nella matematica pura, quando si risolve l'equazione z³ = 1 con il metodo di Newton.

> **Prova sul laboratorio.** Scheda 3 → «Prova: tre attrattori». La mappa si costruisce da sola in una decina di secondi. Rifalla con «Fine» e confronta i confini.

> **Esperimento.** Cambia il coefficiente γ dell'attrito (prima 0,1 s⁻¹, poi 0,4 s⁻¹) e ricalcola la mappa. Con meno attrito i confini diventano più intricati o più semplici? Perché?

## Mettiti alla prova

Tra parentesi la sezione a cui si riferisce ogni domanda. Dove serve, usa k = 8,99·10⁹ N·m²/C².

1. (1) Una carica di +3 nC è ferma nell'origine. Quanto vale il potenziale a 6 cm? Che lavoro compie la forza elettrica quando una carica di +1 nC passa da 6 cm a 3 cm?
2. (2) Perché due isoipse diverse non possono incrociarsi?
3. (2–3) Nel dipolo del laboratorio, nell'origine V = 0. Vuol dire che anche il campo è nullo? Controlla con la sonda.
4. (3) Due isoipse distano 0,5 cm e differiscono di 100 V. Stima l'intensità del campo in V/m.
5. (4) Una carica parte da ferma vicino a una sola carica fissa positiva. Segue la linea di campo? E se le cariche fisse sono due, come nel dipolo?
6. (5) In un'orbita circolare il raggio raddoppia. Come cambiano la velocità e il periodo?
7. (5) Calcola la distanza minima dal centro nell'urto frontale del preset Rutherford: carica fissa +4 nC, q₀ = 1 nC, m = 1 g, velocità iniziale 7 cm/s. Suggerimento: nel punto più vicino tutta l'energia cinetica è diventata potenziale.
8. (6–7) Qual è la differenza tra le orbite ellittiche della sezione 5 e il ciclo limite della sezione 7?
9. (8) Perché in un sistema senza attrito non può esserci un attrattore?
10. (8) Se misuri la posizione iniziale dieci volte meglio, puoi prevedere il moto caotico per un tempo dieci volte più lungo?
11. (9) Nella mappa dei bacini, perché vicino ai confini è impossibile dire su quale carica finirà la carica di prova?
12. (9, sul laboratorio) Ricalcola la mappa dei bacini con γ = 0,1 s⁻¹ e con γ = 0,4 s⁻¹. Come cambiano i confini?
