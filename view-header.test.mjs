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
  candidateUnsupported:false,view:'Profile',quadrant:['d1','d2'],waiting:null,plotEntities:null,
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
  fmt:value=>String(value),randomNotice:()=>'',plotted:()=>state.plotEntities||[],waitingCandidates:()=>[],
  quadrantOutOfRange:()=>[],matrixError:()=>null,
  quadrantKeyboardHelp:()=> 'Use arrow keys to edit X and Y values.',quadrantKeyboardStatus:()=>'',
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

test('Matrix header navigator reports page count and disables both controls for a single page',()=>{
 const api=viewApi(),previousWidth=globalThis.innerWidth;
 try{
  globalThis.innerWidth=390;
  let output=renderMatrix(api);
  assert.match(output,/class="matrix-nav"[^>]*data-matrix-page-count="2"/);
  assert.match(output,/data-matrix-page="-1"(?! disabled)/);
  assert.match(output,/data-matrix-page="1"(?! disabled)/);
  globalThis.innerWidth=1280;
  output=renderMatrix(api);
  assert.match(output,/class="matrix-nav"[^>]*data-matrix-page-count="1"/);
  assert.match(output,/data-matrix-page="-1" disabled/);
  assert.match(output,/data-matrix-page="1" disabled/);
 }finally{
  if(previousWidth===undefined)delete globalThis.innerWidth;else globalThis.innerWidth=previousWidth;
 }
});

test('Quadrant plotted-point accessible name and title expose selected X/Y values',()=>{
 const api=viewApi();
 api.state().quadrant=['d1','d2'];
 api.state().values.e1={d1:0,d2:-4,d3:8};
 api.state().plotEntities=[api.state().dataset.entities[0]];
 const output=renderQuadrant(api);
 assert.match(output,/class="plot-dot" data-point="e1" aria-describedby="quadrant-keyboard-help" aria-label="Neil Armstrong: 0, -4" title="Neil Armstrong: 0, -4"/);
 assert.match(output,/id="quadrant-keyboard-help" class="small quadrant-keyboard-help"/);
 assert.match(output,/class="small quadrant-keyboard-status" data-quadrant-keyboard-status role="status" aria-live="polite"/);
 assert.doesNotMatch(output,/assessment-popover|data-close-quadrant-assessments/);
});

test('View Header CSS uses natural-height top alignment and permits Entity-name wrapping',async()=>{
 const css=await readFile(new URL('./second-pass.css',import.meta.url),'utf8');
 assert.match(css,/\.view-head\{display:grid;grid-template-columns:minmax\(0,1fr\) minmax\(250px,min\(35%,320px\)\);align-items:start;min-height:0\}/);
 assert.match(css,/@media\(max-width:720px\)\{\.view-head\{grid-template-columns:minmax\(0,1fr\);gap:13px\}/);
 assert.match(css,/\.view-head \.entity-pager>\.pager-current\{height:auto;min-height:52px;overflow:visible;line-height:1\.25\}/);
 assert.match(css,/\.view-head \.entity-pager \.pager-current strong\{line-height:1\.25;white-space:normal;overflow:visible;overflow-wrap:anywhere;text-overflow:clip\}/);
 assert.match(css,/\.view-head \.entity-pager \.pager-meta\{flex-wrap:wrap;white-space:normal;line-height:1\.25\}/);
 assert.match(css,/\.view-control>\.entity-pager,\.view-control>\.waiting-header,\.view-control>\.matrix-nav\{width:100%;min-width:0\}/);
 assert.match(css,/\.plot-dot:focus-visible\{outline:2px solid #28499a;outline-offset:2px\}/);
 assert.match(css,/\.plot-context-menu button:focus-visible\{outline:2px solid #28499a;outline-offset:-2px;position:relative;z-index:1\}/);
});

test('narrow Quadrant footer stacks each explanation instead of overlaying paragraphs',async()=>{
 const css=await readFile(new URL('./second-pass.css',import.meta.url),'utf8');
 assert.match(css,/@media\(max-width:720px\)\{[\s\S]*?\.quadrant-plot-layout\+\.plot-foot>p\{grid-column:1\/-1;grid-row:auto;[^}]+\}/);
});

test('Quadrant plotted count has a distinct compact status treatment',async()=>{
 const css=await readFile(new URL('./second-pass.css',import.meta.url),'utf8');
 const views=await readFile(new URL('./views.js',import.meta.url),'utf8');
 assert.match(css,/\.plot-foot \.quadrant-count-row\{flex:0 0 100%;display:flex;justify-content:flex-end\}/);
 assert.match(css,/\.quadrant-plot-layout\+\.plot-foot>\.quadrant-count-row\{grid-column:2;grid-row:1;justify-self:end/);
 assert.match(views,/<div class="quadrant-count-row"><span class="small quadrant-plotted-count">\$\{points\.length\} plotted<\/span><\/div>/);
});
