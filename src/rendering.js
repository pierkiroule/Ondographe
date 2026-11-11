import {pageFor,motifTransform} from './page.js';
import {lineAppearance} from './appearance.js';
import {pointsFor} from './geometry.js';
import {animatedItem,DURATION,normalizeAnimation} from './animation.js';
export const path=line=>line.map(([x,y],i)=>(i?'L':'M')+x.toFixed(2)+' '+y.toFixed(2)).join(' ');
export const LINE_STYLES=[['emboss','Empreinte','Blanc en relief'],['ink','Encre','Trait fin et sombre'],['dotted','Pointillé','Une ligne de petits points']];
export function lineStyle(item,mono=false){
 const style=item.lineStyle||'ink';
 return {stroke:mono?'#111111':style==='emboss'?'#edf4f5':'#34464c',width:item.params.lineWidth??1.5,dash:style==='dotted'?'1 5':undefined,emboss:!mono&&style==='emboss'};
}
export function svgFor(item,animated=false,mono=false){
 const times=animated?[...new Set([...Array.from({length:81},(_,i)=>i*DURATION/80),...Object.values(normalizeAnimation(item.animation)).flatMap(keys=>keys.map(k=>k.time))])].sort((a,b)=>a-b):[];
 const frames=times.map(t=>pointsFor(animatedItem(item,t),t));
 const lines=pointsFor(animatedItem(item,0),0),style=lineStyle(item,mono),page=pageFor(item);
 let s='<svg xmlns="http://www.w3.org/2000/svg" width="'+page.width+page.unit+'" height="'+page.height+page.unit+'" viewBox="0 0 '+page.w+' '+page.h+'"><defs><filter id="relief" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0.8" dy="1.1" stdDeviation="0.5" flood-color="#405a66" flood-opacity="0.5"/></filter><filter id="paper"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.08"/></feComponentTransfer><feBlend in="SourceGraphic" mode="multiply"/></filter></defs>';
 if(!mono)s+='<rect width="'+page.w+'" height="'+page.h+'" fill="'+item.palette+'"'+(item.paper?' filter="url(#paper)"':'')+'/>';
 s+='<g transform="'+motifTransform(item)+'"><g fill="none" stroke="'+style.stroke+'" stroke-width="'+style.width+'" stroke-linecap="round" stroke-linejoin="round"'+(style.dash?' stroke-dasharray="'+style.dash+'"':'')+(style.emboss?' filter="url(#relief)"':'')+'>';
 lines.forEach((line,i)=>{
 const drawn=animated&&item.appearance==='draw',start=animated?lineAppearance(item.appearance,0,i,lines.length):{opacity:1,reveal:1};
 s+='<path d="'+path(line)+'" opacity="'+start.opacity+'"'+(drawn?' pathLength="1" stroke-dasharray="1" stroke-dashoffset="'+(1-start.reveal)+'"':'')+'>';
 if(animated){
 const timing=' keyTimes="'+times.map(t=>t/DURATION).join(';')+'" calcMode="linear" dur="'+DURATION+'s" repeatCount="indefinite"/>';
 s+='<animate attributeName="d" values="'+frames.map(f=>path(f[i])).join(';')+'"'+timing;
 if(item.appearance&&item.appearance!=='continuous')s+='<animate attributeName="opacity" values="'+times.map(t=>lineAppearance(item.appearance,t,i,lines.length).opacity).join(';')+'"'+timing;
 if(drawn)s+='<animate attributeName="stroke-dashoffset" values="'+times.map(t=>1-lineAppearance(item.appearance,t,i,lines.length).reveal).join(';')+'"'+timing;
 }
 s+='</path>';
 });
 return s+'</g></g></svg>';
}
