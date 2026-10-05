import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,load,save,getValue,setValue,acceptsDimensionValue,dimensionValueIssue,rangePosition,authoredValueAtPosition,plottedEntities,waitingCandidates} from './model.js';
import {numericError} from './field-validation.js';
import {randomDimensionValue} from './profile-random.js';

test('Dimension-local integer constraint rejects new decimals but does not constrain a neighboring Dimension',()=>{
  const s=fresh({version:'1.0',entities:[{id:'e'}],events:[],relations:[]});
  s.dimensions=[{id:'i',min:-2.5,max:3.5,integerOnly:true},{id:'d',min:-2.5,max:3.5}];
  assert.equal(setValue(s,'e','i',2),true);
  assert.equal(setValue(s,'e','i',2.5),false);
  assert.equal(getValue(s,'e','i'),2);
  assert.match(numericError('2.5',false,s.dimensions[0]),/integer/);
  assert.equal(setValue(s,'e','d',2.5),true);
  assert.equal(setValue(s,'e','i',0),true);
  assert.equal(getValue(s,'e','i'),0);
  assert.equal(setValue(s,'e','i',null),true);
  assert.equal(getValue(s,'e','i'),null);
});

test('enabling the constraint retains decimal records and excludes them from plot and waiting positions',()=>{
  const s=fresh({version:'1.0',entities:[{id:'e'}],events:[],relations:[]});
  s.dimensions=[{id:'x',min:0,max:10},{id:'y',min:0,max:10}];s.quadrant=['x','y'];
  setValue(s,'e','x',2.5);setValue(s,'e','y',3);
  const before=JSON.stringify(s.values);s.dimensions[0].integerOnly=true;
  assert.equal(JSON.stringify(s.values),before);
  assert.equal(dimensionValueIssue(s.dimensions[0],2.5),'violates integer-only constraint');
  assert.equal(rangePosition(s.dimensions[0],2.5),null);
  assert.equal(plottedEntities(s).length,0);assert.equal(waitingCandidates(s).length,0);
  s.dimensions[0].integerOnly=false;assert.equal(plottedEntities(s).length,1);
});

test('integer pointer candidates fit fractional bounds and no-candidate ranges return no edit',()=>{
  const d={min:-2.7,max:3.6,integerOnly:true};
  for(const p of [0,0.1,0.5,0.9,1])assert.ok(acceptsDimensionValue(d,authoredValueAtPosition(d,p)));
  assert.equal(authoredValueAtPosition(d,0),-2);assert.equal(authoredValueAtPosition(d,1),3);
  assert.equal(authoredValueAtPosition({min:0.2,max:0.8,integerOnly:true},0.5),null);
  assert.equal(authoredValueAtPosition({min:1,max:8},0.5),4.5);
  assert.equal(randomDimensionValue(d,()=>0),-2);
  assert.equal(randomDimensionValue({min:1,max:8},()=>0.5),4.5);
});

test('browser-local reload preserves Candidate Dimension policy and retained violating records',()=>{
  const original=globalThis.localStorage,values=new Map();
  globalThis.localStorage={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,String(value)),removeItem:key=>values.delete(key)};
  try{
    const s=fresh({version:'1.0',entities:[{id:'e'}],events:[],relations:[],extensions:{'draft.github.sukoyaka-dopeness.dimension-assessment':{specVersion:'0.1.0',dimensions:[{id:'i',name:'Count',min:0,max:10,integerOnly:true},{id:'legacy',name:'Legacy',min:0,max:10}],assessments:[{entityId:'e',dimensionId:'i',value:2.5}]}}});
    assert.equal(save(s),true);
    const restored=load();assert.deepEqual(restored.dimensions,s.dimensions);assert.deepEqual(restored.values,s.values);
  }finally{if(original===undefined)delete globalThis.localStorage;else globalThis.localStorage=original;}
});
