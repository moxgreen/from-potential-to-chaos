# Uso: make [simulatore | lezione | test | tutto | pulisci]
PY := $(if $(wildcard .venv/bin/python),.venv/bin/python,python3)

tutto: test simulatore lezione

simulatore:       ## src/ -> dist/potenziale-cariche.html (un solo file, offline)
	node strumenti/build-simulatore.js

lezione:          ## lezione/*.md + figure/ -> dist/lezione-dal-potenziale-al-caos.html (un solo file)
	$(PY) lezione/build.py

test:             ## test della fisica sul motore reale del simulatore
	node --test test/*.test.js

pulisci:
	rm -rf dist

.PHONY: tutto simulatore lezione test pulisci
