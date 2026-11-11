export const TRACKS = { energy: 'Vitalité', organic: 'Organicité', complexity: 'Complexité', breath: 'Respiration', driftX: 'Dérive X', driftY: 'Dérive Y', turn: 'Rotation' };
export const DURATION = 10;
export function easing(t, curve = [0.42, 0, 0.58, 1]) {
  const [x1,y1,x2,y2] = curve;
  const cubic = (u,a,b) => 3*(1-u)**2*u*a + 3*(1-u)*u*u*b + u**3;
  let lo=0,hi=1;
  for(let i=0;i<24;i++){const mid=(lo+hi)/2;if(cubic(mid,x1,x2)<t)lo=mid;else hi=mid;}
  return cubic((lo+hi)/2,y1,y2);
}
export function valueAt(keys, time, fallback) {
  if (!keys?.length) return fallback;
  if(time<=keys[0].time)return keys[0].value;
  for(let i=1;i<keys.length;i++){
    const a=keys[i-1],b=keys[i];
    if(time<=b.time)return a.value+(b.value-a.value)*easing((time-a.time)/(b.time-a.time),a.curve);
  }
  return keys.at(-1).value;
}
export function normalizeAnimation(animation={}){
 const end=Math.max(DURATION,...Object.values(animation).flatMap(keys=>keys.map(k=>k.time)));
 const scale=DURATION/end;
 return Object.fromEntries(Object.entries(animation).map(([id,keys])=>[id,keys.map(k=>({...k,time:k.time*scale}))]));
}
export function animatedItem(item,time) {
  const animation=normalizeAnimation(item.animation);
  const params={...item.params};
  for(const key of Object.keys(TRACKS))params[key]=valueAt(animation[key],time,params[key]??50);
  return {...item,params};
}

export const PRESETS=[
 {id:'breathe',name:'Respiration',description:'Les lignes se dilatent puis reviennent au repos.'},
 {id:'drift',name:'Dérive',description:'Un lent mouvement latéral, comme un souffle.'},
 {id:'orbit',name:'Orbite',description:'Le motif décrit une petite ronde.'},
 {id:'swing',name:'Balancement',description:'Une oscillation douce autour du centre.'},
 {id:'ripple',name:'Ondulation',description:'Une vague traverse les contours.'}
];
export function presetAnimation(id,params){
 const keys=(values)=>values.map((value,i)=>({time:i*DURATION/(values.length-1),value,curve:[.42,0,.58,1]}));
 switch(id){
  case 'breathe':return {breath:keys([50,75,50])};
  case 'drift':return {driftX:keys([50,65,50,35,50])};
  case 'orbit':return {driftX:keys([50,65,50,35,50]),driftY:keys([50,65,80,65,50])};
  case 'swing':return {turn:keys([50,60,50,40,50])};
  case 'ripple':return {organic:keys([params.organic??65,95,params.organic??65]),energy:keys([params.energy??40,90,params.energy??40])};
  default:return {};
 }
}
