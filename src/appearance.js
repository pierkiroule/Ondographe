import {DURATION} from './animation.js';
export const APPEARANCES=[
 ['continuous','Continu','Toutes les lignes restent visibles.'],
 ['resonance','Résonance','Une pulsation lumineuse traverse les lignes.'],
 ['echo','Écho','Des vagues successives se répondent.'],
 ['emerge','Émergence','Les lignes se révèlent du centre vers l’extérieur.'],
 ['draw','Tracé','Les contours se dessinent puis se retirent.']
];
export function lineAppearance(mode,time,index,count){
 const phase=time/DURATION*Math.PI*2,position=index/Math.max(1,count-1);
 if(mode==='resonance')return {opacity:.18+.82*((1+Math.cos(phase-position*Math.PI*2))/2)**3,reveal:1};
 if(mode==='echo')return {opacity:.08+.92*((1+Math.cos(phase*2-position*Math.PI*4))/2)**8,reveal:1};
 if(mode==='emerge'){const progress=(1-Math.cos(phase))/2;return {opacity:Math.max(0,Math.min(1,(progress-position*.8)*5)),reveal:1}}
 if(mode==='draw')return {opacity:1,reveal:(1-Math.cos(phase))/2};
 return {opacity:1,reveal:1};
}
