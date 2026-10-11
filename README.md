# Laboratorio del potenziale elettrostatico

## Apri e usa

- **[Simulatore](https://moxgreen.github.io/from-potential-to-chaos/dist/potenziale-cariche.html)**: il laboratorio interattivo, si usa direttamente nel browser.
- **[Lezione](https://moxgreen.github.io/from-potential-to-chaos/dist/lezione-dal-potenziale-al-caos.html)**: canovaccio, note per il relatore e testo per lo studente.
- **[Scarica tutto (zip)](https://moxgreen.github.io/from-potential-to-chaos/dist/laboratorio-potenziale.zip)**: i due file HTML con un breve `README.txt`, per usarli offline.

Simulatore interattivo del potenziale e del campo elettrico, con una lezione per la quinta liceo scientifico che lo usa per arrivare, passo dopo passo, dai sistemi dinamici al caos.

## Cosa contiene

- **Simulatore** (un solo file HTML, funziona offline): mappa 2D con isoipse e linee di campo, superficie 3D del potenziale, moto di cariche di prova con attrito (viscoso o attivo), spazio delle fasi, mappa dei bacini di attrazione con zoom, scenari pronti (orbite, Rutherford, punto fisso, ciclo limite, biliardo caotico, attrattore strano).
- **Lezione** in tre livelli, generata da Markdown: canovaccio, note per il relatore e testo per lo studente, con figure e formule. Nove tappe in tre incontri: potenziale, moto delle cariche, sistemi dinamici e caos.
- **Test** della fisica eseguiti sul motore reale del simulatore.

## Se vuoi modificarlo

Per usare il simulatore e la lezione basta aprire i file in `dist/`. Per cambiare i sorgenti e rigenerarli servono Node.js (simulatore e test) e Python 3 (lezione).

```bash
make simulatore   # src/ -> dist/potenziale-cariche.html
make lezione      # lezione/*.md + figure/ -> dist/lezione-dal-potenziale-al-caos.html
make test         # test della fisica (node --test)
make zip          # i due HTML + README.txt in dist/laboratorio-potenziale.zip
make tutto        # test + simulatore + lezione + zip
```

Per la lezione:

```bash
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
```

Il simulatore compilato si apre direttamente nel browser, senza server né connessione.

## Struttura

```
src/        sorgenti del simulatore (moduli JS concatenati, CSS, HTML)
lezione/    canovaccio.md, relatore.md, studente.md, template e build.py
figure/     figure della lezione
strumenti/  build, motore fisico per Node, script di analisi
test/       test della fisica
dist/       file compilati (simulatore e lezione), versionati per la pubblicazione
```

Unità: cm, nC, V, V/m, µJ, s. Dettagli su convenzioni numeriche, scenari verificati e cose da fare sono in [CLAUDE.md](CLAUDE.md).

## Strumenti informatici del simulatore

Il simulatore è volutamente senza dipendenze: HTML, CSS e JavaScript puro, nessun framework, nessuna libreria esterna, nessuna richiesta di rete.

- **Disegno**: elemento `<canvas>` del browser, con proiezione 3D scritta a mano (algoritmo del pittore) per la superficie del potenziale.
- **Mappa del potenziale**: isoipse con l'algoritmo *marching squares* su una griglia di 161 × 161 nodi; linee di campo integrate numericamente.
- **Dinamica**: integratore Runge–Kutta 4 a passo variabile, che rallenta vicino alle cariche; attrito viscoso o attivo (Rayleigh / van der Pol).
- **Bacini di attrazione**: calcolo progressivo a blocchi di pochi millisecondi per fotogramma, per non bloccare l'interfaccia; zoom sulla mappa per esplorare i confini frattali.
- **Interfaccia**: Fullscreen API per lo schermo intero, con ripiego in CSS quando un iframe lo blocca.
- **Struttura del codice**: moduli `src/NN-nome.js` concatenati da uno script Node (`strumenti/build-simulatore.js`) in un unico HTML autonomo, senza bundler.
- **Test**: `node --test` sul motore fisico reale, caricato in Node al posto dell'interfaccia (conservazione dell'energia, periodi orbitali, esiti degli scenari).
- **Lezione e figure**: Python con `markdown` per il testo, `matplotlib` per le formule (convertite in SVG), `Pillow` per le immagini, `playwright` per catturare le schermate del simulatore.

## Come è stato usato Claude

Il progetto è stato sviluppato in conversazione con [Claude Code](https://claude.com/claude-code), con il docente che guida le scelte didattiche e fisiche e Claude che scrive e verifica il codice e i testi.

- **Sviluppo**: Claude ha scritto e rifattorizzato il simulatore (dal file unico ai moduli in `src/`), il Makefile incrementale e gli script di compilazione.
- **Verifica numerica**: gli scenari non sono stati scelti a occhio. Condizioni iniziali, valori di attrito e numeri citati nella lezione (periodi, pericentri, esiti dei bacini) sono stati controllati eseguendo il motore fisico in Node e fissati nei test.
- **Risultati negativi**: le prove fallite sono state registrate, per esempio il problema dei due centri fissi (integrabile, quindi non caotico) e il ciclo limite con una sola carica attrattiva (instabile).
- **Testi**: canovaccio, note per il relatore e testo narrativo per lo studente sono stati scritti e rivisti con Claude partendo dagli obiettivi didattici.
- **Figure**: le schermate sono state generate con Playwright pilotando il simulatore reale.
- **Memoria del progetto**: [CLAUDE.md](CLAUDE.md) raccoglie convenzioni, scenari verificati e cose da fare, così ogni sessione riparte dallo stato aggiornato.

Il contenuto fisico e didattico va comunque controllato da una persona prima dell'uso in classe.
