import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {quadrantAssessmentPopoverMarkup} from './quadrant-assessment-popover.js';

test('Quadrant Assessment popover reads every Dimension and distinguishes zero, negative, and absent values',()=>{
  const dimensions=[
    {id:'command',name:'指揮権限'},
    {id:'concord',name:'Contribution to Concord'},
    {id:'unknown',name:'Unassessed'},
  ];
  const values={command:0,concord:-4};
  const before=structuredClone({dimensions,values});
  const markup=quadrantAssessmentPopoverMarkup({
    entityName:'Darius Halden',
    dimensions,
    getValue:id=>Object.hasOwn(values,id)?values[id]:null,
    format:value=>String(value),
  });
  assert.match(markup,/Darius Halden/);
  assert.match(markup,/指揮権限[\s\S]*?<dd>0<\/dd>/);
  assert.match(markup,/Contribution to Concord[\s\S]*?<dd>-4<\/dd>/);
  assert.match(markup,/Unassessed[\s\S]*?No assessment/);
  assert.equal((markup.match(/quadrant-assessment-row/g)||[]).length,3);
  assert.deepEqual({dimensions,values},before);
});

test('popover is a keyboard-readable view-only dialog and escapes authored strings',()=>{
  const markup=quadrantAssessmentPopoverMarkup({
    entityName:'<Entity & name>',dimensions:[{id:'x',name:'<Dimension>'}],getValue:()=>7,format:String,
  });
  assert.match(markup,/role="dialog" aria-modal="false"/);
  assert.match(markup,/<h3 id="quadrant-assessment-title" tabindex="-1">Assessment details<\/h3>/);
  assert.match(markup,/class="quadrant-assessment-list" tabindex="0" aria-label="Assessment details"/);
  assert.match(markup,/data-close-quadrant-assessments aria-label="Close assessment details"/);
  assert.match(markup,/&lt;Entity &amp; name&gt;/);
  assert.match(markup,/&lt;Dimension&gt;/);
  assert.doesNotMatch(markup,/<input|<select|data-value=/);
});

test('point activation, pointer drag, Escape, and focus restoration are wired as separate paths',async()=>{
  const source=await readFile(new URL('./main.js',import.meta.url),'utf8');
  const drag=await readFile(new URL('./quadrant-drag.js',import.meta.url),'utf8');
  assert.match(source,/if\(b\.dataset\.point\)\{if\(e\.detail===0\)openQuadrantAssessmentPopover\(b\.dataset\.point\);return;\}/);
  assert.match(source,/onSelect:\(\)=>openQuadrantAssessmentPopover\(id\)/);
  assert.match(source,/onPlace:x=>\{quadrantAssessmentPopover=null;placeOnPlot\(id,x,plot\);\}/);
  assert.match(source,/e\.key==='Escape'&&quadrantAssessmentPopover\)\{e\.preventDefault\(\);closeQuadrantAssessmentPopover\(\);return;\}/);
  assert.ok(source.includes('root.querySelector(`[data-point="${CSS.escape(prior.id)}"]`)?.focus({preventScroll:true});'));
  assert.ok(drag.includes('if(onCancel)onCancel(e);else onSelect(e);'));
});
