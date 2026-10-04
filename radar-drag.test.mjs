import test from 'node:test';
import assert from 'node:assert/strict';
import {radarPositionAtPoint} from './radar-geometry.js';
import {authoredValueAtPosition,rangePosition} from './model.js';

test('Radar pointer projection inverts rendered radius on every spoke without outward jump',()=>{
 for(let n=3;n<=10;n++)for(let i=0;i<n;i++)for(const t of [0,.1,.5,.9,1]){
  const a=-Math.PI/2+i*2*Math.PI/n;
  assert.ok(Math.abs(radarPositionAtPoint(150+105*t*Math.cos(a),150+105*t*Math.sin(a),a)-t)<1e-12);
 }
});
test('Radar motion keeps full radial sensitivity, rejects tangent displacement and bounds endpoints',()=>{
 const a=.7,position=(r,t=0)=>radarPositionAtPoint(150+r*Math.cos(a)-t*Math.sin(a),150+r*Math.sin(a)+t*Math.cos(a),a);
 assert.ok(Math.abs(position(60)-position(50)-10/105)<1e-12);
 assert.ok(Math.abs(position(50,200)-position(50))<1e-12);
 assert.equal(position(-100),0);assert.equal(position(200),1);
});
test('Radar coordinate correction preserves Dimension authoring policies and arbitrary ranges',()=>{
 const count={min:0,max:10,integerOnly:true},measure={min:-1,max:1},positive={min:10,max:20};
 for(const d of [count,measure,positive]){
  const p=radarPositionAtPoint(150,150-105*.6,-Math.PI/2),v=authoredValueAtPosition(d,p);
  assert.ok(Math.abs(rangePosition(d,v)-.6)<1e-12);
 }
 assert.equal(authoredValueAtPosition(count,.63),6);
 assert.ok(!Number.isInteger(authoredValueAtPosition(measure,.63)));
});
