/* ================= colori ================= */
const STOPS = [
  [0.00, 12, 16, 168], [0.16, 30, 80, 236], [0.33, 36, 186, 236], [0.50, 84, 194, 104],
  [0.67, 238, 220, 52], [0.83, 248, 136, 32], [1.00, 184, 22, 22]
];
function cmapRaw(t){
  for (let i = 1; i < STOPS.length; i++){
    if (t <= STOPS[i][0]){
      const a = STOPS[i-1], b = STOPS[i], u = (t - a[0]) / (b[0] - a[0]);
      return [a[1] + (b[1]-a[1])*u, a[2] + (b[2]-a[2])*u, a[3] + (b[3]-a[3])*u];
    }
  }
  return [184, 22, 22];
}
const LUTN = 256, LUT = [], LUTS = [];
for (let n = 0; n < LUTN; n++){ const c = cmapRaw(n/(LUTN-1)); LUT.push(c); LUTS.push(`rgb(${c[0]|0},${c[1]|0},${c[2]|0})`); }
function lutIndex(v){
  let t = 0.5 + 0.5*v/state.vmax;
  if (!(t > 0)) t = 0; if (t > 1) t = 1;
  return Math.round(t*(LUTN-1));
}

/* ================= formattazione ================= */
const NF = [0,1,2].map(d => new Intl.NumberFormat('it-IT', { minimumFractionDigits: d, maximumFractionDigits: d }));
const SIG3 = new Intl.NumberFormat('it-IT', { maximumSignificantDigits: 3 });
const minus = s => s.replace('-', '−');
function fmtV(v, signed){
  const a = Math.abs(v), d = a >= 100 ? 0 : a >= 10 ? 1 : 2;
  let s = minus(NF[d].format(v));
  if (signed && v > 0) s = '+' + s;
  return s;
}
function fmtE(e){
  if (e >= 1e6) return NF[2].format(e/1e6) + ' MV/m';
  if (e >= 1e3) return NF[1].format(e/1e3) + ' kV/m';
  return NF[0].format(e) + ' V/m';
}
function fmtQ(q){ return (q > 0 ? '+' : q < 0 ? '−' : '') + NF[Number.isInteger(q) ? 0 : 1].format(Math.abs(q)) + ' nC'; }
const fmtCm = x => Math.abs(x) < 0.05 ? '0,0' : minus(NF[1].format(x));
const fmtSig = x => Math.abs(x) < 1e-9 ? '0' : minus(SIG3.format(x));
const SUP = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
function fmtSci(x){
  if (Math.abs(x) < 1e-15) return '0';
  const e = Math.floor(Math.log10(Math.abs(x))), m = x/Math.pow(10, e);
  return minus(NF[2].format(m)) + '·10' + String(e).split('').map(ch => SUP[ch]).join('');
}

