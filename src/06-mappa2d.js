/* ================= vista dall'alto ================= */
const topCv = $('top'), tctx = topCv.getContext('2d');
let dpr = 1, topW = 0, topH = 0, FS = 1;
const TL = { x0: 0, y0: 0, P: 100 };
function layoutTop(){
  const r = topCv.getBoundingClientRect();
  dpr = window.devicePixelRatio || 1;
  topW = r.width; topH = r.height;
  topCv.width = Math.max(1, Math.round(topW*dpr)); topCv.height = Math.max(1, Math.round(topH*dpr));
  const ml = 44, mr = 88, mt = 30, mb = 36;
  const P = Math.max(60, Math.min(topW - ml - mr, topH - mt - mb));
  TL.P = P; FS = Math.max(1, Math.min(1.5, P/640));
  TL.x0 = ml + Math.max(0, (topW - ml - mr - P)/2);
  TL.y0 = mt + Math.max(0, (topH - mt - mb - P)/2);
}
const toSX = x => TL.x0 + (x + L)/(2*L)*TL.P;
const toSY = y => TL.y0 + (L - y)/(2*L)*TL.P;
const toX = sx => (sx - TL.x0)/TL.P*2*L - L;
const toY = sy => L - (sy - TL.y0)/TL.P*2*L;
const chargeRadius = c => (8 + 2.2*Math.sqrt(Math.abs(c.q)))*Math.min(FS, 1.25);

const heat = document.createElement('canvas'); heat.width = NT; heat.height = NT;
const hctx = heat.getContext('2d'), himg = hctx.createImageData(NT, NT);
function updateHeat(){
  const d = himg.data;
  for (let row = 0; row < NT; row++){
    const j = NT - 1 - row;
    for (let i = 0; i < NT; i++){
      const c = LUT[lutIndex(gridT[j*NT + i])], p = (row*NT + i)*4;
      d[p] = 255 - (255 - c[0])*0.38; d[p+1] = 255 - (255 - c[1])*0.38; d[p+2] = 255 - (255 - c[2])*0.38; d[p+3] = 255;
    }
  }
  hctx.putImageData(himg, 0, 0);
}
function arrowHead(ctx, x, y, ux, uy, s){
  ctx.moveTo(x + ux*s, y + uy*s);
  ctx.lineTo(x - ux*s*0.7 - uy*s*0.6, y - uy*s*0.7 + ux*s*0.6);
  ctx.lineTo(x - ux*s*0.7 + uy*s*0.6, y - uy*s*0.7 - ux*s*0.6);
  ctx.closePath();
}
function haloText(ctx, text, x, y){
  ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(255,255,255,.92)'; ctx.lineJoin = 'round';
  ctx.strokeText(text, x, y); ctx.fillText(text, x, y);
}
function roundBox(ctx, x, y, w, h, r){ ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h); }
function drawArrow(ctx, x1, y1, x2, y2, col, w){
  const dx = x2 - x1, dy = y2 - y1, m = Math.hypot(dx, dy);
  if (m < 3) return;
  const ux = dx/m, uy = dy/m, s = Math.min(8, 3 + m*0.2), ex = x2 - ux*s*1.2, ey = y2 - uy*s*1.2;
  ctx.lineCap = 'round';
  ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = w + 3;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(ex, ey); ctx.stroke();
  ctx.strokeStyle = col; ctx.lineWidth = w;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(ex, ey); ctx.stroke();
  ctx.fillStyle = col; ctx.beginPath(); arrowHead(ctx, x2 - ux*s, y2 - uy*s, ux, uy, s); ctx.fill();
}
function drawBall(ctx, sx, sy, col, sel){
  ctx.beginPath(); ctx.arc(sx, sy, 7.5, 0, 2*Math.PI); ctx.fillStyle = '#fff'; ctx.fill();
  ctx.lineWidth = 2.6; ctx.strokeStyle = col; ctx.stroke();
  if (sim.q0 !== 0){
    ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(sx - 3.5, sy); ctx.lineTo(sx + 3.5, sy);
    if (sim.q0 > 0){ ctx.moveTo(sx, sy - 3.5); ctx.lineTo(sx, sy + 3.5); }
    ctx.stroke();
  }
  if (sel){ ctx.beginPath(); ctx.arc(sx, sy, 12.5, 0, 2*Math.PI); ctx.lineWidth = 1.6; ctx.setLineDash([3,3]); ctx.stroke(); ctx.setLineDash([]); }
}
function handlePos(p){
  const v = Math.hypot(p.vx0, p.vy0);
  return v < 1e-9 ? [p.x0 + 1.4, p.y0] : [p.x0 + p.vx0*VS, p.y0 + p.vy0*VS];
}
function drawTestsBelow(ctx){
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  for (const p of tests){
    if (p.fl && p.fl.length > 2){
      ctx.beginPath(); ctx.moveTo(toSX(p.fl[0]), toSY(p.fl[1]));
      for (let k = 2; k < p.fl.length; k += 2) ctx.lineTo(toSX(p.fl[k]), toSY(p.fl[k+1]));
      ctx.strokeStyle = 'rgba(20,42,76,.8)'; ctx.lineWidth = 1.8; ctx.setLineDash([2,5]); ctx.stroke(); ctx.setLineDash([]);
    }
    if (p.trail.length > 2){
      ctx.beginPath(); ctx.moveTo(toSX(p.trail[0]), toSY(p.trail[1]));
      for (let k = 2; k < p.trail.length; k += 2) ctx.lineTo(toSX(p.trail[k]), toSY(p.trail[k+1]));
      ctx.lineTo(toSX(p.x), toSY(p.y));
      ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 4.5; ctx.stroke();
      ctx.strokeStyle = tcol(p); ctx.lineWidth = p === selTest ? 2.2 : 1.8; ctx.stroke();
    }
  }
}
function drawTestsAbove(ctx){
  if (!tests.length) return;
  const font = FONT(), started = sim.t > 0, ppc = TL.P/(2*L);
  ctx.save(); ctx.beginPath(); ctx.rect(TL.x0 - 12, TL.y0 - 12, TL.P + 24, TL.P + 24); ctx.clip();
  for (const p of tests){
    const col = tcol(p);
    if (started){
      ctx.beginPath(); ctx.arc(toSX(p.x0), toSY(p.y0), 3.5, 0, 2*Math.PI);
      ctx.fillStyle = '#fff'; ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 1.5; ctx.stroke();
      if (sim.showVF && p.status === 'moving'){
        const sx = toSX(p.x), sy = toSY(p.y), len = Math.hypot(p.vx, p.vy)*VS;
        if (len > 0.05){ const f = Math.min(len, 7)/len; drawArrow(ctx, sx, sy, sx + p.vx*VS*f*ppc, sy - p.vy*VS*f*ppc, col, 2.2); }
        elecAccel(p.x, p.y); const a = Math.hypot(_ax, _ay);
        if (a > 1e-6){ const fl = Math.min(5, 0.9*Math.sqrt(a)); drawArrow(ctx, sx, sy, sx + _ax/a*fl*ppc, sy - _ay/a*fl*ppc, FCOL, 2.2); }
      }
    } else {
      const v = Math.hypot(p.vx0, p.vy0), sx = toSX(p.x0), sy = toSY(p.y0);
      if (v > 0) drawArrow(ctx, sx, sy, toSX(p.x0 + p.vx0*VS), toSY(p.y0 + p.vy0*VS), col, 2.2);
      if (p === selTest){
        const [hx, hy] = handlePos(p), hsx = toSX(hx), hsy = toSY(hy);
        ctx.beginPath(); ctx.arc(hsx, hsy, 9, 0, 2*Math.PI); ctx.strokeStyle = col; ctx.lineWidth = 1.6;
        if (v === 0){
          ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.fill(); ctx.setLineDash([3,3]); ctx.stroke(); ctx.setLineDash([]);
          ctx.fillStyle = col; ctx.font = `italic 600 13px ${font}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('v', hsx, hsy);
        } else ctx.stroke();
      }
    }
    drawBall(ctx, toSX(p.x), toSY(p.y), col, p === selTest);
    if (state.labels){
      ctx.fillStyle = col; ctx.font = `600 ${Math.round(12*FS)}px ${font}`; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      haloText(ctx, 'P' + (tests.indexOf(p) + 1), toSX(p.x) + 9, toSY(p.y) + 6);
    }
  }
  ctx.restore();
  if (started && sim.showVF){
    const x = TL.x0 + 10, y = TL.y0 + 10, w = 158, h = 50;
    ctx.fillStyle = 'rgba(255,255,255,.93)'; ctx.strokeStyle = 'rgba(20,42,76,.22)'; ctx.lineWidth = 1;
    roundBox(ctx, x, y, w, h, 6); ctx.fill(); ctx.stroke();
    drawArrow(ctx, x + 10, y + 16, x + 42, y + 16, INK, 2.2);
    drawArrow(ctx, x + 10, y + 34, x + 42, y + 34, FCOL, 2.2);
    ctx.fillStyle = INK; ctx.font = `13px ${font}`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText('velocità', x + 50, y + 16); ctx.fillText('forza elettrica', x + 50, y + 34);
  }
}

function drawTop(){
  const ctx = tctx, P = TL.P, x0 = TL.x0, y0 = TL.y0, font = FONT();
  if (topW < 10) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, topW, topH);
  ctx.fillStyle = '#fff'; ctx.fillRect(x0, y0, P, P);
  const showBasin = basin.data && basin.show;
  if (showBasin){ ctx.imageSmoothingEnabled = false; ctx.drawImage(basin.cv, x0, y0, P, P); ctx.imageSmoothingEnabled = true; }
  else if (state.fill){ ctx.imageSmoothingEnabled = true; ctx.drawImage(heat, x0, y0, P, P); }

  ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(20,42,76,.08)'; ctx.beginPath();
  for (let v = -L; v <= L; v += 1){ const sx = toSX(v), sy = toSY(v); ctx.moveTo(sx, y0); ctx.lineTo(sx, y0+P); ctx.moveTo(x0, sy); ctx.lineTo(x0+P, sy); }
  ctx.stroke();
  ctx.strokeStyle = 'rgba(20,42,76,.3)'; ctx.setLineDash([4,4]); ctx.beginPath();
  ctx.moveTo(toSX(0), y0); ctx.lineTo(toSX(0), y0+P); ctx.moveTo(x0, toSY(0)); ctx.lineTo(x0+P, toSY(0));
  ctx.stroke(); ctx.setLineDash([]);

  ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, P, P); ctx.clip();
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  const g2 = P/(NT-1), step = state.vmax/state.nlev;
  if (showBasin) ctx.globalAlpha = 0.45;
  for (const [k, arr] of contours){
    ctx.beginPath();
    for (let m = 0; m < arr.length; m += 4){ ctx.moveTo(x0 + arr[m]*g2, y0 + P - arr[m+1]*g2); ctx.lineTo(x0 + arr[m+2]*g2, y0 + P - arr[m+3]*g2); }
    ctx.strokeStyle = LUTS[lutIndex(k*step)];
    ctx.lineWidth = (k === 0 && state.hlZero) ? 3 : 1.4;
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  if (state.field === 'lines'){
    ctx.strokeStyle = 'rgba(20,42,76,.62)'; ctx.lineWidth = 1.1; ctx.beginPath();
    for (const fl of fieldLines){ const p = fl.pts; ctx.moveTo(toSX(p[0]), toSY(p[1])); for (let m = 2; m < p.length; m += 2) ctx.lineTo(toSX(p[m]), toSY(p[m+1])); }
    ctx.stroke();
    ctx.fillStyle = 'rgba(20,42,76,.85)'; ctx.beginPath();
    for (const fl of fieldLines){
      const p = fl.pts, npts = p.length/2;
      if (npts < 8) continue;
      let last = npts - 1;
      for (let m = 1; m < npts; m++){ if (Math.abs(p[2*m]) > L || Math.abs(p[2*m+1]) > L){ last = m - 1; break; } }
      const k = Math.max(2, Math.floor(last*0.5));
      if (k + 1 >= npts) continue;
      const ax = toSX(p[2*k]), ay = toSY(p[2*k+1]);
      let ux = toSX(p[2*k+2]) - ax, uy = toSY(p[2*k+3]) - ay; const m = Math.hypot(ux, uy); if (m === 0) continue;
      arrowHead(ctx, ax, ay, ux/m*fl.sgn, uy/m*fl.sgn, 6);
    }
    ctx.fill();
  } else if (state.field === 'vectors' && charges.length){
    const n = 16, cell = 2*L/n, vals = []; let lmin = Infinity, lmax = -Infinity;
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++){
      const x = -L + (i + 0.5)*cell, y = -L + (j + 0.5)*cell;
      if (nearestDist(x, y) < 0.7) continue;
      efieldRaw(x, y); const mag = Math.hypot(_ex, _ey); if (mag === 0) continue;
      const lm = Math.log10(mag); lmin = Math.min(lmin, lm); lmax = Math.max(lmax, lm);
      vals.push([x, y, _ex/mag, _ey/mag, lm]);
    }
    const len = cell/(2*L)*P*0.78;
    for (const [x, y, ux, uy, lm] of vals){
      const t = lmax > lmin ? (lm - lmin)/(lmax - lmin) : 1, sx = toSX(x), sy = toSY(y), dx = ux*len/2, dy = -uy*len/2;
      ctx.strokeStyle = ctx.fillStyle = `rgba(20,42,76,${0.22 + 0.73*t})`; ctx.lineWidth = 1 + 1.2*t;
      ctx.beginPath(); ctx.moveTo(sx - dx, sy - dy); ctx.lineTo(sx + dx*0.55, sy + dy*0.55); ctx.stroke();
      ctx.beginPath(); arrowHead(ctx, sx + dx*0.55, sy + dy*0.55, ux, -uy, 3 + 2*t); ctx.fill();
    }
  }

  const pr = state.probe;
  if (pr && state.hlProbe && charges.length && nearestDist(pr.x, pr.y) > RMIN){
    const arr = singleContour(potential(pr.x, pr.y));
    ctx.beginPath();
    for (let m = 0; m < arr.length; m += 4){ ctx.moveTo(x0 + arr[m]*g2, y0 + P - arr[m+1]*g2); ctx.lineTo(x0 + arr[m+2]*g2, y0 + P - arr[m+3]*g2); }
    ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.setLineDash([7,5]); ctx.stroke(); ctx.setLineDash([]);
  }
  drawTestsBelow(ctx);
  ctx.restore();

  ctx.strokeStyle = INK; ctx.lineWidth = 1.2; ctx.strokeRect(x0, y0, P, P);

  // cariche sorgente
  const showLab = state.labels;
  for (const c of charges){
    const sx = toSX(c.x), sy = toSY(c.y), r = chargeRadius(c);
    ctx.beginPath(); ctx.arc(sx, sy, r + 2, 0, 2*Math.PI); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.beginPath(); ctx.arc(sx, sy, r, 0, 2*Math.PI); ctx.fillStyle = c.q > 0 ? POS : c.q < 0 ? NEG : '#8a93a6'; ctx.fill();
    if (showBasin && basin.keys.length){
      const k = basin.keys.find(a => a.kind === 'q' && charges[a.idx] === c);
      if (k){ ctx.lineWidth = 4; ctx.strokeStyle = k.col; ctx.beginPath(); ctx.arc(sx, sy, r + 4, 0, 2*Math.PI); ctx.stroke(); }
    }
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.beginPath();
    ctx.moveTo(sx - r*0.5, sy); ctx.lineTo(sx + r*0.5, sy);
    if (c.q > 0){ ctx.moveTo(sx, sy - r*0.5); ctx.lineTo(sx, sy + r*0.5); }
    ctx.stroke();
    if (c === selected){ ctx.beginPath(); ctx.arc(sx, sy, r + 6, 0, 2*Math.PI); ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.setLineDash([3,3]); ctx.stroke(); ctx.setLineDash([]); }
    if (showLab && (charges.length <= 8 || c === selected)){
      ctx.fillStyle = INK; ctx.font = `600 ${Math.round(13*FS)}px ${font}`; ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
      haloText(ctx, fmtQ(c.q), sx + r + 4, sy - r + 2);
    }
  }
  drawTestsAbove(ctx);

  if (pr){
    const sx = toSX(pr.x), sy = toSY(pr.y);
    ctx.strokeStyle = INK; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(sx, sy, 5, 0, 2*Math.PI);
    ctx.moveTo(sx - 11, sy); ctx.lineTo(sx - 6, sy); ctx.moveTo(sx + 6, sy); ctx.lineTo(sx + 11, sy);
    ctx.moveTo(sx, sy - 11); ctx.lineTo(sx, sy - 6); ctx.moveTo(sx, sy + 6); ctx.lineTo(sx, sy + 11);
    ctx.stroke();
    if (charges.length){
      const txt = 'V = ' + fmtV(potential(pr.x, pr.y), true) + ' V';
      ctx.font = `600 ${Math.round(14*FS)}px ${font}`;
      const tw = ctx.measureText(txt).width, th = 24*FS;
      let tx = sx + 14, ty = sy + 14;
      if (tx + tw + 10 > x0 + P) tx = sx - 14 - tw - 10;
      if (ty + th > y0 + P) ty = sy - 14 - th;
      ctx.fillStyle = 'rgba(255,255,255,.94)'; ctx.strokeStyle = 'rgba(20,42,76,.25)'; ctx.lineWidth = 1;
      roundBox(ctx, tx, ty, tw + 10, th, 5); ctx.fill(); ctx.stroke();
      ctx.fillStyle = INK; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(txt, tx + 5, ty + th/2 + 0.5);
    }
  }

  // assi
  ctx.font = `${Math.round(12*FS)}px ${font}`; ctx.fillStyle = MUTED;
  const tstep = P > 420 ? 2 : 5;
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  for (let v = -L; v <= L; v += tstep) ctx.fillText(minus(String(v)), toSX(v), y0 + P + 6);
  ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
  for (let v = -L; v <= L; v += tstep) ctx.fillText(minus(String(v)), x0 - 6, toSY(v));
  ctx.fillStyle = INK; ctx.font = `italic ${Math.round(14*FS)}px ${font}`;
  ctx.textAlign = 'right'; ctx.textBaseline = 'top'; ctx.fillText('x (cm)', x0 + P, y0 + P + 20);
  ctx.save(); ctx.translate(x0 - 30, y0); ctx.rotate(-Math.PI/2); ctx.textAlign = 'right'; ctx.textBaseline = 'middle'; ctx.fillText('y (cm)', 0, 0); ctx.restore();

  // barra dei colori
  const bx = x0 + P + 16, bw = 13, steps = 120;
  for (let s = 0; s < steps; s++){ ctx.fillStyle = LUTS[Math.round((1 - s/steps)*(LUTN-1))]; ctx.fillRect(bx, y0 + s*P/steps, bw, P/steps + 1); }
  ctx.strokeStyle = INK; ctx.lineWidth = 1; ctx.strokeRect(bx, y0, bw, P);
  ctx.strokeStyle = 'rgba(20,42,76,.55)'; ctx.beginPath();
  for (let k = -state.nlev; k <= state.nlev; k++){ const yy = y0 + P*(0.5 - 0.5*k/state.nlev); ctx.moveTo(bx + bw, yy); ctx.lineTo(bx + bw + 3, yy); }
  ctx.stroke();
  ctx.fillStyle = MUTED; ctx.font = `${Math.round(12*FS)}px ${font}`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  for (const f of [1, 0.5, 0, -0.5, -1]) ctx.fillText(f === 0 ? '0' : fmtV(f*state.vmax, true), bx + bw + 6, y0 + P*(0.5 - 0.5*f));
  ctx.fillStyle = INK; ctx.font = `italic ${Math.round(14*FS)}px ${font}`; ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
  ctx.fillText('V (V)', bx - 2, y0 - 10);
}

