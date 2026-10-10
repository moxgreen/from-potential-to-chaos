const {mk,integ}=require('./dyn.js');
const r2=v=>Math.round(v*100)/100||0;
const ring=(N,R,q)=>Array.from({length:N},(_,k)=>[r2(R*Math.cos(2*Math.PI*k/N)),r2(R*Math.sin(2*Math.PI*k/N)),q]);
const tri=(r,q)=>[0,1,2].map(k=>[r2(r*Math.cos(Math.PI/2+2*Math.PI*k/3)),r2(r*Math.sin(Math.PI/2+2*Math.PI*k/3)),q]);
const S=mk([...ring(16,8.5,3),...tri(2.2,1.5)]);
function run(a,d,T,dt){ let A=a.slice(),B=[a[0]+d[0],a[1]+d[1],a[2],a[3]]; const out=[]; for(let t=0;t<=T+1e-9;t+=dt){ out.push(Math.hypot(A[0]-B[0],A[1]-B[1])); const r1=integ(S,A,dt), r2=integ(S,B,dt); A=[r1.x,r1.y,r1.vx,r1.vy]; B=[r2.x,r2.y,r2.vx,r2.vy]; } return out; }
const d0=1e-6, dirs=[0,1,2,3,4,5].map(k=>[d0*Math.cos(k*Math.PI/6),d0*Math.sin(k*Math.PI/6)]);
const ch=dirs.map(d=>run([0.3,-5.5,3.5,0.4],d,120,0.5));
const rg=dirs.map(d=>run([0.3,-5.5,3.0,0.4],d,120,0.5));
require('fs').writeFileSync('sep2.json',JSON.stringify({ch,rg,dt:0.5}));
const gm=a=>Math.exp(a.reduce((s,v)=>s+Math.log(v),0)/a.length);
for(const t of [0,20,40,60,80,100,120]){ const i=t*2; console.log(t,'caos',gm(ch.map(r=>r[i])).toExponential(1),'reg',gm(rg.map(r=>r[i])).toExponential(1)); }
