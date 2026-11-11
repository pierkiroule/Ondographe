import React,{useState,useEffect,useRef,useMemo} from "react";
const EM=[["🌊","Onde"],["🌬️","Souffle"],["🌱","Croissance"],["🍄","Réseau"],["🐚","Spirale"],["🪶","Plume"],["🐦","Nuée"],["💧","Écho"],["🌳","Cernes"],["🕸️","Maillage"],["☁️","Brume"],["🪨","Strate"]];
const PAL=["#CADFE6","#BDC9DB","#B0C4CC","#EDE1B5","#F0DC91","#E7CF98","#CBD5BF","#BFD9D0","#D6D9B6","#E8C6B5","#DFB097","#EDC6A1","#E7DFD0","#D3D2CA","#F0EDE5"];
const ADJ=["secret","lent","sauvage","intime","suspendu","fragile","profond","vagabond","naissant"];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),rnd=()=>Math.floor(Math.random()*1e8);
const make=(i,notes,palette,params)=>({id:crypto.randomUUID(),seed:rnd(),kind:i<3?"fixe":"animé",name:(["Le murmure","La mémoire","Les rides","Le souffle","La danse","L'éveil"][i])+" "+(EM.find(e=>e[0]===notes[0])?.[1].toLowerCase()||"du vivant"),notes:[...notes],palette,params:{...params},gestures:[],version:0});
function basePoint(u,i,n,seed,notes,params){
 const a=u*Math.PI*2,r=9+i*245/n,noise=seed*.00001,o=params.organic/100,c=params.complexity/100;
 const ring=notes.some(x=>["🌳","💧","🐚"].includes(x));
 const branches=notes.some(x=>["🍄","🕸️"].includes(x));
 // Une seule topologie par œuvre : aucun mélange de motifs entre les lignes.
 // Les emojis modulent la forme dominante au lieu d'ajouter des couches concurrentes.
 let x,y;
 if(branches&&!ring){let theta=i/n*Math.PI*2+noise+o*.3*Math.sin(u*8+i);x=300+u*310*Math.cos(theta);y=300+u*310*Math.sin(theta);}
 else if(ring){let rr=r*(1+o*.16*Math.sin(a*3+noise+i*.06)+c*.06*Math.cos(a*5-noise));if(notes.includes("🐚"))rr=8+u*280+i*3,x=300+rr*Math.cos(a*2.7+noise),y=300+rr*Math.sin(a*2.7+noise);else x=300+rr*Math.cos(a),y=300+rr*Math.sin(a)*.88;}
 else{x=-70+u*740;y=35+i*530/n+o*30*Math.sin(x*.021+i*.13+noise);}
 return[x,y];
}
function pointsFor(item,t=0){
 const {notes,params,seed,gestures}=item,n=12+Math.round(params.density*.18),P=64,phase=t/30*Math.PI*2,energy=params.energy/100,organic=params.organic/100;
 return Array.from({length:n},(_,i)=>Array.from({length:P+1},(_,j)=>{
 let [x,y]=basePoint(j/P,i,n,seed,notes,params);const dx=x-300,dy=y-300,f=Math.exp(-(dx*dx+dy*dy)/65000);
 if(notes.includes("🌊"))y+=organic*17*Math.sin(x*.027+phase+i*.11);
 if(notes.includes("🌬️"))x+=energy*45*Math.sin(phase+dy*.015);
 if(notes.includes("🌱")){x+=dx*.13*energy*Math.sin(phase);y+=dy*.13*energy*Math.sin(phase);}
 if(notes.includes("🐦")){x+=energy*24*Math.sin(phase+dy*.014);y+=energy*24*Math.cos(phase+dx*.014);}
 if(notes.includes("☁️")){x+=energy*30*Math.sin(phase);y+=energy*25*Math.cos(phase);}
 if(notes.includes("🪶"))y+=organic*16*Math.sin(j*.14+i*.1+phase);
 if(notes.includes("💧")){let v=energy*.1*Math.sin(phase*2-Math.hypot(dx,dy)*.026);x+=dx*v;y+=dy*v;}
 if(notes.includes("🪨"))y+=organic*9*Math.cos(x*.04+i*.2);
 x+=energy*25*f*Math.sin(phase+dy*.017+seed);y+=energy*25*f*Math.cos(phase+dx*.017+seed);
 for(const g of gestures){const ax=x-g.x,ay=y-g.y,w=Math.exp(-(ax*ax+ay*ay)/(g.radius*g.radius));x+=g.dx*w;y+=g.dy*w;}
 return[x,y];
 }));
}
const path=line=>line.map(([x,y],i)=>(i?"L":"M")+x.toFixed(2)+" "+y.toFixed(2)).join(" ");
function svgFor(item,animated=false,mono=false){
 const bg=item.palette,p=item.params,ink=mono?"#000000":"#ffffff",shade=mono?"#000000":"#354a48";
 const frames=animated?Array.from({length:25},(_,i)=>pointsFor(item,i*30/24)):null;
 const lines=pointsFor(item,0);
 let s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">';
 if(!mono)s+='<rect width="600" height="600" fill="'+bg+'"/>';
 for(const [col,offset,op] of [[shade,1.4,mono?1:p.relief/130],[ink,-.7,mono?0:p.relief/100]]){
 if(op<=0)continue;
 s+='<g fill="none" stroke="'+col+'" stroke-width="'+(mono?1.5:1.4)+'" opacity="'+op+'" stroke-linecap="round" transform="translate(0 '+offset+')">';
 lines.forEach((line,i)=>{s+='<path d="'+path(line)+'">';if(animated)s+='<animate attributeName="d" values="'+frames.map(f=>path(f[i])).join(";")+'" dur="30s" repeatCount="indefinite"/>';s+='</path>';});s+='</g>';
 }
 return s+'</svg>';
}
const download=(text,name,type="image/svg+xml")=>{const url=URL.createObjectURL(new Blob([text],{type})),a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500)};
const defaults={organic:65,density:50,energy:40,complexity:45,relief:70};
function Wave({item,edit,onSculpt}){
 const ref=useRef(),drag=useRef(null),[tick,setTick]=useState(0);
 useEffect(()=>{if(item.kind!=="animé")return;let raf,active=true;const loop=()=>{if(!active)return;setTick(v=>v+1);raf=requestAnimationFrame(loop)};raf=requestAnimationFrame(loop);return()=>{active=false;cancelAnimationFrame(raf)}},[item.kind]);
 const paths=useMemo(()=>pointsFor(item,item.kind==="animé"?(performance.now()/1000)%30:0).map(path),[item,tick]);
 const onMove=e=>{if(!drag.current||!edit)return;const r=ref.current.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*600,y=(e.clientY-r.top)/r.height*600,prev=drag.current;onSculpt(item.id,{x,y,dx:(x-prev.x)*1.6,dy:(y-prev.y)*1.6,radius:100});drag.current={x,y}};
 return <svg ref={ref} viewBox="0 0 600 600" className={edit?"editable":""} onPointerDown={e=>{if(!edit)return;const r=e.currentTarget.getBoundingClientRect();drag.current={x:(e.clientX-r.left)/r.width*600,y:(e.clientY-r.top)/r.height*600};e.currentTarget.setPointerCapture(e.pointerId)}} onPointerMove={onMove} onPointerUp={()=>drag.current=null} onPointerCancel={()=>drag.current=null}>
 <rect width="600" height="600" fill={item.palette}/>
 {paths.map((d,i)=><g key={i} fill="none" strokeLinecap="round"><path d={d} stroke="#364842" strokeWidth="2.1" opacity={item.params.relief/160} transform="translate(0 1.4)"/><path d={d} stroke="#fff" strokeWidth="1.3" opacity={item.params.relief/100} transform="translate(0 -.6)"/></g>)}
 </svg>;
}
function Range({label,value,min,max,step=1,onChange,unit=''}){return <label className="range-label"><span>{label}<output>{Math.round(value*10)/10}{unit}</output></span><input aria-label={label} type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(+e.target.value)}/></label>}
export default function App(){
 const [work,setWork]=useState(createWork),[step,setStep]=useState(0),[mode,setMode]=useState('sculpt'),[playing,setPlaying]=useState(false),[tab,setTab]=useState('instrument'),[message,setMessage]=useState(''),[expanded,setExpanded]=useState(false),[code,setCode]=useState('');
 const [brush,setBrush]=useState({size:100,intensity:60}),[labResult,setLabResult]=useState(null);
 const [library,setLibrary]=useState(()=>{try{const a=JSON.parse(localStorage.getItem('ondographe-library')||'[]');return Array.isArray(a)?a:[]}catch{return []}});
 const dialog=useRef(null);
 useEffect(()=>{try{localStorage.setItem('ondographe-library',JSON.stringify(library))}catch{setMessage('Stockage plein. Exportez votre Ondothèque.')}},[library]);
 const [time,setTime]=useAnimationClock(playing&&work.kind==='animé'&&step>=3&&tab==='instrument');
 useEffect(()=>{if(expanded)dialog.current.showModal()},[expanded]);
 const patch=p=>setWork(w=>({...w,...p,...(['notes','palette','paper','lineStyle','gestures'].some(k=>k in p)?{fixedSnapshot:null}:{})}));
 const param=(key,value)=>setWork(w=>({...w,params:{...w.params,[key]:value},fixedSnapshot:null}));
 const sculpt=g=>setWork(w=>({...w,gestures:[...(w.gestures||[]).slice(-350),g],fixedSnapshot:null}));
 const center=(x,y)=>setWork(w=>({...w,params:{...w.params,centerX:Math.round(x),centerY:Math.round(y)},fixedSnapshot:null}));
 const navigate=i=>{if(i>=3&&!work.fixedSnapshot){setStep(2);setMessage('Validez d’abord votre empreinte fixe.');setPlaying(false);return}setStep(i);setTime(0);setPlaying(i>=3&&work.kind==='animé')};
 const validate=()=>{setWork(w=>{const {fixedSnapshot,...base}=w;return {...w,fixedSnapshot:structuredClone({...base,kind:'fixe',animation:{},preset:null})}});setMessage('SVG fixe validé. Vous pouvez choisir son animation.');setStep(3);setTime(0);setPlaying(work.kind==='animé')};
 const chooseAnimation=id=>{setWork(w=>({...w,kind:'animé',preset:id,animation:presetAnimation(id,w.params)}));setTime(0);setPlaying(true)};
 const noAnimation=()=>{patch({kind:'fixe',preset:null,animation:{}});setPlaying(false);setTime(0)};
 const save=()=>{setLibrary(old=>[{...work,id:crypto.randomUUID()},...old]);setMessage('Empreinte conservée dans l’Ondothèque.')};
 const exportWork=(item,animated=false,mono=false)=>{const text=svgFor(!animated&&item.fixedSnapshot?{...item.fixedSnapshot,name:item.name}:item,animated,mono);setCode(text);download(text,(item.name||'empreinte').replace(/[^a-z0-9_-]+/gi,'-')+(animated?'-anime':'')+'.svg')};
 const display=step<3?{...work,kind:'fixe',animation:{}}:work;
 const waveProps={item:display,time,mode:step===1?mode:null,onSculpt:sculpt,onCenter:center,brush};
 return <main className="flow-app"><header><div><p className="eyebrow">LES SOURCIERS DU VIVANT</p><h1>L’Ondographe <small>•°</small></h1></div><nav><button className={tab==='instrument'?'active':''} onClick={()=>setTab('instrument')}>Atelier</button><button className={tab==='lab'?'active':''} onClick={()=>setTab('lab')}>Labo des résonances</button><button className={tab==='library'?'active':''} onClick={()=>setTab('library')}>Ondothèque ({library.length})</button></nav></header>
 {tab==='instrument'?<>
 <div className="flow-intro"><p className="eyebrow">UNE FORME. UN GESTE. UNE EMPREINTE.</p><h2>Donner forme à l’écoute.</h2></div>
 <section className="flow-progress" aria-label="Étapes de création"><ol>{STEPS.map((name,i)=><li key={name}><button aria-current={step===i?'step':undefined} className={i===step?'current':i<step?'complete':''} onClick={()=>navigate(i)}><span>{String(i+1).padStart(2,'0')}</span>{name}</button></li>)}</ol><div role="progressbar" aria-label="Progression de création" aria-valuemin="0" aria-valuemax="5" aria-valuenow={step+1}><div style={{width:`${(step+1)*20}%`}}/></div></section>
 <div className="flow-workspace"><section className="canvas-panel" aria-label="Aperçu de l’œuvre"><div className="canvas-top"><span>{step===1?mode==='center'?'Déplacez le centre sur le visuel':'Glissez pour sculpter':step===3&&work.kind==='animé'?'Votre empreinte prend vie':'Votre empreinte'}</span><button onClick={()=>setExpanded(true)}>Agrandir ⤢</button></div><div className="artwork"><Wave {...waveProps}/></div><div className="canvas-caption"><span>{MOTIFS.find(([id])=>id===work.notes?.[0])?.[1]||'Empreinte'} · {LINE_STYLES.find(([id])=>id===(work.lineStyle||'ink'))?.[1]}</span><span>{step>=3&&work.kind==='animé'?'Boucle · 10 s':'SVG statique'}</span></div></section>
 <aside className="flow-panel" aria-label={STEPS[step]}><p className="eyebrow">ÉTAPE {step+1} / 5</p><h3>{['Composer votre onde','Le pinceau de résonance','Votre empreinte fixe','Une boucle de 10 secondes','Emporter l’empreinte'][step]}</h3>
 {step===0&&<><h4>La forme</h4><div className="motifs">{MOTIFS.map(([id,label])=><button key={id} aria-pressed={work.notes[0]===id} className={work.notes[0]===id?'active':''} onClick={()=>patch({notes:[id]})}><svg viewBox="0 0 600 600" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="4">{pointsFor({notes:[id],params:{...defaults,spacing:26},seed:1}).map((line,i)=><path key={i} d={path(line)}/>)}</g></svg><span>{label}</span></button>)}</div>
 <h4>Le trait</h4><div className="style-options">{LINE_STYLES.map(([id,label,description])=><button key={id} className={work.lineStyle===id?'active':''} aria-pressed={work.lineStyle===id} onClick={()=>patch({lineStyle:id})}><span className={'stroke-sample '+id}/><strong>{label}</strong><small>{description}</small></button>)}</div>
 <Range label="Épaisseur du trait" value={work.params.lineWidth??1.5} min={.6} max={4} step={.1} onChange={v=>param('lineWidth',v)} unit=" px"/>
 <h4>Le fond</h4><div className="background-options">{PAL.map(([color,label])=><button key={color} style={{'--swatch':color}} aria-label={label} aria-pressed={work.palette===color} className={work.palette===color?'picked':''} onClick={()=>patch({palette:color})}><span/>{label}</button>)}</div><label className="check"><input type="checkbox" checked={!!work.paper} onChange={e=>patch({paper:e.target.checked})}/> Grain de papier</label>
 <h4>Le rythme des lignes</h4><Range label="Espacement des lignes" value={work.params.spacing??11} min={4} max={30} onChange={v=>param('spacing',v)} unit=" px"/><Range label="Ouverture du motif" value={work.params.hollow??35} min={0} max={140} onChange={v=>param('hollow',v)} unit=" px"/><Range label="Organicité" value={work.params.organic??65} min={0} max={100} onChange={v=>param('organic',v)}/><Range label="Complexité · nombre de vagues" value={work.params.waves??3} min={1} max={12} onChange={v=>param('waves',v)}/></>}
 {step===1&&<><p className="hint">Passez le pinceau sur les lignes : une résonance souple suit votre geste. Ajustez son rayon et sa force.</p><div className="sculpt-tools"><button className={mode==='sculpt'?'active':''} aria-pressed={mode==='sculpt'} onClick={()=>setMode('sculpt')}>Pinceau de résonance</button><button className={mode==='center'?'active':''} aria-pressed={mode==='center'} onClick={()=>setMode('center')}>Déplacer le centre</button></div><Range label="Taille du pinceau" value={brush.size} min={20} max={220} onChange={size=>setBrush(b=>({...b,size}))} unit=" px"/><Range label="Intensité du pinceau" value={brush.intensity} min={0} max={100} onChange={intensity=>setBrush(b=>({...b,intensity}))} unit=" %"/><button disabled={!work.gestures?.length} onClick={()=>patch({gestures:work.gestures.at(-1)?.stroke?work.gestures.filter(g=>g.stroke!==work.gestures.at(-1).stroke):work.gestures.slice(0,-1)})}>Annuler le dernier geste</button><button className="quiet" disabled={!work.gestures?.length} onClick={()=>patch({gestures:[]})}>Réinitialiser la sculpture</button><details><summary>Placer le centre précisément</summary><Range label="Centre horizontal" value={work.params.centerX??300} min={0} max={600} onChange={v=>param('centerX',v)}/><Range label="Centre vertical" value={work.params.centerY??300} min={0} max={600} onChange={v=>param('centerY',v)}/></details></>}
 {step===2&&<><p className="hint">Prenez un instant pour regarder votre empreinte. Cette version fixe sera conservée pour les exports, indépendamment de l’animation.</p><div className="validation-summary"><span>Forme</span><strong>{MOTIFS.find(([id])=>id===work.notes[0])?.[1]||'Empreinte'}</strong><span>Trait</span><strong>{LINE_STYLES.find(([id])=>id===(work.lineStyle||'ink'))?.[1]}</strong><span>Vagues</span><strong>{work.params.waves??3}</strong><span>Espacement</span><strong>{work.params.spacing??11} px</strong></div><button onClick={()=>navigate(1)}>Retoucher au pinceau</button>{work.fixedSnapshot&&<p className="hint">Votre SVG fixe est validé.</p>}</>}
 {step===3&&<><p className="hint">Choisissez un mouvement prêt à jouer. Vous pourrez ensuite ajuster ses images clés.</p><div className="animation-presets">{PRESETS.map((preset,i)=><button key={preset.id} className={work.preset===preset.id?'active':''} aria-pressed={work.preset===preset.id} onClick={()=>chooseAnimation(preset.id)}><span className="preset-number">0{i+1}</span><span><strong>{preset.name}</strong><small>{preset.description}</small></span><span aria-hidden="true">↗</span></button>)}</div><h4>Apparition des lignes</h4><div className="appearance-options">{APPEARANCES.map(([id,label,description])=><button key={id} aria-pressed={(work.appearance||'continuous')===id} className={(work.appearance||'continuous')===id?'active':''} onClick={()=>{if(work.kind!=='animé')chooseAnimation('breathe');patch({appearance:id});setTime(0);setPlaying(true)}}><strong>{label}</strong><small>{description}</small></button>)}</div><button className="quiet" onClick={()=>{noAnimation();setStep(4)}}>Continuer sans animation →</button>{work.kind==='animé'&&<><div className="simple-transport"><button onClick={()=>setPlaying(!playing)}>{playing?'Pause':'Lire'}</button><output>{time.toFixed(1)} / 10 s</output><button onClick={()=>{setPlaying(false);setTime(0)}}>Au début</button></div><label className="range-label">Parcourir l’animation<input aria-label="Temps de l’animation" type="range" min="0" max="10" step=".1" value={time} onChange={e=>{setPlaying(false);setTime(+e.target.value)}}/></label></>}</>}
 {step===4&&<><p className="hint">Votre dessin reste vectoriel. Conservez-le ici ou emportez-le dans vos outils.</p><label className="name-field">Nom de l’empreinte<input value={work.name} onChange={e=>patch({name:e.target.value})}/></label><div className="export-options"><button className="primary" onClick={()=>exportWork(work)}>Télécharger le SVG statique <span>Une image fixe, prête à utiliser.</span></button>{work.kind==='animé'&&<button onClick={()=>exportWork(work,true)}>Télécharger le SVG animé <span>Votre mouvement en boucle de 10 s.</span></button>}<button onClick={()=>exportWork(work,false,true)}>SVG pour la gravure <span>Trait noir, sans fond.</span></button><button onClick={save}>Garder dans l’Ondothèque</button><button className="quiet" onClick={()=>download(JSON.stringify(work,null,2),'empreinte-projet.json','application/json')}>Exporter le projet modifiable</button></div><details><summary>Code SVG</summary><button onClick={()=>setCode(svgFor(work,work.kind==='animé'))}>Afficher le code</button><textarea aria-label="Code SVG" value={code} onChange={e=>setCode(e.target.value)} rows="8"/><button disabled={!code} onClick={()=>download(code,'empreinte-editee.svg')}>Exporter le code modifié</button></details></>}
 <div className="flow-navigation">{step>0&&<button className="quiet" onClick={()=>navigate(step-1)}>← Retour</button>}{step<4?<button className="primary" onClick={()=>step===2?validate():navigate(step+1)}>{['Passer au pinceau','Voir le SVG fixe','Valider ce SVG fixe','Passer aux exports'][step]} →</button>:<button onClick={()=>{setWork(createWork());setTime(0);setPlaying(false);setStep(0);setCode('')}}>Nouvelle empreinte →</button>}</div>
 </aside></div>
 {step===3&&work.kind==='animé'&&<details className="advanced-animation" key={work.preset}><summary>Modifier les images clés <span>Facultatif · votre animation est déjà prête</span></summary><Timeline key={work.preset} item={work} time={time} onTime={setTime} playing={playing} onPlaying={setPlaying} onChange={animation=>patch({animation})}/></details>}
 </>:tab==='lab'?<ResonanceLab Wave={Wave} result={labResult} onResult={setLabResult} createWork={createWork} onEdit={(item,target)=>{setWork(structuredClone(item));setStep(target);setTime(0);setPlaying(target===3);setTab('instrument');setMessage('Proposition du labo prête à retoucher.')}} onExport={exportWork} onSave={item=>{setLibrary(old=>[{...item,id:crypto.randomUUID()},...old]);setMessage('Les versions fixe et animée sont conservées dans l’Ondothèque.')}}/>:<section className="library-panel"><div className="library-heading"><div><p className="eyebrow">VOS EMPREINTES</p><h2>L’Ondothèque</h2></div><button onClick={()=>download(JSON.stringify(library,null,2),'ondotheque.json','application/json')}>Exporter la collection</button><label className="upload">Importer un projet<input type="file" accept=".json" hidden onChange={async e=>{try{const parsed=JSON.parse(await e.target.files[0].text()),items=Array.isArray(parsed)?parsed:[parsed];if(!items.every(w=>w.params&&Array.isArray(w.notes)&&Array.isArray(w.gestures)))throw Error();setLibrary(old=>[...items.map(w=>({...w,id:crypto.randomUUID()})),...old]);setMessage('Projet importé.')}catch{setMessage('Le fichier ne contient pas de projet compatible.')}}}/></label></div>{!library.length&&<p className="empty-state">Vos empreintes trouveront leur place ici. Commencez dans l’atelier.</p>}<div className="gallery">{library.map(w=><article key={w.id}><LibraryPreview Wave={Wave} item={w}/><div className="card-info"><h3>{w.name}</h3><div className="actions"><button onClick={()=>{setWork({...w,id:crypto.randomUUID(),params:{...defaults,...w.params}});setStep(1);setTab('instrument');setTime(0);setPlaying(false)}}>Reprendre</button><button onClick={()=>exportWork(w,w.kind==='animé')}>SVG</button><button onClick={()=>setLibrary(old=>old.filter(x=>x.id!==w.id))}>Supprimer</button></div></div></article>)}</div></section>}
 <p className="hint status" role="status">{message}</p><footer>ÉCOUTER · SCULPTER · RÉCOLTER</footer>
 {expanded&&<dialog ref={dialog} className="art-dialog" aria-label="Empreinte agrandie" onClose={()=>setExpanded(false)}><div className="dialog-toolbar"><span>{work.name}</span><button autoFocus onClick={()=>dialog.current.close()}>Fermer ×</button></div><Wave {...waveProps}/></dialog>}
 </main>;
}
