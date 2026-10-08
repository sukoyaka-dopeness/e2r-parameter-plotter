import test from 'node:test';
import assert from 'node:assert/strict';
import {createDatasetEntity} from './successor-domain.js';
import {entities,fresh,label,load,save} from './model.js';
import {dimensionDisplayName, dimensionNeedsId, entityNeedsId} from './workspace-actions.js';
import {renderProfile} from './views.js';

const dataset=entities=>({version:'1.0',entities,events:[],relations:[]});

class MemoryStorage{
  values=new Map();
  getItem(key){return this.values.get(key)??null;}
  setItem(key,value){this.values.set(key,String(value));}
  removeItem(key){this.values.delete(key);}
}

test('unnamed Dataset Entities retain fallback labels and do not interrupt entity disambiguation',()=>{
  const state=fresh(dataset([{id:'e1',name:'Elara Veyne'},{id:'e2',name:'Garrick Thorn'}]));
  const result=createDatasetEntity(state,{name:'  ',description:'Description without a name'});
  assert.equal(result.ok,true);

  const rows=entities(state);
  assert.equal(Object.hasOwn(rows[2],'name'),false);
  assert.equal(label(rows[2],2),'Entity 3');
  assert.equal(rows[2].description,'Description without a name');
  for(const entity of rows)assert.doesNotThrow(()=>entityNeedsId(state,entity,'pool'));
  assert.equal(entityNeedsId(state,rows[2],'pool'),false);
});

test('named duplicate and visually similar Entities still receive disambiguating IDs',()=>{
  const repeated='Repeated Entity';
  const prefix='A deliberately long shared Entity name prefix ';
  const state=fresh(dataset([
    {id:'duplicate-1',name:repeated},
    {id:'duplicate-2',name:repeated},
    {id:'prefix-1',name:`${prefix}one`},
    {id:'prefix-2',name:`${prefix}two`},
    {id:'unnamed',description:'No display name'},
  ]));
  const rows=entities(state);
  assert.equal(entityNeedsId(state,rows[0],'pool'),true);
  assert.equal(entityNeedsId(state,rows[1],'pool'),true);
  assert.equal(entityNeedsId(state,rows[2],'pool'),true);
  assert.equal(entityNeedsId(state,rows[3],'pool'),true);
  for(const entity of rows)assert.doesNotThrow(()=>entityNeedsId(state,entity,'pool'));
});

test('saved workspaces recover unnamed Entities without changing IDs or fallback labels',()=>{
  const original=globalThis.localStorage,storage=new MemoryStorage();
  globalThis.localStorage=storage;
  try{
    const state=fresh(dataset([{id:'e1',name:'Elara Veyne'}]));
    assert.equal(createDatasetEntity(state,{name:'',description:'Recovered description'}).ok,true);
    const expectedId=state.dataset.entities[1].id;
    assert.equal(save(state),true);

    const recovered=load(),rows=entities(recovered),unnamed=rows[1];
    assert.equal(unnamed.id,expectedId);
    assert.equal(Object.hasOwn(unnamed,'name'),false);
    assert.equal(unnamed.description,'Recovered description');
    assert.equal(label(unnamed,1),'Entity 2');
    for(const entity of rows)assert.doesNotThrow(()=>entityNeedsId(recovered,entity,'pool'));
  }finally{
    if(original===undefined)delete globalThis.localStorage;
    else globalThis.localStorage=original;
  }
});

test('duplicate Dimension display names disambiguate exact duplicates without throwing',()=>{
  const first={id:'dimension-alpha-001',name:'Confidence',low:'Low',high:'High',min:0,max:10,unit:'points'};
  const second={...first,id:'dimension-alpha-002'};
  const state={dimensions:[first,second]};

  assert.equal(dimensionDisplayName(state,first),'Confidence · 0 → 10 · points · lpha-001');
  assert.equal(dimensionDisplayName(state,second),'Confidence · 0 → 10 · points · lpha-002');

  const renderState={selected:'entity-1',readOnly:false,candidateUnsupported:false,dimensions:[first,second]};
  const api={
    state:()=>renderState,
    entities:()=>[{id:'entity-1',name:'Elara Veyne'}],
    name:id=>id==='entity-1'?'Elara Veyne':'',
    entityId:()=>'',
    randomNotice:()=>'',
    dimension:id=>renderState.dimensions.find(d=>d.id===id),
    dimensionName:id=>dimensionDisplayName(renderState,renderState.dimensions.find(d=>d.id===id)),
    get:()=>null,
  };
  const profile=renderProfile(api);
  assert.match(profile,/Confidence · 0 → 10 · points · lpha-001/);
  assert.match(profile,/Confidence · 0 → 10 · points · lpha-002/);
});

test('same-name Dimensions with different ranges keep range labels and do not receive unnecessary IDs',()=>{
  const first={id:'dimension-alpha-001',name:'Confidence',low:'Low',high:'High',min:0,max:10,unit:'points'};
  const second={...first,id:'dimension-alpha-002',min:0,max:100};
  const state={dimensions:[first,second]};

  assert.doesNotThrow(()=>dimensionDisplayName(state,first));
  assert.doesNotThrow(()=>dimensionDisplayName(state,second));
  assert.equal(dimensionDisplayName(state,first),'Confidence · 0 → 10 · points');
  assert.equal(dimensionDisplayName(state,second),'Confidence · 0 → 100 · points');
  assert.equal(dimensionNeedsId(state,first,'selector'),true);
  assert.equal(dimensionNeedsId(state,second,'selector'),true);
});

test('visually similar Dimension names retain existing surface-specific ID disambiguation',()=>{
  const prefix='A deliberately long shared Dimension name prefix ';
  const first={id:'dimension-alpha-001',name:`${prefix}one`,low:'Low',high:'High',min:0,max:10};
  const second={id:'dimension-alpha-002',name:`${prefix}two`,low:'Low',high:'High',min:0,max:10};
  const state={dimensions:[first,second]};

  assert.equal(dimensionDisplayName(state,first),first.name);
  assert.equal(dimensionNeedsId(state,first,'selector'),true);
  assert.equal(dimensionNeedsId(state,second,'selector'),true);
});
