/* ================= ciclo di disegno ================= */
let physicsDirty = true, needTop = true, need3D = true, rafPending = false;
function schedule(){ if (!rafPending){ rafPending = true; requestAnimationFrame(frame); } }
function markPhysics(){ physicsDirty = true; schedule(); }
function redraw(){ needTop = need3D = true; schedule(); }
function frame(ts){
  rafPending = false;
  if (physicsDirty){
    fillGrid(gridT, NT); fillGrid(gridS, NS);
    buildContours(); updateHeat();
    if (state.field === 'lines') computeFieldLines();
    refreshTests();
    physicsDirty = false; needTop = need3D = true;
    updateReadout(); updateTestUI();
  }
  if (sim.running){
    const dt = sim.lastTs ? Math.min(0.05, (ts - sim.lastTs)/1000) : 0;
    sim.lastTs = ts;
    if (dt > 0) stepSim(dt*sim.speed);
    needTop = need3D = true; updateTestUI();
  }
  if (basin.active){ basinWork(sim.running ? 14 : 30); needTop = true; }
  if (state.autoRot && state.right === '3d'){ state.cam.az += 0.004; need3D = true; }
  if (needTop) drawTop();
  if (need3D) drawRight();
  needTop = need3D = false;
  if ((state.autoRot && state.right === '3d') || sim.running || basin.active) schedule();
}

