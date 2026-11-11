import test from 'node:test';import assert from 'node:assert/strict';
import {audioParams,captureAnimation} from '../src/audio.js';
import {svgFor} from '../src/rendering.js';
test('live audio mapping responds to bands and intensity',()=>{
 const quiet=audioParams({volume:0,bass:0,treble:0}),loud=audioParams({volume:.8,bass:.7,treble:.6});assert.ok(loud.energy>quiet.energy);assert.ok(loud.breath>quiet.breath);assert.ok(loud.organic>quiet.organic);assert.deepEqual(audioParams({volume:1,bass:1,treble:1},100,0),quiet);
});
test('capture builds editable tracks with seamless 10s endpoints and audio-free export',()=>{
 const animation=captureAnimation([{time:.02,params:audioParams({volume:.2,bass:.1,treble:.3})},{time:5,params:audioParams({volume:.9,bass:.8,treble:.7})},{time:9.8,params:audioParams({volume:.5,bass:.3,treble:.8})}]);for(const keys of Object.values(animation)){assert.equal(keys[0].time,0);assert.equal(keys.at(-1).time,10);assert.equal(keys[0].value,keys.at(-1).value);assert.ok(keys.length>=4)}const svg=svgFor({notes:['whorl'],params:{spacing:20},animation,appearance:'echo',palette:'#b7cdd9'},true);assert.ok(svg.includes('dur="10s"'));assert.ok(svg.includes('attributeName="opacity"'));assert.ok(!svg.includes('<audio'));assert.throws(()=>captureAnimation([]));
});
