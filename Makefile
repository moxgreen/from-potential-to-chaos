# Uso: make [simulatore | lezione | test | tutto | pulisci]
#      oppure direttamente: make dist/lezione-dal-potenziale-al-caos.html
PY := $(if $(wildcard .venv/bin/python),.venv/bin/python,python3)

SIM := dist/potenziale-cariche.html
LEZ := dist/lezione-dal-potenziale-al-caos.html

tutto: test simulatore lezione

simulatore: $(SIM)  ## src/ -> dist/potenziale-cariche.html (un solo file, offline)
lezione: $(LEZ)     ## lezione/*.md + figure/ -> dist/lezione-dal-potenziale-al-caos.html

$(SIM): $(wildcard src/* src/*/*) strumenti/build-simulatore.js
	@mkdir -p dist
	node strumenti/build-simulatore.js

$(LEZ): lezione/build.py lezione/template.html lezione/canovaccio.md lezione/relatore.md lezione/studente.md $(wildcard figure/*)
	@mkdir -p dist
	$(PY) lezione/build.py

test:             ## test della fisica sul motore reale del simulatore
	node --test test/*.test.js

pulisci:
	rm -rf dist

.PHONY: tutto simulatore lezione test pulisci
