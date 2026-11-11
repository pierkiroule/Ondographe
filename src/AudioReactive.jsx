import React,{useState,useRef,useEffect} from 'react';
import {audioParams,captureAnimation} from './audio';
export default function AudioReactive({onLive,onCapture}){
 const [status,setStatus]=useState('idle'),[error,setError]=useState(''),[name,setName]=useState(''),[elapsed,setElapsed]=useState(0),[capturing,setCapturing]=useState(false),[level,setLevel]=useState(0),[settings,setSettings]=useState({sensitivity:100,smoothness:65,intensity:60});
 const runtime=useRef(null),raf=useRef(null),request=useRef(0),capture=useRef(null),options=useRef(settings),callbacks=useRef({onLive,onCapture});options.current=settings;callbacks.current={onLive,onCapture};
 const stop=()=>{cancelAnimationFrame(raf.current);const r=runtime.current;runtime.current=null;capture.current=null;if(r){r.stream?.getTracks().forEach(t=>t.stop());try{r.source.stop?.()}catch{}r.source.disconnect();r.analyser.disconnect();r.ctx.close().catch(()=>{})}callbacks.current.onLive(null);setCapturing(false);setLevel(0);setStatus('idle')};
 useEffect(()=>()=>{request.current++;cancelAnimationFrame(raf.current);const r=runtime.current;if(r){r.stream?.getTracks().forEach(t=>t.stop());try{r.source.stop?.()}catch{}r.ctx.close().catch(()=>{})}callbacks.current.onLive(null)},[]);
 const start=async(file)=>{
  const id=++request.current;stop();setError('');setStatus('loading');let ctx,stream;
  try{
   if(!file&&!navigator.mediaDevices?.getUserMedia)throw Error('Le micro nécessite un navigateur compatible et une connexion HTTPS.');
   ctx=new (window.AudioContext||window.webkitAudioContext)();await ctx.resume();let source;
   if(file){const buffer=await ctx.decodeAudioData(await file.arrayBuffer());source=ctx.createBufferSource();source.buffer=buffer;source.loop=true}else{stream=await navigator.mediaDevices.getUserMedia({audio:true});source=ctx.createMediaStreamSource(stream)}
   if(id!==request.current){stream?.getTracks().forEach(t=>t.stop());await ctx.close();return}
   const analyser=ctx.createAnalyser();analyser.fftSize=2048;analyser.smoothingTimeConstant=.4;source.connect(analyser);if(file){analyser.connect(ctx.destination);source.start()}
   runtime.current={ctx,source,analyser,stream};setName(file?file.name:'Microphone');setStatus('live');
   const waveform=new Float32Array(analyser.fftSize),spectrum=new Uint8Array(analyser.frequencyBinCount);let previous={volume:0,bass:0,treble:0},last=-1;
   const loop=()=>{
    if(runtime.current?.ctx!==ctx)return;const now=ctx.currentTime;
    if(now-last>=.05){last=now;analyser.getFloatTimeDomainData(waveform);analyser.getByteFrequencyData(spectrum);let sum=0;for(const v of waveform)sum+=v*v;
     const band=(low,high)=>{let total=0,n=0;for(let i=Math.ceil(low/(ctx.sampleRate/analyser.fftSize));i<Math.min(spectrum.length,high/(ctx.sampleRate/analyser.fftSize));i++){total+=spectrum[i]/255;n++}return n?total/n:0};
     const raw={volume:Math.min(1,Math.sqrt(sum/waveform.length)*5),bass:band(30,250),treble:band(2000,10000)},alpha=1-options.current.smoothness/110;
     previous=Object.fromEntries(Object.keys(raw).map(k=>[k,previous[k]+(raw[k]-previous[k])*alpha]));
     const params=audioParams(previous,options.current.sensitivity,options.current.intensity);setLevel(previous.volume);callbacks.current.onLive(params,now%10);
     if(capture.current){const t=now-capture.current.start;setElapsed(Math.min(10,t));capture.current.frames.push({time:Math.min(t,10),params});if(t>=10){const animation=captureAnimation(capture.current.frames);callbacks.current.onCapture(animation,{name:file?file.name:'Microphone',duration:10});stop();setStatus('captured');return}}
    }
    raf.current=requestAnimationFrame(loop);
   };raf.current=requestAnimationFrame(loop);
  }catch(e){stream?.getTracks().forEach(t=>t.stop());if(ctx&&ctx.state!=='closed')await ctx.close();if(id===request.current){setStatus('idle');setError(e.name==='NotAllowedError'?'Accès au micro refusé. Autorisez-le dans le navigateur ou importez un sample.':e.message||'Impossible de lire cette source audio.')}}
 };
 return <section className="audio-reactive"><p className="hint">Importez un sample ou activez le micro. Le son anime votre empreinte ; le mode d’apparition reste au choix.</p><div className="audio-sources"><label className="upload">Importer un sample<input aria-label="Sample audio" type="file" accept="audio/*" hidden disabled={status==='loading'} onChange={e=>{const file=e.target.files[0];e.target.value='';if(file)start(file)}}/></label><button disabled={status==='loading'} onClick={()=>start(null)}>Activer le micro</button></div>{status==='loading'&&<p role="status">Ouverture de la source…</p>}{error&&<p role="alert">{error}</p>}
 {status==='live'&&<><p className="hint">{name} · {runtime.current?.stream?'micro actif, sans retour haut-parleur':'sample en boucle'}</p><meter aria-label="Niveau sonore" min="0" max="1" value={level}/>{[['sensitivity','Sensibilité',25,250],['smoothness','Douceur',0,100],['intensity','Intensité',0,100]].map(([id,label,min,max])=><label className="range-label" key={id}><span>{label}<output>{settings[id]} %</output></span><input aria-label={label} type="range" min={min} max={max} value={settings[id]} onChange={e=>setSettings(s=>({...s,[id]:+e.target.value}))}/></label>)}<button className="primary" disabled={capturing} onClick={()=>{capture.current={start:runtime.current.ctx.currentTime,frames:[]};setElapsed(0);setCapturing(true)}}>{capturing?'Capture en cours…':'Capturer 10 secondes'}</button>{capturing&&<><progress aria-label="Capture audio" max="10" value={elapsed}/><output>{elapsed.toFixed(1)} / 10 s</output></>}<button className="quiet" onClick={()=>{request.current++;stop()}}>Arrêter le son</button></>}
 {status==='captured'&&<p role="status">Capture prête : lecture en boucle, images clés modifiables et export SVG animé.</p>}
 <p className="hint">Volume → amplitude · graves → dilatation · aigus → vibration. Le traitement est local. Le SVG restitue la capture, sans inclure le son.</p></section>;
}
