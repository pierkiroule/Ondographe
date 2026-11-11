import test from 'node:test';
import assert from 'node:assert/strict';
import {APPEARANCES,lineAppearance} from '../src/appearance.js';
import {DURATION,normalizeAnimation} from '../src/animation.js';
import {svgFor} from '../src/rendering.js';
test('appearance modes are bounded, distinct and seamless over 10 seconds',()=>{
 assert.equal(DURATION,10);const signatures=new Set();
 for(const [mode] of APPEARANCES){signatures.add(JSON.stringify(Array.from({length:8},(_,i)=>lineAppearance(mode,3,i,8))));for(let i=0;i<8;i++){const start=lineAppearance(mode,0,i,8),end=lineAppearance(mode,10,i,8);assert.ok(Math.abs(start.opacity-end.opacity)<1e-9);assert.ok(Math.abs(start.reveal-end.reveal)<1e-9);for(let t=0;t<=10;t+=.5){const a=lineAppearance(mode,t,i,8);assert.ok(a.opacity>=0&&a.opacity<=1);assert.ok(a.reveal>=0&&a.reveal<=1)}}}assert.equal(signatures.size,5);
});
test('old keyframes compress to 10 seconds without mutating their values or curves',()=>{
 const old={energy:[{time:0,value:20},{time:15,value:90,curve:[0,0,1,1]},{time:30,value:20}]};const current=normalizeAnimation(old);assert.deepEqual(current.energy.map(k=>k.time),[0,5,10]);assert.equal(old.energy[1].time,15);assert.deepEqual(current.energy[1].curve,[0,0,1,1]);
});
test('animated exports include line appearance and 10s timing; static stays complete',()=>{
 const item={notes:['whorl'],params:{spacing:20,hollow:35},palette:'#b7cdd9',appearance:'draw'};const animated=svgFor(item,true),fixed=svgFor(item);assert.ok(animated.includes('dur="10s"'));assert.ok(!animated.includes('dur="30s"'));assert.ok(animated.includes('attributeName="stroke-dashoffset"'));assert.ok(animated.includes('attributeName="opacity"'));assert.ok(!fixed.includes('<animate'));assert.ok(!fixed.includes('stroke-dashoffset='));
});
