import {DURATION} from './animation.js';
export function audioParams({volume=0,bass=0,treble=0},sensitivity=100,intensity=60){
 const gain=sensitivity/100,amount=intensity/100,limit=v=>Math.max(0,Math.min(1,v*gain));
 return {energy:Math.round(10+limit(volume)*90*amount),breath:50+limit(bass)*35*amount,organic:20+limit(treble)*75*amount,complexity:25+limit(treble)*70*amount};
}
export function captureAnimation(frames){
 if(!frames.length)throw Error('Aucune donnée sonore capturée.');
 const animation={};
 for(const key of ['energy','breath','organic','complexity']){
  const first=frames[0].params[key];
  animation[key]=frames.filter(f=>f.time<DURATION).map(f=>({time:Math.max(0,f.time),value:f.time>9.5?f.params[key]+(first-f.params[key])*(f.time-9.5)/.5:f.params[key],curve:[0,0,1,1]}));
  if(animation[key][0].time!==0)animation[key].unshift({time:0,value:first,curve:[0,0,1,1]});
  animation[key].push({time:DURATION,value:first,curve:[0,0,1,1]});
 }
 return animation;
}
