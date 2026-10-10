/* ================= costanti ================= */
const L = 10;                         // semilato del dominio (cm)
const K = 8.9875517923e9;
const KV = K * 1e-9 / 1e-2;           // V   per (nC / cm)
const KE = K * 1e-9 / 1e-4;           // V/m per (nC / cm²)
const RMIN = 0.15;
const MAX_CHARGES = 20;
const NT = 161, NS = 81;
const ZH = 0.6, ZF = -1.0, ZTOP = 0.72, ZC = (ZF + ZTOP) / 2;
const POS = '#d7301f', NEG = '#2052c9', INK = '#142a4c', MUTED = '#5d6b82';
const $ = id => document.getElementById(id);
const FONT = () => getComputedStyle(document.body).fontFamily;

/* ================= stato ================= */
const state = {
  vmax: 1000, nlev: 10, field: 'none',
  fill: true, hlZero: true, hlProbe: true, labels: true, snap: true, floor: true,
  autoRot: false, tool: 'add', newSign: 1, newMag: 2, probe: null, right: '3d',
  cam: { az: -0.62, el: 0.52, zoom: 1 }
};
const CAM0 = { az: -0.62, el: 0.52, zoom: 1 };
let charges = [], selected = null, nextId = 1;
function addCharge(x, y, q){
  if (charges.length >= MAX_CHARGES){ toast(`Puoi inserire al massimo ${MAX_CHARGES} cariche`); return null; }
  const c = { id: nextId++, x, y, q }; charges.push(c); return c;
}
