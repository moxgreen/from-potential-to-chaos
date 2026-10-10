/* ================= bacini di attrazione ================= */
const BCOL = ['#e8a33d','#3fa7a0','#8e6cc9','#d9617a','#6aa84f','#4f86c6','#c7a02a','#a0522d'];
const basin = { N: 100, data: null, row: 0, active: false, show: true, keys: [], undecided: 0, cv: document.createElement('canvas'), img: null };
function basinClear(){
  if (!basin.data && !basin.active) return;
  basin.data = null; basin.active = false; basin.row = 0; basin.keys = [];
  updateBasinUI(); needTop = true; schedule();
}
function basinStart(){
  if (!charges.length){ toast('Servono delle cariche sulla mappa'); return; }
  if (sim.damp !== 'visc'){ setDamp('visc', sim.gamma > 0.6 ? 0.2 : sim.gamma); toast('Per i bacini serve l\'attrito viscoso: l\'ho attivato'); }
  const N = basin.N;
  basin.data = new Int16Array(N*N).fill(-3); basin.row = 0; basin.keys = []; basin.undecided = 0;
  basin.active = true; basin.show = true; $('optBasin').checked = true;
  basin.cv.width = N; basin.cv.height = N; basin.img = basin.cv.getContext('2d').createImageData(N, N);
  updateBasinUI(); schedule();
}
function attractorKey(kind, idx, x, y){
  for (let k = 0; k < basin.keys.length; k++){
    const a = basin.keys[k];
    if (a.kind === kind && (kind === 'q' ? a.idx === idx : Math.hypot(a.x - x, a.y - y) < 0.5)) return k;
  }
  const col = BCOL[basin.keys.length % BCOL.length];
  basin.keys.push({ kind, idx, x, y, n: 0, col, rgb: [1,3,5].map(o => parseInt(col.slice(o, o+2), 16)) });
  return basin.keys.length - 1;
}
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
  const N = basin.N, t0 = performance.now(), d = basin.img.data, cell = 2*L/N;
  while (basin.row < N && performance.now() - t0 < budget){
    const j = basin.row, y = L - (j + 0.5)*cell;
    for (let i = 0; i < N; i++){
      const k = basinClassify(-L + (i + 0.5)*cell, y), o = (j*N + i)*4;
      basin.data[j*N + i] = k;
      if (k >= 0){ const c = basin.keys[k]; c.n++; d[o] = c.rgb[0]; d[o+1] = c.rgb[1]; d[o+2] = c.rgb[2]; d[o+3] = 235; }
      else if (k === -2){ basin.undecided++; d[o] = 70; d[o+1] = 74; d[o+2] = 84; d[o+3] = 220; }
      else d[o+3] = 0;
    }
    basin.row++;
  }
  basin.cv.getContext('2d').putImageData(basin.img, 0, 0);
  if (basin.row >= N) basin.active = false;
  updateBasinUI();
}

