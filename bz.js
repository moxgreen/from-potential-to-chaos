const {mk,integ}=require('./dyn.js'); const fs=require('fs');
const r2=v=>Math.round(v*100)/100||0;
const ring=(N,R,q)=>Array.from({length:N},(_,k)=>[r2(R*Math.cos(2*Math.PI*k/N)),r2(R*Math.sin(2*Math.PI*k/N)),q]);
const tri=(r,q)=>[0,1,2].map(k=>[r2(r*Math.cos(Math.PI/2+2*Math.PI*k/3)),r2(r*Math.sin(Math.PI/2+2*Math.PI*k/3)),q]);
const src=[...ring(16,8.5,3),...tri(3,-1)]; const S=mk(src,1,1,'visc',0.2);
function cls(x,y){ for(const [cx,cy] of src) if(Math.hypot(x-cx,y-cy)<0.3) return -1;
  const r=integ(S,[x,y,0,0],200); if(r.st==='out') return -1; if(r.st!=='hit') return 9;
  let k=-1,b=1e9; src.forEach(([cx,cy],n)=>{const d=Math.hypot(r.x-cx,r.y-cy); if(d<b){b=d;k=n;}}); return k-16; }
const [x0,x1,y0,y1,N,name]=process.argv.slice(2).map((v,i)=>i<5?+v:v);
const out=[]; const t0=Date.now();
for(let j=0;j<N;j++) for(let i=0;i<N;i++) out.push(cls(x0+(x1-x0)*(i+.5)/N, y1-(y1-y0)*(j+.5)/N));
fs.writeFileSync(name,JSON.stringify({x0,x1,y0,y1,N,out})); console.log(name,(Date.now()-t0)/1000,'s');
