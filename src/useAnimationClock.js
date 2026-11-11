import {useEffect,useState} from 'react';
import {DURATION} from './animation.js';
// A shared preview clock: no hidden-tab catch-up and no render loop at display refresh rate.
export default function useAnimationClock(active){
 const [time,setTime]=useState(0);
 useEffect(()=>{
  if(!active)return;
  let frame,last=null,paint=null;
  const reset=()=>{last=null;paint=null};
  const tick=now=>{
   if(document.hidden){reset()}else{
    if(last===null){last=now;paint=now}
    if(now-paint>=1000/30){const elapsed=(now-last)/1000;last=now;paint=now;setTime(t=>(t+elapsed)%DURATION)}
   }
   frame=requestAnimationFrame(tick);
  };
  document.addEventListener('visibilitychange',reset);
  frame=requestAnimationFrame(tick);
  return()=>{cancelAnimationFrame(frame);document.removeEventListener('visibilitychange',reset)};
 },[active]);
 return [time,setTime];
}
