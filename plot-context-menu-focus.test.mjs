import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {closePlotContextMenu, placePlotContextMenuAfterTrigger} from './plot-context-menu-focus.js';

function fixture({trigger='point'}={}){
  const order=[];
  const element={dataset:trigger==='label'?{selectEntity:'entity-1'}:{point:'entity-1'},focused:false,
    after(node){order.splice(order.indexOf(this)+1,0,node);},
    focus(options){this.focused=true;this.focusOptions=options;}};
  const menu={removed:false,remove(){this.removed=true;const index=order.indexOf(this);if(index>=0)order.splice(index,1);}};
  order.push({id:'before'},element,{id:'after'});
  const root={querySelector:selector=>selector==='.plot-context-menu'&&!menu.removed?menu:null,
    querySelectorAll:selector=>selector===(trigger==='label'?'[data-select-entity]':'[data-point]')?[element]:[]};
  return {root,element,menu,order};
}

test('Quadrant context menu sits after its invoking plot control in natural Tab order',()=>{
  for(const trigger of ['point','label']){
    const state=fixture({trigger});
    const resolved=placePlotContextMenuAfterTrigger(state.root,{id:'entity-1',trigger});
    assert.equal(resolved,state.element);
    assert.deepEqual(state.order.map(item=>item===state.menu?'menu':item.id||'trigger'),['before','trigger','menu','after']);
  }
});

test('Escape dismissal removes the menu and restores focus to its original plot control',()=>{
  const state=fixture();
  assert.equal(closePlotContextMenu(state.root,{id:'entity-1',trigger:'point'},{restoreFocus:true}),true);
  assert.equal(state.menu.removed,true);
  assert.equal(state.element.focused,true);
  assert.deepEqual(state.element.focusOptions,{preventScroll:true});
});

test('context-menu focus exit uses native Tab order without a menu focus trap',async()=>{
  const source=await readFile(new URL('./main.js',import.meta.url),'utf8');
  assert.match(source,/if\(contextMenu\)\{const menu=root\.querySelector\('\.plot-context-menu'\);if\(menu&&!menu\.contains\(e\.target\)\)\{contextMenu=null;menu\.remove\(\);\}\}/);
  assert.match(source,/const trigger=e\.target\.closest\('\[data-point\],\[data-select-entity\]'\);contextMenu=\{id:item\.dataset\.entity,x:e\.clientX,y:e\.clientY,trigger:trigger\?\.hasAttribute\('data-select-entity'\)\?'label':'point'\};render\(\);root\.querySelector\('\.plot-context-menu button'\)\?\.focus\(\)/);
  assert.match(source,/if\(contextMenu\)placePlotContextMenuAfterTrigger\(root,contextMenu\)/);
  assert.match(source,/closePlotContextMenu\(root,previous,\{restoreFocus:true\}\)/);
  assert.doesNotMatch(source,/plot-context-menu[^\n]*Tab/);
});
