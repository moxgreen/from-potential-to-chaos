/* ================= fisica del potenziale ================= */
function potential(x, y){
  let v = 0;
  for (let n = 0; n < charges.length; n++){
    const c = charges[n], dx = x - c.x, dy = y - c.y;
    let r = Math.sqrt(dx*dx + dy*dy); if (r < RMIN) r = RMIN;
    v += c.q/r;
  }
  return v*KV;
}
let _ex = 0, _ey = 0;
function efieldRaw(x, y){
  let ex = 0, ey = 0;
  for (let n = 0; n < charges.length; n++){
    const c = charges[n], dx = x - c.x, dy = y - c.y;
    let r2 = dx*dx + dy*dy; if (r2 < RMIN*RMIN) r2 = RMIN*RMIN;
    const f = c.q/(r2*Math.sqrt(r2));
    ex += f*dx; ey += f*dy;
  }
  _ex = ex; _ey = ey;
}
function nearestSource(x, y){
  let d = Infinity, idx = -1;
  for (let n = 0; n < charges.length; n++){ const r = Math.hypot(x - charges[n].x, y - charges[n].y); if (r < d){ d = r; idx = n; } }
  return [d, idx];
}
const nearestDist = (x, y) => nearestSource(x, y)[0];

const gridT = new Float64Array(NT*NT), gridS = new Float64Array(NS*NS);
function fillGrid(g, N){
  const h = 2*L/(N-1);
  for (let j = 0; j < N; j++){ const y = -L + j*h; for (let i = 0; i < N; i++) g[j*N + i] = potential(-L + i*h, y); }
}

/* ================= marching squares ================= */
const SEGT = [null,[3,0],[0,1],[3,1],[1,2],null,[0,2],[3,2],[2,3],[0,2],null,[1,2],[1,3],[0,1],[3,0],null];
function edgePt(e, a, b, c, d, i, j, lv, out){
  let t;
  switch (e){
    case 0: t = (lv-a)/(b-a); out.push(i+t, j); break;
    case 1: t = (lv-b)/(c-b); out.push(i+1, j+t); break;
    case 2: t = (lv-d)/(c-d); out.push(i+t, j+1); break;
    default: t = (lv-a)/(d-a); out.push(i, j+t);
  }
}
function cellSeg(a, b, c, d, i, j, lv, out){
  const cs = (a>=lv?1:0) | (b>=lv?2:0) | (c>=lv?4:0) | (d>=lv?8:0);
  if (cs === 0 || cs === 15) return;
  if (cs === 5 || cs === 10){
    const up = (a+b+c+d)/4 >= lv, p = (cs === 5) === up ? [0,1,2,3] : [3,0,1,2];
    for (const e of p) edgePt(e, a, b, c, d, i, j, lv, out);
    return;
  }
  const s = SEGT[cs];
  edgePt(s[0], a, b, c, d, i, j, lv, out); edgePt(s[1], a, b, c, d, i, j, lv, out);
}
let contours = new Map();
function buildContours(){
  const step = state.vmax/state.nlev, n = state.nlev, N = NT, g = gridT, map = new Map();
  for (let j = 0; j < N-1; j++) for (let i = 0; i < N-1; i++){
    const a = g[j*N+i], b = g[j*N+i+1], c = g[(j+1)*N+i+1], d = g[(j+1)*N+i];
    let k0 = Math.ceil(Math.min(a,b,c,d)/step), k1 = Math.floor(Math.max(a,b,c,d)/step);
    if (k0 < -n) k0 = -n; if (k1 > n) k1 = n;
    for (let k = k0; k <= k1; k++){ let arr = map.get(k); if (!arr){ arr = []; map.set(k, arr); } cellSeg(a, b, c, d, i, j, k*step, arr); }
  }
  contours = map;
}
function singleContour(lv){
  const out = [], N = NT, g = gridT;
  for (let j = 0; j < N-1; j++) for (let i = 0; i < N-1; i++){
    const a = g[j*N+i], b = g[j*N+i+1], c = g[(j+1)*N+i+1], d = g[(j+1)*N+i];
    if (Math.min(a,b,c,d) <= lv && Math.max(a,b,c,d) >= lv) cellSeg(a, b, c, d, i, j, lv, out);
  }
  return out;
}

/* ================= linee di campo ================= */
let fieldLines = [], _ux = 0, _uy = 0;
function fdir(x, y, sgn){
  efieldRaw(x, y); const m = Math.hypot(_ex, _ey);
  if (m < 1e-9) return false;
  _ux = sgn*_ex/m; _uy = sgn*_ey/m; return true;
}
function computeFieldLines(){
  fieldLines = [];
  const cs = charges.filter(c => c.q !== 0), step = 0.07, B = L*1.03, hitR = 0.22;
  for (const c of cs){
    const sgn = Math.sign(c.q), n = Math.max(4, Math.min(40, Math.round(Math.abs(c.q)*4)));
    for (let m = 0; m < n; m++){
      const ang = 2*Math.PI*(m + 0.5)/n;
      let x = c.x + 0.25*Math.cos(ang), y = c.y + 0.25*Math.sin(ang);
      const pts = [c.x, c.y, x, y]; let end = null;
      for (let s = 0; s < 1600; s++){
        if (!fdir(x, y, sgn)) break;
        const mx = x + 0.5*step*_ux, my = y + 0.5*step*_uy;
        if (!fdir(mx, my, sgn)) break;
        x += step*_ux; y += step*_uy; pts.push(x, y);
        if (x < -B || x > B || y < -B || y > B) break;
        for (const o of cs){ if (o === c) continue; const dx = x - o.x, dy = y - o.y; if (dx*dx + dy*dy < hitR*hitR){ end = o; break; } }
        if (end){ pts.push(end.x, end.y); break; }
      }
      if (sgn < 0 && end && end.q > 0) continue;
      fieldLines.push({ pts, sgn });
    }
  }
}

