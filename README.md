# Laboratorio del potenziale elettrostatico – riepilogo per Claude Code

Progetto didattico per la quinta liceo scientifico: un simulatore HTML (potenziale, moto di cariche, sistemi dinamici e caos) e una lezione in tre livelli (canovaccio, note per il relatore, testo per lo studente) che lo usa.

## 1. Struttura del progetto e comandi

```
src/                 sorgenti del simulatore (moduli JS concatenati, CSS e HTML separati)
lezione/             canovaccio.md, relatore.md, studente.md (FONTE UNICA), template.html, build.py
figure/              le 15 figure della lezione (PNG)
strumenti/           build-simulatore.js, motore.js (motore fisico in Node), bz.js, sep2.js, shots.py
test/                test della fisica (node --test)
dist/                file compilati, non versionati: un solo HTML ciascuno, funzionano offline
```

| Comando | Effetto |
| --- | --- |
| `make simulatore` | `src/` → `dist/potenziale-cariche.html` (Node, nessuna dipendenza) |
| `make lezione` | `lezione/*.md` + `figure/` → `dist/lezione-dal-potenziale-al-caos.html` (Python) |
| `make test` | test fisici sul motore reale del simulatore (`node --test`, nessuna dipendenza) |
| `make tutto` | test, poi i due file |

Setup Python (solo per la lezione e per `shots.py`): `python3 -m venv .venv && .venv/bin/pip install -r requirements.txt`; per `shots.py` anche `.venv/bin/playwright install chromium`.

**Sorgenti del simulatore.** I moduli `src/NN-nome.js` condividono lo stesso scope (sono concatenati nell'ordine del numero e avvolti in una funzione, come nel file originale): niente `import`, quindi nessun bundler. Gli `01…05` e `09` non toccano il DOM; `strumenti/motore.js` li carica in Node con poche funzioni dell'interfaccia sostituite da no-op, così test, `bz.js` e `sep2.js` usano lo stesso codice del simulatore. Le funzioni di disegno e interfaccia stanno in `06`, `07`, `08`, `10`. Nuovo modulo = nuovo file numerato.

**Lezione.** I tre `.md` sono la fonte unica; il documento su claude.ai è solo una copia e non va più riesportato. Immagini: `![didascalia](../figure/nome.png)`; formule: blocchi ```latex; il diagramma del percorso nel canovaccio è generato da `build.py` al posto del segnaposto `@@PERCORSO@@`.

Versioni online (private finché non le condividi):

- Simulatore pubblicato: https://claude.ai/artifact/JBUKU3S2H6ZyMqB8o5mJRk
- Documento della lezione (copia): https://claude.ai/code/artifact/b47bbfd4-6448-4ee5-8eb6-af24a4abcfdd

Strumenti offline: `node strumenti/bz.js x0 x1 y0 y1 N out.json` (mappa dei bacini su una regione, scenario «bacini»); `node strumenti/sep2.js [out.json]` (separazione tra traiettorie vicine, per `f8_separazione.png`).

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
| Rutherford | +4 nC in (0,0) | no | 9 cariche da (−9,5; y), y = −4…4, v = (7, 0) | distanza minima frontale 1,27 cm (1,47 cm è il valore se la carica partisse da lontano: il testo della lezione usa quello) |
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
- Le formule (blocchi ```latex) sono convertite in SVG con il mathtext di matplotlib; i comandi non supportati vengono tradotti (`\text` → `\mathrm`, `\frac` → `\dfrac`).

## 6. Cose da fare

Fatto: struttura a cartelle e git; simulatore modulare con compilazione a file unico; test della fisica sul motore reale (`test/fisica.test.js`: scenari del §4 tranne «rosetta», «partenza da ferma» e «deflessione», ancora senza test); lezione compilabile da `.md` locali.

1. **Figure rigenerate automaticamente.** `shots.py` produce catture con nomi diversi da quelli delle figure della lezione (`f5_ellittiche`/`f5_rutherford` invece di `f5_orbite_rutherford`, `f9_bacini` invece di `f9_bacini_2d`) e non è mai stato eseguito dopo il riordino; i grafici `f6_schema_comportamenti`, `f8_separazione`, `f9_zoom` e i composti `f5_*`, `f9_bacini_2d` non hanno più lo script che li genera (restano `sep2.js` e `bz.js` per i dati). Obiettivo: un solo comando che rigenera tutte le figure.
2. **Numeri nei testi.** Alcune cifre sono scritte a mano nei `.md`: far leggere i valori dai test. In particolare il testo del relatore (tappa 5) dà 1,47 cm per Rutherford; è giusto solo «da lontano» e va precisato che nel laboratorio la partenza a 9,5 cm dà 1,27 cm.
3. **Collegamenti.** I `.md` puntano al simulatore su claude.ai; per una lezione tutta offline potrebbero puntare a `potenziale-cariche.html` nella stessa cartella.
4. Possibili migliorie: sezione di Poincaré per l'attrattore strano; zoom interattivo sulla mappa dei bacini; scelta della coppia di variabili nello spazio delle fasi (x–vₓ o y–v_y); tema scuro.
5. Se si vuole aggiornare la versione online del simulatore: `make simulatore` e ripubblicare `dist/potenziale-cariche.html` su claude.ai (artifact JBUKU3S2H6ZyMqB8o5mJRk).
