import test from 'node:test';
import assert from 'node:assert/strict';
import {endpointBoundaryText,endpointRangeText,endpointText,hasAuthoredEndpointLabel} from './endpoint-presentation.js';
import {renderProfile,renderQuadrant,renderRadar,renderMatrix} from './views.js';

const dimension=(id,labels=false)=>({
 id,name:`Dimension ${id}`,low:labels?`Low ${id}`:'',high:labels?`High ${id}`:'',
 endpointLabelsPresent:labels,min:0,max:10,
});

function viewApi(dimensions){
 const state={dataset:{version:'1.0',entities:[{id:'e1',name:'Alpha'}],events:[],relations:[]},dimensions,values:{e1:Object.fromEntries(dimensions.map(d=>[d.id,5]))},selected:'e1',readOnly:false,candidateUnsupported:false,view:'Profile',quadrant:[dimensions[0].id,dimensions[1]?.id||null],waiting:null,radar:dimensions.map(d=>d.id),secondary:null,matrix:dimensions.map(d=>d.id),matrixRows:[],matrixPage:0};
 return {
  state:()=>state,
  entities:()=>state.dataset.entities,
  name:id=>state.dataset.entities.find(e=>e.id===id)?.name||'Entity',
  entityId:()=>'',
  dimension:id=>dimensions.find(d=>d.id===id),
  dimensionName:id=>dimensions.find(d=>d.id===id)?.name||'',
  axisName:id=>dimensions.find(d=>d.id===id)?.name||'',
  dimensionId:()=>'',
  dimensionOptions:()=>'<option value="">Choose</option>',
  entityOptions:()=>'<option value="">Choose</option>',
  get:(entityId,dimensionId)=>state.values[entityId]?.[dimensionId]??null,
  fmt:value=>String(value),
  randomNotice:()=>'',
  plotted:()=>[],
  waitingCandidates:()=>[],
  quadrantOutOfRange:()=>[],
  matrixError:()=>null,
 };
}

test('omitted endpoint labels render numeric MIN/MAX only across comparison views',()=>{
 const dims=[dimension('d1'),dimension('d2'),dimension('d3')],api=viewApi(dims),priorWidth=globalThis.innerWidth;
 globalThis.innerWidth=500;
 try{
  assert.equal(endpointText(dims[0],'low'), '0');
  assert.equal(endpointText(dims[0],'high'), '10');
  assert.equal(endpointRangeText(dims[0]),'0 → 10');
  const outputs=[renderProfile(api),renderQuadrant(api),renderRadar(api),renderMatrix(api)];
  for(const output of outputs){
   assert.doesNotMatch(output,/>\s*(?:Low|High)\s*</);
   assert.match(output,/0/);
   assert.match(output,/10/);
  }
  assert.match(outputs[0],/<div class="low-high"><span>0<\/span><span>10<\/span><\/div>/);
  assert.match(outputs[1],/<div class="quadrant-axis-endpoint"><span>10<\/span><\/div>/);
  assert.match(outputs[2],/<small>0 → 10<\/small>/);
  assert.match(outputs[3],/0 to 10/);
 }finally{
  if(priorWidth===undefined)delete globalThis.innerWidth;else globalThis.innerWidth=priorWidth;
 }
});

test('explicitly authored endpoint labels remain visible alongside numeric ranges',()=>{
 const dims=[dimension('d1',true),dimension('d2',true),dimension('d3',true)],api=viewApi(dims),priorWidth=globalThis.innerWidth;
 globalThis.innerWidth=500;
 try{
  assert.equal(endpointText(dims[0],'low'),'Low d1');
  assert.equal(endpointText(dims[0],'high'),'High d1');
  assert.equal(endpointRangeText(dims[0]),'Low d1 · 0 → 10 · High d1');
  const outputs=[renderProfile(api),renderQuadrant(api),renderRadar(api),renderMatrix(api)];
  assert.match(outputs[0],/Low d1 · 0/);
  assert.match(outputs[0],/10 · High d1/);
  assert.match(outputs[1],/X Low/);
  assert.match(outputs[1],/Low d1/);
  assert.match(outputs[2],/Low d1 · 0 → 10 · High d1/);
  assert.match(outputs[3],/Low d1 · 0 → 10 · High d1/);
 }finally{
  if(priorWidth===undefined)delete globalThis.innerWidth;else globalThis.innerWidth=priorWidth;
 }
});

test('present but empty endpoint label fields do not create orphan separators',()=>{
 const dimensionWithBlankLabels={...dimension('blank-pair',true),low:'',high:''};
 assert.equal(hasAuthoredEndpointLabel(dimensionWithBlankLabels,'low'),false);
 assert.equal(hasAuthoredEndpointLabel(dimensionWithBlankLabels,'high'),false);
 assert.equal(endpointText(dimensionWithBlankLabels,'low'),'0');
 assert.equal(endpointText(dimensionWithBlankLabels,'high'),'10');
 assert.equal(endpointBoundaryText(dimensionWithBlankLabels,'low'),'0');
 assert.equal(endpointBoundaryText(dimensionWithBlankLabels,'high'),'10');
 assert.equal(endpointRangeText(dimensionWithBlankLabels),'0 → 10');
});

test('re-renders after Dimension addition and Radar, Quadrant, and Matrix selection keep endpoint separators paired with text',()=>{
 const dims=[dimension('d1',true)];
 dims[0].low='';dims[0].high='';
 const api=viewApi(dims),state=api.state(),priorWidth=globalThis.innerWidth;
 globalThis.innerWidth=390;
 try{
  const initial=[renderProfile(api),renderRadar(api),renderMatrix(api)];
  assert.match(initial[0],/<div class="low-high"><span>0<\/span><span>10<\/span><\/div>/);
  assert.match(initial[1],/<small>0 → 10<\/small>/);
  assert.doesNotMatch(initial[1],/· 0|10 ·/);

  const added=dimension('d2',true);added.low='';added.high='';
  state.dimensions.push(added);
  state.values.e1.d2=5;
  state.radar.push('d2');
  state.quadrant=[dims[0].id,added.id];
  state.matrix.push(added.id);

  const profile=renderProfile(api),radar=renderRadar(api),quadrant=renderQuadrant(api),matrix=renderMatrix(api);
  assert.equal((profile.match(/<div class="low-high"><span>0<\/span><span>10<\/span><\/div>/g)||[]).length,2);
  assert.equal((radar.match(/<small>0 → 10<\/small>/g)||[]).length,2);
  assert.doesNotMatch(radar,/· 0|10 ·/);
  assert.match(quadrant,/<div class="quadrant-axis-endpoint"><span>0<\/span><\/div>/);
  assert.match(quadrant,/<div class="quadrant-axis-endpoint"><span>10<\/span><\/div>/);
  assert.doesNotMatch(quadrant,/X Low|X High|Y Low|Y High/);
  assert.doesNotMatch(matrix,/· to ·|to · 0/);
  assert.match(matrix,/0 → 10/);
 }finally{
  if(priorWidth===undefined)delete globalThis.innerWidth;else globalThis.innerWidth=priorWidth;
 }
});
