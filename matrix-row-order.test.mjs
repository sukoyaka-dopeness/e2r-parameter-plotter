import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,load,save,entities,matrixEntities,reorderMatrixRow} from './model.js';

const fixture=()=>{
  const s=fresh({version:'1.0',entities:[{id:'a'},{id:'b'},{id:'c'}],events:[],relations:[]});
  s.tempEntities=[{id:'t',temporary:true}];s.values={a:{d:0},t:{d:2.75}};
  s.dimensions=[{id:'d'}];s.matrix=['d'];return s;
};
const ids=s=>matrixEntities(s).map(e=>e.id);

test('Matrix insertion boundaries produce first, middle and last positions without changing shared data',()=>{
  const s=fixture(),shared=JSON.stringify({...s});
  assert.equal(reorderMatrixRow(s,'t',0),true);assert.deepEqual(ids(s),['t','a','b','c']);
  assert.equal(reorderMatrixRow(s,'c',2),true);assert.deepEqual(ids(s),['t','a','c','b']);
  assert.equal(reorderMatrixRow(s,'t',4),true);assert.deepEqual(ids(s),['a','c','b','t']);
  const {matrixRows,...unchanged}=s;assert.equal(JSON.stringify(unchanged),shared);
  assert.deepEqual(entities(s).map(e=>e.id),['a','b','c','t']);
  const prior=JSON.stringify(s);
  for(const [id,gap] of [['t',3],['t',4],['missing',0],['a',-1],['a',5],['a',0.5]])assert.equal(reorderMatrixRow(s,id,gap),false);
  assert.equal(JSON.stringify(s),prior);
});

test('Matrix read-time order ignores stale/duplicate IDs and appends new Entities without repairing session state',()=>{
  const s=fixture(),before=JSON.stringify(s);assert.deepEqual(ids(s),['a','b','c','t']);assert.equal(JSON.stringify(s),before);
  s.matrixRows=['t','missing','b','t'];const stored=JSON.stringify(s.matrixRows);
  assert.deepEqual(ids(s),['t','b','a','c']);assert.equal(JSON.stringify(s.matrixRows),stored);
  s.tempEntities.push({id:'new',temporary:true});assert.deepEqual(ids(s),['t','b','a','c','new']);
  s.tempEntities=s.tempEntities.filter(e=>e.id!=='t');assert.deepEqual(ids(s),['b','a','c','new']);
  assert.equal(JSON.stringify(s.matrixRows),stored);
});

test('Matrix order survives session save/load; older sessions gain no automatic row-order or range migration',()=>{
  const original=globalThis.sessionStorage;let raw;
  globalThis.sessionStorage={getItem:()=>raw,setItem:(_key,value)=>{raw=value;}};
  try{
    const s=fixture();reorderMatrixRow(s,'c',0);save(s);const saved=raw,restored=load();
    assert.deepEqual(ids(restored),['c','a','b','t']);assert.equal(raw,saved);
    assert.deepEqual(restored.values,s.values);assert.deepEqual(entities(restored),entities(s));
    const old=fixture();raw=JSON.stringify(old);const oldRaw=raw,legacy=load();
    assert.deepEqual(ids(legacy),['a','b','c','t']);assert.equal('matrixRows' in legacy,false);
    assert.deepEqual(legacy.dimensions,[{id:'d'}]);assert.equal(raw,oldRaw);
  }finally{if(original===undefined)delete globalThis.sessionStorage;else globalThis.sessionStorage=original;}
});
