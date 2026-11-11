import {pointsFor} from './geometry.js';
import {animatedItem,DURATION} from './animation.js';
export const path=line=>line.map(([x,y],i)=>(i?'L':'M')+x.toFixed(2)+' '+y.toFixed(2)).join(' ');
export const LINE_STYLES=[['emboss','Empreinte','Blanc en relief'],['ink','Encre','Trait fin et sombre'],['dotted','Pointillé','Une ligne de petits points']];
export function lineStyle(item,mono=false){
 const style=item.lineStyle||'ink';
 return {stroke:mono?'#111111':style==='emboss'?'#edf4f5':'#34464c',width:item.params.lineWidth??1.5,dash:style==='dotted'?'1 5':undefined,emboss:!mono&&style==='emboss'};
}
export function svgFor(item,animated=false,mono=false){
 const times=animated?[...new Set([...Array.from({length:121},(_,i)=>i/4),...Object.values(item.animation||{}).flatMap(keys=>keys.map(k=>k.time))])].sort((a,b)=>a-b):[];
 const frames=times.map(t=>pointsFor(animatedItem(item,t),t));
 const lines=pointsFor(animatedItem(item,0),0),style=lineStyle(item,mono);
 let s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><defs><filter id="relief" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0.8" dy="1.1" stdDeviation="0.5" flood-color="#405a66" flood-opacity="0.5"/></filter><filter id="paper"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.08"/></feComponentTransfer><feBlend in="SourceGraphic" mode="multiply"/></filter></defs>';
 if(!mono)s+='<rect width="600" height="600" fill="'+item.palette+'"'+(item.paper?' filter="url(#paper)"':'')+'/>';
 s+='<g fill="none" stroke="'+style.stroke+'" stroke-width="'+style.width+'" stroke-linecap="round" stroke-linejoin="round"'+(style.dash?' stroke-dasharray="'+style.dash+'"':'')+(style.emboss?' filter="url(#relief)"':'')+'>';
 lines.forEach((line,i)=>{s+='<path d="'+path(line)+'">';if(animated)s+='<animate attributeName="d" values="'+frames.map(f=>path(f[i])).join(';')+'" keyTimes="'+times.map(t=>t/DURATION).join(';')+'" calcMode="linear" dur="30s" repeatCount="indefinite"/>';s+='</path>';});
 return s+'</g></svg>';
}
