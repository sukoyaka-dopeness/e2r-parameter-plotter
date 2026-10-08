import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {renderProfile,renderRadar,renderQuadrant,renderMatrix} from './views.js';

const dimensions=['d1','d2','d3'].map((id,index)=>({id,name:`Dimension ${index+1}`,min:0,max:10,integerOnly:true}));

function viewApi(){
 const entity={id:'e1',name:'Neil Armstrong',description:''};
 const state={
  dataset:{version:'1.0',entities:[entity],events:[],relations:[]},
  dimensions,values:{e1:{d1:3,d2:5,d3:8}},selected:'e1',readOnly:false,
  candidateUnsupported:false,view:'Profile',quadrant:['d1','d2'],waiting:null,
  radar:['d1','d2','d3'],secondary:null,matrix:['d1','d2','d3'],matrixRows:[],matrixPage:0,
 };
 return {
  state:()=>state,
  entities:()=>state.dataset.entities,
  name:id=>state.dataset.entities.find(item=>item.id===id)?.name||'Entity',
  entityId:()=>'',dimension:id=>dimensions.find(item=>item.id===id),
  dimensionName:id=>dimensions.find(item=>item.id===id)?.name||'',
  axisName:id=>dimensions.find(item=>item.id===id)?.name||'',dimensionId:()=>'',
  dimensionOptions:()=>'<option value="d1">Dimension 1</option>',
  entityOptions:()=>'<option value="e1">Neil Armstrong</option>',
  get:(entityId,dimensionId)=>state.values[entityId]?.[dimensionId]??null,
  fmt:value=>String(value),randomNotice:()=>'',plotted:()=>[],waitingCandidates:()=>[],
  quadrantOutOfRange:()=>[],matrixError:()=>null,
 };
}

test('all four views retain a shared header structure and their navigation controls',()=>{
 const api=viewApi(),previousWidth=globalThis.innerWidth;
 globalThis.innerWidth=1024;
 try{
  const outputs=[renderProfile(api),renderRadar(api),renderQuadrant(api),renderMatrix(api)];
  for(const output of outputs){
   assert.match(output,/<div class="view-head"><div class="view-heading">/);
   assert.match(output,/<div class="view-control">/);
  }
  for(const output of outputs.slice(0,2)){
   assert.match(output,/<strong>Neil Armstrong<\/strong>/);
   assert.match(output,/data-primary-step="-1"/);
   assert.match(output,/data-primary-step="1"/);
  }
  assert.match(outputs[2],/data-waiting-step="-1"/);
  assert.match(outputs[2],/data-waiting-step="1"/);
  assert.match(outputs[3],/data-matrix-page="-1"/);
  assert.match(outputs[3],/data-matrix-page="1"/);
 }finally{
  if(previousWidth===undefined)delete globalThis.innerWidth;else globalThis.innerWidth=previousWidth;
 }
});

test('View Header CSS uses natural-height top alignment and permits Entity-name wrapping',async()=>{
 const css=await readFile(new URL('./second-pass.css',import.meta.url),'utf8');
 assert.match(css,/\.view-head\{display:grid;grid-template-columns:minmax\(0,1fr\) minmax\(250px,min\(35%,320px\)\);align-items:start;min-height:0\}/);
 assert.match(css,/@media\(max-width:720px\)\{\.view-head\{grid-template-columns:minmax\(0,1fr\);gap:13px\}/);
 assert.match(css,/\.view-head \.entity-pager>\.pager-current\{height:auto;min-height:52px;overflow:visible;line-height:1\.25\}/);
 assert.match(css,/\.view-head \.entity-pager \.pager-current strong\{line-height:1\.25;white-space:normal;overflow:visible;overflow-wrap:anywhere;text-overflow:clip\}/);
 assert.match(css,/\.view-head \.entity-pager \.pager-meta\{flex-wrap:wrap;white-space:normal;line-height:1\.25\}/);
});
