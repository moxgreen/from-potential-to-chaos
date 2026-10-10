/* ================= grafico di destra: 3D o spazio delle fasi ================= */
const c3cv = $('three'), c3 = c3cv.getContext('2d');
let W3 = 0, H3 = 0;
function layout3D(){
  const r = c3cv.getBoundingClientRect();
  W3 = r.width; H3 = r.height;
  c3cv.width = Math.max(1, Math.round(W3*dpr)); c3cv.height = Math.max(1, Math.round(H3*dpr));
}
const cam = { ca: 1, sa: 0, ce: 1, se: 0, S: 100, cx: 0, cy: 0 };
function setupCam(){
  const c = state.cam;
  cam.ca = Math.cos(c.az); cam.sa = Math.sin(c.az); cam.ce = Math.cos(c.el); cam.se = Math.sin(c.el);
  cam.S = Math.min(W3*0.28, H3*0.27)*c.zoom; cam.cx = W3*0.53; cam.cy = H3*0.5;
}
let _px = 0, _py = 0, _pd = 0;
function proj(X, Y, Z){
  Z -= ZC;
  const x1 = X*cam.ca - Y*cam.sa, y1 = X*cam.sa + Y*cam.ca;
  const up = Z*cam.ce + y1*cam.se, d = y1*cam.ce - Z*cam.se, p = 5/(5 + d);
  _px = cam.cx + cam.S*p*x1; _py = cam.cy - cam.S*p*up; _pd = d;
}
function depthOf(X, Y, Z){ proj(X, Y, Z); return _pd; }
function polyPath(ctx, pts){ ctx.beginPath(); pts.forEach((p, n) => { proj(p[0], p[1], p[2]); n ? ctx.lineTo(_px, _py) : ctx.moveTo(_px, _py); }); ctx.closePath(); }
function seg3(ctx, a, b){ proj(a[0], a[1], a[2]); ctx.moveTo(_px, _py); proj(b[0], b[1], b[2]); ctx.lineTo(_px, _py); }

const NV = NS*NS, NQ = (NS-1)*(NS-1);
const VX = new Float32Array(NV), VY = new Float32Array(NV), VD = new Float32Array(NV), VZ = new Float32Array(NV);
const QD = new Float32Array(NQ), order = Array.from({ length: NQ }, (_, n) => n);
const LIGHT = (() => { const v = [-0.45, -0.35, 0.82], m = Math.hypot(...v); return v.map(a => a/m); })();

function draw3DTrails(ctx, onFloor){
  const vmax = state.vmax;
  for (const p of tests){
    const tr = p.trail, tv = p.trailV;
    if (tv.length < 2) continue;
    ctx.beginPath(); let pen = false;
    for (let k = 0; k < tv.length; k++){
      const x = tr[2*k], y = tr[2*k+1];
      if (Math.abs(x) > L || Math.abs(y) > L){ pen = false; continue; }
      let z = ZF;
      if (!onFloor){ let t = tv[k]/vmax; if (t > 1) t = 1; if (t < -1) t = -1; z = t*ZH + 0.012; }
      proj(x/L, y/L, z); pen ? ctx.lineTo(_px, _py) : ctx.moveTo(_px, _py); pen = true;
    }
    if (onFloor){ ctx.strokeStyle = tcol(p); ctx.globalAlpha = 0.45; ctx.lineWidth = 1.3; ctx.stroke(); ctx.globalAlpha = 1; }
    else { ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 4; ctx.stroke(); ctx.strokeStyle = tcol(p); ctx.lineWidth = 2; ctx.stroke(); }
  }
  if (onFloor) return;
  for (const p of tests){
    if (Math.abs(p.x) > L || Math.abs(p.y) > L) continue;
    let t = potential(p.x, p.y)/vmax; if (t > 1) t = 1; if (t < -1) t = -1;
    proj(p.x/L, p.y/L, t*ZH + 0.012);
    ctx.beginPath(); ctx.arc(_px, _py, 6, 0, 2*Math.PI); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.lineWidth = 2.6; ctx.strokeStyle = tcol(p); ctx.stroke();
  }
}

function draw3D(){
  const ctx = c3;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W3, H3);
  setupCam();
  const font = FONT();
  const bxw = depthOf(1, 0, 0) > depthOf(-1, 0, 0) ? 1 : -1;
  const byw = depthOf(0, 1, 0) > depthOf(0, -1, 0) ? 1 : -1;
  const zt = [-ZH, -ZH/2, 0, ZH/2, ZH];

  ctx.lineWidth = 1;
  polyPath(ctx, [[-1,-1,ZF],[1,-1,ZF],[1,1,ZF],[-1,1,ZF]]); ctx.fillStyle = '#f4f7fb'; ctx.fill(); ctx.strokeStyle = '#c3ccda'; ctx.stroke();
  polyPath(ctx, [[bxw,-1,ZF],[bxw,1,ZF],[bxw,1,ZTOP],[bxw,-1,ZTOP]]); ctx.fillStyle = '#f8fafc'; ctx.fill(); ctx.stroke();
  polyPath(ctx, [[-1,byw,ZF],[1,byw,ZF],[1,byw,ZTOP],[-1,byw,ZTOP]]); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = 'rgba(20,42,76,.09)'; ctx.beginPath();
  for (const t of [-0.5, 0, 0.5]){ seg3(ctx, [t,-1,ZF], [t,1,ZF]); seg3(ctx, [-1,t,ZF], [1,t,ZF]); seg3(ctx, [bxw,t,ZF], [bxw,t,ZTOP]); seg3(ctx, [t,byw,ZF], [t,byw,ZTOP]); }
  for (const z of zt){ seg3(ctx, [bxw,-1,z], [bxw,1,z]); seg3(ctx, [-1,byw,z], [1,byw,z]); }
  ctx.stroke();

  if (state.floor){
    const s = 2/(NT-1), step = state.vmax/state.nlev;
    ctx.lineWidth = 1;
    for (const [k, arr] of contours){
      ctx.beginPath();
      for (let m = 0; m < arr.length; m += 4){
        proj(-1 + arr[m]*s, -1 + arr[m+1]*s, ZF); ctx.moveTo(_px, _py);
        proj(-1 + arr[m+2]*s, -1 + arr[m+3]*s, ZF); ctx.lineTo(_px, _py);
      }
      ctx.strokeStyle = LUTS[lutIndex(k*step)]; ctx.stroke();
    }
  }
  for (const c of charges){
    proj(c.x/L, c.y/L, ZF);
    ctx.beginPath(); ctx.arc(_px, _py, 3.5, 0, 2*Math.PI); ctx.fillStyle = c.q > 0 ? POS : c.q < 0 ? NEG : '#8a93a6'; ctx.fill();
  }
  draw3DTrails(ctx, true);

  const h = 2/(NS-1), vmax = state.vmax;
  for (let j = 0; j < NS; j++) for (let i = 0; i < NS; i++){
    const n = j*NS + i;
    let t = gridS[n]/vmax; if (t > 1) t = 1; if (t < -1) t = -1;
    const z = t*ZH; VZ[n] = z;
    proj(-1 + i*h, -1 + j*h, z); VX[n] = _px; VY[n] = _py; VD[n] = _pd;
  }
  for (let j = 0; j < NS-1; j++) for (let i = 0; i < NS-1; i++){ const n = j*NS + i; QD[j*(NS-1) + i] = VD[n] + VD[n+1] + VD[n+NS] + VD[n+NS+1]; }
  order.sort((a, b) => QD[b] - QD[a]);
  ctx.lineWidth = 0.6; ctx.lineJoin = 'round';
  for (let o = 0; o < NQ; o++){
    const q = order[o], i = q % (NS-1), j = (q - i)/(NS-1);
    const n00 = j*NS + i, n10 = n00 + 1, n01 = n00 + NS, n11 = n01 + 1;
    const vAvg = (gridS[n00] + gridS[n10] + gridS[n01] + gridS[n11])/4;
    const dz1 = VZ[n11] - VZ[n00], dz2 = VZ[n01] - VZ[n10];
    let nx = h*(dz2 - dz1), ny = -h*(dz1 + dz2), nz = 2*h*h;
    const nm = Math.hypot(nx, ny, nz); nx /= nm; ny /= nm; nz /= nm;
    const sh = 0.6 + 0.4*Math.max(0, nx*LIGHT[0] + ny*LIGHT[1] + nz*LIGHT[2]);
    const c = LUT[lutIndex(vAvg)], r = c[0]*sh|0, g = c[1]*sh|0, b = c[2]*sh|0;
    ctx.beginPath(); ctx.moveTo(VX[n00], VY[n00]); ctx.lineTo(VX[n10], VY[n10]); ctx.lineTo(VX[n11], VY[n11]); ctx.lineTo(VX[n01], VY[n01]); ctx.closePath();
    ctx.fillStyle = `rgb(${r},${g},${b})`; ctx.fill();
    ctx.strokeStyle = `rgb(${r*0.86|0},${g*0.86|0},${b*0.86|0})`; ctx.stroke();
  }
  draw3DTrails(ctx, false);

  const pr = state.probe;
  if (pr && charges.length){
    let t = potential(pr.x, pr.y)/vmax; if (t > 1) t = 1; if (t < -1) t = -1;
    const X = pr.x/L, Y = pr.y/L, Z = t*ZH;
    ctx.strokeStyle = INK; ctx.lineWidth = 1.4; ctx.setLineDash([4,4]); ctx.beginPath(); seg3(ctx, [X,Y,ZF], [X,Y,Z]); ctx.stroke(); ctx.setLineDash([]);
    proj(X, Y, ZF); ctx.beginPath(); ctx.arc(_px, _py, 3, 0, 2*Math.PI); ctx.fillStyle = INK; ctx.fill();
    proj(X, Y, Z); ctx.beginPath(); ctx.arc(_px, _py, 5.5, 0, 2*Math.PI); ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = 2.2; ctx.strokeStyle = INK; ctx.stroke();
  }

  ctx.font = `12px ${font}`; ctx.fillStyle = MUTED; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  for (const v of [-10, -5, 0, 5, 10]){
    proj(v/L, -byw*1.13, ZF); ctx.fillText(minus(String(v)), _px, _py);
    proj(-bxw*1.13, v/L, ZF); ctx.fillText(minus(String(v)), _px, _py);
  }
  ctx.font = `italic 14px ${font}`; ctx.fillStyle = INK;
  proj(0, -byw*1.32, ZF); ctx.fillText('x (cm)', _px, _py);
  proj(-bxw*1.32, 0, ZF); ctx.fillText('y (cm)', _px, _py);
  let best = null;
  for (const [cx, cy] of [[-1,-1],[1,-1],[1,1],[-1,1]]){ proj(cx, cy, 0); if (!best || _px < best[2]) best = [cx, cy, _px]; }
  const [zx, zy] = best;
  ctx.strokeStyle = 'rgba(20,42,76,.45)'; ctx.lineWidth = 1; ctx.beginPath(); seg3(ctx, [zx,zy,-ZH], [zx,zy,ZH]); ctx.stroke();
  ctx.font = `12px ${font}`; ctx.fillStyle = MUTED; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
  for (const f of [-1, -0.5, 0, 0.5, 1]){
    proj(zx, zy, f*ZH);
    ctx.beginPath(); ctx.moveTo(_px - 4, _py); ctx.lineTo(_px, _py); ctx.stroke();
    ctx.fillText(f === 0 ? '0' : fmtV(f*vmax, true), _px - 7, _py);
  }
  proj(zx, zy, ZH); ctx.font = `italic 14px ${font}`; ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
  ctx.fillText('V (V)', _px, _py - 10);
}

function drawPhase(){
  const ctx = c3, font = FONT();
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W3, H3);
  const ml = 62, mr = 20, mt = 22, mb = 44;
  const W = Math.max(50, W3 - ml - mr), H = Math.max(50, H3 - mt - mb), x0 = ml, y0 = mt;
  let vm = 0;
  for (const p of tests){ for (const v of p.trailVX) vm = Math.max(vm, Math.abs(v)); vm = Math.max(vm, Math.abs(p.vx)); }
  phaseV = Math.max(phaseV, vm*1.15, 1);
  const X = x => x0 + (x + L)/(2*L)*W, Y = v => y0 + H/2 - v/phaseV*H/2;
  ctx.fillStyle = '#fff'; ctx.fillRect(x0, y0, W, H);
  // griglia
  const vstep = [0.5, 1, 2, 5, 10, 20, 50].find(s => phaseV/s <= 5) || 100;
  ctx.strokeStyle = 'rgba(20,42,76,.08)'; ctx.lineWidth = 1; ctx.beginPath();
  for (let x = -L; x <= L; x += 2){ ctx.moveTo(X(x), y0); ctx.lineTo(X(x), y0 + H); }
  for (let v = -Math.floor(phaseV/vstep)*vstep; v <= phaseV; v += vstep){ ctx.moveTo(x0, Y(v)); ctx.lineTo(x0 + W, Y(v)); }
  ctx.stroke();
  ctx.strokeStyle = 'rgba(20,42,76,.35)'; ctx.setLineDash([4,4]); ctx.beginPath();
  ctx.moveTo(X(0), y0); ctx.lineTo(X(0), y0 + H); ctx.moveTo(x0, Y(0)); ctx.lineTo(x0 + W, Y(0)); ctx.stroke(); ctx.setLineDash([]);
  // traiettorie
  ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, W, H); ctx.clip();
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  for (const p of tests){
    const tr = p.trail, tv = p.trailVX;
    if (tv.length < 2) continue;
    ctx.beginPath(); ctx.moveTo(X(tr[0]), Y(tv[0]));
    for (let k = 1; k < tv.length; k++) ctx.lineTo(X(tr[2*k]), Y(tv[k]));
    ctx.lineTo(X(p.x), Y(p.vx));
    ctx.strokeStyle = tcol(p); ctx.lineWidth = 1.5; ctx.globalAlpha = 0.85; ctx.stroke(); ctx.globalAlpha = 1;
  }
  for (const p of tests){
    ctx.beginPath(); ctx.arc(X(p.x0), Y(p.vx0), 3.5, 0, 2*Math.PI); ctx.fillStyle = '#fff'; ctx.fill(); ctx.strokeStyle = tcol(p); ctx.lineWidth = 1.5; ctx.stroke();
    drawBall(ctx, X(p.x), Y(p.vx), tcol(p), p === selTest);
  }
  ctx.restore();
  ctx.strokeStyle = INK; ctx.lineWidth = 1.2; ctx.strokeRect(x0, y0, W, H);
  ctx.font = `12px ${font}`; ctx.fillStyle = MUTED;
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  for (let x = -L; x <= L; x += (W > 420 ? 2 : 5)) ctx.fillText(minus(String(x)), X(x), y0 + H + 6);
  ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
  for (let v = -Math.floor(phaseV/vstep)*vstep; v <= phaseV; v += vstep) ctx.fillText(minus(NF[vstep < 1 ? 1 : 0].format(v)), x0 - 6, Y(v));
  ctx.fillStyle = INK; ctx.font = `italic 14px ${font}`;
  ctx.textAlign = 'right'; ctx.textBaseline = 'top'; ctx.fillText('x (cm)', x0 + W, y0 + H + 22);
  ctx.save(); ctx.translate(x0 - 44, y0 + H/2); ctx.rotate(-Math.PI/2); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('vₓ (cm/s)', 0, 0); ctx.restore();
  if (!tests.length){
    ctx.fillStyle = MUTED; ctx.font = `15px ${font}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('Aggiungi una carica di prova per vedere', x0 + W/2, y0 + H/2 - 12);
    ctx.fillText('il suo moto nello spazio delle fasi', x0 + W/2, y0 + H/2 + 12);
  }
}
function drawRight(){ if (W3 < 10) return; state.right === 'phase' ? drawPhase() : draw3D(); }

