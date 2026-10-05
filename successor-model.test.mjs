import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,load,save,readDataset,datasetForWorkspace,exportBaseline,markDatasetModified} from './model.js';
import {DIMENSION_ASSESSMENT_ID} from './model.js';
import {applyAssessment,applyDimensionAndRescale,createDatasetEntity,deleteDatasetEntity,editDatasetEntity,entityDeleteEligibility,rescaledAssessmentValue} from './successor-domain.js';
import {validateDataset} from './vendor/e2r-validator/index.js';

const baseDataset=()=>({version:'1.0',entities:[{id:'e1',name:'Alpha',extensions:{'opaque.example/entity':{keep:[1,2]}}},{id:'e2',name:'Beta'}],events:[],relations:[],extensions:{'opaque.example/dataset':{keep:true}}});
class MemoryStorage{
  values=new Map();failSet=false;
  getItem(key){return this.values.get(key)??null;}
  setItem(key,value){if(this.failSet&&key==='e2r-parameter-plotter-local-workspace-v2')throw new Error('quota');this.values.set(key,String(value));}
  removeItem(key){this.values.delete(key);}
}

test('Candidate payload authoring is Dataset data and retains unknown sibling Extensions',()=>{
  const state=fresh(baseDataset());
  assert.equal(applyDimensionAndRescale(state,{id:'d1',name:'Measure',low:'',high:'',min:-2.7,max:3.6,integerOnly:true}).ok,true);
  assert.equal(applyAssessment(state,'e1','d1',0).ok,true);
  const dataset=datasetForWorkspace(state);
  assert.deepEqual(dataset.extensions['opaque.example/dataset'],{keep:true});
  assert.deepEqual(dataset.entities[0].extensions['opaque.example/entity'],{keep:[1,2]});
  assert.deepEqual(dataset.extensions[DIMENSION_ASSESSMENT_ID].assessments,[{entityId:'e1',dimensionId:'d1',value:0}]);
  assert.equal(validateDataset(dataset).valid,true);
  assert.equal(state.datasetModified,true);
});

test('Entity edits only touch allowlisted labels; blank removes, nonblank text is preserved',()=>{
  const state=fresh(baseDataset());
  assert.equal(editDatasetEntity(state,'e1',{name:'  Alpha  ',description:'  Notes  '}).ok,true);
  assert.equal(state.dataset.entities[0].name,'  Alpha  ');
  assert.equal(state.dataset.entities[0].description,'  Notes  ');
  assert.equal(editDatasetEntity(state,'e1',{name:' \t ',description:' '}).ok,true);
  assert.equal(Object.hasOwn(state.dataset.entities[0],'name'),false);
  assert.equal(Object.hasOwn(state.dataset.entities[0],'description'),false);
  assert.deepEqual(state.dataset.entities[0].extensions,{'opaque.example/entity':{keep:[1,2]}});
});

test('Entity creation is direct and deletion is blocked by Relations then cleans Candidate assessments only',()=>{
  const state=fresh({version:'1.0',entities:[{id:'e1',name:'Alpha'},{id:'e2',name:'Beta'}],events:[],relations:[]});
  assert.equal(applyDimensionAndRescale(state,{id:'d1',name:'Measure',low:'',high:'',min:0,max:10}).ok,true);
  assert.equal(applyAssessment(state,'e1','d1',4).ok,true);
  state.dataset.relations.push({id:'r1',sourceId:'e1',targetId:'e2'});
  state.validation=validateDataset(state.dataset);
  assert.equal(entityDeleteEligibility(state,'e1').allowed,false);
  state.dataset.relations=[];state.validation=validateDataset(state.dataset);
  const created=createDatasetEntity(state,{name:'New Entity',description:''});
  assert.equal(created.ok,true);
  assert.equal(state.dataset.entities.at(-1).name,'New Entity');
  assert.equal(deleteDatasetEntity(state,'e1').ok,true);
  assert.deepEqual(datasetForWorkspace(state).extensions[DIMENSION_ASSESSMENT_ID].assessments,[]);
});

test('Rescale uses linear position and integer ties away from zero',()=>{
  const old={min:0,max:10},next={min:-1,max:1,integerOnly:true};
  assert.equal(rescaledAssessmentValue(7.5,old,next),1);
  assert.equal(rescaledAssessmentValue(2.5,old,next),-1);
  assert.equal(rescaledAssessmentValue(0,{min:-1e308,max:1e308},{min:0,max:10}),5);
  assert.equal(rescaledAssessmentValue(5e-301,{min:0,max:1e-300},{min:-10,max:10}),0);
});

test('Validator-invalid Dataset is read-only, but warning-only unknown data remains inspectable',()=>{
  const invalid=baseDataset();invalid.extensions[DIMENSION_ASSESSMENT_ID]={specVersion:'0.1.0',dimensions:[],assessments:[{entityId:'missing',dimensionId:'d',value:0}]};
  const state=fresh(invalid);
  assert.equal(state.readOnly,true);
  assert.equal(createDatasetEntity(state,{name:'x'}).ok,false);
  const warning=fresh(baseDataset());
  assert.equal(warning.readOnly,false);
  assert.ok(warning.validation.diagnostics.some(item=>item.code==='unknown_extension'));
  assert.equal(editDatasetEntity(warning,'e1',{name:'Changed'}).ok,true);
});

test('Candidate B tempEntities in old sessionStorage are not migrated',()=>{
  const original=globalThis.localStorage,originalSession=globalThis.sessionStorage;
  globalThis.localStorage=new MemoryStorage();
  globalThis.sessionStorage={getItem:()=>JSON.stringify({tempEntities:[{id:'temp:legacy'}]})};
  try{const state=load();assert.equal(state.dataset.entities.length,0);assert.equal(state.dimensions.length,0);assert.deepEqual(state.tempEntities,[]);assert.equal(state.dataset.entities.some(entity=>entity.id==='temp:legacy'),false);}
  finally{globalThis.localStorage=original;globalThis.sessionStorage=originalSession;}
});

test('failed restored-workspace persistence preserves the prior browser copy and reports degraded state',()=>{
  const original=globalThis.localStorage,storage=new MemoryStorage();globalThis.localStorage=storage;
  try{
    const prior=fresh(baseDataset());assert.equal(save(prior),true);const old=storage.getItem('e2r-parameter-plotter-local-workspace-v2');
    const incoming=fresh({...baseDataset(),entities:[{id:'new',name:'Incoming'}]});storage.failSet=true;
    assert.equal(save(incoming,{preservePrevious:true}),false);
    assert.equal(storage.getItem('e2r-parameter-plotter-local-workspace-v2'),old);
    assert.equal(incoming.persistence.status,'degraded');
    assert.equal(incoming.dataset.entities[0].id,'new');
  }finally{globalThis.localStorage=original;}
});

test('unreadable browser workspace remains untouched while degraded editing continues in memory',()=>{
  const original=globalThis.localStorage,storage={value:'not-json',getItem(){return this.value;},setItem(_key,value){this.value=String(value);},removeItem(){this.value=null;}};globalThis.localStorage=storage;
  try{
    const state=load();assert.equal(state.persistence.status,'degraded');assert.equal(state.dataset.entities.length,0);
    assert.equal(createDatasetEntity(state,{name:'Memory only'}).ok,true);
    assert.equal(save(state),false);assert.equal(storage.value,'not-json');assert.equal(state.persistence.status,'degraded');
  }finally{globalThis.localStorage=original;}
});

test('successful Dataset Export baseline affects only Dataset dirty status',()=>{
  const state=fresh(baseDataset());markDatasetModified(state);state.pendingDraft=true;state.persistence.status='saved';
  exportBaseline(state);
  assert.equal(state.datasetModified,false);assert.equal(state.pendingDraft,true);assert.equal(state.persistence.status,'saved');
});

test('readDataset keeps parseable Validator errors available for inspection',()=>{
  const value=baseDataset();value.relations=[{id:'r1',sourceId:'missing',targetId:'e1'}];
  assert.equal(readDataset(value),value);
  assert.equal(validateDataset(value).valid,false);
});
