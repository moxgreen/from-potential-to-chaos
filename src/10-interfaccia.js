/* ================= interfaccia ================= */
const toastEl = $('toast'); let toastT = 0;
function toast(msg){ toastEl.textContent = msg; toastEl.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('show'), 2600); }

function updateReadout(){
  const p = state.probe;
  if (!p){ ['rx','ry','rv','re'].forEach(id => $(id).textContent = '—'); return; }
  $('rx').textContent = fmtCm(p.x) + ' cm'; $('ry').textContent = fmtCm(p.y) + ' cm';
  if (!charges.length){ $('rv').textContent = '0 V'; $('re').textContent = '0 V/m'; return; }
  if (nearestDist(p.x, p.y) < RMIN){ $('rv').textContent = 'molto grande'; $('re').textContent = 'molto grande'; return; }
  $('rv').textContent = fmtV(potential(p.x, p.y), true) + ' V';
  efieldRaw(p.x, p.y); $('re').textContent = fmtE(Math.hypot(_ex, _ey)*KE);
}
// aggancio a 0,5 cm (o 0,1 cm senza griglia); con lo zoom il passo si riduce con la finestra
function snapV(v){ const s = Math.min(state.snap ? 0.5 : 0.1, niceStep(view.h/20)); return Math.round(Math.round(v/s)*s*1e6)/1e6; }
const clampL = v => Math.max(-L, Math.min(L, v));
function select(c){ selected = c; lastSel = 'charge'; syncUI(); redraw(); }
function changed(){ basinClear(); markPhysics(); syncUI(); }

function syncUI(){
  const box = $('chips'); box.innerHTML = '';
  charges.forEach((c, n) => {
    const b = document.createElement('button');
    b.className = 'chip' + (c === selected ? ' sel' : '');
    b.innerHTML = `<i class="dot ${c.q > 0 ? 'p' : c.q < 0 ? 'n' : 'z'}"></i>Q${n+1} <b>${fmtQ(c.q)}</b><span>(${fmtCm(c.x)}; ${fmtCm(c.y)}) cm</span>`;
    b.addEventListener('click', () => select(c));
    box.appendChild(b);
  });
  $('count').textContent = `(${charges.length})`;
  if (!charges.length) box.innerHTML = '<p class="muted" style="margin:4px 0">Nessuna carica. Clicca sulla mappa o scegli una configurazione.</p>';
  const has = !!selected && charges.includes(selected);
  if (!has) selected = null;
  $('selBox').hidden = !has; $('noSel').hidden = has;
  if (has){
    $('selName').textContent = 'Q' + (charges.indexOf(selected) + 1);
    $('qRange').value = selected.q; $('qOut').textContent = fmtQ(selected.q);
    if (document.activeElement !== $('xNum')) $('xNum').value = selected.x;
    if (document.activeElement !== $('yNum')) $('yNum').value = selected.y;
  }
}

/* --- interazione con la mappa --- */
let drag = null, probeDrag = false, tdrag = null;
function eventPos(ev){ const r = topCv.getBoundingClientRect(); return [ev.clientX - r.left, ev.clientY - r.top]; }
function insidePlot(sx, sy){ return sx >= TL.x0 && sx <= TL.x0 + TL.P && sy >= TL.y0 && sy <= TL.y0 + TL.P; }
function chargeAt(sx, sy){
  for (let n = charges.length - 1; n >= 0; n--){ const c = charges[n]; if (Math.hypot(sx - toSX(c.x), sy - toSY(c.y)) <= chargeRadius(c) + 5) return c; }
  return null;
}
function testAt(sx, sy){
  for (let n = tests.length - 1; n >= 0; n--){ const p = tests[n]; if (Math.hypot(sx - toSX(p.x), sy - toSY(p.y)) <= 10) return p; }
  return null;
}
function handleAt(sx, sy){
  if (sim.t > 0 || !selTest) return null;
  const [hx, hy] = handlePos(selTest);
  return Math.hypot(sx - toSX(hx), sy - toSY(hy)) <= 10 ? selTest : null;
}
function setProbe(sx, sy){ state.probe = insidePlot(sx, sy) ? { x: toX(sx), y: toY(sy) } : null; updateReadout(); redraw(); }
function grab(ev){ topCv.setPointerCapture(ev.pointerId); topCv.classList.add('dragging'); }
topCv.addEventListener('pointerdown', ev => {
  const [sx, sy] = eventPos(ev);
  if (state.tool === 'zoom'){
    if (insidePlot(sx, sy)){ zsel = { sx0: sx, sy0: sy, sx1: sx, sy1: sy }; topCv.setPointerCapture(ev.pointerId); }
    return;
  }
  let p = handleAt(sx, sy);
  if (p){ tdrag = { p, mode: 'vel' }; grab(ev); return; }
  p = testAt(sx, sy);
  if (p){ selectTest(p); if (sim.t === 0){ tdrag = { p, mode: 'pos' }; grab(ev); } return; }
  const c = chargeAt(sx, sy);
  if (c){ selected = c; lastSel = 'charge'; drag = c; grab(ev); syncUI(); redraw(); return; }
  if (!insidePlot(sx, sy)) return;
  let x = clampL(snapV(toX(sx))), y = clampL(snapV(toY(sy)));
  if (state.tool === 'test' && chal.list){     // un clic vicino a un anello numerato prende esattamente il punto sfida
    for (const [cx, cy] of chal.list) if (Math.hypot(sx - toSX(cx), sy - toSY(cy)) <= 11){ x = cx; y = cy; break; }
  }
  if (state.tool === 'add'){
    const nc = addCharge(x, y, state.newSign*Math.max(0.5, Math.min(10, state.newMag)));
    if (nc){ selected = nc; lastSel = 'charge'; drag = nc; grab(ev); changed(); }
  } else if (state.tool === 'test'){
    if (state.clickLaunch){ launchTrial(x, y); return; }
    const np = addTest(x, y, 0, 0);
    if (np){ selectTest(np); tdrag = { p: np, mode: 'vel' }; grab(ev); resetSim(); }
  } else { probeDrag = true; topCv.setPointerCapture(ev.pointerId); setProbe(sx, sy); }
});
topCv.addEventListener('pointermove', ev => {
  const [sx, sy] = eventPos(ev);
  if (zsel){ zsel.sx1 = sx; zsel.sy1 = sy; needTop = true; schedule(); return; }
  if (tdrag){
    const p = tdrag.p;
    if (tdrag.mode === 'pos'){
      const nx = clampL(snapV(toX(sx))), ny = clampL(snapV(toY(sy)));
      if (nx !== p.x0 || ny !== p.y0){ p.x0 = nx; p.y0 = ny; resetSim(); }
    } else {
      let vx = (toX(sx) - p.x0)/VS, vy = (toY(sy) - p.y0)/VS;
      if (Math.hypot(vx, vy) < 0.3){ vx = 0; vy = 0; } else { vx = Math.round(vx*10)/10; vy = Math.round(vy*10)/10; }
      if (vx !== p.vx0 || vy !== p.vy0){ setVel(p, vx, vy); resetSim(); }
    }
    return;
  }
  if (drag){
    const nx = clampL(snapV(toX(sx))), ny = clampL(snapV(toY(sy)));
    if (nx !== drag.x || ny !== drag.y){ drag.x = nx; drag.y = ny; changed(); }
    setProbe(sx, sy); return;
  }
  if (probeDrag || ev.pointerType === 'mouse') setProbe(sx, sy);
  topCv.classList.toggle('over-charge', !!(chargeAt(sx, sy) || testAt(sx, sy) || handleAt(sx, sy)));
});
function endDrag(){ drag = null; tdrag = null; probeDrag = false; zsel = null; topCv.classList.remove('dragging'); }
topCv.addEventListener('pointerup', () => {
  if (zsel){
    // riquadro trascinato: si ingrandisce il quadrato che lo contiene; clic semplice: zoom ×2 attorno al punto
    const z = zsel, s = Math.max(Math.abs(z.sx1 - z.sx0), Math.abs(z.sy1 - z.sy0));
    if (s < 8) zoomBy(0.5, toX(z.sx0), toY(z.sy0));
    else setView({ cx: toX((z.sx0 + z.sx1)/2), cy: toY((z.sy0 + z.sy1)/2), h: +(s/TL.P*view.h).toPrecision(2) });
    redraw();
  }
  endDrag();
});
topCv.addEventListener('pointercancel', () => { endDrag(); redraw(); });
topCv.addEventListener('pointerleave', ev => { if (!drag && !tdrag && ev.pointerType === 'mouse'){ state.probe = null; updateReadout(); redraw(); } });
let wheelT = 0;
topCv.addEventListener('wheel', ev => {
  const [sx, sy] = eventPos(ev);
  if (ev.ctrlKey || ev.metaKey || ev.shiftKey || state.tool === 'zoom'){
    // zoom a rotella (o pizzico sul trackpad) attorno al cursore; una serie di scatti conta come un solo passo per «Indietro»
    if (!insidePlot(sx, sy)) return;
    ev.preventDefault();
    const d = ev.deltaY || ev.deltaX; if (!d) return;
    const now = performance.now(), push = now - wheelT > 500; wheelT = now;
    zoomBy(Math.exp(Math.max(-0.4, Math.min(0.4, d*0.002))), toX(sx), toY(sy), push);
    return;
  }
  const c = chargeAt(sx, sy);
  if (!c) return;
  ev.preventDefault();
  const q = Math.max(-10, Math.min(10, Math.round((c.q + (ev.deltaY < 0 ? 0.5 : -0.5))*2)/2));
  if (q !== c.q){ c.q = q; selected = c; lastSel = 'charge'; changed(); }
}, { passive: false });

/* --- interazione col grafico di destra --- */
let rot = null;
c3cv.addEventListener('pointerdown', ev => { if (state.right !== '3d') return; rot = [ev.clientX, ev.clientY]; c3cv.setPointerCapture(ev.pointerId); c3cv.classList.add('dragging'); });
c3cv.addEventListener('pointermove', ev => {
  if (!rot) return;
  const dx = ev.clientX - rot[0], dy = ev.clientY - rot[1]; rot = [ev.clientX, ev.clientY];
  state.cam.az += dx*0.009; state.cam.el = Math.max(0.05, Math.min(Math.PI/2, state.cam.el + dy*0.009));
  need3D = true; schedule();
});
const endRot = () => { rot = null; c3cv.classList.remove('dragging'); };
c3cv.addEventListener('pointerup', endRot);
c3cv.addEventListener('pointercancel', endRot);
c3cv.addEventListener('wheel', ev => {
  if (state.right !== '3d') return;
  ev.preventDefault();
  state.cam.zoom = Math.max(0.5, Math.min(2.6, state.cam.zoom*Math.exp(-ev.deltaY*0.0012)));
  need3D = true; schedule();
}, { passive: false });
c3cv.addEventListener('dblclick', () => { if (state.right === '3d'){ Object.assign(state.cam, CAM0); need3D = true; schedule(); } });
$('camReset').addEventListener('click', () => { Object.assign(state.cam, CAM0); need3D = true; schedule(); });
$('camTop').addEventListener('click', () => { Object.assign(state.cam, { az: 0, el: Math.PI/2 }); need3D = true; schedule(); });
$('camSpin').addEventListener('click', e => {
  state.autoRot = !state.autoRot;
  e.currentTarget.classList.toggle('on', state.autoRot); e.currentTarget.setAttribute('aria-pressed', state.autoRot);
  schedule();
});

/* --- comandi generici --- */
function segmented(id, cb){
  const el = $(id);
  el.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    el.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
    cb(b.dataset.v);
  });
}
function setSeg(id, v){ $(id).querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.v === String(v))); }
function setTool(v){
  state.tool = v; setSeg('toolSeg', v);
  $('toolTest').classList.toggle('on', v === 'test'); $('zoomTool').classList.toggle('on', v === 'zoom');
  topCv.classList.toggle('zooming', v === 'zoom');
}

/* --- zoom della mappa 2D --- */
const viewStack = [];
const sameView = (a, b) => a.cx === b.cx && a.cy === b.cy && a.h === b.h;
const r6 = v => Math.round(v*1e6)/1e6;
function setView(v, push = true){
  if (v.h < HMIN*0.999) toast('Ingrandimento massimo: a scale più piccole il calcolo numerico non è più affidabile');
  const h = r6(Math.max(HMIN, Math.min(L, v.h))), s = niceStep(h/20);     // centro su una griglia (1/20 della finestra): coordinate leggibili
  const c = u => r6(Math.max(-L + h, Math.min(L - h, Math.round(u/s)*s)));
  const nv = { cx: c(v.cx), cy: c(v.cy), h };
  if (sameView(nv, view)) return;
  if (push){ viewStack.push(view); if (viewStack.length > 40) viewStack.shift(); }
  view = nv; state.probe = null;
  markPhysics(); updateZoomUI(); updateBasinUI(); updateReadout();
  if (state.basinFollow && (basin.active || (basin.data && basin.show))) basinFollow();
}
// Con una mappa in vista, dopo uno zoom la mappa si rifà nella nuova finestra (stesse partenze per lato, celle più piccole).
// Si aspetta che lo zoom si fermi (rotella), e si riusa una mappa già calcolata se c'è.
let followT = 0;
function basinFollow(){
  clearTimeout(followT);
  followT = setTimeout(() => { if (!(basin.data && sameView(basin.win, view)) && !basinRestore(view)) basinStart(); }, 350);
}
// ingrandimento di un fattore f (< 1 ingrandisce) tenendo fermo il punto (x, y)
function zoomBy(f, x, y, push = true){ setView({ cx: x + (view.cx - x)*f, cy: y + (view.cy - y)*f, h: view.h*f }, push); }
function zoomBack(){ if (viewStack.length) setView(viewStack.pop(), false); }
function resetView(){ viewStack.length = 0; if (!sameView(view, VIEW0)){ view = { ...VIEW0 }; markPhysics(); } updateZoomUI(); }
function fmtWin(w){
  const d = Math.max(1, Math.ceil(-Math.log10(w.h)) + 2), f = v => minus(String(+v.toFixed(d)).replace('.', ','));
  return `x ∈ [${f(w.cx - w.h)}; ${f(w.cx + w.h)}], y ∈ [${f(w.cy - w.h)}; ${f(w.cy + w.h)}] cm`;
}
function updateZoomUI(){
  const full = sameView(view, VIEW0);
  $('zoomStatus').textContent = full ? 'Si vede tutta la mappa.' : `Finestra: ${fmtWin(view)} · zoom ×${SIG3.format(L/view.h)}`;
  $('zoomBack').disabled = !viewStack.length; $('zoomAll').disabled = full; $('zoomOut').disabled = full;
  $('zoomIn').disabled = view.h <= HMIN;
  $('zoomCalc').textContent = sameView(view, VIEW0) ? 'Calcola la mappa' : 'Calcola la mappa qui';
}
$('zoomTool').addEventListener('click', () => setTool(state.tool === 'zoom' ? 'test' : 'zoom'));
$('zoomIn').addEventListener('click', () => zoomBy(0.5, view.cx, view.cy));
$('zoomOut').addEventListener('click', () => zoomBy(2, view.cx, view.cy));
$('zoomBack').addEventListener('click', zoomBack);
$('zoomAll').addEventListener('click', () => setView(VIEW0));
$('zoomCalc').addEventListener('click', () => { if (!basinRestore(view)) basinStart(); });
$('optFollow').addEventListener('change', e => { state.basinFollow = e.target.checked; });
function setRight(v){
  state.right = v; setSeg('rightSeg', v);
  $('camTools').hidden = v !== '3d';
  $('rightTitle').textContent = v === '3d' ? 'Superficie del potenziale in 3D' : 'Spazio delle fasi (x, vₓ)';
  $('rightFoot').innerHTML = v === '3d'
    ? '<span>Trascina per ruotare, rotella per lo zoom. Oltre ±V<sub>max</sub> la superficie è troncata.</span>'
    : '<span>Ogni punto del grafico è uno stato della carica di prova: posizione <i>x</i> e velocità <i>v<sub>x</sub></i>. Il cerchietto vuoto è lo stato iniziale.</span>';
  $('layout3dBtn').textContent = v === '3d' ? 'Solo 3D' : 'Solo fasi';
  c3cv.classList.toggle('rotatable', v === '3d');
  need3D = true; schedule();
  if (v === '3d' && state.autoRot) schedule();
}
function setScale(vmax, nlev){
  state.vmax = vmax; state.nlev = nlev;
  $('vmax').value = Math.round(50*Math.log10(vmax/100)); $('nlev').value = nlev;
  syncScale(); markPhysics();
}

/* --- editor della carica selezionata --- */
$('qRange').addEventListener('input', e => { if (selected){ selected.q = parseFloat(e.target.value); changed(); } });
$('flip').addEventListener('click', () => { if (selected){ selected.q = -selected.q; changed(); } });
$('del').addEventListener('click', deleteSelected);
function deleteSelected(){ if (!selected) return; charges = charges.filter(c => c !== selected); selected = null; changed(); }
for (const [id, key] of [['xNum','x'], ['yNum','y']]){
  $(id).addEventListener('input', e => { const v = parseFloat(String(e.target.value).replace(',', '.')); if (selected && isFinite(v)){ selected[key] = clampL(v); changed(); } });
}
segmented('toolSeg', v => setTool(v));
segmented('signSeg', v => { state.newSign = parseInt(v, 10); });
segmented('fieldSeg', v => { state.field = v; markPhysics(); });
segmented('rightSeg', v => setRight(v));
$('newMag').addEventListener('input', e => { const v = parseFloat(e.target.value); if (isFinite(v)) state.newMag = v; });

/* --- scala e opzioni --- */
const vmaxFromSlider = p => { const raw = 100*Math.pow(10, p/50); const e = Math.pow(10, Math.floor(Math.log10(raw)) - 1); return Math.round(raw/e)*e; };
function syncScale(){
  $('vmaxOut').textContent = '±' + NF[0].format(state.vmax) + ' V';
  $('nlevOut').textContent = state.nlev;
  $('dvOut').textContent = fmtV(state.vmax/state.nlev) + ' V';
}
$('vmax').addEventListener('input', e => { state.vmax = vmaxFromSlider(+e.target.value); syncScale(); markPhysics(); });
$('nlev').addEventListener('input', e => { state.nlev = +e.target.value; syncScale(); markPhysics(); });
for (const [id, key] of Object.entries({ optFill: 'fill', optZero: 'hlZero', optProbe: 'hlProbe', optLabels: 'labels', optSnap: 'snap', optFloor: 'floor' })){
  $(id).addEventListener('change', e => { state[key] = e.target.checked; redraw(); });
}

/* --- configurazioni (scheda 1) --- */
function loadPreset(name){
  charges = []; selected = null;
  resetView(); chal.list = null; chal.cur = chal.reached = -1; renderChallenges();
  for (const [x, y, q] of PRESETS[name]) addCharge(x, y, q);
  if (state.vmax > 3000) setScale(1000, 10);
  changed();
}
$('presets').addEventListener('click', e => { const b = e.target.closest('button'); if (b) loadPreset(b.dataset.p); });
$('clearAll').addEventListener('click', () => { charges = []; selected = null; changed(); });

/* --- simulazione --- */
const anyActive = () => tests.some(p => p.status === 'ready' || p.status === 'moving');
function selectTest(p){ selTest = p; lastSel = 'test'; updateTestUI(); redraw(); }
function deleteTest(p){ tests = tests.filter(q => q !== p); if (selTest === p) selTest = null; resetSim(); }
// Lancio con un clic (prove sui bacini): la carica parte da ferma senza azzerare le altre in moto.
// Delle prove finite resta solo l'ultima (per confrontare due partenze vicine) e il punto colorato.
function launchTrial(x, y){
  if (nearestDist(x, y) < HIT_R){ toast('Troppo vicino a una carica: scegli un altro punto'); return; }
  const done = tests.filter(p => p.status !== 'ready' && p.status !== 'moving');
  tests = tests.filter(p => p.status === 'ready' || p.status === 'moving' || p === done[done.length - 1]);
  if (!anyActive()){ sim.t = 0; phaseV = 1; }
  const p = addTest(x, y, 0, 0); if (!p) return;
  selTest = p; lastSel = 'test';
  sim.running = true; sim.lastTs = 0; updateTestUI(); redraw(); schedule();
}
function startSim(){
  if (!tests.length){ setTool('test'); toast('Clicca sulla mappa per posizionare una carica di prova'); return; }
  if (!anyActive()) resetSim();
  sim.running = true; sim.lastTs = 0; updateTestUI(); schedule();
}
function setIfIdle(id, v){ if (document.activeElement !== $(id)) $(id).value = v; }
function updateTestUI(){
  $('simTime').textContent = NF[1].format(sim.t) + ' s';
  $('simPlay').textContent = sim.running ? 'Pausa' : (sim.t > 0 && anyActive() ? 'Riprendi' : 'Avvia');
  if (selTest && !tests.includes(selTest)) selTest = null;
  const p = selTest;
  $('testBox').hidden = !p; $('noTest').hidden = !!p;
  if (!p) return;
  $('testName').textContent = 'P' + (tests.indexOf(p) + 1); $('testName').style.color = tcol(p);
  $('testStatus').textContent = statusText(p);
  setIfIdle('tx', p.x0); setIfIdle('ty', p.y0);
  const v0 = Math.hypot(p.vx0, p.vy0);
  setIfIdle('tv', Math.round(v0*100)/100); setIfIdle('ta', Math.round(p.ang));
  $('p0Out').textContent = fmtSci(sim.m*v0*1e-5) + ' kg·m/s';
  const v = Math.hypot(p.vx, p.vy), Kj = 0.05*sim.m*v*v, U = sim.q0*potential(p.x, p.y)*1e-3;
  $('eV').textContent = fmtSig(v) + ' cm/s'; $('eK').textContent = fmtSig(Kj) + ' µJ';
  $('eU').textContent = fmtSig(U) + ' µJ'; $('eE').textContent = fmtSig(Kj + U) + ' µJ';
}
$('toolTest').addEventListener('click', () => setTool('test'));
$('simPlay').addEventListener('click', () => { if (sim.running){ sim.running = false; updateTestUI(); } else startSim(); });
$('simReset').addEventListener('click', resetSim);
$('simClear').addEventListener('click', () => { tests = []; selTest = null; resetSim(); });
$('testDel').addEventListener('click', () => { if (selTest) deleteTest(selTest); });
$('q0').addEventListener('input', e => { const v = parseFloat(e.target.value); if (isFinite(v)){ sim.q0 = Math.max(-5, Math.min(5, v)); basinClear(); resetSim(); } });
$('mass').addEventListener('input', e => { const v = parseFloat(e.target.value); if (isFinite(v) && v > 0){ sim.m = Math.min(20, v); basinClear(); resetSim(); } });
for (const [id, key] of [['tx','x0'], ['ty','y0']]){
  $(id).addEventListener('input', e => { const v = parseFloat(e.target.value); if (selTest && isFinite(v)){ selTest[key] = clampL(v); resetSim(); } });
}
$('tv').addEventListener('input', e => { const v = parseFloat(e.target.value); if (selTest && isFinite(v) && v >= 0){ setPolar(selTest, Math.min(60, v), selTest.ang); resetSim(); } });
$('ta').addEventListener('input', e => { const a = parseFloat(e.target.value); if (selTest && isFinite(a)){ setPolar(selTest, Math.hypot(selTest.vx0, selTest.vy0), a); resetSim(); } });
segmented('speedSeg', v => { sim.speed = parseFloat(v); });
$('optVF').addEventListener('change', e => { sim.showVF = e.target.checked; redraw(); });
$('optFL').addEventListener('change', e => { sim.showFL = e.target.checked; tests.forEach(p => { p.fl = sim.showFL ? fieldLineFrom(p.x0, p.y0) : null; }); redraw(); });

/* --- attrito (scheda 3) --- */
const DAMP_HELP = {
  none: 'Nessuna forza oltre a quella elettrica: l\'energia totale K + U si conserva.',
  visc: 'Forza F = −mγv, opposta alla velocità, come la resistenza di un fluido: la carica perde energia.',
  active: 'Forza F = mγ(1 − v²/v*²)v: spinge la carica quando è più lenta di v* e la frena quando è più veloce. È un «motore» che fornisce e toglie energia, come nell\'oscillatore di van der Pol.'
};
function setDamp(mode, gamma, vstar){
  sim.damp = mode;
  if (gamma != null) sim.gamma = gamma;
  if (vstar != null) sim.vstar = vstar;
  setSeg('dampSeg', mode);
  $('gamma').value = sim.gamma; $('vstar').value = sim.vstar;
  $('gOut').textContent = NF[2].format(sim.gamma) + ' s⁻¹';
  $('vsOut').textContent = NF[1].format(sim.vstar) + ' cm/s';
  $('gammaBox').hidden = mode === 'none'; $('vstarBox').hidden = mode !== 'active';
  $('dampHelp').textContent = DAMP_HELP[mode];
  const badge = $('dampBadge');
  badge.hidden = mode === 'none';
  badge.textContent = mode === 'visc' ? `Attrito viscoso · γ = ${NF[2].format(sim.gamma)} s⁻¹`
    : `Attrito attivo · γ = ${NF[2].format(sim.gamma)} s⁻¹ · v* = ${NF[1].format(sim.vstar)} cm/s`;
  $('energyNote').hidden = mode === 'none';
  $('energyNote').textContent = mode === 'visc' ? 'Con l\'attrito viscoso l\'energia totale diminuisce.' : 'Con l\'attrito attivo l\'energia totale non si conserva.';
  basinClear();
}
segmented('dampSeg', v => { setDamp(v); resetSim(); });
$('gamma').addEventListener('input', e => { setDamp(sim.damp, parseFloat(e.target.value)); resetSim(); });
$('vstar').addEventListener('input', e => { setDamp(sim.damp, null, parseFloat(e.target.value)); resetSim(); });

/* --- bacini: interfaccia --- */
const fmtPt = v => Number.isInteger(Math.round(v*1e6)/1e5) ? fmtCm(v) : minus(String(+v.toFixed(3)).replace('.', ','));   // più cifre solo se servono (zoom)
const at = (x, y) => `(${fmtPt(x)}; ${fmtPt(y)})`;
function outcomeText(a){
  if (a.kind === 'q') return `finisce su ${a.letter}, ${placeName(a.x, a.y)}`;
  return Math.hypot(a.x, a.y) < 0.5 ? 'resta ferma al centro (equilibrio)' : `si ferma in ${at(a.x, a.y)} (equilibrio)`;
}
function trialDone(p, k){
  const a = attractors[k];
  $('trialStatus').innerHTML = `<span class="sw" style="background:${a.col}"></span>Partenza da ${at(p.x0, p.y0)}: ${outcomeText(a)}.`;
  updateBasinUI(); needTop = true;
}
function updateBasinUI(){
  const N = basin.N, done = basin.data && !basin.active, bw = basin.win;
  $('basinBar').style.width = basin.data ? Math.round(basin.row/N*100) + '%' : '0%';
  const here = !sameView(view, VIEW0) && !(basin.data && sameView(bw, view));
  $('basinGo').textContent = basin.active ? 'Calcolo in corso…' : here ? 'Calcola la mappa qui' : basin.data ? 'Ricalcola' : 'Calcola la mappa';
  const where = sameView(bw, VIEW0) ? '' : ` in ${fmtWin(bw)} (cella di ${SIG3.format(2*bw.h/N*10)} mm)`;
  $('basinStatus').textContent = basin.active ? `Calcolo: ${Math.round(basin.row/N*100)}% (${N}×${N} partenze da ferma${where})`
    : done ? `Fatto: ${N}×${N} partenze da ferma${where}.` + (sameView(bw, view) ? '' : ' Con lo zoom attuale si vede solo una parte della mappa, o niente.')
    : 'Vale per le cariche e l\'attrito attuali; serve l\'attrito viscoso.';
  if (!marks.length) $('trialStatus').textContent = '';
  // legenda unica per prove e mappa: le cariche attrattive A, B, C… (anche prima di ogni prova) e gli equilibri trovati
  const leg = $('basinLegend'); leg.innerHTML = '';
  const tot = basin.n.reduce((s, v) => s + (v || 0), 0) + basin.undecided, ranks = attractorRanks() || [];
  const pct = k => {
    const n = k >= 0 && basin.data && tot ? basin.n[k] || 0 : 0;
    return n ? ` · ${n/tot < 0.01 ? 'meno dell\'1' : Math.round(n/tot*100)}% della mappa` : '';
  };
  const row = (col, txt) => { const d = document.createElement('div'); d.innerHTML = `<span class="sw" style="background:${col}"></span>${txt}`; leg.appendChild(d); };
  ranks.forEach((ci, r) => {
    const c = charges[ci], k = attractors.findIndex(a => a.kind === 'q' && a.idx === ci);
    row(candColor(r), `<b>${LETTERS[r]}</b> · Q${ci + 1} (${fmtQ(c.q)}), ${placeName(c.x, c.y)} ${at(c.x, c.y)}${pct(k)}`);
  });
  attractors.forEach((a, k) => {
    if (a.kind === 'q' && ranks.includes(a.idx)) return;
    row(a.col, `<b>${a.letter}</b> · ${a.kind === 'q' ? `Q${a.idx + 1} ${at(a.x, a.y)}` : `equilibrio in ${at(a.x, a.y)}`}${pct(k)}`);
  });
  if (basin.data && basin.undecided) row('#464a54', `non si ferma entro 200 s · ${Math.max(1, Math.round(basin.undecided/tot*100))}% della mappa`);
  renderChallenges();
}

/* --- punti sfida (scommessa) --- */
let chalSig = '';
function renderChallenges(){
  const res = chal.list ? chal.list.map(([x, y]) => { const m = markAt(x, y); return m && attractors[m.k] ? m.k : -1; }) : [];
  const sig = JSON.stringify([chal.list, chal.cur, res, attractors.map(a => a.col)]);
  if (sig === chalSig) return;             // si ricostruisce solo se cambia qualcosa (updateBasinUI gira a ogni fotogramma del calcolo)
  chalSig = sig;
  $('chalBox').hidden = !chal.list;
  const ol = $('chalList'); ol.innerHTML = '';
  if (!chal.list) return;
  chal.list.forEach(([x, y], n) => {
    const li = document.createElement('li'), a = res[n] >= 0 ? attractors[res[n]] : null;
    li.dataset.n = n; if (n === chal.cur) li.className = 'cur';
    li.innerHTML = `<span class="pt"><b>${n + 1}</b> · ${at(x, y)}</span>`
      + `<button class="btn sm" data-a="show">Evidenzia</button><button class="btn sm" data-a="go">Mettila per me</button>`
      + `<span class="res">${a ? `<span class="sw" style="background:${a.col}"></span>${outcomeText(a)}` : ''}</span>`;
    ol.appendChild(li);
  });
}
$('chalList').addEventListener('click', e => {
  const b = e.target.closest('button'), li = e.target.closest('li'); if (!b || !li) return;
  const n = +li.dataset.n, [x, y] = chal.list[n];
  chal.cur = n; chal.reached = Math.max(chal.reached, n);
  if (b.dataset.a === 'show'){
    setTool('test');
    if (view.h < L && (Math.abs(x - view.cx) > view.h || Math.abs(y - view.cy) > view.h)) resetView();
    toast(`Punto ${n + 1}: ${at(x, y)}. Su quale carica andrà a finire?`);
  } else launchTrial(x, y);
  renderChallenges(); redraw();
});
$('optLaunch').addEventListener('change', e => { state.clickLaunch = e.target.checked; if (state.clickLaunch) setTool('test'); });
$('marksClear').addEventListener('click', () => { marks = []; updateBasinUI(); redraw(); });
$('basinGo').addEventListener('click', () => { if (!basin.active) basinStart(); });
segmented('basinRes', v => { basin.N = parseInt(v, 10); if (basin.data) basinStart(); });
$('optBasin').addEventListener('change', e => { basin.show = e.target.checked; redraw(); });

/* --- scenari (schede 2 e 3) --- */
function loadScenario(name){
  const S = SCENARI[name];
  charges = []; selected = null;
  for (const [x, y, q] of S.src) addCharge(x, y, q);
  sim.q0 = 1; sim.m = 1; $('q0').value = 1; $('mass').value = 1;
  setDamp(S.damp || 'none', S.gamma, S.vstar);
  sim.speed = S.speed; setSeg('speedSeg', S.speed);
  sim.showFL = !!S.fl; $('optFL').checked = sim.showFL;
  const [vm, nl] = S.scale || [1000, 10];
  if (state.vmax !== vm || state.nlev !== nl) setScale(vm, nl);
  if (S.right) setRight(S.right);
  setTool('test');
  resetView();
  state.clickLaunch = !!S.clickLaunch; $('optLaunch').checked = state.clickLaunch;
  chal.list = S.challenges || null; chal.cur = chal.reached = -1;
  tests = [];
  for (const [x, y, vx, vy] of S.tests) addTest(x, y, vx, vy);
  selTest = tests[0] || null; lastSel = 'test';
  changed(); resetSim();
  if (tests.length) startSim(); else if (S.clickLaunch) toast('Clicca sulla mappa: la carica parte da ferma');
  updateBasinUI();
}
$('tpresets2').addEventListener('click', e => { const b = e.target.closest('button'); if (b){ setRight('3d'); loadScenario(b.dataset.t); } });
document.querySelectorAll('#tab3 .try').forEach(b => b.addEventListener('click', () => loadScenario(b.dataset.s)));
$('showPhase').addEventListener('click', () => setRight('phase'));

/* --- schede --- */
document.querySelectorAll('.tabs button').forEach(b => b.addEventListener('click', () => {
  const n = b.dataset.tab;
  document.querySelectorAll('.tabs button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); });
  ['1','2','3'].forEach(k => { $('tab' + k).hidden = k !== n; });
  document.querySelector('.side').scrollTop = 0;
}));

/* --- disposizione e schermo intero --- */
const stageArea = $('stageArea');
segmented('layoutSeg', v => {
  stageArea.classList.toggle('only-2d', v === '2d');
  stageArea.classList.toggle('only-3d', v === '3d');
});
const fsElement = () => document.fullscreenElement || document.webkitFullscreenElement;
const isFs = () => fsElement() === stageArea || stageArea.classList.contains('pseudo-fs');
function fsChanged(){ $('fsBtn').textContent = isFs() ? '✕ Esci da schermo intero' : '⛶ Schermo intero'; }
function toggleFs(){
  if (isFs()){
    if (stageArea.classList.contains('pseudo-fs')){ stageArea.classList.remove('pseudo-fs'); fsChanged(); }
    else (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    return;
  }
  const req = stageArea.requestFullscreen || stageArea.webkitRequestFullscreen;
  const fallback = () => { if (!isFs()){ stageArea.classList.add('pseudo-fs'); fsChanged(); } };
  try {
    const r = req ? req.call(stageArea) : null;
    if (r && r.catch) r.catch(fallback);
    setTimeout(fallback, 400);
  } catch (e){ fallback(); }
}
$('fsBtn').addEventListener('click', toggleFs);
document.addEventListener('fullscreenchange', fsChanged);
document.addEventListener('webkitfullscreenchange', fsChanged);

/* --- tastiera --- */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && stageArea.classList.contains('pseudo-fs')){ stageArea.classList.remove('pseudo-fs'); fsChanged(); return; }
  if (e.key === 'Escape' && !e.target.matches('input, textarea')){ if (zsel){ zsel = null; redraw(); } else zoomBack(); return; }
  if (e.target.matches('input, textarea, button')) return;
  if (e.key === ' '){ e.preventDefault(); $('simPlay').click(); return; }
  if (e.key === 'f' || e.key === 'F'){ toggleFs(); return; }
  if (e.key === 'Delete' || e.key === 'Backspace'){
    if (lastSel === 'test' && selTest){ e.preventDefault(); deleteTest(selTest); }
    else if (selected){ e.preventDefault(); deleteSelected(); }
    return;
  }
  if (!selected) return;
  const d = e.shiftKey ? 1 : 0.1;
  const mv = { ArrowLeft: [-d, 0], ArrowRight: [d, 0], ArrowUp: [0, d], ArrowDown: [0, -d] }[e.key];
  if (mv){
    e.preventDefault();
    selected.x = clampL(Math.round((selected.x + mv[0])*10)/10);
    selected.y = clampL(Math.round((selected.y + mv[1])*10)/10);
    changed();
  }
});

/* --- avvio --- */
function relayout(){ layoutTop(); layout3D(); redraw(); }
new ResizeObserver(relayout).observe($('topStage'));
new ResizeObserver(relayout).observe($('threeStage'));
$('vmax').value = Math.round(50*Math.log10(state.vmax/100)); $('nlev').value = state.nlev;
syncScale(); setDamp('none'); setRight('3d');
loadPreset('dipolo');
updateTestUI(); updateBasinUI(); updateZoomUI();
relayout();
