/* ================= carica di prova e dinamica ================= */
const ACC = K*1e-9;           // a (cm/s²) = ACC · q0(nC) · Σ q/r² (nC/cm²) / m(g)
const HIT_R = 0.3, MAX_TESTS = 12, MAX_TRAIL = 12000, VS = 0.5;
const TCOL = ['#142a4c','#8a4b00','#00695c','#5e2b97','#9c1c1c','#37474f','#1b5e20','#6d4c41','#283593','#7b1fa2','#004d40','#bf360c'];
const FCOL = '#d81b60';
const sim = { q0: 1, m: 1, speed: 1, running: false, t: 0, lastTs: 0, showVF: true, showFL: false, damp: 'none', gamma: 0.3, vstar: 2.5 };
let tests = [], selTest = null, lastSel = 'charge', phaseV = 1;
const tcol = p => TCOL[Math.max(0, tests.indexOf(p)) % TCOL.length];

let _ax = 0, _ay = 0;
function elecAccel(x, y){ efieldRaw(x, y); const f = ACC*sim.q0/sim.m; _ax = f*_ex; _ay = f*_ey; }
function accel(x, y, vx, vy){
  elecAccel(x, y);
  if (sim.damp === 'visc'){ _ax -= sim.gamma*vx; _ay -= sim.gamma*vy; }
  else if (sim.damp === 'active'){ const k = sim.gamma*(1 - (vx*vx + vy*vy)/(sim.vstar*sim.vstar)); _ax += k*vx; _ay += k*vy; }
}
function rk4(p, h){
  const x = p.x, y = p.y, vx = p.vx, vy = p.vy;
  accel(x, y, vx, vy); const a1x = _ax, a1y = _ay;
  const x2 = x + 0.5*h*vx, y2 = y + 0.5*h*vy, vx2 = vx + 0.5*h*a1x, vy2 = vy + 0.5*h*a1y;
  accel(x2, y2, vx2, vy2); const a2x = _ax, a2y = _ay;
  const x3 = x + 0.5*h*vx2, y3 = y + 0.5*h*vy2, vx3 = vx + 0.5*h*a2x, vy3 = vy + 0.5*h*a2y;
  accel(x3, y3, vx3, vy3); const a3x = _ax, a3y = _ay;
  const x4 = x + h*vx3, y4 = y + h*vy3, vx4 = vx + h*a3x, vy4 = vy + h*a3y;
  accel(x4, y4, vx4, vy4); const a4x = _ax, a4y = _ay;
  p.x = x + h/6*(vx + 2*vx2 + 2*vx3 + vx4);
  p.y = y + h/6*(vy + 2*vy2 + 2*vy3 + vy4);
  p.vx = vx + h/6*(a1x + 2*a2x + 2*a3x + a4x);
  p.vy = vy + h/6*(a1y + 2*a2y + 2*a3y + a4y);
}
function stepSize(p, d, base){
  accel(p.x, p.y, p.vx, p.vy);
  const v = Math.hypot(p.vx, p.vy), a = Math.hypot(_ax, _ay);
  let h = base;
  if (isFinite(d)) h = Math.min(h, 0.02*d/(v + 1e-9), 0.1*Math.sqrt(d/(a + 1e-12)));
  return [Math.max(h, 1e-6), v, a];
}

function setVel(p, vx, vy){ p.vx0 = vx; p.vy0 = vy; if (vx || vy) p.ang = Math.atan2(vy, vx)*180/Math.PI; }
function setPolar(p, mag, ang){
  p.ang = ang; const r = ang*Math.PI/180;
  p.vx0 = Math.abs(mag*Math.cos(r)) < 1e-9 ? 0 : mag*Math.cos(r);
  p.vy0 = Math.abs(mag*Math.sin(r)) < 1e-9 ? 0 : mag*Math.sin(r);
}
function addTest(x, y, vx, vy){
  if (tests.length >= MAX_TESTS){ toast(`Puoi inserire al massimo ${MAX_TESTS} cariche di prova`); return null; }
  const p = { x0: x, y0: y, vx0: 0, vy0: 0, ang: 0 };
  setVel(p, vx, vy); tests.push(p); resetParticle(p); return p;
}
function resetParticle(p){
  p.x = p.x0; p.y = p.y0; p.vx = p.vx0; p.vy = p.vy0;
  p.trail = [p.x0, p.y0]; p.trailV = [potential(p.x0, p.y0)]; p.trailVX = [p.vx0];
  p.status = 'ready'; p.note = '';
  p.fl = sim.showFL ? fieldLineFrom(p.x0, p.y0) : null;
}
function resetSim(){
  sim.running = false; sim.t = 0; sim.lastTs = 0; phaseV = 1;
  tests.forEach(resetParticle);
  updateTestUI(); redraw();
}
function advance(p, T){
  let t = 0, guard = 0;
  while (t < T && guard++ < 50000){
    const [d, idx] = nearestSource(p.x, p.y);
    if (d < HIT_R){ p.status = 'hit'; p.note = 'urto con Q' + (idx + 1); return; }
    if (Math.abs(p.x) > 1.25*L || Math.abs(p.y) > 1.25*L){ p.status = 'out'; return; }
    let [h, v, a] = stepSize(p, d, 0.01);
    if (sim.damp === 'visc' && v < 0.003 && a < 0.003){ p.status = 'rest'; return; }
    h = Math.min(h, T - t);
    rk4(p, h); t += h;
    const n = p.trail.length, dx = p.x - p.trail[n-2], dy = p.y - p.trail[n-1];
    if (dx*dx + dy*dy > 0.0025){
      p.trail.push(p.x, p.y); p.trailV.push(potential(p.x, p.y)); p.trailVX.push(p.vx);
      if (p.trailV.length > MAX_TRAIL){ p.trail.splice(0, 2000); p.trailV.splice(0, 1000); p.trailVX.splice(0, 1000); }
    }
  }
}
function stepSim(T){
  let active = 0;
  for (const p of tests){
    if (p.status === 'ready') p.status = 'moving';
    if (p.status === 'moving'){ advance(p, T); if (p.status === 'moving') active++; }
  }
  sim.t += T;
  if (!active) sim.running = false;
}
function fieldLineFrom(x, y){
  const pts = [x, y], sgn = sim.q0 < 0 ? -1 : 1, st = 0.06;
  for (let s = 0; s < 900; s++){
    if (!fdir(x, y, sgn)) break;
    const mx = x + 0.5*st*_ux, my = y + 0.5*st*_uy;
    if (!fdir(mx, my, sgn)) break;
    x += st*_ux; y += st*_uy; pts.push(x, y);
    if (Math.abs(x) > 1.05*L || Math.abs(y) > 1.05*L) break;
    if (nearestDist(x, y) < HIT_R) break;
  }
  return pts;
}
function refreshTests(){
  for (const p of tests){
    for (let k = 0; k < p.trailV.length; k++) p.trailV[k] = potential(p.trail[2*k], p.trail[2*k+1]);
    if (sim.t === 0) p.fl = sim.showFL ? fieldLineFrom(p.x0, p.y0) : null;
  }
}
function statusText(p){ return { ready: 'pronta', moving: 'in moto', out: 'uscita dalla mappa', rest: 'ferma in equilibrio', hit: p.note }[p.status]; }

