// Carica il motore fisico REALE del simulatore (src/01..05 e 09) in Node, senza DOM.
// Così test, calcoli offline e simulatore usano lo stesso codice (niente copie da tenere allineate).
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { moduli, SRC } = require('./moduli.js');

// Moduli senza dipendenze dal DOM (il resto è disegno e interfaccia)
const PURI = ['01-costanti.js', '02-colori-formati.js', '03-fisica.js', '04-dinamica.js', '05-bacini.js', '09-scenari.js'];

// Funzioni dell'interfaccia richiamate dal motore: qui non fanno nulla.
const STUB = `
  let needTop = false;
  const toast = () => {}, redraw = () => {}, schedule = () => {}, updateTestUI = () => {}, updateBasinUI = () => {};
  const setDamp = (mode, gamma, vstar) => { sim.damp = mode; if (gamma != null) sim.gamma = gamma; if (vstar != null) sim.vstar = vstar; };
`;

// Operazioni di alto livello, scritte per il test (equivalgono a loadScenario senza interfaccia).
const AIUTI = `
  function caricaScenario(nome){
    const S = SCENARI[nome];
    charges = []; selected = null;
    for (const [x, y, q] of S.src) addCharge(x, y, q);
    sim.q0 = 1; sim.m = 1; sim.showFL = false; sim.t = 0;
    sim.damp = S.damp || 'none';
    if (S.gamma != null) sim.gamma = S.gamma;
    if (S.vstar != null) sim.vstar = S.vstar;
    tests = [];
    for (const [x, y, vx, vy] of S.tests) addTest(x, y, vx, vy);
    return S;
  }
  // Avanza la simulazione di T secondi a blocchi di dt, chiamando cb(t) dopo ogni blocco.
  function integra(T, dt, cb){
    for (let t = 0; t < T - 1e-9; t += dt){ stepSim(dt); if (cb) cb(t + dt); }
  }
  const distSorgente = p => nearestSource(p.x, p.y)[0];
`;

function caricaMotore(){
  const doc = { createElement: () => ({ getContext: () => ({}) }) };
  const ctx = vm.createContext({ Intl, Math, performance, console, document: doc });
  vm.runInContext(STUB, ctx, { filename: 'stub' });
  for (const f of PURI) vm.runInContext(fs.readFileSync(path.join(SRC, f), 'utf8'), ctx, { filename: f });
  vm.runInContext(AIUTI, ctx, { filename: 'aiuti' });
  return { ctx, run: code => vm.runInContext(code, ctx) };
}
module.exports = { caricaMotore };
