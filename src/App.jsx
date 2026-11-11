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
 const frames=animated?Array.from({length:25},(_,i)=>pointsFor(item,i*30/24)):null;
 const lines=pointsFor(item,0);
 const stroke=mono?"#000000":"#354a48";
 let s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">';
 if(!mono)s+='<rect width="600" height="600" fill="'+item.palette+'"/>';
 s+='<g fill="none" stroke="'+stroke+'" stroke-width="'+(0.7+item.params.relief/100).toFixed(2)+'" opacity=".75" stroke-linecap="round" stroke-linejoin="round">';
 lines.forEach((line,i)=>{s+='<path d="'+path(line)+'">';if(animated)s+='<animate attributeName="d" values="'+frames.map(f=>path(f[i])).join(";")+'" dur="30s" repeatCount="indefinite"/>';s+='</path>';});
 s+='</g></svg>';
 return s;
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
 <g fill="none" stroke="#354a48" strokeWidth={0.7+item.params.relief/100} opacity=".75" strokeLinecap="round" strokeLinejoin="round">{paths.map((d,i)=><path key={i} d={d}/>)}</g>
 </svg>;
}
export default function App(){
 const [notes,setNotes]=useState(["🌊","🌱"]),[palette,setPalette]=useState(PAL[1]),[params,setParams]=useState(defaults);
 const [works,setWorks]=useState(()=>Array.from({length:6},(_,i)=>make(i,["🌊","🌱"],PAL[1],defaults)));
 const [selected,setSelected]=useState(null),[sculpt,setSculpt]=useState(false),[tab,setTab]=useState("instrument");
 const [library,setLibrary]=useState(()=>{try{return JSON.parse(localStorage.getItem("ondographe-library")||"[]")}catch{return []}});
 const [code,setCode]=useState(""),[audio,setAudio]=useState(null),[message,setMessage]=useState("");
 const selectedWork=works.find(w=>w.id===selected)||library.find(w=>w.id===selected);
 useEffect(()=>{try{localStorage.setItem("ondographe-library",JSON.stringify(library))}catch{setMessage("Stockage local saturé. Exportez votre Ondothèque.")}},[library]);
 const updateAll=(nextNotes=notes,nextPalette=palette,nextParams=params)=>setWorks(old=>old.map(w=>({...w,notes:[...nextNotes],palette:nextPalette,params:{...nextParams}})));
 const changeNotes=n=>{setNotes(n);updateAll(n,palette,params)};
 const changeParams=(key,value)=>{const p={...params,[key]:value};setParams(p);updateAll(notes,palette,p)};
 const changePalette=c=>{setPalette(c);updateAll(notes,c,params)};
 const updateWork=(id,patch)=>setWorks(old=>old.map(w=>w.id===id?{...w,...patch}:w));
 const sculptWork=(id,g)=>setWorks(old=>old.map(w=>w.id===id?{...w,gestures:[...w.gestures.slice(-350),g],version:w.version+1}:w));
 const fresh=()=>{setWorks(Array.from({length:6},(_,i)=>make(i,notes,palette,params)));setSelected(null)};
 const save=w=>{setLibrary(old=>[{...w,id:crypto.randomUUID(),name:w.name},...old]);setMessage("Empreinte ajoutée à l'Ondothèque.")};
 const exportWork=(w,animated=w.kind==="animé",mono=false)=>{const svg=svgFor(w,animated,mono);setCode(svg);download(svg,w.name.replace(/[^a-z0-9_-]+/gi,"-")+".svg")};
 const analyze=async file=>{if(!file)return;setMessage("Analyse sonore locale…");try{const ctx=new (window.AudioContext||window.webkitAudioContext)(),buf=await ctx.decodeAudioData(await file.arrayBuffer()),data=buf.getChannelData(0);let rms=0,changes=0,z=0,last=0,steps=0;const stride=Math.max(1,Math.floor(data.length/120000));for(let i=0;i<data.length;i+=stride){const v=data[i];rms+=v*v;changes+=Math.abs(v-last);if((v>=0)!==(last>=0))z++;last=v;steps++}await ctx.close();rms=Math.sqrt(rms/steps);const variation=changes/steps,zero=z/steps;const p={organic:clamp(Math.round(35+variation*150),5,100),density:clamp(Math.round(20+zero*500),8,100),energy:clamp(Math.round(rms*260),5,100),complexity:clamp(Math.round(25+variation*220),5,100),relief:params.relief};const n=[zero>.1?"🐦":"🌊",variation>.1?"🌬️":"🌱",rms>.13?"💧":"🪶"];setAudio({name:file.name,duration:buf.duration,rms,variation,zero});setParams(p);setNotes(n);updateAll(n,palette,p);setMessage("Analyse terminée. Six propositions recalculées.");}catch(e){setMessage("Impossible d'analyser ce fichier audio : "+e.message)}};
 return <main><header><h1>L'Ondographe <small>•°</small></h1><p>INSTRUMENT DES SOURCIERS DU VIVANT</p></header>
 <nav><button className={tab==="instrument"?"active":""} onClick={()=>setTab("instrument")}>Instrument</button><button className={tab==="library"?"active":""} onClick={()=>setTab("library")}>Ondothèque ({library.length})</button></nav>
 {tab==="instrument"?<>
 <h3>Accord du vivant</h3><div className="emojis">{EM.map(([emoji,label])=><button title={label} aria-label={label} key={emoji} className={notes.includes(emoji)?"active":""} onClick={()=>changeNotes(notes.includes(emoji)?notes.length>1?notes.filter(n=>n!==emoji):notes:[...notes,emoji])}>{emoji}<span>{label}</span></button>)}</div>
 <div className="controls">{Object.entries(params).map(([k,v])=><label key={k}>{({organic:"Organicité",density:"Densité",energy:"Vitalité",complexity:"Complexité",relief:"Relief"})[k]} · {v}%<input type="range" min="0" max="100" value={v} onChange={e=>changeParams(k,+e.target.value)}/></label>)}</div>
 <div className="palette">{PAL.map(c=><button key={c} title={c} className={palette===c?"picked":""} style={{background:c}} onClick={()=>changePalette(c)}/>)}</div>
 <div className="toolbar"><button onClick={fresh}>↻ Six nouvelles propositions</button><button className={sculpt?"active":""} onClick={()=>setSculpt(!sculpt)}>{sculpt?"Terminer la sculpture":"Sculpter au doigt"}</button><label className="upload">Importer WAV / MP3<input type="file" accept="audio/*,.wav,.mp3" hidden onChange={e=>analyze(e.target.files[0])}/></label></div>
 {audio&&<p className="hint">{audio.name} · {audio.duration.toFixed(1)} s · énergie RMS {audio.rms.toFixed(3)}</p>}
 <h3>Trois empreintes fixes</h3><div className="gallery">{works.slice(0,3).map(w=><WorkCard key={w.id} {...{w,sculpt,updateWork,sculptWork,save,exportWork}}/>)}</div>
 <h3>Trois empreintes vivantes · 30 s</h3><div className="gallery">{works.slice(3).map(w=><WorkCard key={w.id} {...{w,sculpt,updateWork,sculptWork,save,exportWork}}/>)}</div>
 </>:<><div className="toolbar"><button onClick={()=>download(JSON.stringify(library,null,2),"ondotheque.json","application/json")}>Exporter l'Ondothèque JSON</button><label className="upload">Importer JSON<input type="file" accept=".json,application/json" hidden onChange={async e=>{try{const data=JSON.parse(await e.target.files[0].text());if(!Array.isArray(data))throw Error("Format incorrect");setLibrary(old=>[...data,...old]);setMessage("Ondothèque importée.")}catch(err){setMessage(err.message)}}}/></label></div><div className="gallery">{library.map(w=><WorkCard key={w.id} {...{w,sculpt,sculptWork:()=>{},save:()=>{},exportWork}} updateWork={(id,patch)=>setLibrary(old=>old.map(x=>x.id===id?{...x,...patch}:x))} remove={()=>setLibrary(old=>old.filter(x=>x.id!==w.id))}/>)}</div></>}
 <details><summary>Code SVG de l'œuvre</summary><p className="hint">Sélectionnez une œuvre puis générez son SVG. Le code peut être modifié et exporté. L'édition libre ne reconstitue pas les paramètres génératifs.</p><select value={selected||""} onChange={e=>setSelected(e.target.value)}><option value="">Choisir une œuvre</option>{[...works,...library].map(w=><option value={w.id} key={w.id}>{w.name}</option>)}</select><button disabled={!selectedWork} onClick={()=>setCode(svgFor(selectedWork,selectedWork.kind==="animé"))}>Générer le code</button><textarea value={code} onChange={e=>setCode(e.target.value)} rows={9}/><button disabled={!code} onClick={()=>download(code,"ondographe-edite.svg")}>Exporter le code modifié</button></details>
 <p className="hint" role="status">{message}</p><footer>ÉCOUTER · SCULPTER · RÉCOLTER</footer></main>;
}
function WorkCard({w,sculpt,updateWork,sculptWork,save,exportWork,remove}){return <article><Wave item={w} edit={sculpt&&!remove} onSculpt={sculptWork}/><input aria-label="Nom de l'œuvre" className="workname" value={w.name} onChange={e=>updateWork(w.id,{name:e.target.value})}/><small>{w.kind==="animé"?"Boucle · 30 s":"Empreinte fixe"}</small><div className="actions">{!remove&&<button onClick={()=>save(w)}>Garder</button>}<button onClick={()=>exportWork(w)}>SVG</button><button onClick={()=>exportWork(w,false,true)}>Gravure</button>{remove&&<button onClick={remove}>Supprimer</button>}</div></article>}
