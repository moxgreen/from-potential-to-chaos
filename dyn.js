const ACC=8.9875517923, RMIN=0.15;
function mk(src,q0=1,m=1,damp='none',g=0,vs=1){
  return {src,q0,m,damp,g,vs};
}
function acc(S,x,y,vx,vy){
  let ex=0,ey=0;for(const [cx,cy,q] of S.src){const dx=x-cx,dy=y-cy;let r2=Math.max(dx*dx+dy*dy,RMIN*RMIN);const f=q/(r2*Math.sqrt(r2));ex+=f*dx;ey+=f*dy;}
  let ax=ACC*S.q0/S.m*ex, ay=ACC*S.q0/S.m*ey;
  if(S.damp==='visc'){ax-=S.g*vx;ay-=S.g*vy;}
  if(S.damp==='active'){const k=S.g*(1-(vx*vx+vy*vy)/(S.vs*S.vs));ax+=k*vx;ay+=k*vy;}
  return [ax,ay];
}
function integ(S,st,T,cb){
  let [x,y,vx,vy]=st,t=0;
  while(t<T){
    let d=1e9; for(const [cx,cy] of S.src) d=Math.min(d,Math.hypot(x-cx,y-cy));
    if(d<0.3) return {st:'hit',t,x,y,vx,vy};
    if(Math.abs(x)>30||Math.abs(y)>30) return {st:'out',t,x,y,vx,vy};
    const [ax,ay]=acc(S,x,y,vx,vy),v=Math.hypot(vx,vy),a=Math.hypot(ax,ay);
    let h=Math.min(0.01,0.02*d/(v+1e-9),0.1*Math.sqrt(d/(a+1e-12)));
    const f=(X,Y,VX,VY)=>acc(S,X,Y,VX,VY);
    const k1=[vx,vy,ax,ay];
    let s=f(x+.5*h*k1[0],y+.5*h*k1[1],vx+.5*h*k1[2],vy+.5*h*k1[3]);const k2=[vx+.5*h*k1[2],vy+.5*h*k1[3],s[0],s[1]];
    s=f(x+.5*h*k2[0],y+.5*h*k2[1],vx+.5*h*k2[2],vy+.5*h*k2[3]);const k3=[vx+.5*h*k2[2],vy+.5*h*k2[3],s[0],s[1]];
    s=f(x+h*k3[0],y+h*k3[1],vx+h*k3[2],vy+h*k3[3]);const k4=[vx+h*k3[2],vy+h*k3[3],s[0],s[1]];
    x+=h/6*(k1[0]+2*k2[0]+2*k3[0]+k4[0]);y+=h/6*(k1[1]+2*k2[1]+2*k3[1]+k4[1]);
    vx+=h/6*(k1[2]+2*k2[2]+2*k3[2]+k4[2]);vy+=h/6*(k1[3]+2*k2[3]+2*k3[3]+k4[3]);t+=h;
    if(cb) cb(t,x,y,vx,vy);
  }
  return {st:'ok',t,x,y,vx,vy};
}
// divergenza di due traiettorie vicine
function lyap(S,a,b,T,label){
  const out=[];
  for(const tt of [10,20,40,80,T]){ const r1=integ(S,a,tt), r2=integ(S,b,tt); out.push(`${tt}s:${r1.st==='ok'&&r2.st==='ok'?Math.hypot(r1.x-r2.x,r1.y-r2.y).toExponential(1):r1.st+'/'+r2.st}`); }
  console.log(label, out.join(' '));
}
module.exports={mk,integ,lyap,ACC};
if(require.main===module){
  // 1) due centri (vecchio preset): integrabile?
  const two=mk([[-3,0,-2],[3,0,-2]]);
  lyap(two,[0,2.5,3,0],[0,2.5+1e-6,3,0],150,'2 centri hamilt.');
  // 2) ciclo limite: centro -2, attivo
  const lc=mk([[0,0,-2]],1,1,'active',0.5,1.9);
  for(const s0 of [[2,0,0,2],[8.5,0,0,0.5],[0,-6,3,0]]){ let rs=[]; integ(lc,s0,80,(t,x,y)=>{ if(t>60) rs.push(Math.hypot(x,y)); }); console.log('ciclo limite da',s0,'r in [',Math.min(...rs).toFixed(2),Math.max(...rs).toFixed(2),']'); }
  // 3) particella attiva con 2 e 3 centri
  for (const [g,vs] of [[0.3,2.2],[0.3,2.6],[0.5,2.4],[0.2,3.0]]){
    const S=mk([[-3,0,-2],[3,0,-2]],1,1,'active',g,vs);
    lyap(S,[0,3,vs,0],[0,3+1e-6,vs,0],200,`attiva 2c g=${g} v*=${vs}`);
  }
  const tri=[0,1,2].map(k=>[3.5*Math.cos(Math.PI/2+2*Math.PI*k/3),3.5*Math.sin(Math.PI/2+2*Math.PI*k/3),-1.5]);
  for (const [g,vs] of [[0.3,2.0],[0.3,2.5],[0.5,2.2]]){
    const S=mk(tri,1,1,'active',g,vs);
    lyap(S,[0,0.5,vs,0],[0,0.5+1e-6,vs,0],200,`attiva 3c g=${g} v*=${vs}`);
  }
}
