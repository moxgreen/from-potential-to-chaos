# Laboratorio del potenziale elettrostatico – riepilogo per Claude Code

Progetto didattico per la quinta liceo scientifico: un simulatore HTML (potenziale, moto di cariche, sistemi dinamici e caos) e una lezione in tre livelli (canovaccio, note per il relatore, testo per lo studente) che lo usa.

## 1. File

| File | Che cos'è |
| --- | --- |
| `potenziale-cariche.html` | Il simulatore: un solo file HTML, JavaScript puro su canvas, nessuna dipendenza esterna, funziona offline. |
| `lezione-dal-potenziale-al-caos.html` | La lezione: canovaccio con pannelli apribili (note relatore / testo studente), figure e formule incorporate, versione studente stampabile. Generato da `strumenti/build.py`. |
| `figure/` | Le 15 figure della lezione (PNG): catture del simulatore e grafici calcolati. |
| `strumenti/build.py` + `template.html` | Costruiscono la lezione HTML dai tre file Markdown. |
| `strumenti/canovaccio.md`, `relatore.md`, `studente.md` | Testo delle tre schede, esportato dal documento su claude.ai (le immagini sono segnaposto `&#91;image: <alt>\]`). |
| `strumenti/dyn.js` | Motore fisico minimo in Node, identico a quello del simulatore, per verifiche numeriche. |
| `strumenti/bz.js` | Calcolo offline di una mappa dei bacini: `node bz.js x0 x1 y0 y1 N out.json`. |
| `strumenti/sep2.js` | Separazione nel tempo tra traiettorie vicine (biliardo elettrico), per il grafico `f8_separazione.png`. |
| `strumenti/shots.py` | Playwright: genera le catture del simulatore usate come figure. |

Versioni online (private finché non le condividi):

- Simulatore pubblicato: https://claude.ai/artifact/JBUKU3S2H6ZyMqB8o5mJRk
- Documento della lezione (tre schede, modificabile): https://claude.ai/code/artifact/b47bbfd4-6448-4ee5-8eb6-af24a4abcfdd

Le modifiche fatte nel documento online non arrivano da sole nei file: vanno riesportate in Markdown (una scheda alla volta) e rimesse in `strumenti/`.

## 2. Convenzioni fisiche e numeriche

- Unità: posizioni in **cm**, cariche in **nC**, potenziale in **V**, campo in **V/m**, energia in **µJ**, tempo in **s**.
- Dominio visualizzato: x, y ∈ [−10, 10] cm.
- Costanti nel codice: `K = 8.9875517923e9`; `KV = K·1e-9/1e-2 ≈ 898,76` (V per nC/cm); `KE = K·1e-9/1e-4` (V/m per nC/cm²); `ACC = K·1e-9 ≈ 8,99` (accelerazione in cm/s² = ACC·q₀·Σ q/r² / m, con q in nC, r in cm, m in g).
- Carica di prova di default: q₀ = 1 nC, m = 1 g.
- Energie: K = 0,05·m·v² µJ (m in g, v in cm/s); U = q₀·V·10⁻³ µJ.
- Ammorbidimento: distanza minima `RMIN = 0.15` cm nel calcolo di V ed E; urto quando la carica di prova arriva a `HIT_R = 0.3` cm da una sorgente.
- Integratore: Runge–Kutta 4 a passo variabile (≤ 0,01 s; più piccolo vicino alle cariche: h ≤ 0,02·d/v e h ≤ 0,1·√(d/a)).
- Attrito (scheda 3): viscoso F = −mγv; attivo (Rayleigh / van der Pol) F = mγ(1 − v²/v\*²)v.
- Colori e superficie 3D troncati a ±V_max (default 1000 V, 10 isoipse per segno, ΔV = 100 V). Gli scenari della scheda 3 usano V_max = 8000 V e 25 isoipse.
- Griglie: 161 × 161 nodi per la mappa (marching squares), 81 × 81 per la superficie 3D.

## 3. Struttura del simulatore (`potenziale-cariche.html`)

- **Layout**: grafici sempre visibili a sinistra (mappa 2D | superficie 3D o spazio delle fasi), barra comandi sotto, tre schede a destra. Schermo intero con Fullscreen API, ripiego CSS (`.pseudo-fs`) se l'iframe lo blocca. Modalità «Solo 2D / Solo 3D».
- **Fisica**: `potential`, `efieldRaw`, `fillGrid`, `buildContours` (marching squares), `computeFieldLines`.
- **Dinamica**: `accel` (con attrito), `rk4`, `advance`, `stepSim`, `fieldLineFrom`; stato in `sim` e array `tests` (cariche di prova con traccia `trail`, `trailV`, `trailVX`).
- **Bacini**: `basinStart`, `basinClassify`, `basinWork` (calcolo progressivo a blocchi di 14–30 ms per frame), legenda in `updateBasinUI`.
- **Disegno**: `drawTop` (mappa), `draw3D` (painter's algorithm), `drawPhase` (proiezione x–vₓ); ciclo `frame` con flag `physicsDirty`, `needTop`, `need3D`.
- **Scenari**: oggetto `SCENARI` (schede 2 e 3) e `PRESETS` (scheda 1).

## 4. Scenari e condizioni iniziali (verificati numericamente)

Notazione: carica di prova `[x0, y0, vx0, vy0]` in cm e cm/s; q₀ = 1 nC, m = 1 g salvo indicazione. `BOWL` = anello di 16 cariche da +3 nC su raggio 8,5 cm.

| Scenario | Sorgenti | Attrito | Partenze | Esito verificato |
| --- | --- | --- | --- | --- |
| Orbita circolare | −2 nC in (0,0) | no | (5, 0, 0, 1,896) | v = 1,90 cm/s, T ≈ 16,6 s, energia costante a 3 cifre |
| Orbite ellittiche | −2 nC in (0,0) | no | (7, 0, 0, f·1,602), f = 0,5 / 0,7 / 0,9 | pericentri 1,0 / 2,3 / 4,8 cm |
| Rosetta | −1,5 nC in (±1,5; 0) | no | (0, 6, 0,8·v_c, 0) | orbita limitata che precede |
| Rutherford | +4 nC in (0,0) | no | 9 cariche da (−9,5; y), y = −4…4, v = (7, 0) | distanza minima frontale 1,47 cm |
| Partenza da ferma | dipolo ±2 nC in (∓3; 0) | no | (−2, 2, 0, 0) | la traiettoria si stacca dalla linea di campo |
| Deflessione | due file di 7 cariche ±1 nC a x = ∓3 | no | (−1,5; −9,5) con v_y = 14, 17, 21, 28 | deviazioni decrescenti con v |
| Punto fisso | BOWL | viscoso γ = 0,4 | (5,2,1,1), (−6,−3,0,0), (0,6,5,2,0) | tutte al centro |
| Bacini | BOWL + 3 × (−1 nC) su raggio 3 | viscoso γ = 0,2 | 4 partenze da ferma | mappa 100 × 100 in ≈ 10 s; tre bacini con confini frattali |
| Ciclo limite | BOWL | attivo γ = 0,6, v\* = 2 | (0,5;0;0;0,3), (6,5;0;0;1), (−6;0;0;−1,5) | tutte su r = 3,11 cm, senso antiorario |
| Biliardo (caos senza attrito) | BOWL + 3 × (+1,5 nC) su raggio 2,2 | no | (0,3; −5,5; 3,5; 0,4), (0,3; −5,48; …), (0,3; −5,5; 3,0; 0,4) | le prime due divergono (λ ≈ 0,6–0,8 s⁻¹ nella fase rapida, dopo ≈ 40 s), la terza resta regolare |
| Attrattore strano | BOWL + 3 × (+1,5 nC) su raggio 3 | attivo γ = 0,5, v\* = 2,5 | (0,3; −5,5; 2,5; 0,4), (0,3; −5,48; …), (5, 4, 0, −1) | 5 partenze diverse restano confinate e caotiche |

Risultati negativi utili (da non rifare):

- Il problema dei **due centri fissi** (Eulero) è integrabile: niente caos (separazione lineare, 10⁻⁶ → 5·10⁻⁵ cm in 150 s). Il vecchio preset «Due centri: moto caotico» è stato rimosso.
- Attrito attivo con **una sola carica attrattiva**: il cerchio a velocità v\* è instabile (la carica cade o sfugge), perché in 1/r² la velocità circolare decresce con r. Per questo il ciclo limite usa la «ciotola» BOWL, dove la velocità circolare cresce con r.
- Anello da 12 cariche +1,5 nC: le cariche di prova sfuggono tra i varchi; servono 16 cariche da +3 nC (barriera ≈ 1,9 µJ sopra il centro).

## 5. Lezione

- Struttura: introduzione, 9 tappe in tre incontri (A: 1–3 potenziale, B: 4–5 moto, C: 6–9 sistemi dinamici e caos), chiusura; 12 domande di verifica con soluzioni.
- Rigenerare l'HTML: mettere `canovaccio.md`, `relatore.md`, `studente.md` e `template.html` nella stessa cartella di `build.py`, le figure in `figure/` (percorso `FIG` nello script), poi `python3 build.py`.
- Dipendenze: Python 3 con `markdown`, `matplotlib`, `Pillow`; per le catture `playwright` (Chromium); Node per `dyn.js`, `bz.js`, `sep2.js`.
- Le formule (blocchi ```latex) sono convertite in SVG con il mathtext di matplotlib; i comandi non supportati vengono tradotti (`\text` → `\mathrm`, `\frac` → `\dfrac`).

## 6. Cose da fare

1. **Dividere il simulatore in moduli** (fisica, dinamica, bacini, disegno 2D, 3D, fasi, interfaccia) con un passaggio di build che produca ancora un unico file HTML offline.
2. **Test automatici** della fisica con `dyn.js` o con i moduli estratti: conservazione dell'energia, periodo dell'orbita circolare, distanza minima di Rutherford, raggio del ciclo limite, esito degli scenari della tabella al punto 4.
3. **Figure rigenerate automaticamente**: unire `shots.py`, `sep2.js` e `bz.js` in un'unica pipeline, così che modificando uno scenario si aggiornino le figure e la lezione.
4. Tenere `build.py` e le note del relatore allineati ai numeri delle verifiche (alcune cifre sono scritte a mano nel testo).
5. Possibili migliorie: sezione di Poincaré per l'attrattore strano; zoom interattivo sulla mappa dei bacini; scelta della coppia di variabili nello spazio delle fasi (x–vₓ o y–v_y); tema scuro.
6. Dopo ogni modifica al simulatore, ripubblicarlo su claude.ai (artifact JBUKU3S2H6ZyMqB8o5mJRk) se si vuole aggiornare la versione online.
