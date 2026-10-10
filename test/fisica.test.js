// Test del motore fisico reale del simulatore (src/), sugli scenari verificati in README.md §4.
const test = require('node:test');
const assert = require('node:assert/strict');
const { caricaMotore } = require('../strumenti/motore.js');

// Ogni test parte da un motore pulito (stato globale azzerato).
const nuovo = () => caricaMotore().run;
const vicino = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg || ''} ${a} non è entro ${tol} da ${b}`);

test('potenziale e campo di una carica singola (legge di Coulomb)', () => {
  const run = nuovo();
  const r = run(`
    charges = []; addCharge(0, 0, 2);
    ({ V: potential(4, 0), E: (efieldRaw(4, 0), KE*Math.hypot(_ex, _ey)), KV, KE })   // efieldRaw dà nC/cm²`);
  vicino(r.V, r.KV * 2 / 4, 1e-9, 'V = k q / r');
  vicino(r.E, r.KE * 2 / 16, 1e-6, 'E = k q / r²');
});

test('orbita circolare: velocità, periodo, energia conservata', () => {
  const r = nuovo()(`
    caricaScenario('circolare'); const p = tests[0];
    const En = () => 0.05*Math.hypot(p.vx, p.vy)**2 + sim.q0*potential(p.x, p.y)*1e-3;   // µJ
    const E0 = En(); let prev = Math.atan2(p.y, p.x), T = null;
    integra(40, 0.01, t => { const a = Math.atan2(p.y, p.x); if (T === null && t > 1 && prev < 0 && a >= 0) T = t; prev = a; });
    ({ v: Math.hypot(p.vx0, p.vy0), T, E0, E1: En() })`);
  vicino(r.v, 1.90, 0.005, 'velocità');
  vicino(r.T, 16.6, 0.05, 'periodo');
  vicino(r.E1, r.E0, 1e-9, 'energia');
});

test('orbite ellittiche: pericentri 1,0 / 2,3 / 4,8 cm', () => {
  const m = nuovo()(`
    caricaScenario('ellittiche'); const m = tests.map(() => 1e9);
    integra(60, 0.01, () => tests.forEach((p, i) => m[i] = Math.min(m[i], distSorgente(p))));
    m`);
  [1.0, 2.3, 4.8].forEach((att, i) => vicino(m[i], att, 0.05, `pericentro ${i}`));
});

test('Rutherford: urto frontale, distanza minima da conservazione dell\'energia', () => {
  const r = nuovo()(`
    caricaScenario('rutherford'); const frontale = tests[4]; let dmin = 1e9;
    integra(10, 0.01, () => { dmin = Math.min(dmin, distSorgente(frontale)); });
    ({ dmin, stati: tests.map(p => p.status), K0: 0.05*49, kQ: KV*4 })`);
  // Partenza da x = -9,5 cm: K0 + kQ/9,5 = kQ/d   (kQ in µJ·cm, con q0 = 1 nC)
  const dAtteso = (r.kQ * 1e-3) / (r.K0 + (r.kQ * 1e-3) / 9.5);
  vicino(r.dmin, dAtteso, 0.01, 'distanza minima');
  vicino(r.dmin, 1.27, 0.01, 'valore del README');
  // Da lontano (formula del testo della lezione) sarebbe 1,47 cm: la partenza a 9,5 cm la accorcia.
  vicino((r.kQ * 1e-3) / r.K0, 1.47, 0.01, 'formula da distanza infinita');
  assert.ok(r.stati.every(s => s === 'out'), 'tutte le cariche vengono respinte fuori dalla mappa');
});

test('punto fisso: con attrito viscoso tutte si fermano al centro della ciotola', () => {
  const r = nuovo()(`
    caricaScenario('puntofisso'); integra(200, 0.05);
    tests.map(p => ({ r: Math.hypot(p.x, p.y), s: p.status }))`);
  for (const p of r){ assert.equal(p.s, 'rest'); assert.ok(p.r < 0.05, `r = ${p.r}`); }
});

test('ciclo limite: tutte le partenze convergono su r = 3,11 cm', () => {
  const r = nuovo()(`
    caricaScenario('ciclo'); const rr = tests.map(() => []);
    integra(150, 0.05, t => { if (t > 120) tests.forEach((p, i) => rr[i].push(Math.hypot(p.x, p.y))); });
    rr.map(a => [Math.min(...a), Math.max(...a)])`);
  for (const [lo, hi] of r){ vicino(lo, 3.11, 0.01); vicino(hi, 3.11, 0.01); }
});

test('ciclo limite: verso antiorario', () => {
  const L = nuovo()(`
    caricaScenario('ciclo'); integra(150, 0.05);
    tests.map(p => p.x*p.vy - p.y*p.vx)`);        // momento angolare
  for (const l of L) assert.ok(l > 0, `L = ${l}`);
});

// Divergenza di due traiettorie che partono a 1e-6 cm l'una dall'altra.
const separazione = (nome, i, tempi) => nuovo()(`
  const S = caricaScenario('${nome}'), s0 = S.tests[${i}]; tests = [];
  addTest(...s0); addTest(s0[0] + 1e-6, s0[1], s0[2], s0[3]);
  const r = {}; integra(${Math.max(...tempi)}, 0.5, t => { if (${JSON.stringify(tempi)}.includes(t)) r[t] = Math.hypot(tests[0].x - tests[1].x, tests[0].y - tests[1].y); });
  r`);

test('biliardo: partenza caotica diverge, partenza regolare no', () => {
  const caos = separazione('caos', 0, [60, 100]);
  const reg = separazione('caos', 2, [60, 100]);
  assert.ok(caos[60] > 0.1, `caos a 60 s: ${caos[60]}`);       // da 1e-6 a oltre 0,1 cm
  assert.ok(reg[100] < 1e-3, `regolare a 100 s: ${reg[100]}`);  // resta vicina
});

test('attrattore strano: sensibilità alle condizioni iniziali e confinamento', () => {
  const s = separazione('attrattore', 0, [40, 100]);
  assert.ok(s[100] > 1, `separazione a 100 s: ${s[100]}`);
  const raggi = nuovo()(`
    caricaScenario('attrattore'); let rmax = 0, vivi = true;
    integra(120, 0.5, () => tests.forEach(p => { rmax = Math.max(rmax, Math.hypot(p.x, p.y)); if (p.status !== 'moving') vivi = false; }));
    ({ rmax, vivi })`);
  assert.ok(raggi.vivi, 'nessuna esce dalla mappa né urta una carica');
  assert.ok(raggi.rmax < 10, `r max = ${raggi.rmax}`);
});

test('bacini: tre bacini, uno per ciascuna carica negativa interna', () => {
  const r = nuovo()(`
    caricaScenario('bacini'); const N = 20, cell = 2*L/N, n = {};
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++){
      const k = basinClassify(-L + (i + .5)*cell, L - (j + .5)*cell); n[k] = (n[k] || 0) + 1; }
    ({ n, keys: basin.keys.map(k => k.idx), indecisi: n[-2] || 0 })`);
  assert.deepEqual(Array.from(r.keys).sort((a, b) => a - b), [16, 17, 18]);
  assert.equal(r.indecisi, 0);
  for (const k of [0, 1, 2]) assert.ok(r.n[k] > 30, `bacino ${k}: ${r.n[k]} celle`);
});
