import {presetAnimation,DURATION} from './animation.js';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function analyzeSamples(data,sampleRate){
 if(!data?.length||!sampleRate)throw Error('Le son est vide.');
 let sum=0,crossings=0,change=0,seed=2166136261;const envelope=Array(16).fill(0),counts=Array(16).fill(0);
 const stride=Math.max(1,Math.floor(data.length/150000));let count=0,last=0;
 for(let i=0;i<data.length;i+=stride){const v=data[i];if(!Number.isFinite(v))throw Error('Signal invalide.');sum+=v*v;if(count&&(v>=0)!==(last>=0))crossings++;change+=Math.abs(v-last);last=v;count++;const bin=Math.min(15,Math.floor(i/data.length*16));envelope[bin]+=v*v;counts[bin]++;seed=Math.imul(seed^Math.round((v+1)*32767),16777619)>>>0}
 const rms=Math.sqrt(sum/count),variation=change/count,brightness=crossings/Math.max(1,count-1);
 return {rms,variation,brightness,seed,duration:data.length/sampleRate,envelope:envelope.map((sum,i)=>Math.sqrt(sum/Math.max(1,counts[i])))};
}
export function soundProposal(base,features,name){
 const {rms,brightness,variation,seed,envelope}=features;
 const params={...base.params,energy:clamp(Math.round(rms*250),8,90),organic:clamp(Math.round(35+variation*180),20,95),complexity:clamp(Math.round(brightness*200+25),15,95),waves:clamp(Math.round(2+brightness*16),2,10),spacing:clamp(Math.round(16-rms*20-brightness*8),5,20),hollow:clamp(Math.round(25+rms*60),15,70),centerX:300,centerY:300};
 const preset=brightness>.22?'ripple':variation>.12?'orbit':'breathe';
 const work={...base,seed,name:name.replace(/\.[^.]+$/,'')||'Résonance sonore',notes:[brightness>.3?'rosette':brightness>.12?'double':rms>.15?'arch':'whorl'],params,gestures:[],kind:'animé',appearance:'echo',preset,animation:presetAnimation(preset,params),sourceAudio:{name,duration:features.duration,rms,brightness}};
 const max=Math.max(...envelope,.001);work.animation.energy=envelope.map((v,i)=>({time:i*DURATION/16,value:clamp(Math.round(15+v/max*65),5,95),curve:[.42,0,.58,1]}));work.animation.energy.push({...work.animation.energy[0],time:DURATION});
 const {fixedSnapshot,...rest}=work;
 return {...work,fixedSnapshot:{...rest,kind:'fixe',animation:{},preset:null}};
}
