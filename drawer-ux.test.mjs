import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {revealWithinScrollport} from './drawer-visibility.js';

function scrollport({top=0,height=100,scrollTop=0,scrollHeight=300}={}){
  return {
    clientTop:0,
    clientHeight:height,
    scrollHeight,
    scrollTop,
    getBoundingClientRect:()=>({top,bottom:top+height}),
  };
}

function target({top,height,port}){
  return {getBoundingClientRect:()=>({top:top-port.scrollTop,bottom:top+height-port.scrollTop})};
}

test('Entity menu reveal scrolls only the clipping amount within its list scrollport',()=>{
  const list=scrollport({height:100,scrollHeight:300});
  const actions=target({top:82,height:42,port:list});
  assert.equal(revealWithinScrollport(actions,list),24);
  assert.equal(list.scrollTop,24);
});

test('Entity menu reveal leaves a fully visible menu and its scrollport untouched',()=>{
  const list=scrollport({height:100,scrollHeight:300,scrollTop:30});
  const actions=target({top:45,height:42,port:list});
  assert.equal(revealWithinScrollport(actions,list),0);
  assert.equal(list.scrollTop,30);
});

test('Entity menu reveal can correct top clipping without exceeding the scroll range',()=>{
  const list=scrollport({height:100,scrollHeight:300,scrollTop:80});
  const actions=target({top:70,height:30,port:list});
  assert.equal(revealWithinScrollport(actions,list),-10);
  assert.equal(list.scrollTop,70);
});

test('Entity menu reveal checks the list before the Drawer and adjusts each only when clipped',()=>{
  const drawer=scrollport({height:100,scrollHeight:300});
  const list={
    clientTop:0,
    clientHeight:100,
    scrollHeight:300,
    scrollTop:0,
    getBoundingClientRect:()=>({top:20-drawer.scrollTop,bottom:120-drawer.scrollTop}),
  };
  const actions={getBoundingClientRect:()=>({top:110-list.scrollTop-drawer.scrollTop,bottom:150-list.scrollTop-drawer.scrollTop})};
  assert.equal(revealWithinScrollport(actions,list),30);
  assert.equal(revealWithinScrollport(actions,drawer),20);
  assert.equal(list.scrollTop,30);
  assert.equal(drawer.scrollTop,20);
});

test('Drawer ordinary action geometry matches Workspace while preserving special row controls',async()=>{
  const [css,workspaceCss,main]=await Promise.all([
    readFile(new URL('./second-pass.css',import.meta.url),'utf8'),
    readFile(new URL('./home-screen.css',import.meta.url),'utf8'),
    readFile(new URL('./main.js',import.meta.url),'utf8'),
  ]);
  assert.match(css,/\.drawer button:not\(\.entity-choice\):not\(\.entity-more\)\{min-height:36px;padding:5px 9px;border-radius:4px;font-size:15px;line-height:120%\}/);
  assert.match(workspaceCss,/\.workspace-action-bar > button[^\n]*min-height:36px;padding:5px 9px[^\n]*font-size:15px;line-height:120%/);
  assert.match(main,/focus\(\{preventScroll:true\}\);if\(entityMenu===id\)\{requestAnimationFrame\(\(\)=>\{if\(entityMenu!==id\)return/);
  assert.match(main,/revealWithinScrollport\(actions,list\);revealWithinScrollport\(actions,drawer\)/);
  assert.doesNotMatch(main,/entity-actions[^\n]*scrollIntoView/);
});
