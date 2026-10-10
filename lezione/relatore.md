# Note per il relatore

Ogni sezione approfondisce la tappa omonima del canovaccio: fisica, conti di controllo, errori tipici degli studenti e cosa far vedere nel laboratorio.

## 1 · Dalla legge di Coulomb al potenziale

Il punto da far emergere è che il potenziale esiste solo perché il lavoro non dipende dal percorso: è questa proprietà, non la formula, il cuore della tappa.

**Il lavoro, in due versioni.** Con l'integrale, sfruttando che solo la componente radiale lavora:

```latex
W_{AB} = \int_{r_A}^{r_B} \frac{k q q_0}{r^2}\,dr = k q q_0 \left(\frac{1}{r_A} - \frac{1}{r_B}\right)
```

Senza integrale: si scompone un percorso qualsiasi in tratti radiali e archi di circonferenza centrati sulla carica. Sugli archi la forza è perpendicolare allo spostamento e il lavoro è nullo; i tratti radiali, comunque disposti, coprono sempre lo stesso intervallo di r.

**Numeri di controllo** (carica di +2 nC, come nel preset «Carica singola»):

| r | V | U per q₀ = 1 nC |
| --- | --- | --- |
| 1 cm | 1798 V | 1,80 µJ |
| 2 cm | 899 V | 0,90 µJ |
| 4 cm | 449 V | 0,45 µJ |

**Esempio sulla sovrapposizione da fare alla lavagna.** Due cariche di +2 nC a ±3 cm: nell'origine V = 2 × 599 V ≈ 1200 V ma E = 0. Nel dipolo (+2 e −2 nC) succede il contrario: V = 0 ma E ≈ 40 kV/m. Le due situazioni insieme smontano l'idea che V e E «vadano insieme».

**Errori tipici degli studenti**

- Confondere U (proprietà della coppia di cariche, in joule) con V (proprietà del punto, in volt).
- Credere che V = 0 implichi E = 0, o il contrario.
- Perdere il segno: per una carica negativa V è negativo e la carica di prova positiva vi «scende».
- Dare un significato assoluto allo zero: contano solo le differenze; il laboratorio pone V = 0 all'infinito.

**Sul laboratorio.** Entro 0,15 cm da una carica il calcolo limita la distanza per evitare la divisione per zero: la sonda scrive «molto grande». Colori e superficie sono troncati a ±V\_max (cursore nella scheda 1).

## 2 · Leggere il potenziale: isoipse e superficie

La superficie 3D è l'immagine più potente del percorso, perché tornerà nella tappa 4 come «paesaggio» su cui si muove la carica: conviene costruirla con cura.

- **Che cosa mostra la superficie.** È il potenziale tridimensionale k q / r valutato nel piano delle cariche, non un potenziale «bidimensionale» (che andrebbe come il logaritmo di r). È quindi esattamente il potenziale che gli studenti conoscono.
- **Troncamento.** Vicino alle cariche V diverge: picchi e pozzi sono tagliati a ±V\_max e i «pianori» in cima sono un artificio grafico. Alzando V\_max i picchi crescono ma le isoipse lontane si diradano.
- **Niente massimi né minimi nel vuoto.** Lontano dalle cariche V soddisfa l'equazione di Laplace, quindi in ogni punto vale la media dei punti vicini: i picchi stanno solo sulle cariche. Ristretto al piano, però, V può avere un minimo: lo useremo nella tappa 7.
- **Il punto di sella.** Con due cariche uguali, al centro V è minimo lungo la congiungente e massimo nella direzione perpendicolare. Lì E = 0.
- **Isoipse che si incrociano.** Due isoipse diverse non si incrociano mai, perché V ha un solo valore per punto. Una stessa isoipsa può però incrociare sé stessa, a forma di 8, in un punto di sella. Con «Due cariche uguali» si vede passando la sonda vicino al centro: è un bel momento di discussione.

**Suggerimento di conduzione.** Prima di ogni configurazione chiedere di disegnare a mano le isoipse previste, poi confrontare. Il comando «Solo 2D / Solo 3D» nella barra sotto i grafici aiuta a separare i due piani di lettura.

## 3 · Campo e potenziale

La relazione locale E = −grad V è l'idea chiave: a livello di quinta si può dire «E è la pendenza in discesa di V», con la forma discreta |E| ≈ ΔV/Δs.

```latex
E_x = -\frac{\partial V}{\partial x}, \qquad E_y = -\frac{\partial V}{\partial y}, \qquad |\vec E| \approx \frac{\Delta V}{\Delta s}
```

**Attività di misura con risultato atteso.** Preset «Dipolo» (±2 nC a ±3 cm), impostazione iniziale con 10 isoipse per segno, cioè ΔV = 100 V.

- Nell'origine il campo vale circa 400 V/cm = 40 kV/m (ogni carica contribuisce 20 kV/m, nello stesso verso).
- Le isoipse vicino all'origine distano quindi circa 100 V / 400 V/cm = 0,25 cm: la griglia della mappa è di 1 cm, quindi se ne contano circa quattro per quadretto.
- La sonda nell'origine legge |E| ≈ 40 kV/m: il confronto con la stima ΔV/Δs chiude il cerchio.

**Linee di campo nel laboratorio.** Ne vengono tracciate 4 per nC, quindi il loro numero è proporzionale alla carica. Attenzione: la densità delle linee disegnate in un piano è solo indicativa dell'intensità, perché il flusso di un campo tridimensionale attraversa superfici, non linee. I «Vettori E» hanno lunghezza fissa e opacità crescente con il logaritmo di |E|.

**Errore tipico da preparare.** Gli studenti tendono a pensare che una carica libera percorra la linea di campo. Lasciare la domanda aperta: la risposta (no) arriva nella tappa 4.

## 4 · Una carica che si muove

La tappa smonta l'equivoco «la carica segue la linea di campo» con un argomento di dinamica elementare.

**Perché la traiettoria non è la linea di campo.** Per percorrere una curva di raggio R a velocità v serve un'accelerazione normale v²/R. Lungo una linea di campo la forza q₀E è tangente alla linea, quindi non ha componente normale: la carica non può restarci sopra, salvo velocità nulla o linea retta. Partendo da ferma imbocca la linea, poi l'inerzia la porta verso l'esterno della curvatura. Con una sola carica sorgente le linee sono rette e traiettoria e linea coincidono: è un buon controesempio da proporre.

**Unità del laboratorio, per i conti alla lavagna**

- K = ½ m v²: con m = 1 g e v = 1 cm/s vale 0,05 µJ.
- U = q₀ V: con q₀ = 1 nC e V = 1000 V vale 1 µJ.
- a = q₀ E / m: con E = 10 kV/m l'accelerazione è 1 cm/s².

**Il metodo numerico.** Il laboratorio integra con Runge–Kutta del quarto ordine a passo variabile (al massimo 0,01 s, più piccolo vicino alle cariche). L'energia totale mostrata resta costante alle tre cifre significative visualizzate. Con studenti che programmano si può confrontare il metodo di Eulero, che fa crescere l'energia di un'orbita a ogni giro.

**Limiti dell'analogia della pallina.** Per q₀ > 0 la carica «rotola» sulla superficie V, ma l'analogia è qualitativa: una pallina vera ha anche energia di rotazione e l'accelerazione segue la pendenza solo per pendii poco ripidi. Per q₀ < 0 il paesaggio va capovolto.

**Urti.** Il laboratorio ferma la carica di prova a 0,3 cm da una sorgente e scrive «urto con Q…»: nel modello puntiforme l'energia potenziale diverge, mentre i corpi reali hanno dimensioni finite.

## 5 · Orbite e diffusione

La forza di Coulomb e la gravità di Newton hanno la stessa forma, quindi tutta la meccanica celeste si trasferisce: i preset sono costruiti per verificarlo con i numeri.

**Orbita circolare, conto svolto** (Q = −2 nC, q₀ = 1 nC, m = 1 g, r = 5 cm):

```latex
\frac{k|qQ|}{r^2} = \frac{m v^2}{r} \;\Rightarrow\; v = \sqrt{\frac{k|qQ|}{m r}} \approx 1{,}90\ \text{cm/s}, \qquad T = \frac{2\pi r}{v} \approx 16{,}6\ \text{s}
```

Da qui la terza legge di Keplero: T² = 4π² m r³ / (k|qQ|), quindi T² ∝ r³.

**Orbite ellittiche.** Il preset parte da r = 7 cm con una frazione f della velocità circolare; la distanza minima vale r\_min = r\_max · f² / (2 − f²).

| f | Distanza minima |
| --- | --- |
| 0,5 | 1,0 cm |
| 0,7 | 2,3 cm |
| 0,9 | 4,8 cm |

**Rosetta e teorema di Bertrand.** Le uniche forze centrali per cui tutte le orbite limitate si chiudono sono quella ∝ 1/r² e quella elastica ∝ r. Due cariche al centro aggiungono una piccola correzione e l'orbita precede, come il perielio di Mercurio (che precede soprattutto per l'attrazione degli altri pianeti e, per una piccola parte, per effetti relativistici).

**Rutherford.** Nell'urto frontale la carica si ferma dove tutta l'energia cinetica è diventata potenziale: d = 2kqQ/(mv²) ≈ 1,47 cm (con +4 nC e v = 7 cm/s). Per un parametro d'urto b l'angolo di deviazione θ soddisfa b = (d/2)·cot(θ/2): con b = 1 cm si ottiene θ ≈ 73°, verificabile a occhio sul preset. Nell'esperimento di Geiger e Marsden (1909) circa una particella alfa su 8000 tornava indietro: impossibile con una carica positiva diffusa, naturale con un nucleo concentrato.

**Deflessione.** Tra le due file il campo è quasi uniforme e le traiettorie sono quasi parabole: è il principio con cui J. J. Thomson misurò il rapporto e/m dell'elettrone (1897). Lo spostamento laterale è inversamente proporzionale a v², e il preset lo mostra con quattro velocità.

## 6 · Sistemi dinamici e spazio delle fasi

È la tappa concettualmente più delicata: si passa dal guardare un moto al guardare la regola che genera tutti i moti.

**Riscaldamento alla lavagna: l'oscillatore armonico.** Da x = A cos ωt e v = −Aω sin ωt si ottiene un'ellisse nel piano (x, v):

```latex
\frac{x^2}{A^2} + \frac{v^2}{A^2\omega^2} = 1
```

L'orbita circolare del laboratorio dà la stessa figura nel piano (x, vₓ), perché x = r cos ωt e vₓ = −rω sin ωt.

**Punti da sottolineare**

- Lo spazio delle fasi della carica ha 4 dimensioni; la conservazione dell'energia confina ogni moto senza attrito su un'ipersuperficie a 3 dimensioni.
- Per il teorema di esistenza e unicità, due traiettorie nello spazio delle fasi completo non si incrociano mai: è la forma matematica del determinismo.
- Il grafico (x, vₓ) è una proiezione, quindi le curve possono sembrare incrociarsi. Va detto subito, altrimenti sembra contraddire il punto precedente.
- Le orbite della tappa 5 sono stabili solo in senso neutro: una piccola variazione della velocità iniziale dà un'orbita vicina, che non torna alla precedente. È la differenza con il ciclo limite della tappa 7.

**Sul laboratorio.** La scala verticale dello spazio delle fasi si allarga da sola quando serve e torna al valore iniziale con «Ricomincia». Il cerchietto vuoto indica lo stato iniziale, la pallina lo stato attuale.

## 7 · Attrattori regolari: punto fisso e ciclo limite

L'idea nuova è la dissipazione: con l'attrito i volumi nello spazio delle fasi si contraggono e le traiettorie possono convergere verso un insieme comune, l'attrattore.

**Earnshaw e la «ciotola».** In tre dimensioni nessuna carica può stare in equilibrio stabile in un campo elettrostatico (teorema di Earnshaw), perché lontano dalle cariche ∇²V = 0. Nel piano invece si può: al centro di un anello di cariche positive V diminuisce uscendo dal piano, quindi la curvatura nel piano è positiva e c'è un minimo. La stabilità verticale la garantisce il tavolo. Le trappole reali per ioni aggirano il teorema con campi magnetici (trappola di Penning) o oscillanti (trappola di Paul).

```latex
\frac{\partial^2 V}{\partial x^2} + \frac{\partial^2 V}{\partial y^2} = -\frac{\partial^2 V}{\partial z^2} > 0 \quad \text{al centro dell'anello}
```

**Attrito viscoso (preset con γ = 0,4 s⁻¹).** L'energia diminuisce sempre e lo spazio delle fasi si contrae a ritmo 2γ: tre partenze diverse finiscono tutte nel centro.

**Attrito attivo e ciclo limite.** La forza F = mγ(1 − v²/v\*²)v immette energia quando v < v\* e ne sottrae quando v > v\*, come nell'oscillatore di van der Pol. Nel preset (γ = 0,6 s⁻¹, v\* = 2 cm/s) tre partenze diverse convergono sull'orbita circolare di raggio 3,1 cm percorsa a velocità v\*.

**Perché serve la ciotola e non una carica centrale.** Preparando il laboratorio ho verificato numericamente che con una sola carica attrattiva lo stesso «motore» non produce un ciclo stabile: la carica finisce sulla sorgente o sfugge. Il motivo è che nell'attrazione ∝ 1/r² la velocità circolare diminuisce con il raggio: se la carica si allontana un poco, il motore la porta a v\*, più veloce del necessario, e si allontana ancora. Nella ciotola la velocità circolare cresce con il raggio e la perturbazione si corregge da sola. È un buon esempio di come la stabilità dipenda dalla struttura del sistema.

**Note.** Ci sono due cicli limite, uno orario e uno antiorario: i preset partono tutti in senso antiorario. Esempi reali di ciclo limite: lo scappamento dell'orologio a pendolo, il battito cardiaco, la corda di violino strofinata dall'archetto.

## 8 · Caos e attrattori strani

Il messaggio è la distinzione tra determinismo e prevedibilità: le leggi sono esatte, ma l'errore sulle condizioni iniziali cresce in modo esponenziale.

**Integrabile o caotico.** Il moto attorno a due centri fissi (problema di Eulero, 1760) si separa in coordinate ellittiche: oltre all'energia c'è una seconda grandezza conservata, e il moto resta regolare. Nelle verifiche fatte per il laboratorio, due partenze distanti 10⁻⁶ cm si erano allontanate solo fino a 5·10⁻⁵ cm dopo 150 s, una crescita lineare. Con tre ostacoli la seconda costante non c'è più e il caos diventa possibile.

**Esponente di Lyapunov e orizzonte di prevedibilità.** Nella fase caotica la distanza cresce come δ(t) ≈ δ₀·e^(λt). Nel biliardo elettrico, partendo da 10⁻⁶ cm, la distanza cresce lentamente per circa 40 s (la traiettoria indugia vicino a zone regolari), poi esplode: nella fase di crescita rapida λ ≈ 0,6–0,8 s⁻¹ (grafico nella sezione 8 del testo per lo studente). Da qui il tempo oltre il quale l'errore supera una tolleranza Δ:

```latex
T_{\text{prev}} \approx \frac{1}{\lambda}\,\ln\frac{\Delta}{\delta_0}
```

Misurare la posizione iniziale 10 volte meglio allunga la previsione solo di ln(10)/λ, cioè di 3–4 secondi: si guadagna in modo additivo, non moltiplicativo. È la risposta alla domanda guida.

**Ordine e caos convivono.** Nel preset la terza carica, più lenta, resta su un moto regolare (nelle verifiche due sue copie distanti 0,02 cm restano entro 0,2 cm per 90 s): lo spazio delle fasi è «misto», con isole regolari in un mare caotico (teoria KAM).

**Liouville.** Senza attrito i volumi nello spazio delle fasi si conservano, quindi nessun insieme può attirare traiettorie da una regione più grande: niente attrattori. Con attrito viscoso i volumi si contraggono a ritmo 2γ; con quello attivo il ritmo cambia segno a seconda della velocità.

**L'attrattore strano del laboratorio.** Anello di cariche più tre ostacoli positivi, attrito attivo (γ = 0,5 s⁻¹, v\* = 2,5 cm/s). Nelle verifiche cinque partenze molto diverse sono rimaste confinate nella stessa regione con moto caotico; due partenze distanti 0,02 cm erano a circa 2 cm dopo 40 s. Il laboratorio non calcola né la dimensione frattale né una sezione di Poincaré: l'attrattore si riconosce dalle tre proprietà (attira, è limitato, il moto su di esso è caotico).

**Cautele da dire**

- La forma non è una farfalla: quella di Lorenz (1963) viene da un modello semplificato di convezione; l'«effetto farfalla» è il titolo di una sua conferenza del 1972.
- Il caos amplifica anche gli errori numerici: la traiettoria calcolata non è quella esatta, ma per molti sistemi i teoremi di «shadowing» garantiscono che resta vicina a una traiettoria vera, per cui le proprietà statistiche restano affidabili.
- Nella proiezione (x, vₓ) le curve si incrociano: nello spazio completo no.

## 9 · Bacini di attrazione frattali

Qui l'imprevedibilità non sta nel moto, che finisce sempre fermo su una carica, ma nel destino: quale carica raccoglierà la carica di prova.

**Come si costruisce la mappa.** Il piano è diviso in N × N quadretti (60, 100 o 150 per lato). Da ciascuno la carica parte da ferma, con le stesse equazioni della simulazione, finché arriva a 0,3 cm da una carica sorgente. Il quadretto prende il colore di quella carica; se dopo 200 s non si è fermata diventa grigio, se esce dall'anello resta trasparente. Con N = 100 sono 10 000 simulazioni, circa 10 secondi.

**La scommessa, prima della mappa.** Lo scenario parte senza mappa e senza cariche di prova, con «un clic = una prova» attivo: ogni clic lancia una carica da ferma e, quando arriva, il punto di partenza resta colorato come la carica su cui è finita. Dopo qualche prova libera si passa ai punti sfida nell'ordine. Esiti verificati con il motore del laboratorio (anche nei test automatici):

| Punto | Partenza (cm) | Esito | Che cosa far notare |
| --- | --- | --- | --- |
| 1, 2, 3 | (0; 5,5), (−5; −2,5), (5; −2,5) | A, B, C | ovvi: cade sulla carica più vicina in circa 1 s |
| 4 | (−1,5; −6) | A | è a 4,6 cm da B e C e a 9,1 cm da A, ma risale tra B e C e finisce su A |
| 5 | (−4,5; 3,5) | C | A è a 4,5 cm, eppure finisce su C, dall'altra parte, a 8,7 cm |
| 6 | (4,5; 3,5) | B | speculare del 5: conferma che non è un caso |
| 7 | (0; 0) | resta ferma | forze nulle per simmetria: equilibrio, ma instabile |
| 8, 9 | (0,5; 0), (−0,5; 0) | C, B | a 1 cm l'una dall'altra, finiscono su cariche diverse |

I punti 4 e 5 non dipendono dalla precisione del clic: spostandoli di 3 mm in qualunque direzione l'esito non cambia. Sono «ingannevoli» perché la forza non punta verso la carica più vicina: è la somma di tutte, compreso l'anello, che spinge verso il centro. Nel punto 4 le attrazioni di B e C sono quasi simmetriche e si compensano; la carica accelera verso il centro e per inerzia lo supera, finendo su A. La domanda da far discutere: perché la carica non sceglie la più vicina? La risposta (forza totale e inerzia) è la stessa della tappa 4: la traiettoria non segue la linea di campo. I punti 7–9 preparano il frattale: vicino al centro un piccolo spostamento cambia il destino.

**Il pendolo magnetico elettrostatico.** L'anello di sedici cariche da +3 nC fa da forza di richiamo, come la gravità per un pendolo; le tre cariche negative fanno da magneti; l'attrito viscoso (γ = 0,2 s⁻¹) fa da resistenza dell'aria.

**Che cosa far notare**

- Vicino a ogni carica c'è un bacino grande e compatto: lì il destino è certo.
- Lontano i tre colori si alternano in strisce sempre più sottili: è il confine frattale.
- Riducendo γ i confini diventano più intricati, perché la carica fa più giri prima di fermarsi; aumentandolo si semplificano. È un buon esperimento da far fare agli studenti.

**Approfondimenti per il relatore**

- Sensibilità dello stato finale: la frazione di punti «incerti» entro una distanza ε da un confine cresce come ε^α con α < 1 quando il confine è frattale, quindi migliorare la precisione serve meno del previsto.
- Proprietà di Wada: in sistemi di questo tipo (come il pendolo magnetico) si osserva numericamente che ogni punto di confine tocca tutti e tre i bacini insieme.
- Collegamento matematico: anche il metodo di Newton per risolvere z³ = 1 ha tre bacini con confini frattali. Fu Cayley, nel 1879, a porre il problema; la risposta arrivò con gli insiemi di Julia.

**Zoom sul confine.** Con «Ingrandisci un riquadro» si trascina un quadrato sulla mappa (un clic semplice ingrandisce ×2); se la mappa è visibile si ricalcola da sola nella nuova finestra (altrimenti «Calcola la mappa qui»), sempre con 60, 100 o 150 partenze per lato, quindi con celle più piccole. Le mappe già calcolate restano in memoria: «Indietro» le ritrova subito. Un buon punto di partenza è la zona in alto a sinistra, tra (−6,5; 2,5) e (−4,5; 4,5): a ingrandimento ×10 compaiono fasce dei tre colori annidate, che si ripetono ingrandendo ancora un confine. «Indietro» (o Esc) torna allo zoom precedente, «Tutta la mappa» alla vista intera.

**Limiti dello strumento.** La risoluzione massima è 150 × 150 partenze per finestra. Lo zoom si ferma a ×200 (finestra di 1 mm, celle da 7–17 µm): più in basso il risultato dipende dal passo di integrazione e dalla distanza a cui si considera «arrivata» la carica (0,3 cm), quindi non è più affidabile. Le prove a mano e la mappa usano lo stesso integratore ma con passi un po' diversi: in un punto proprio sul confine la prova e la mappa possono dare colori diversi, ed è un buon esempio della sensibilità di cui si parla.

## Soluzioni delle domande di verifica

La numerazione è quella della sezione «Mettiti alla prova» del testo per lo studente.

1. V(6 cm) = 8,99·10⁹ × 3·10⁻⁹ / 0,06 ≈ 449 V; V(3 cm) ≈ 899 V. Lavoro della forza elettrica: W = q₀(V\_A − V\_B) = 10⁻⁹ × (449 − 899) ≈ −0,45 µJ. È negativo: la carica va spinta.
2. In un punto di incrocio V avrebbe due valori diversi, ma il potenziale in ogni punto ne ha uno solo.
3. No. Nell'origine V = 0 ma |E| ≈ 40 kV/m: il campo dipende da come V cambia, non dal suo valore.
4. |E| ≈ 100 V / 0,005 m = 2·10⁴ V/m.
5. Con una sola carica sì: le linee di campo sono rette e la carica parte lungo la retta senza motivo di deviare. Nel dipolo no: le linee sono curve e l'inerzia porta la carica fuori dalla linea.
6. Da v = √(k|qQ|/(mr)): la velocità si divide per √2 ≈ 1,41. Il periodo T = 2πr/v si moltiplica per 2√2 ≈ 2,83 (terza legge di Keplero).
7. ½mv² = k q Q / d ⇒ d = 2kqQ/(mv²) = 2 × 8,99·10⁹ × 10⁻⁹ × 4·10⁻⁹ / (10⁻³ × 0,07²) ≈ 0,0147 m ≈ 1,5 cm.
8. Le orbite ellittiche sono una famiglia continua: cambiando la velocità iniziale si passa a un'altra orbita e lì si resta. Il ciclo limite è un'orbita isolata che attira quelle vicine: da qualunque partenza vicina si finisce su di essa.
9. Senza attrito l'energia si conserva: due partenze con energie diverse restano per sempre su livelli di energia diversi e non possono finire sullo stesso insieme. Più in generale i volumi nello spazio delle fasi non si contraggono (teorema di Liouville).
10. No. L'errore cresce come e^(λt): dividere l'errore iniziale per 10 aggiunge solo ln(10)/λ al tempo di previsione, non lo moltiplica per 10.
11. Vicino al confine i bacini sono intrecciati a ogni scala: qualunque errore, per quanto piccolo, sulla posizione iniziale può cadere in un bacino diverso.
12. Domanda aperta: con γ minore la carica compie più giri prima di fermarsi e i confini diventano più intricati; con γ maggiore la mappa si semplifica e i bacini si avvicinano alle «zone di vicinanza» delle tre cariche.
13. La forza non punta verso la carica più vicina: è la somma delle forze di tutte le cariche, compreso l'anello che spinge verso il centro. Da (−1,5; −6) le attrazioni di B e C sono quasi simmetriche e si compensano in parte; la carica accelera verso il centro, passa tra B e C e per inerzia arriva nella zona di A. Come nella sezione 4, la traiettoria non segue la linea di campo: conta anche la velocità acquistata.
