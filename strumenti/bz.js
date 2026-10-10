// Mappa dei bacini di attrazione (scenario «bacini») su una regione arbitraria, con il motore reale.
// Uso: node strumenti/bz.js x0 x1 y0 y1 N out.json
// Uscita: out[j*N+i] = -1 (esclusa/fuori), 9 (indecisa), 0..2 (una delle tre cariche negative interne); riga 0 = y alto.
const fs = require('fs');
const { caricaMotore } = require('./motore.js');

const [x0, x1, y0, y1, N] = process.argv.slice(2, 7).map(Number);
const nome = process.argv[7];
if (!nome) { console.error('uso: node bz.js x0 x1 y0 y1 N out.json'); process.exit(1); }

const M = caricaMotore();
M.run("caricaScenario('bacini')");
const t0 = Date.now();
const out = M.run(`
  const out = [], X0 = ${x0}, X1 = ${x1}, Y0 = ${y0}, Y1 = ${y1}, N = ${N};
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++){
    const k = basinClassify(X0 + (X1 - X0)*(i + .5)/N, Y1 - (Y1 - Y0)*(j + .5)/N);
    out.push(k === -2 ? 9 : k < 0 ? -1 : attractors[k].idx - 16);     // le 16 cariche dell'anello hanno indice 0..15
  }
  out`);
fs.writeFileSync(nome, JSON.stringify({ x0, x1, y0, y1, N, out: Array.from(out) }));
console.log(nome, (Date.now() - t0) / 1000, 's');
