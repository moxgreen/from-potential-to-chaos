const r2 = v => Math.round(v*100)/100 || 0;
const ring = (N, R, q) => Array.from({ length: N }, (_, k) => [r2(R*Math.cos(2*Math.PI*k/N)), r2(R*Math.sin(2*Math.PI*k/N)), q]);
const tri = (r, q) => [0, 1, 2].map(k => [r2(r*Math.cos(Math.PI/2 + 2*Math.PI*k/3)), r2(r*Math.sin(Math.PI/2 + 2*Math.PI*k/3)), q]);
const PRESETS = {
  dipolo:     [[-3, 0, 2], [3, 0, -2]],
  uguali:     [[-3, 0, 2], [3, 0, 2]],
  asimm:      [[-3, 0, 4], [3, 0, -1]],
  singola:    [[0, 0, 2]],
  quadrupolo: [[-3, 3, 2], [3, 3, -2], [-3, -3, -2], [3, -3, 2]],
  piani:      [-6, -4, -2, 0, 2, 4, 6].flatMap(y => [[-3, y, 1], [3, y, -1]])
};

const vcirc = (Q, r) => Math.sqrt(ACC*Q/r);     // velocità circolare per q0 = 1 nC, m = 1 g
const BOWL = ring(16, 8.5, 3);
const SCENARI = {
  circolare:    { src: [[0, 0, -2]], speed: 4, tests: [[5, 0, 0, vcirc(2, 5)]] },
  ellittiche:   { src: [[0, 0, -2]], speed: 4, tests: [0.5, 0.7, 0.9].map(f => [7, 0, 0, f*vcirc(2, 7)]) },
  rosetta:      { src: [[-1.5, 0, -1.5], [1.5, 0, -1.5]], speed: 8, tests: [[0, 6, 0.8*vcirc(3, 6), 0]] },
  rutherford:   { src: [[0, 0, 4]], speed: 1, tests: [-4, -3, -2, -1, 0, 1, 2, 3, 4].map(y => [-9.5, y, 7, 0]) },
  ferma:        { src: [[-3, 0, 2], [3, 0, -2]], speed: 1, fl: true, tests: [[-2, 2, 0, 0]] },
  condensatore: { src: PRESETS.piani, speed: 0.5, tests: [14, 17, 21, 28].map(v => [-1.5, -9.5, 0, v]) },
  puntofisso:   { src: BOWL, damp: 'visc', gamma: 0.4, speed: 2, scale: [8000, 25], right: 'phase', tests: [[5, 2, 1, 1], [-6, -3, 0, 0], [0, 6.5, 2, 0]] },
  // Nessuna carica di prova e nessuna mappa all'avvio: prima le prove a mano e la «scommessa» sui punti sfida.
  // Punti sfida, nell'ordine: ovvi (cade sulla più vicina), ingannevoli (finisce su una carica lontana),
  // equilibrio instabile al centro, confine (due partenze vicine, due esiti). Esiti verificati in test/fisica.test.js.
  bacini:       { src: [...BOWL, ...tri(3, -1)], damp: 'visc', gamma: 0.2, speed: 2, scale: [8000, 25], clickLaunch: true, tests: [],
                  challenges: [[0, 5.5], [-5, -2.5], [5, -2.5], [-1.5, -6], [-4.5, 3.5], [4.5, 3.5], [0, 0], [0.5, 0], [-0.5, 0]] },
  ciclo:        { src: BOWL, damp: 'active', gamma: 0.6, vstar: 2.0, speed: 4, scale: [8000, 25], right: 'phase', tests: [[0.5, 0, 0, 0.3], [6.5, 0, 0, 1], [-6, 0, 0, -1.5]] },
  caos:         { src: [...BOWL, ...tri(2.2, 1.5)], speed: 4, scale: [8000, 25], right: 'phase', tests: [[0.3, -5.5, 3.5, 0.4], [0.3, -5.48, 3.5, 0.4], [0.3, -5.5, 3.0, 0.4]] },
  attrattore:   { src: [...BOWL, ...tri(3, 1.5)], damp: 'active', gamma: 0.5, vstar: 2.5, speed: 8, scale: [8000, 25], right: 'phase', tests: [[0.3, -5.5, 2.5, 0.4], [0.3, -5.48, 2.5, 0.4], [5, 4, 0, -1]] },
  // Ostacoli più lontani e motore più lento: attrattore compatto a tre lobi, raggiunto in circa 100 s da partenze ai lati opposti.
  // Con l'attrito «Nessuno» le stesse partenze vagano invece su gran parte dell'anello: confronto diretto con il biliardo.
  attrattore2:  { src: [...BOWL, ...tri(4, 1.5)], damp: 'active', gamma: 0.6, vstar: 1.5, speed: 8, scale: [8000, 25], right: 'phase', tests: [[0.3, -6.5, 0, 0], [6, 3, 0, -1.5], [-6.5, 2.5, 0, 0], [-1, 6.5, 3, 0]] },
  // Altre configurazioni per i bacini: quattro cariche uguali sul raggio di 3 cm; tre cariche diverse (−2, −1, −0,5 nC), mappa senza simmetria.
  bacini4:      { src: [...BOWL, [2.12, 2.12, -1], [-2.12, 2.12, -1], [-2.12, -2.12, -1], [2.12, -2.12, -1]], damp: 'visc', gamma: 0.2, speed: 2, scale: [8000, 25], clickLaunch: true, tests: [] },
  baciniDiverse:{ src: [...BOWL, [0, 3, -2], [-2.6, -1.5, -1], [2.6, -1.5, -0.5]], damp: 'visc', gamma: 0.2, speed: 2, scale: [8000, 25], clickLaunch: true, tests: [] }
};
