import test from 'node:test';
import assert from 'node:assert/strict';
import {PRESETS,presetAnimation,animatedItem} from '../src/animation.js';
import {pointsFor} from '../src/geometry.js';
import {svgFor,lineStyle} from '../src/rendering.js';
const base={notes:['whorl'],params:{spacing:14,hollow:50,centerX:300,centerY:300,organic:65,energy:40,complexity:45,lineWidth:1.6},gestures:[],palette:'#b7cdd9',paper:true,lineStyle:'emboss',seed:123};
test('five ready-to-play presets animate without changing the sculpted source',()=>{
 const signatures=new Set();
 for(const {id} of PRESETS){const item={...base,animation:presetAnimation(id,base.params)};const start=pointsFor(animatedItem(item,0),0),end=pointsFor(animatedItem(item,10),10),mid=pointsFor(animatedItem(item,2.5),2.5);assert.notDeepEqual(mid,start);signatures.add(JSON.stringify(mid));start.forEach((line,i)=>line.forEach(([x,y],j)=>{assert.ok(Math.abs(x-end[i][j][0])<1e-8);assert.ok(Math.abs(y-end[i][j][1])<1e-8)}));assert.equal(item.params.centerX,300)}
 assert.equal(signatures.size,5);
});
test('exports retain paths without any central mask, clip or opaque overlay',()=>{
 const item={...base,notes:['saddle'],animation:presetAnimation('breathe',base.params)};
 const staticSvg=svgFor(item),animatedSvg=svgFor(item,true),engraving=svgFor(item,false,true);
 for(const svg of [staticSvg,animatedSvg,engraving]){assert.ok(!svg.includes('<mask'));assert.ok(!svg.includes('clipPath'));assert.ok(!svg.includes('<circle'));assert.equal((svg.match(/<path /g)||[]).length,pointsFor(item).length)}
 assert.ok(animatedSvg.includes('keyTimes='));assert.ok(staticSvg.includes('filter="url(#relief)"'));assert.ok(staticSvg.includes('filter="url(#paper)"'));assert.ok(!engraving.includes('<rect'));assert.equal(lineStyle({...base,lineStyle:'dotted'}).dash,'1 5');
});
