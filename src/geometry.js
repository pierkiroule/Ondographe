import {DURATION} from './animation.js';
export const MOTIFS=[['whorl','Tourbillon'],['loop','Boucle'],['double','Double foyer'],['arch','Arche'],['saddle','Selle'],['rosette','Rosace']];
export function motifFor(item){
 const id=item.notes?.[0];
 return MOTIFS.some(([key])=>key===id)?id:({'🌊':'arch','🌱':'loop','🐚':'whorl','🌳':'whorl','💧':'double','🍄':'saddle','🕸️':'rosette'}[id]||'whorl');
}
export function centerFor(item){return [item.params.centerX??300,item.params.centerY??300]}
export function pointsFor(item,t=0){
 const {params:p,seed=1,gestures=[]}=item;
 const motif=motifFor(item),gap=p.spacing??(5+(100-(p.density??50))*.12),hole=p.hollow??35;
 const n=Math.max(4,Math.floor((300-hole)/gap)),P=192,[cx,cy]=centerFor(item);
 const phase=t/DURATION*Math.PI*2,o=(p.organic??65)/100,c=(p.complexity??45)/100,e=(p.energy??40)/100;
 const rotation=Math.sin(seed)*.2,waves=p.waves??3;
 return Array.from({length:n},(_,i)=>Array.from({length:P+1},(_,j)=>{
  const u=j/P,a=u*Math.PI*2,r=hole+gap*(i+1);
  let x,y;
  if(motif==='arch'){
   x=-360+u*720;y=hole+gap*i-90*Math.exp(-x*x/28000)*(1+o*.25*Math.sin(x*.007*waves+phase));
  }else if(motif==='saddle'){
   x=-350+u*700;y=(i-(n-1)/2)*gap*1.6+60*Math.tanh(x/75)*Math.sin(x*waves/400+rotation+.15*Math.sin(phase));
  }else{
   let theta=a,rr=r;
   if(motif==='whorl'){theta=a+.55*Math.log(1+r/25)+rotation;rr=r*(1+.1*o*Math.sin(waves*a+phase));}
   if(motif==='loop'){rr=r*(1+.36*Math.cos(a)+.08*o*Math.sin(waves*a+phase));theta=a+rotation;}
   if(motif==='double'){rr=r*(1+.48*Math.cos(2*a)+.04*o*Math.sin(waves*a));theta=a+rotation;}
   if(motif==='rosette'){rr=r*(1+(.12+c*.16)*Math.cos((waves+2)*a+.25*Math.sin(phase)));theta=a+rotation;}
   x=rr*Math.cos(theta);y=rr*Math.sin(theta)*(motif==='loop'?.72:1);
  }
  const distance=Math.hypot(x,y),influence=Math.exp(-distance*distance/100000);
  x+=e*14*influence*Math.sin(phase)*Math.sin(y*.018+seed);
  y+=e*14*influence*Math.sin(phase)*Math.cos(x*.018+seed);
  x+=cx;y+=cy;
  for(const g of gestures){const dx=x-g.x,dy=y-g.y,w=Math.exp(-(dx*dx+dy*dy)/(g.radius*g.radius));x+=g.dx*w;y+=g.dy*w;}
  const scale=1+((p.breath??50)-50)/150,angle=((p.turn??50)-50)/100*Math.PI;
  const rx=(x-cx)*scale,ry=(y-cy)*scale;
  return [cx+rx*Math.cos(angle)-ry*Math.sin(angle)+((p.driftX??50)-50)*2,cy+rx*Math.sin(angle)+ry*Math.cos(angle)+((p.driftY??50)-50)*2];
 }));
}
