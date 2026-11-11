import test from 'node:test';
import assert from 'node:assert/strict';
import {analyzeSamples,soundProposal} from '../src/resonance.js';
import {pointsFor} from '../src/geometry.js';
import {svgFor} from '../src/rendering.js';
const tone=(hz,amplitude=.3)=>Float32Array.from({length:24000},(_,i)=>Math.sin(i*2*Math.PI*hz/24000)*amplitude*(.5+.5*i/24000));
const base={params:{spacing:11,hollow:35,lineWidth:1.6,centerX:300,centerY:300},notes:['whorl'],palette:'#b7cdd9',gestures:[],lineStyle:'emboss'};
test('audio analysis distinguishes signals and is deterministic',()=>{
 const low=analyzeSamples(tone(100),24000),high=analyzeSamples(tone(6000,.7),24000);
 assert.ok(high.brightness>low.brightness);assert.ok(high.rms>low.rms);assert.notEqual(high.seed,low.seed);assert.equal(low.duration,1);assert.equal(low.envelope.length,16);assert.deepEqual(analyzeSamples(tone(100),24000),low);assert.throws(()=>analyzeSamples([],24000));
});
test('the sound produces editable fixed and animated versions, looping for 30s',()=>{
 const proposal=soundProposal(base,analyzeSamples(tone(1000),24000),'foret.wav');
 assert.equal(proposal.fixedSnapshot.kind,'fixe');assert.deepEqual(proposal.fixedSnapshot.animation,{});assert.equal(proposal.kind,'animé');assert.equal(proposal.sourceAudio.name,'foret.wav');assert.equal(proposal.animation.energy.at(-1).time,30);assert.equal(proposal.animation.energy.at(-1).value,proposal.animation.energy[0].value);assert.ok(svgFor(proposal,true).includes('dur="30s"'));assert.ok(!svgFor(proposal.fixedSnapshot).includes('<animate'));assert.equal(base.params.spacing,11);
});
test('number of waves changes contours while preserving line topology',()=>{
 for(const motif of ['whorl','loop','double','arch','saddle','rosette']){const a=pointsFor({...base,notes:[motif],params:{...base.params,waves:2}}),b=pointsFor({...base,notes:[motif],params:{...base.params,waves:8}});assert.equal(a.length,b.length);assert.notDeepEqual(a,b)}
});
