/* ================= bacini di attrazione ================= */
const BCOL = ['#e8a33d','#3fa7a0','#8e6cc9','#d9617a','#6aa84f','#4f86c6','#c7a02a','#a0522d'];
const EQCOL = ['#9aa0ac','#c9b18a','#7f8fa6'];
const LETTERS = 'ABCDEFGH', MAX_MARKS = 400;
// win: finestra (centro e semilato in cm) su cui è stata calcolata la mappa; n[k]: celle che finiscono sull'attrattore k
const basin = { N: 100, data: null, row: 0, active: false, show: true, n: [], undecided: 0, win: { ...VIEW0 }, cv: document.createElement('canvas'), img: null };
// Registro degli attrattori, comune a mappa e prove a mano: stesso attrattore, stesso colore e stessa lettera.
// marks: punti di partenza delle prove a mano (da ferma, con attrito viscoso) con l'attrattore su cui sono finite.
let attractors = [], marks = [];

// Cariche che possono attirare la carica di prova (segno opposto a q0), nell'ordine dell'elenco: A, B, C…
function attractorCands(){ const out = []; charges.forEach((c, i) => { if (c.q*sim.q0 < 0) out.push(i); }); return out; }
const candColor = r => BCOL[r % BCOL.length];
function placeName(x, y){
  if (Math.hypot(x, y) < 0.5) return 'al centro';
  const names = ['a destra','in alto a destra','in alto','in alto a sinistra','a sinistra','in basso a sinistra','in basso','in basso a destra'];
  return names[((Math.round(Math.atan2(y, x)*4/Math.PI) % 8) + 8) % 8];
}

// Mappe già calcolate, per finestra e risoluzione: tornando indietro con lo zoom non si ricalcola.
const basinCache = new Map(), MAX_CACHE = 12;
const winKey = (w, N) => `${w.cx},${w.cy},${w.h},${N}`;
function basinSave(){
  basinCache.delete(winKey(basin.win, basin.N));
  basinCache.set(winKey(basin.win, basin.N), { data: basin.data, n: basin.n.slice(), undecided: basin.undecided, img: basin.img, win: { ...basin.win }, N: basin.N });
  if (basinCache.size > MAX_CACHE) basinCache.delete(basinCache.keys().next().value);
}
function basinRestore(w){
  const c = basinCache.get(winKey(w, basin.N));
  if (!c) return false;
  Object.assign(basin, { data: c.data, n: c.n.slice(), undecided: c.undecided, img: c.img, win: { ...c.win }, row: c.N, active: false, show: true });
  basin.cv.width = basin.cv.height = c.N; basin.cv.getContext('2d').putImageData(c.img, 0, 0);
  updateBasinUI(); needTop = true; schedule();
  return true;
}

// Cambiano cariche, q0, massa o attrito: mappa, prove e attrattori non valgono più.
function basinClear(){
  const had = basin.data || basin.active || marks.length || attractors.length;
  basinCache.clear();
  basin.data = null; basin.active = false; basin.row = 0; basin.n = []; attractors = []; marks = [];
  if (had){ updateBasinUI(); needTop = true; schedule(); }
}
function basinStart(){
  if (!charges.length){ toast('Servono delle cariche sulla mappa'); return; }
  if (sim.damp !== 'visc'){ setDamp('visc', sim.gamma > 0.6 ? 0.2 : sim.gamma); toast('Per i bacini serve l\'attrito viscoso: l\'ho attivato'); }
  const N = basin.N;
  basin.win = { ...view };
  basin.data = new Int16Array(N*N).fill(-3); basin.row = 0; basin.n = []; basin.undecided = 0;
  basin.active = true; basin.show = true; $('optBasin').checked = true;
  basin.cv.width = N; basin.cv.height = N; basin.img = basin.cv.getContext('2d').createImageData(N, N);
  updateBasinUI(); schedule();
}
function attractorKey(kind, idx, x, y){
  for (let k = 0; k < attractors.length; k++){
    const a = attractors[k];
    if (a.kind === kind && (kind === 'q' ? a.idx === idx : Math.hypot(a.x - x, a.y - y) < 0.5)) return k;
  }
  let col, letter;
  if (kind === 'q'){
    const r = attractorCands().indexOf(idx);
    col = candColor(r >= 0 ? r : attractors.length);
    letter = r >= 0 && r < LETTERS.length ? LETTERS[r] : 'Q' + (idx + 1);
  } else {
    const n = attractors.filter(a => a.kind === 'eq').length;
    col = EQCOL[n % EQCOL.length]; letter = 'E' + (n + 1);
  }
  attractors.push({ kind, idx, x, y, col, letter, rgb: [1,3,5].map(o => parseInt(col.slice(o, o+2), 16)) });
  return attractors.length - 1;
}
// Fine di una prova a mano (da advance): il punto di partenza prende il colore dell'attrattore.
function trialEnd(p, kind, idx, x, y){
  if (sim.damp !== 'visc' || p.vx0 || p.vy0) return;     // i bacini valgono per partenze da ferma con attrito viscoso
  const k = attractorKey(kind, idx, x, y);
  p.end = k;
  marks = marks.filter(m => m.x !== p.x0 || m.y !== p.y0);
  marks.push({ x: p.x0, y: p.y0, k });
  if (marks.length > MAX_MARKS) marks.shift();
  trialDone(p, k);
}
const markAt = (x, y) => marks.find(m => Math.abs(m.x - x) < 1e-9 && Math.abs(m.y - y) < 1e-9);

const _bp = { x: 0, y: 0, vx: 0, vy: 0 };
function basinClassify(x0, y0){
  const p = _bp; p.x = x0; p.y = y0; p.vx = 0; p.vy = 0;
  let t = 0, still = 0;
  if (nearestDist(x0, y0) < HIT_R) return -1;          // partenza dentro una carica: esclusa
  for (let g = 0; g < 40000; g++){
    const [d, idx] = nearestSource(p.x, p.y);
    if (d < HIT_R) return attractorKey('q', idx, charges[idx].x, charges[idx].y);
    if (Math.abs(p.x) > 2.5*L || Math.abs(p.y) > 2.5*L) return -1;
    const [h, v, a] = stepSize(p, d, 0.02);
    if (v < 0.005 && a < 0.005){ if (++still > 30) return attractorKey('eq', -1, p.x, p.y); } else still = 0;
    rk4(p, h); t += h;
    if (t > 200) break;
  }
  return -2;
}
function basinWork(budget){
  const N = basin.N, t0 = performance.now(), d = basin.img.data, w = basin.win, cell = 2*w.h/N;
  while (basin.row < N && performance.now() - t0 < budget){
    const j = basin.row, y = w.cy + w.h - (j + 0.5)*cell;
    for (let i = 0; i < N; i++){
      const k = basinClassify(w.cx - w.h + (i + 0.5)*cell, y), o = (j*N + i)*4;
      basin.data[j*N + i] = k;
      if (k >= 0){ const c = attractors[k]; basin.n[k] = (basin.n[k] || 0) + 1; d[o] = c.rgb[0]; d[o+1] = c.rgb[1]; d[o+2] = c.rgb[2]; d[o+3] = 235; }
      else if (k === -2){ basin.undecided++; d[o] = 70; d[o+1] = 74; d[o+2] = 84; d[o+3] = 220; }
      else d[o+3] = 0;
    }
    basin.row++;
  }
  basin.cv.getContext('2d').putImageData(basin.img, 0, 0);
  if (basin.row >= N){ basin.active = false; basinSave(); }
  updateBasinUI();
}
