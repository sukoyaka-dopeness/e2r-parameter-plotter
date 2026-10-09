import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {headerNavigationFocusRequest, restoreHeaderNavigationFocus} from './view-header-focus.js';

function button(attributes, {disabled = false} = {}) {
  return {
    disabled,
    focused: false,
    hasAttribute: name => Object.hasOwn(attributes, name),
    getAttribute: name => attributes[name] ?? null,
    closest: selector => selector === '.view-control' || selector === '.entity-pager' || selector === '.matrix-nav' ? {} : null,
    focus(options) { this.focused = true; this.focusOptions = options; },
  };
}

test('header Entity, Quadrant waiting, and Matrix arrows request focus restoration only for explicit keyboard activation',()=>{
  for (const [attribute, value, expected] of [
    ['data-primary-step','1','primary'],
    ['data-waiting-step','-1','waiting'],
    ['data-matrix-page','1','matrix'],
  ]) {
    const target=button({[attribute]:value});
    assert.deepEqual(headerNavigationFocusRequest(target,{detail:0}),{type:expected,step:value});
    assert.equal(headerNavigationFocusRequest(target,{detail:1}),null);
  }
  const nonHeader=button({'data-matrix-page':'1'});
  nonHeader.closest=()=>null;
  assert.equal(headerNavigationFocusRequest(nonHeader,{detail:0}),null);
});

test('focus restoration keeps the same enabled direction and does not scroll',()=>{
  const previous=button({'data-primary-step':'-1'}),next=button({'data-primary-step':'1'});
  const root={querySelector:selector=>selector==='.view-control .entity-pager'?{querySelectorAll:()=>[previous,next]}:null};
  assert.equal(restoreHeaderNavigationFocus(root,{type:'primary',step:'1'}),true);
  assert.equal(next.focused,true);
  assert.deepEqual(next.focusOptions,{preventScroll:true});
  assert.equal(previous.focused,false);
});

test('keyboard Header restoration preserves page position and reveals only an offscreen control',()=>{
  const scrollElement={scrollLeft:0,scrollTop:0,scrollWidth:900,scrollHeight:1800};
  const documentObject={scrollingElement:scrollElement,documentElement:{clientWidth:390,clientHeight:600,scrollWidth:900,scrollHeight:1800}};
  const target=button({'data-primary-step':'1'});
  target.getBoundingClientRect=()=>({left:100,top:1120-scrollElement.scrollTop,right:140,bottom:1160-scrollElement.scrollTop,width:40,height:40});
  const group={querySelectorAll:()=>[target]};
  const root={querySelector:()=>group};
  const scrollSnapshot={element:scrollElement,left:0,top:500};
  scrollElement.scrollTop=900; // Simulate scroll anchoring during the full-root render.
  assert.equal(restoreHeaderNavigationFocus(root,{type:'primary',step:'1'},{scrollSnapshot,documentObject}),true);
  assert.equal(target.focused,true);
  assert.deepEqual(target.focusOptions,{preventScroll:true});
  assert.equal(scrollElement.scrollTop,584); // Minimal 24px visibility margin.
});

test('when a Matrix arrow becomes disabled at a page boundary, focus stays on the available Header arrow',()=>{
  const previous=button({'data-matrix-page':'-1'},{disabled:false});
  const next=button({'data-matrix-page':'1'},{disabled:true});
  const root={querySelector:selector=>selector==='.view-control .matrix-nav'?{querySelectorAll:()=>[previous,next]}:null};
  assert.equal(restoreHeaderNavigationFocus(root,{type:'matrix',step:'1'}),true);
  assert.equal(previous.focused,true);
  assert.equal(next.focused,false);
});

test('header focus restoration is wired only into the three rerendering navigation handlers',async()=>{
  const source=await readFile(new URL('./main.js',import.meta.url),'utf8');
  assert.match(source,/import\s*\{headerNavigationFocusRequest,\s*restoreHeaderNavigationFocus\}\s*from\s*['"]\.\/view-header-focus\.js['"]/);
  for(const key of ['matrixPage','primaryStep','waitingStep']){
    const branch=source.match(new RegExp(`if\\(b\\.dataset\\.${key}\\)[^\\n]*`))?.[0]||'';
    assert.match(branch,/headerNavigationFocusRequest\(b,e\)/);
    assert.match(branch,/scrollSnapshot=focusRequest\?captureDocumentScroll\(document\):null/);
    assert.match(branch,/update\(\);restoreHeaderNavigationFocus\(root,focusRequest,\{scrollSnapshot,documentObject:document\}\)/);
  }
});
