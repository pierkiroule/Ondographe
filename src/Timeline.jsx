import React,{useState} from 'react';
import {TRACKS,DURATION,valueAt} from './animation';
const presets={Douce:[.42,0,.58,1],Linéaire:[0,0,1,1],Accélération:[.42,0,1,1],Décélération:[0,0,.58,1]};
export default function Timeline({item,time,onTime,playing,onPlaying,onChange}){
 const [track,setTrack]=useState('energy'),[selected,setSelected]=useState(null);
 const keys=item.animation?.[track]||[];
 const key=keys.find(k=>k.time===selected);
 const commit=next=>onChange({...item.animation,[track]:next.sort((a,b)=>a.time-b.time)});
 const patch=values=>commit(keys.map(k=>k.time===selected?{...k,...values}:k));
 const add=()=>{const t=Math.round(time*10)/10;commit([...keys.filter(k=>k.time!==t),{time:t,value:valueAt(keys,t,item.params[track]),curve:[.42,0,.58,1]}]);setSelected(t);onTime(t);onPlaying(false)};
 const curve=key?.curve||presets.Douce;
 const graph=Array.from({length:151},(_,i)=>`${i?'L':'M'}${i*2} ${100-valueAt(keys,i/5,item.params[track])}`).join(' ');
 return <section className="timeline" aria-label="Éditeur d’animation">
 <div className="timeline-title"><h3>Animation</h3><span>Boucle de 30 secondes</span></div>
 <div className="transport"><button onClick={()=>onPlaying(!playing)}>{playing?'Pause':'Lire'}</button><button onClick={()=>{onPlaying(false);onTime(0)}} aria-label="Revenir au début">↤</button><output>{time.toFixed(1)} / 30 s</output><button onClick={add}>+ Image clé</button></div>
 <label className="scrubber">Temps<input aria-label="Temps de l’animation" type="range" min="0" max={DURATION} step="0.1" value={time} onChange={e=>{onPlaying(false);onTime(+e.target.value)}}/></label>
 <div className="ruler"><span>0 s</span><span>10 s</span><span>20 s</span><span>30 s</span></div>
 <div className="track-tabs">{Object.entries(TRACKS).map(([id,label])=><button key={id} className={track===id?'active':''} onClick={()=>{setTrack(id);setSelected(null)}}>{label}</button>)}</div>
 <div className="key-lane">{keys.map(k=><button key={k.time} className={selected===k.time?'key selected':'key'} style={{left:`${k.time/30*100}%`}} aria-label={`Image clé à ${k.time} secondes`} onClick={()=>{setSelected(k.time);onTime(k.time);onPlaying(false)}}>◆</button>)}</div>
 <svg className="value-graph" viewBox="0 -5 300 110" role="img" aria-label="Courbe du paramètre sur 30 secondes"><path d="M0 0H300M0 50H300M0 100H300" stroke="#d8ddd6" fill="none"/><path d={graph} fill="none" stroke="#354a48" strokeWidth="2"/><path d={`M${time*10} -5V105`} stroke="#b36b43"/>{keys.map(k=><circle key={k.time} cx={k.time*10} cy={100-k.value} r="3" fill="#354a48"/>)}</svg>
 {key?<div className="key-editor"><div className="key-fields"><label>Temps (s)<input type="number" min="0" max="30" step="0.1" value={key.time} onChange={e=>{if(e.target.value==='')return;const t=Math.max(0,Math.min(30,+e.target.value));if(keys.some(k=>k!==key&&k.time===t))return;patch({time:t});setSelected(t);onTime(t)}}/></label><label>Valeur (%)<input type="number" min="0" max="100" value={key.value} onChange={e=>patch({value:Math.max(0,Math.min(100,+e.target.value))})}/></label><button onClick={()=>{commit(keys.filter(k=>k.time!==selected));setSelected(null)}}>Supprimer la clé</button></div>
 <p className="hint">Courbe de transition vers la clé suivante. Ajustez les poignées avec les curseurs.</p>
 <div className="curve-layout"><svg viewBox="-8 -8 116 116" className="bezier" role="img" aria-label="Courbe Bézier de transition"><path d="M0 0V100H100" fill="none" stroke="#c9cfc7"/><path d={`M0 100L${curve[0]*100} ${100-curve[1]*100}M100 0L${curve[2]*100} ${100-curve[3]*100}`} stroke="#b36b43"/><path d={`M0 100C${curve[0]*100} ${100-curve[1]*100} ${curve[2]*100} ${100-curve[3]*100} 100 0`} fill="none" stroke="#354a48" strokeWidth="2"/>{[0,2].map(i=><circle key={i} cx={curve[i]*100} cy={100-curve[i+1]*100} r="4" fill="#b36b43"/>)}</svg><div className="curve-controls"><div className="curve-presets">{Object.entries(presets).map(([label,c])=><button key={label} onClick={()=>patch({curve:c})}>{label}</button>)}</div>{['Entrée X','Entrée Y','Sortie X','Sortie Y'].map((label,i)=><label key={label}>{label}<input type="range" aria-label={label} min="0" max="1" step=".01" value={curve[i]} onChange={e=>patch({curve:curve.map((v,j)=>i===j?+e.target.value:v)})}/></label>)}</div></div></div>:<p className="hint">Placez la tête de lecture, puis ajoutez une image clé. Sélectionnez un losange pour modifier sa valeur et sa courbe.</p>}
 </section>;
}
