import test from 'node:test';
import assert from 'node:assert/strict';
import {createEmptyDataset} from './dataset-specification.js';
import {applyDatasetTitle} from './dataset-title.js';
import {fresh,transactDatasetMutation,datasetForWorkspace,datasetForExport,validateDataset,saveIfCurrent,load,WORKSPACE_STORAGE_KEY,DIMENSION_ASSESSMENT_ID as DA,setValue} from './model.js';
import {applyDimensionAndRescale,applyAssessment,deleteDatasetDimension,upgradeDimensionAssessment} from './successor-domain.js';
import {MemoryStorage} from './test-support/workspace-locks.mjs';
const SPEC='draft.github.sukoyaka-dopeness.specification';
const empty=()=>({version:'1.0',entities:[],events:[],relations:[]});
const uses=dataset=>dataset.extensions[SPEC].uses;
const title=(state,value)=>transactDatasetMutation(state,()=>applyDatasetTitle(state.dataset,value));
const dim={id:'d',name:'Dimension',min:0,max:10};

test('new Dataset has an exact finite bootstrap and title lifecycle stays valid through save/reload/Export',()=>{
  const dataset=createEmptyDataset();assert.deepEqual(uses(dataset),[]);
  assert.deepEqual(validateDataset(dataset).diagnostics,[]);
  const state=fresh(dataset);assert.equal(title(state,'test').ok,true);
  assert.deepEqual(uses(state.dataset),[{extension:'metadata',version:'1.0.0'}]);
  assert.deepEqual(state.validation.diagnostics,[]);
  const priorStorage=globalThis.localStorage;globalThis.localStorage=new MemoryStorage();
  try{
    assert.equal(saveIfCurrent(state,null).ok,true);
    const stored=JSON.parse(localStorage.getItem(WORKSPACE_STORAGE_KEY)).dataset;
    const reloaded=load();assert.deepEqual(reloaded.dataset,stored);
    assert.deepEqual(reloaded.validation.diagnostics,[]);
    assert.deepEqual(datasetForExport(reloaded),stored);
    assert.equal(title(reloaded,'').ok,true);
    assert.equal(reloaded.dataset.extensions.metadata,undefined);
    assert.deepEqual(uses(reloaded.dataset),[]);
    assert.equal(title(reloaded,'again').ok,true);
    assert.deepEqual(uses(reloaded.dataset),[{extension:'metadata',version:'1.0.0'}]);
  }finally{globalThis.localStorage=priorStorage;}
});

test('external undeclared Metadata is not migrated on load/save; explicit title edit safely completes known data',()=>{
  const dataset={...empty(),extensions:{metadata:{datasetId:'keep',title:'Old'}}};
  const state=fresh(dataset);assert.deepEqual(datasetForWorkspace(state),dataset);
  const previous=globalThis.localStorage;globalThis.localStorage=new MemoryStorage();
  try{assert.equal(saveIfCurrent(state,null).ok,true);assert.deepEqual(load().dataset,dataset);}finally{globalThis.localStorage=previous;}
  assert.equal(title(state,'New').ok,true);assert.equal(state.dataset.extensions.metadata.datasetId,'keep');
  assert.deepEqual(state.validation.diagnostics,[]);
  assert.equal(title(state,'').ok,true);assert.deepEqual(state.dataset.extensions.metadata,{datasetId:'keep'});
  assert.deepEqual(uses(state.dataset),[{extension:'metadata',version:'1.0.0'}]);
});

test('unknown Dataset/object Extensions and future Dimension payloads prevent partial declaration synthesis',()=>{
  for(const dataset of [
    {...empty(),extensions:{'example.future':{keep:[1]}}},
    {...empty(),entities:[{id:'e',extensions:{'example.future':{keep:[1]}}}]},
    {...empty(),extensions:{[DA]:{specVersion:'9.9.9',dimensions:[],assessments:[]}}},
  ]){
    const before=structuredClone(dataset);const state=fresh(dataset);
    assert.equal(title(state,'test').ok,true);
    assert.equal(state.dataset.extensions[SPEC],undefined);
    assert.ok(state.validation.diagnostics.some(d=>d.code==='extension_version_unspecified'&&d.path==='/extensions/metadata'));
    for(const [id,payload] of Object.entries(before.extensions||{}))assert.deepEqual(state.dataset.extensions[id],payload);
    assert.deepEqual(state.dataset.entities,before.entities);
    assert.equal(datasetForExport(state).extensions[SPEC],undefined);
  }
});

test('existing future/opaque declarations and their additional information are preserved',()=>{
  const declaration={specVersion:'9.9.9',uses:[{extension:'example.future',version:'7.0.0'}],extra:{keep:true}};
  const state=fresh({...empty(),extensions:{[SPEC]:declaration,'example.future':{keep:true}}});
  assert.equal(title(state,'test').ok,true);
  assert.deepEqual(state.dataset.extensions[SPEC],declaration);
  assert.deepEqual(datasetForExport(state).extensions[SPEC],declaration);
});

test('bundled Validator preserves future Specification versions with either supported Dimension Assessment Candidate',()=>{
  for(const version of ['0.1.0','0.2.0']){
    const dataset={...empty(),entities:[{id:'e'}],extensions:{
      [DA]:{specVersion:version,dimensions:[dim],assessments:[{entityId:'e',dimensionId:'d',value:0}]},
      [SPEC]:{specVersion:'9.0.0',uses:[],future:{keep:true}},
    }};
    const before=JSON.stringify(dataset),state=fresh(dataset);
    assert.equal(state.validation.valid,true);
    assert.equal(state.readOnly,false);
    assert.ok(state.validation.diagnostics.some(d=>d.code==='specification_version_unsupported'));
    assert.ok(!state.validation.diagnostics.some(d=>d.code==='dimension_assessment_specification_declaration_count'));
    assert.deepEqual(datasetForWorkspace(state),dataset);
    assert.deepEqual(datasetForExport(state),dataset);
    const previous=globalThis.localStorage;globalThis.localStorage=new MemoryStorage();
    try{
      assert.equal(saveIfCurrent(state,null).ok,true);
      assert.deepEqual(load().dataset,dataset);
    }finally{globalThis.localStorage=previous;}
    assert.equal(JSON.stringify(dataset),before);

    const supported=structuredClone(dataset);
    supported.extensions[SPEC]={specVersion:'0.1.0',uses:[]};
    assert.ok(validateDataset(supported).diagnostics.some(d=>d.code==='dimension_assessment_specification_declaration_count'));
    supported.extensions[SPEC].uses=[{extension:DA,version:version==='0.1.0'?'0.2.0':'0.1.0'}];
    assert.ok(validateDataset(supported).diagnostics.some(d=>d.code==='dimension_assessment_specification_version_conflict'));
    supported.extensions[SPEC].uses[0].version=version;
    assert.equal(validateDataset(supported).valid,true);
  }
});

test('an existing future Metadata version is not downgraded; incomplete declarations remain read-only',()=>{
  const declaration={specVersion:'0.1.0',uses:[{extension:'metadata',version:'9.9.9',extra:'keep'}],extra:{keep:true}};
  const state=fresh({...empty(),extensions:{metadata:{title:'Old'},[SPEC]:declaration}});
  assert.equal(title(state,'test').ok,true);
  assert.deepEqual(state.dataset.extensions[SPEC],declaration);
  const incomplete={...empty(),extensions:{metadata:{title:'Old'},[SPEC]:{specVersion:'0.1.0',uses:[]}}};
  const invalid=fresh(incomplete);assert.equal(invalid.readOnly,true);
  assert.equal(title(invalid,'test').ok,false);assert.deepEqual(invalid.dataset,incomplete);
});

test('supported existing declarations gain only generated Metadata and preserve unknown Extension entries',()=>{
  const declaration={specVersion:'0.1.0',uses:[{extension:'example.future',version:'7.0.0',extra:'keep'}],extra:{keep:true}};
  const state=fresh({...empty(),extensions:{[SPEC]:declaration,'example.future':{keep:true}}});
  assert.equal(title(state,'test').ok,true);
  assert.deepEqual(state.dataset.extensions[SPEC].extra,declaration.extra);
  assert.deepEqual(uses(state.dataset),[...declaration.uses,{extension:'metadata',version:'1.0.0'}]);
  assert.equal(title(state,'').ok,true);assert.deepEqual(state.dataset.extensions[SPEC],declaration);
});

test('generated Dimension and Assessment lifecycle keeps exact declarations',()=>{
  const state=fresh({...empty(),entities:[{id:'e'}]});
  assert.equal(applyDimensionAndRescale(state,dim).ok,true);
  assert.deepEqual(uses(state.dataset),[{extension:DA,version:'0.2.0'}]);
  assert.equal(applyAssessment(state,'e','d',3).ok,true);
  assert.equal(setValue(state,'e','d',4),true);
  assert.deepEqual(state.validation.diagnostics,[]);
  assert.equal(deleteDatasetDimension(state,'d').ok,true);
  assert.deepEqual(state.dataset.extensions[DA].dimensions,[]);
  assert.deepEqual(state.dataset.extensions[DA].assessments,[]);
  assert.deepEqual(uses(state.dataset),[{extension:DA,version:'0.2.0'}]);
});

test('invalid future payload stays read-only, is not repaired and retains its unknown data',()=>{
  const dataset={...empty(),extensions:{[DA]:{specVersion:'9.9.9',future:{keep:[1]}}}};
  const state=fresh(dataset);assert.equal(state.readOnly,true);
  assert.equal(title(state,'test').ok,false);
  assert.deepEqual(datasetForWorkspace(state),dataset);
  assert.deepEqual(datasetForExport(state),dataset);
});

test('explicit legacy Dimension upgrade and direct Assessment edit declare supported versions without migrating on serialization',()=>{
  const dataset={...empty(),entities:[{id:'e'}],extensions:{[DA]:{specVersion:'0.1.0',dimensions:[dim],assessments:[]}}};
  const state=fresh(dataset);assert.equal(datasetForWorkspace(state).extensions[SPEC],undefined);
  assert.equal(upgradeDimensionAssessment(state).ok,true);
  assert.deepEqual(uses(state.dataset),[{extension:DA,version:'0.2.0'}]);
  const legacy=fresh(dataset);assert.equal(setValue(legacy,'e','d',5),true);
  assert.deepEqual(uses(legacy.dataset),[{extension:DA,version:'0.1.0'}]);
});
