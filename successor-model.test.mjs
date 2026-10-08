import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,load,save,readDataset,datasetForWorkspace,exportBaseline,markDatasetModified} from './model.js';
import {DIMENSION_ASSESSMENT_ID} from './model.js';
import {applyAssessment,applyDimensionAndRescale,createDatasetEntity,deleteDatasetEntity,editDatasetEntity,entityDeleteEligibility,rescaledAssessmentValue,upgradeDimensionAssessment} from './successor-domain.js';
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

test('new Dimension authoring starts Candidate 0.2.0 and preserves Description text exactly',()=>{
  const state=fresh(baseDataset());
  const description='  Line one <tag> & **plain text**\nLine two  ';
  assert.equal(applyDimensionAndRescale(state,{id:'d1',name:'Measure',low:'Low',high:'High',min:0,max:10,description}).ok,true);
  assert.equal(applyAssessment(state,'e1','d1',0).ok,true);
  const dataset=datasetForWorkspace(state),payload=dataset.extensions[DIMENSION_ASSESSMENT_ID];
  assert.equal(payload.specVersion,'0.2.0');
  assert.equal(payload.dimensions[0].description,description);
  assert.equal(validateDataset(dataset).valid,true);
});

test('Candidate 0.2.0 Description survives browser-local reload and the Export Dataset baseline',()=>{
  const original=globalThis.localStorage;globalThis.localStorage=new MemoryStorage();
  try{
    const state=fresh(baseDataset());
    const description='Meaning & range: <low> to high.\nSecond line — Japanese: 評価';
    assert.equal(applyDimensionAndRescale(state,{id:'d1',name:'Measure',low:'',high:'',min:0,max:10,description}).ok,true);
    assert.equal(save(state),true);
    const recovered=load();
    assert.equal(recovered.dataset.extensions[DIMENSION_ASSESSMENT_ID].specVersion,'0.2.0');
    assert.equal(recovered.dimensions[0].description,description);
    exportBaseline(recovered);
    assert.equal(recovered.dataset.extensions[DIMENSION_ASSESSMENT_ID].dimensions[0].description,description);
    assert.equal(validateDataset(recovered.dataset).valid,true);
  }finally{globalThis.localStorage=original;}
});

test('Candidate 0.2.0 validator accepts omitted, multiline, marked-up, and long plain-text descriptions only',()=>{
  const dataset=baseDataset();
  const dimension={id:'d1',name:'Measure',min:0,max:10};
  const payload={specVersion:'0.2.0',dimensions:[dimension],assessments:[]};
  dataset.extensions[DIMENSION_ASSESSMENT_ID]=payload;
  assert.equal(validateDataset(dataset).valid,true);
  dimension.description='  first line\n**literal Markdown** & <text>\n'+('long '.repeat(500));
  assert.equal(validateDataset(dataset).valid,true);
  for(const description of ['', ' \t\n ' , 4]){
    dimension.description=description;
    assert.equal(validateDataset(dataset).valid,false);
  }
});

test('unsupported Candidate version remains opaque and cannot be implicitly downgraded',()=>{
  const dataset=baseDataset();dataset.extensions[DIMENSION_ASSESSMENT_ID]={specVersion:'0.3.0',future:[1,2,3]};
  const state=fresh(dataset);
  assert.equal(state.candidateUnsupported,true);
  assert.deepEqual(datasetForWorkspace(state).extensions[DIMENSION_ASSESSMENT_ID],{specVersion:'0.3.0',future:[1,2,3]});
});

test('Candidate 0.1.0 remains unchanged during ordinary edits and explicit upgrade preserves payload data',()=>{
  const dataset=baseDataset();
  delete dataset.extensions['opaque.example/dataset'];
  delete dataset.entities[0].extensions;
  dataset.extensions[DIMENSION_ASSESSMENT_ID]={specVersion:'0.1.0',dimensions:[{id:'d1',name:'Measure',min:-2,max:8,integerOnly:true,lowLabel:'Low',highLabel:'High'}],assessments:[{entityId:'e1',dimensionId:'d1',value:0}]};
  dataset.extensions['draft.github.sukoyaka-dopeness.specification']={specVersion:'0.1.0',uses:[{extension:DIMENSION_ASSESSMENT_ID,version:'0.1.0'}]};
  const state=fresh(dataset);
  assert.equal(state.dimensions[0].description,undefined);
  assert.equal(applyDimensionAndRescale(state,{...state.dimensions[0],name:'Measure revised'}).ok,true);
  assert.equal(datasetForWorkspace(state).extensions[DIMENSION_ASSESSMENT_ID].specVersion,'0.1.0');
  assert.equal(Object.hasOwn(datasetForWorkspace(state).extensions[DIMENSION_ASSESSMENT_ID].dimensions[0],'description'),false);
  const prior=structuredClone(state.dataset);
  assert.equal(upgradeDimensionAssessment(state).ok,true);
  const upgraded=datasetForWorkspace(state),payload=upgraded.extensions[DIMENSION_ASSESSMENT_ID];
  assert.equal(payload.specVersion,'0.2.0');
  assert.deepEqual(payload.dimensions,[{id:'d1',name:'Measure revised',min:-2,max:8,integerOnly:true,lowLabel:'Low',highLabel:'High'}]);
  assert.deepEqual(payload.assessments,[{entityId:'e1',dimensionId:'d1',value:0}]);
  assert.equal(upgraded.extensions['draft.github.sukoyaka-dopeness.specification'].uses[0].version,'0.2.0');
  assert.deepEqual(upgraded.entities,prior.entities);
  assert.equal(validateDataset(upgraded).valid,true);
  assert.equal(applyDimensionAndRescale(state,{...state.dimensions[0],description:'Added after explicit upgrade.'}).ok,true);
  const edited=datasetForWorkspace(state).extensions[DIMENSION_ASSESSMENT_ID];
  assert.equal(edited.specVersion,'0.2.0');
  assert.equal(edited.dimensions[0].description,'Added after explicit upgrade.');
  assert.deepEqual(edited.assessments,[{entityId:'e1',dimensionId:'d1',value:0}]);
});

test('explicit Candidate upgrade rolls back when the resulting Dataset fails validation',()=>{
  const dataset=baseDataset();
  dataset.extensions[DIMENSION_ASSESSMENT_ID]={specVersion:'0.1.0',dimensions:[{id:'d1',name:'Measure',min:0,max:10}],assessments:[{entityId:'e1',dimensionId:'d1',value:0}]};
  const state=fresh(dataset),before=structuredClone(state.dataset);
  // Force the validator boundary to reject the prepared version change.
  state.values.e1.d1=11;
  const rejected=upgradeDimensionAssessment(state);
  assert.equal(rejected.ok,false);
  assert.equal(state.dataset.extensions[DIMENSION_ASSESSMENT_ID].specVersion,'0.1.0');
  assert.deepEqual(state.dataset,before);
  assert.equal(state.values.e1.d1,11);
  assert.equal(validateDataset(before).valid,true);
});

test('upgrade preserves opaque sibling Extensions and does not invent a Specification Extension',()=>{
  const dataset=baseDataset();
  dataset.extensions[DIMENSION_ASSESSMENT_ID]={specVersion:'0.1.0',dimensions:[{id:'d1',name:'Measure',min:0,max:10}],assessments:[]};
  const state=fresh(dataset);
  assert.equal(upgradeDimensionAssessment(state).ok,true);
  const upgraded=datasetForWorkspace(state);
  assert.equal(upgraded.extensions[DIMENSION_ASSESSMENT_ID].specVersion,'0.2.0');
  assert.deepEqual(upgraded.extensions['opaque.example/dataset'],{keep:true});
  assert.deepEqual(upgraded.entities[0].extensions,{'opaque.example/entity':{keep:[1,2]}});
  assert.equal(Object.hasOwn(upgraded.extensions,'draft.github.sukoyaka-dopeness.specification'),false);
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

test('reviewed Rescale commits its Dimension and Assessment together or leaves both unchanged',()=>{
  const state=fresh(baseDataset());
  assert.equal(applyDimensionAndRescale(state,{id:'d1',name:'Measure',low:'Low',high:'High',endpointLabelsPresent:true,min:0,max:10}).ok,true);
  assert.equal(applyAssessment(state,'e1','d1',7).ok,true);
  exportBaseline(state);
  const result=applyDimensionAndRescale(state,{id:'d1',name:'Measure',low:'Low',high:'High',endpointLabelsPresent:true,min:0,max:5},{e1:3.5});
  assert.equal(result.ok,true);
  assert.equal(state.dimensions[0].max,5);
  assert.equal(state.values.e1.d1,3.5);
  assert.equal(state.datasetModified,true);
  assert.equal(state.datasetBaseline.includes('"max":10'),true);

  const unchanged={dimension:structuredClone(state.dimensions[0]),value:state.values.e1.d1,dirty:state.datasetModified};
  const rejected=applyDimensionAndRescale(state,{id:'d1',name:'Measure',low:'Low',high:'High',endpointLabelsPresent:true,min:0,max:2},{e1:3.5});
  assert.equal(rejected.ok,false);
  assert.deepEqual(state.dimensions[0],unchanged.dimension);
  assert.equal(state.values.e1.d1,unchanged.value);
  assert.equal(state.datasetModified,unchanged.dirty);
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

test('failed browser-local persistence preserves the last stored copy and reports degraded state',()=>{
  const original=globalThis.localStorage,storage=new MemoryStorage();globalThis.localStorage=storage;
  try{
    const prior=fresh(baseDataset());assert.equal(save(prior),true);const old=storage.getItem('e2r-parameter-plotter-local-workspace-v2');
    const incoming=fresh({...baseDataset(),entities:[{id:'new',name:'Incoming'}]});storage.failSet=true;
    assert.equal(save(incoming),false);
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
