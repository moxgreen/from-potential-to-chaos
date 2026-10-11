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

test('attrattore compatto: partenze lontane raccolte nella stessa regione, moto caotico', () => {
  const s = separazione('attrattore2', 0, [25, 75]);
  assert.ok(s[25] < 0.01 && s[75] > 0.1, `separazione a 25 s: ${s[25]}, a 75 s: ${s[75]}`);
  // Con il motore tutte restano entro 4,8 cm dopo i primi 20 s; senza motore (biliardo) ognuna torna oltre 6 cm.
  const r = mot => nuovo()(`
    caricaScenario('attrattore2'); sim.damp = '${mot}'; const rmax = tests.map(() => 0);
    integra(300, 0.5, t => tests.forEach((p, i) => { if (t > 20) rmax[i] = Math.max(rmax[i], Math.hypot(p.x, p.y)); }));
    ({ rmax, vive: tests.every(p => p.status === 'moving') })`);
  const conMotore = r('active'), senza = r('none');
  assert.ok(conMotore.vive && senza.vive, 'nessuna esce dalla mappa né urta una carica');
  for (const v of conMotore.rmax) assert.ok(v < 4.8, `con il motore r max = ${v}`);
  for (const v of senza.rmax) assert.ok(v > 6, `senza motore r max = ${v}`);
});

test('bacini: tre bacini, uno per ciascuna carica negativa interna', () => {
  const r = nuovo()(`
    caricaScenario('bacini'); const N = 20, cell = 2*L/N, n = {};
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++){
      const k = basinClassify(-L + (i + .5)*cell, L - (j + .5)*cell); n[k] = (n[k] || 0) + 1; }
    ({ n, keys: attractors.map(k => k.idx), indecisi: n[-2] || 0 })`);
  assert.deepEqual(Array.from(r.keys).sort((a, b) => a - b), [16, 17, 18]);
  assert.equal(r.indecisi, 0);
  for (const k of [0, 1, 2]) assert.ok(r.n[k] > 30, `bacino ${k}: ${r.n[k]} celle`);
});

// Punti sfida della «scommessa» (SCENARI.bacini.challenges): A = Q17 in alto, B = Q18 in basso a sinistra, C = Q19 in basso a destra.
const SFIDE = ['A', 'B', 'C', 'A', 'C', 'B', 'eq', 'C', 'B'];
const esito = `(k => k < 0 ? String(k) : attractors[k].kind === 'eq' ? 'eq' : attractors[k].letter)`;

test('scommessa: esito di ogni punto sfida con la mappa (basinClassify)', () => {
  const r = nuovo()(`caricaScenario('bacini'); SCENARI.bacini.challenges.map(([x, y]) => ${esito}(basinClassify(x, y)))`);
  assert.deepEqual(Array.from(r), SFIDE);
});

test('scommessa: la prova a mano (advance) dà lo stesso esito, con fotogrammi di durata diversa', () => {
  for (const dt of [1/60, 0.05, 0.1]){
    const r = nuovo()(`
      caricaScenario('bacini'); tests = [];
      for (const [x, y] of SCENARI.bacini.challenges) addTest(x, y, 0, 0);
      integra(30, ${dt});
      ({ esiti: tests.map(p => p.end == null ? p.status : ${esito}(p.end)), punti: marks.length })`);
    assert.deepEqual(Array.from(r.esiti), SFIDE, `dt = ${dt}`);
    assert.equal(r.punti, SFIDE.length, 'un punto colorato per ogni partenza');
  }
});

test('scommessa: i punti ingannevoli non dipendono dalla precisione del clic (±0,3 cm)', () => {
  const r = nuovo()(`
    caricaScenario('bacini');
    [3, 4, 5].map(n => { const [x, y] = SCENARI.bacini.challenges[n]; const out = new Set();
      for (let a = 0; a < 8; a++) out.add(${esito}(basinClassify(x + 0.3*Math.cos(a*Math.PI/4), y + 0.3*Math.sin(a*Math.PI/4))));
      return [...out]; })`);
  assert.equal(JSON.stringify(r), JSON.stringify([['A'], ['C'], ['B']]));
});

test('attrattori: stesso colore e stessa lettera per prove a mano e mappa, in qualunque ordine', () => {
  const r = nuovo()(`
    caricaScenario('bacini'); tests = []; addTest(5, -2.5, 0, 0); integra(5, 0.05);    // prima prova: C
    const prima = attractors.map(a => [a.letter, a.col]);
    const kA = basinClassify(0, 5.5), kB = basinClassify(-5, -2.5);
    ({ prima, A: [attractors[kA].letter, attractors[kA].col], B: [attractors[kB].letter, attractors[kB].col], BCOL })`);
  const J = JSON.stringify;
  assert.equal(J(r.prima), J([['C', r.BCOL[2]]]));
  assert.equal(J(r.A), J(['A', r.BCOL[0]]));
  assert.equal(J(r.B), J(['B', r.BCOL[1]]));
});

test('prove a mano: nessun punto colorato senza attrito viscoso o con velocità iniziale', () => {
  const r = nuovo()(`
    caricaScenario('bacini'); tests = []; addTest(4, 4, 1, 0); integra(20, 0.05);
    const conV = marks.length; sim.damp = 'none'; tests = []; addTest(5, -2.5, 0, 0); integra(5, 0.05);
    ({ conV, senzaAttrito: marks.length })`);
  assert.equal(r.conV, 0);
  assert.equal(r.senzaAttrito, 0);
});

test('zoom: potenziale e mappa dei bacini calcolati sulla finestra', () => {
  const r = nuovo()(`
    caricaScenario('bacini');
    const w = { cx: -4.5, cy: 3.5, h: 0.5 }, N = 10, g = new Float64Array(N*N);
    fillGrid(g, N, w);
    const errV = Math.abs(g[3*N + 7] - potential(w.cx - w.h + 7*2*w.h/(N - 1), w.cy - w.h + 3*2*w.h/(N - 1)));
    // basinWork su una finestra, senza DOM: riga 0 = bordo alto
    basin.N = N; basin.win = w; basin.data = new Int16Array(N*N); basin.row = 0; basin.n = []; basin.undecided = 0;
    basin.img = { data: new Uint8ClampedArray(N*N*4) }; basin.cv = { getContext: () => ({ putImageData(){} }) };
    basin.active = true; basinWork(1e9);
    const cell = 2*w.h/N, ok = [[0, 0], [9, 0], [0, 9], [4, 6]].every(([i, j]) =>
      basin.data[j*N + i] === basinClassify(w.cx - w.h + (i + .5)*cell, w.cy + w.h - (j + .5)*cell));
    ({ errV, ok, fatto: !basin.active, tutteC: Array.from(basin.data).every(k => attractors[k].letter === 'C') })`);
  assert.ok(r.errV < 1e-9, `errore sul potenziale ${r.errV}`);
  assert.ok(r.ok, 'celle della finestra = classificazione diretta');
  assert.ok(r.fatto);
  assert.ok(r.tutteC, 'attorno al punto sfida 5 tutto il riquadro di 1 cm finisce su C');
});

// Altre configurazioni dei bacini (pulsanti «Quattro attrattori» e «Tre cariche diverse»).
const bacini = nome => nuovo()(`
  caricaScenario('${nome}'); const N = 20, cell = 2*L/N, n = {};
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++){
    const k = basinClassify(-L + (i + .5)*cell, L - (j + .5)*cell); n[k < 0 ? k : attractors[k].letter] = (n[k < 0 ? k : attractors[k].letter] || 0) + 1; }
  ({ n, tipi: attractors.map(a => a.kind).join('') })`);

test('bacini: quattro attrattori, bacini uguali per simmetria', () => {
  const r = bacini('bacini4');
  assert.equal(r.tipi, 'qqqq');
  assert.ok(!r.n[-2], 'nessuna partenza indecisa');
  const k = ['A', 'B', 'C', 'D'].map(l => r.n[l]);
  for (const v of k) assert.ok(v > 30 && Math.abs(v - k[0]) <= 0.15*k[0], `celle per bacino: ${k}`);
});

test('bacini: tre cariche diverse, il bacino più grande è della carica più forte', () => {
  const r = bacini('baciniDiverse');
  assert.equal(r.tipi, 'qqq');
  assert.ok(!r.n[-2], 'nessuna partenza indecisa');
  assert.ok(r.n.A > r.n.B && r.n.B > r.n.C && r.n.C > 10, `A −2 nC: ${r.n.A}, B −1 nC: ${r.n.B}, C −0,5 nC: ${r.n.C}`);
});
