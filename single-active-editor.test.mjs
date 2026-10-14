import test from 'node:test';
import assert from 'node:assert/strict';
import {createSingleActiveEditor,EDITOR_LOCK,installEditorEventGuard} from './single-active-editor.js';
import {editorSessionMarkup} from './editor-session-screen.js';
import {createWorkspaceCoordinator} from './cross-tab-workspace.js';
import {createWorkspaceWriteGate} from './workspace-write-gate.js';
import {fresh,saveIfCurrent,WORKSPACE_STORAGE_KEY} from './model.js';
import {lockService,MemoryStorage,tick} from './test-support/workspace-locks.mjs';

test('simultaneous startup grants one editor including while it is on Home',async()=>{
  const locks=lockService();
  const pages=Array.from({length:8},(_,i)=>createSingleActiveEditor({lockManager:locks.client(String(i))}));
  await Promise.all(pages.map(page=>page.ready));
  assert.equal(pages.filter(page=>page.owns).length,1);
  assert.equal(pages.filter(page=>page.kind==='blocked').length,7);
  assert.equal([...locks.held].filter(([name])=>name===EDITOR_LOCK).length,1);
  pages.forEach(page=>page.end());await tick();
});

test('a blocked tab never takes over after owner exit; a fresh load can acquire',async()=>{
  const locks=lockService(),windowA=new EventTarget(),windowB=new EventTarget();
  const a=createSingleActiveEditor({lockManager:locks.client('a'),windowObject:windowA});await a.ready;
  const b=createSingleActiveEditor({lockManager:locks.client('b'),windowObject:windowB});await b.ready;
  windowA.dispatchEvent(new Event('pagehide'));await tick();
  for(const name of ['focus','storage','pageshow'])windowB.dispatchEvent(new Event(name));
  assert.equal(b.kind,'blocked');assert.equal(b.owns,false);
  const reload=createSingleActiveEditor({lockManager:locks.client('reload')});await reload.ready;
  assert.equal(reload.owns,true);reload.end();await tick();
});

test('BFCache restoration never revives an ended document or its ownership token',async()=>{
  const locks=lockService(),windowA=new EventTarget();
  const a=createSingleActiveEditor({lockManager:locks.client('a'),windowObject:windowA});await a.ready;
  const token=a.capture();
  const hide=new Event('pagehide');Object.defineProperty(hide,'persisted',{value:true});windowA.dispatchEvent(hide);
  await tick();
  const next=createSingleActiveEditor({lockManager:locks.client('next')});await next.ready;
  const show=new Event('pageshow');Object.defineProperty(show,'persisted',{value:true});windowA.dispatchEvent(show);
  assert.equal(a.kind,'ended');assert.equal(a.isCurrent(token),false);assert.equal(next.owns,true);
  next.end();await tick();
});

test('missing, throwing, rejected coordination and a late startup grant fail closed',async()=>{
  for(const lockManager of [null,{request(){throw Error('denied');}},{request(){return Promise.reject(Error('denied'));}}]){
    const editor=createSingleActiveEditor({lockManager});await editor.ready;
    assert.equal(editor.kind,'unavailable');assert.equal(editor.owns,false);
  }
  let grant;
  const editor=createSingleActiveEditor({lockManager:{request(name,options,callback){grant=callback;return new Promise(()=>{});}}});
  editor.end();await editor.ready;await grant({name:EDITOR_LOCK});
  assert.equal(editor.kind,'ended');assert.equal(editor.owns,false);
});

test('modeled browser termination releases ownership despite a leftover storage marker',async()=>{
  const locks=lockService(),storage=new MemoryStorage();
  const a=createSingleActiveEditor({lockManager:locks.client('crashed')});await a.ready;
  const coordinator=createWorkspaceCoordinator({storage,lockManager:locks.client('crashed'),ownership:a,tabId:'crashed'});
  await tick();coordinator.setActive(true);
  locks.terminate('crashed'); // No pagehide cleanup: the old JS context is gone.
  const b=createSingleActiveEditor({lockManager:locks.client('b')});await b.ready;
  const next=createWorkspaceCoordinator({storage,lockManager:locks.client('b'),ownership:b,tabId:'b'});
  const result=await next.withWriteLock(({activeTabs})=>({ok:true,activeTabs}));
  assert.equal(result.ok,true);assert.deepEqual(result.activeTabs,[]);
  assert.equal(storage.getItem(coordinator.statusKey),null);
  b.end();await tick();
});

test('queued or query-delayed saves cannot commit after ownership ends',async()=>{
  for(const delay of ['write-lock','query']){
    const locks=lockService(),storage=new MemoryStorage(),windowA=new EventTarget();
    let unblock,queryStarted;
    const wait=new Promise(resolve=>{unblock=resolve;}),entered=new Promise(resolve=>{queryStarted=resolve;});
    const manager=locks.client('a');
    if(delay==='query'){const query=manager.query;manager.query=async()=>{queryStarted();await wait;return query();};}
    const a=createSingleActiveEditor({lockManager:manager,windowObject:windowA});await a.ready;
    const coordinator=createWorkspaceCoordinator({storage,lockManager:manager,windowObject:windowA,ownership:a,tabId:'a'});
    await tick();
    if(delay==='write-lock')void locks.client('other').request('e2r:parameter-plotter:workspace-write',async()=>{queryStarted();await wait;});
    let commits=0;
    const pending=coordinator.withWriteLock(()=>{commits++;storage.setItem(WORKSPACE_STORAGE_KEY,'stale');return {ok:true};});
    await entered;
    windowA.dispatchEvent(new Event('pagehide'));await tick();
    const b=createSingleActiveEditor({lockManager:locks.client('b')});await b.ready;
    if(delay==='write-lock')unblock(); // The unrelated holder must finish.
    assert.equal((await pending).cancelled,true);
    const next=createWorkspaceCoordinator({storage,lockManager:locks.client('b'),ownership:b,tabId:'b'});
    // A's stalled query must not block the new owner. It is still unresolved.
    const freshWrite=await next.withWriteLock(()=>{storage.setItem(WORKSPACE_STORAGE_KEY,'new owner');return {ok:true};});
    assert.equal(freshWrite.ok,true);
    assert.equal(commits,0);assert.equal(storage.getItem(WORKSPACE_STORAGE_KEY),'new owner');
    unblock();await tick();
    assert.equal(storage.getItem(WORKSPACE_STORAGE_KEY),'new owner');
    b.end();await tick();
  }
});

test('owner writes retain saved revision checks and a refused save remains latched',async()=>{
  const locks=lockService(),storage=new MemoryStorage();globalThis.localStorage=storage;
  const editor=createSingleActiveEditor({lockManager:locks.client('a')});await editor.ready;
  const coordinator=createWorkspaceCoordinator({storage,lockManager:locks.client('a'),ownership:editor,tabId:'a'});
  const initial='previous';storage.setItem(WORKSPACE_STORAGE_KEY,initial);
  const state=fresh({version:'1.0',entities:[],events:[],relations:[]});
  const gate=createWorkspaceWriteGate();
  assert.equal((await gate.run(()=>coordinator.withWriteLock(()=>saveIfCurrent(state,initial)))).ok,true);
  const raw=storage.getItem(WORKSPACE_STORAGE_KEY);
  storage.setItem(WORKSPACE_STORAGE_KEY,'newer');
  assert.equal((await gate.run(()=>coordinator.withWriteLock(()=>saveIfCurrent(state,raw)))).conflict,true);
  let writes=0;
  assert.equal((await gate.run(()=>{writes++;return {ok:true};})).ok,false);
  assert.equal(writes,0);assert.equal(storage.getItem(WORKSPACE_STORAGE_KEY),'newer');
  editor.end();await tick();
});

test('non-owner registration, state changes and writes do not touch saved Workspace',async()=>{
  const locks=lockService(),storage=new MemoryStorage();storage.setItem(WORKSPACE_STORAGE_KEY,'protected');
  const a=createSingleActiveEditor({lockManager:locks.client('a')});await a.ready;
  const b=createSingleActiveEditor({lockManager:locks.client('b')});await b.ready;
  const coordinator=createWorkspaceCoordinator({storage,lockManager:locks.client('b'),ownership:b,tabId:'b'});
  coordinator.setActive(true);let calls=0;
  assert.equal((await coordinator.withWriteLock(()=>{calls++;return {ok:true};})).cancelled,true);
  assert.equal(calls,0);assert.equal(storage.getItem(coordinator.statusKey),null);
  assert.equal(storage.getItem(WORKSPACE_STORAGE_KEY),'protected');
  a.end();await tick();
});

test('owner-mode focus does not trigger checking churn; storage signals remain available',async()=>{
  const locks=lockService(),windowA=new EventTarget();
  const a=createSingleActiveEditor({lockManager:locks.client('a'),windowObject:windowA});await a.ready;
  const coordinator=createWorkspaceCoordinator({storage:new MemoryStorage(),lockManager:locks.client('a'),windowObject:windowA,ownership:a,tabId:'a'});
  let notifications=0;coordinator.subscribe(()=>notifications++);
  for(let i=0;i<5;i++)windowA.dispatchEvent(new Event('focus'));
  assert.equal(notifications,0);assert.equal(a.owns,true);
  const change=new Event('storage');Object.defineProperty(change,'key',{value:'e2r:parameter-plotter:workspace-tab:legacy'});
  windowA.dispatchEvent(change);assert.equal(notifications,1);
  a.end();await tick();
});

test('blocked input is stopped before authoring handlers while locale and browser navigation remain usable',()=>{
  const target=new EventTarget(),editor={owns:false};installEditorEventGuard(target,editor);
  let authoring=0;target.addEventListener('submit',()=>authoring++);target.addEventListener('click',()=>authoring++);
  for(const name of ['submit','click']){const event=new Event(name,{cancelable:true});target.dispatchEvent(event);assert.equal(event.defaultPrevented,true);}
  assert.equal(authoring,0);
  for(const name of ['pointermove','pointerup','pointercancel']){
    let updates=0;target.addEventListener(name,()=>updates++);
    const event=new Event(name,{cancelable:true});target.dispatchEvent(event);
    assert.equal(updates,0);assert.equal(event.defaultPrevented,true);
  }
  const locale=new Event('click',{cancelable:true});Object.defineProperty(locale,'target',{value:{closest:()=>({})}});target.dispatchEvent(locale);
  assert.equal(locale.defaultPrevented,false);assert.equal(authoring,1);
  const tab=new Event('keydown',{cancelable:true});Object.defineProperty(tab,'key',{value:'Tab'});target.dispatchEvent(tab);assert.equal(tab.defaultPrevented,false);
  editor.owns=true;target.dispatchEvent(new Event('submit',{cancelable:true}));assert.equal(authoring,2);
});

test('both entry-screen locales provide dedicated guidance without editing or acquisition controls',()=>{
  for(const locale of ['en','ja'])for(const kind of ['blocked','unavailable','ended','checking']){
    const markup=editorSessionMarkup({kind,locale});
    assert.match(markup,/role="status".*aria-live="polite"/);
    assert.doesNotMatch(markup,/data-home-action|dataset-file|data-import|data-export|<form/);
    if(kind==='blocked')assert.match(markup,locale==='ja'?/元のタブに戻り、このタブを閉じて/:/Return to the original tab and close this tab/);
    if(kind==='ended')assert.match(markup,locale==='ja'?/最後に正常保存されたWorkspace/:/last successfully saved Workspace/);
  }
});


test('dedicated screen reuses the common Footer and exposes only presentation controls',()=>{
  const markup=editorSessionMarkup({kind:'blocked'});
  assert.match(markup,/<small>E2R comparison editor<\/small>/);
  assert.match(markup,/<button class="credits-button" data-open-credits>Credits<\/button>/);
  assert.doesNotMatch(markup,/E2R \u00b7 ParameterPlotter|data-home-action|<form/);
});

test('non-owner shell keyboard handling runs before and excludes authoring handlers',()=>{
  const target=new EventTarget(),editor={owns:false};let shell=0,authoring=0;
  installEditorEventGuard(target,editor,{keydown:event=>{shell++;event.preventDefault();event.stopImmediatePropagation();}});
  target.addEventListener('keydown',()=>authoring++);
  const event=new Event('keydown',{cancelable:true});target.dispatchEvent(event);
  assert.equal(shell,1);assert.equal(authoring,0);assert.equal(event.defaultPrevented,true);
  editor.owns=true;target.dispatchEvent(new Event('keydown'));assert.equal(shell,1);assert.equal(authoring,1);
});
