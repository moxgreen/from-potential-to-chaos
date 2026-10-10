// Separazione nel tempo tra traiettorie vicine (biliardo elettrico), per il grafico f8_separazione.
// Uso: node strumenti/sep2.js [out.json]   (default: sep2.json nella cartella corrente)
const fs = require('fs');
const { caricaMotore } = require('./motore.js');

const DT = 0.5, T = 120, D0 = 1e-6, NDIR = 6;
// Per ogni direzione della perturbazione: distanza tra la traiettoria e la sua copia perturbata, ogni DT secondi.
function serie(partenza) {
  const M = caricaMotore();
  return M.run(`
    caricaScenario('caos'); tests = [];
    const P = ${JSON.stringify(partenza)}, out = [];
    for (let k = 0; k < ${NDIR}; k++){
      const a = k*Math.PI/6; addTest(...P); addTest(P[0] + ${D0}*Math.cos(a), P[1] + ${D0}*Math.sin(a), P[2], P[3]);
    }
    const dist = () => Array.from({ length: ${NDIR} }, (_, k) => Math.hypot(tests[2*k].x - tests[2*k+1].x, tests[2*k].y - tests[2*k+1].y));
    out.push(dist());
    integra(${T}, ${DT}, () => out.push(dist()));
    Array.from({ length: ${NDIR} }, (_, k) => out.map(r => r[k]))`);
}
const ch = serie([0.3, -5.5, 3.5, 0.4]), rg = serie([0.3, -5.5, 3.0, 0.4]);
const nome = process.argv[2] || 'sep2.json';
fs.writeFileSync(nome, JSON.stringify({ ch: Array.from(ch, a => Array.from(a)), rg: Array.from(rg, a => Array.from(a)), dt: DT }));
const gm = a => Math.exp(a.reduce((s, v) => s + Math.log(v), 0) / a.length);
for (const t of [0, 20, 40, 60, 80, 100, 120]) {
  const i = t / DT;
  console.log(t, 'caos', gm(ch.map(r => r[i])).toExponential(1), 'reg', gm(rg.map(r => r[i])).toExponential(1));
}
