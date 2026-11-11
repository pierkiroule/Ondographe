import React,{useState} from 'react';
import useAnimationClock from './useAnimationClock';
export default function LibraryPreview({Wave,item}){
 const [playing,setPlaying]=useState(true);
 const [time,setTime]=useAnimationClock(playing&&item.kind==='animé');
 return <><div className="artwork"><Wave item={item} time={time}/></div>{item.kind==='animé'&&<div className="library-transport"><button onClick={()=>setPlaying(!playing)}>{playing?'Pause':'Lire'}</button><output aria-label="Temps de l’aperçu">{time.toFixed(1)} / 30 s</output><button onClick={()=>setTime(0)}>Au début</button></div>}</>;
}
