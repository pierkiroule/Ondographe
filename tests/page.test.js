import test from 'node:test';
import assert from 'node:assert/strict';
import {FORMATS,pageFor,layoutFor,toMotif,motifTransform} from '../src/page.js';
import {svgFor} from '../src/rendering.js';
const item={notes:['whorl'],params:{spacing:20,hollow:35},palette:'#b7cdd9'};
test('formats preserve aspect ratio and A4 physical dimensions in exports',()=>{
 for(const [format,,width,height,unit] of FORMATS){const w={...item,page:{format,width,height,unit}},p=pageFor(w);assert.ok(Math.abs(p.w/p.h-width/height)<1e-10);const svg=svgFor(w);assert.ok(svg.includes(`width="${width}${unit}"`));assert.ok(svg.includes(`height="${height}${unit}"`));assert.ok(svg.includes(`viewBox="0 0 ${p.w} ${p.h}"`))}
});
test('inverse pointer mapping matches translation, rotation and scale',()=>{
 const w={...item,page:{width:210,height:297,unit:'mm'},layout:{scale:73,rotation:63,x:22,y:-13}},l=layoutFor(w),angle=l.rotation*Math.PI/180;
 for(const [x,y] of [[300,300],[20,600],[415,175]]){const dx=(x-300)*l.scale,dy=(y-300)*l.scale;const p=toMotif(w,l.x+dx*Math.cos(angle)-dy*Math.sin(angle),l.y+dx*Math.sin(angle)+dy*Math.cos(angle));assert.ok(Math.abs(p.x-x)<1e-9);assert.ok(Math.abs(p.y-y)<1e-9)}
 assert.ok(svgFor(w,true).includes(`transform="${motifTransform(w)}"`));
});
test('legacy square projects keep their original 600-unit composition',()=>{
 assert.equal(pageFor(item).w,600);assert.equal(pageFor(item).h,600);assert.deepEqual(toMotif(item,120,230),{x:120,y:230});
});
