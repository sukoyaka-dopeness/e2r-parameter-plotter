import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,load,save,entities,matrixEntities,reorderMatrixRow} from './model.js';

const fixture=()=>{
  const s=fresh({version:'1.0',entities:[{id:'a'},{id:'b'},{id:'c'},{id:'t'}],events:[],relations:[],extensions:{'draft.github.sukoyaka-dopeness.dimension-assessment':{specVersion:'0.1.0',dimensions:[{id:'d',name:'Dimension',min:0,max:10}],assessments:[{entityId:'a',dimensionId:'d',value:0},{entityId:'t',dimensionId:'d',value:2.75}]}}});
  s.matrix=['d'];return s;
};
const ids=s=>matrixEntities(s).map(e=>e.id);

test('Matrix insertion boundaries produce first, middle and last positions without changing shared data',()=>{
  const s=fixture(),shared=JSON.stringify({dataset:s.dataset,dimensions:s.dimensions,values:s.values});
  assert.equal(reorderMatrixRow(s,'t',0),true);assert.deepEqual(ids(s),['t','a','b','c']);
  assert.equal(reorderMatrixRow(s,'c',2),true);assert.deepEqual(ids(s),['t','a','c','b']);
  assert.equal(reorderMatrixRow(s,'t',4),true);assert.deepEqual(ids(s),['a','c','b','t']);
  assert.equal(JSON.stringify({dataset:s.dataset,dimensions:s.dimensions,values:s.values}),shared);
  assert.deepEqual(entities(s).map(e=>e.id),['a','b','c','t']);
  const prior=JSON.stringify(s);
  for(const [id,gap] of [['t',3],['t',4],['missing',0],['a',-1],['a',5],['a',0.5]])assert.equal(reorderMatrixRow(s,id,gap),false);
  assert.equal(JSON.stringify(s),prior);
});

test('Matrix read-time order ignores stale/duplicate IDs and appends Dataset Entities without repairing workspace state',()=>{
  const s=fixture(),before=JSON.stringify(s);assert.deepEqual(ids(s),['a','b','c','t']);assert.equal(JSON.stringify(s),before);
  s.matrixRows=['t','missing','b','t'];const stored=JSON.stringify(s.matrixRows);
  assert.deepEqual(ids(s),['t','b','a','c']);assert.equal(JSON.stringify(s.matrixRows),stored);
  s.dataset.entities.push({id:'new'});assert.deepEqual(ids(s),['t','b','a','c','new']);
  s.dataset.entities=s.dataset.entities.filter(e=>e.id!=='t');assert.deepEqual(ids(s),['b','a','c','new']);
  assert.equal(JSON.stringify(s.matrixRows),stored);
});

test('Matrix order survives browser-local save/load; Candidate B session state is not imported',()=>{
  const original=globalThis.localStorage,originalSession=globalThis.sessionStorage,store=new Map();let raw;
  globalThis.localStorage={getItem:key=>store.get(key)??null,setItem:(key,value)=>{raw=String(value);store.set(key,raw);},removeItem:key=>store.delete(key)};
  globalThis.sessionStorage={getItem:()=>JSON.stringify({tempEntities:[{id:'legacy-temp'}]})};
  try{
    const s=fixture();reorderMatrixRow(s,'c',0);save(s);const saved=raw,restored=load();
    assert.deepEqual(ids(restored),['c','a','b','t']);assert.equal(raw,saved);
    assert.deepEqual(restored.values,s.values);assert.deepEqual(entities(restored),entities(s));
    assert.equal(restored.dataset.entities.some(entity=>entity.id==='legacy-temp'),false);
  }finally{if(original===undefined)delete globalThis.localStorage;else globalThis.localStorage=original;if(originalSession===undefined)delete globalThis.sessionStorage;else globalThis.sessionStorage=originalSession;}
});
