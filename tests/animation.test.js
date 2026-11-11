import test from 'node:test';
import assert from 'node:assert/strict';
import {valueAt,animatedItem,easing} from '../src/animation.js';
test('keyframe interpolation holds endpoints and honors linear time',()=>{
 const keys=[{time:5,value:20,curve:[0,0,1,1]},{time:25,value:80}];
 assert.equal(valueAt([],10,45),45);
 assert.equal(valueAt(keys,0,0),20);
 assert.equal(valueAt(keys,30,0),80);
 assert.ok(Math.abs(valueAt(keys,10,0)-35)<.001);
});
test('Bezier easing changes the transition while preserving endpoints',()=>{
 assert.ok(easing(.25,[.42,0,1,1])<.25);
 assert.ok(easing(.25,[0,0,.58,1])>.25);
 assert.ok(easing(0)<.00001);
 assert.ok(easing(1)>.99999);
});
test('animation keeps topology and source parameters intact',()=>{
 const item={params:{energy:40,organic:65,complexity:45,density:50},animation:{energy:[{time:0,value:0,curve:[0,0,1,1]},{time:30,value:100}]}};
 const evaluated=animatedItem(item,15);
 assert.ok(Math.abs(evaluated.params.energy-50)<.001);
 assert.equal(evaluated.params.density,50);
 assert.equal(item.params.energy,40);
});
