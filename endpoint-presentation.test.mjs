import test from 'node:test';
import assert from 'node:assert/strict';
import {endpointRangeText,endpointText} from './endpoint-presentation.js';
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
  assert.match(outputs[3],/Low d1 to High d1/);
 }finally{
  if(priorWidth===undefined)delete globalThis.innerWidth;else globalThis.innerWidth=priorWidth;
 }
});
