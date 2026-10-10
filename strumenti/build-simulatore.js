// Compila src/ in un unico file HTML autonomo (nessuna dipendenza esterna).
// Uso: node strumenti/build-simulatore.js   ->  dist/potenziale-cariche.html
const fs = require('fs');
const path = require('path');
const { moduli } = require('./moduli.js');

const SRC = path.join(__dirname, '..', 'src');
const OUT = path.join(__dirname, '..', 'dist', 'potenziale-cariche.html');
const leggi = f => fs.readFileSync(path.join(SRC, f), 'utf8');

const js = moduli().map(leggi).join('\n');
// function replacer: evita che "$&" e simili nel codice vengano interpretati da replace()
const html = leggi('index.html')
  .replace('/*@@CSS@@*/', () => leggi('stile.css').trimEnd())
  .replace('/*@@JS@@*/', () => js.trimEnd());

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, html);
console.log(path.relative(process.cwd(), OUT), Math.round(html.length / 1024) + ' kB');
