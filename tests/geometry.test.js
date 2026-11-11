import test from 'node:test';
import assert from 'node:assert/strict';
import {MOTIFS,pointsFor,centerFor,motifFor} from '../src/geometry.js';
const item={notes:['whorl'],params:{spacing:10,hollow:45,centerX:300,centerY:300,energy:40,organic:65,complexity:45},seed:123,gestures:[]};
test('six distinct finite motifs with consistent animation topology',()=>{
 const signatures=new Set();
 for(const [id] of MOTIFS){const w={...item,notes:[id]},a=pointsFor(w),b=pointsFor(w,12);signatures.add(JSON.stringify(a));assert.equal(a.length,b.length);a.forEach((line,i)=>{assert.equal(line.length,b[i].length);assert.ok(line.flat().every(Number.isFinite))})}
 assert.equal(signatures.size,6);
});
test('spacing changes line count and center translates the whole field',()=>{
 const a=pointsFor(item);assert.ok(pointsFor({...item,params:{...item.params,spacing:20}}).length<a.length);
 const b=pointsFor({...item,params:{...item.params,centerX:350,centerY:240}});
 a.forEach((line,i)=>line.forEach(([x,y],j)=>{assert.ok(Math.abs(b[i][j][0]-x-50)<1e-9);assert.ok(Math.abs(b[i][j][1]-y+60)<1e-9)}));
});
test('older saved works have usable center, spacing and motif defaults',()=>{
 const old={notes:['🌊'],params:{density:50},seed:1,gestures:[]};assert.equal(motifFor(old),'arch');assert.deepEqual(centerFor(old),[300,300]);assert.ok(pointsFor(old).flat(2).every(Number.isFinite));
});
test('wave count modifies all motif families without changing topology',()=>{
 for(const [motif] of MOTIFS){const a=pointsFor({...item,notes:[motif],params:{...item.params,waves:2}}),b=pointsFor({...item,notes:[motif],params:{...item.params,waves:8}});assert.equal(a.length,b.length);assert.notDeepEqual(a,b)}
});
