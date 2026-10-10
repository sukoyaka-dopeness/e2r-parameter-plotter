import test from 'node:test';
import assert from 'node:assert/strict';
import {activeWorkspaceTabs,createWorkspaceCoordinator,inspectWorkspacePeerWork} from './cross-tab-workspace.js';
import {fresh,saveIfCurrent,WORKSPACE_STORAGE_KEY} from './model.js';

class MemoryStorage {
  values=new Map();
  get length(){return this.values.size;}
  key(index){return [...this.values.keys()][index]??null;}
  getItem(key){return this.values.get(key)??null;}
  setItem(key,value){this.values.set(key,String(value));}
  removeItem(key){this.values.delete(key);}
}

function makeLockManager(){
  const held=new Map();
  return {
    held,
    request(name,optionsOrCallback,maybeCallback){
      const callback=typeof optionsOrCallback==='function'?optionsOrCallback:maybeCallback;
      if(held.has(name))return Promise.resolve(callback(null));
      const token={name};held.set(name,token);
      return Promise.resolve(callback(token)).finally(()=>{held.delete(name);});
    },
    async query(){return {held:[...held.values()]};},
  };
}

test('active work is visible only while its tab lock is held; abandoned status is stale',()=>{
  const storage=new MemoryStorage();
  storage.setItem('e2r:parameter-plotter:workspace-tab:active','{"tabId":"active","active":true}');
  storage.setItem('e2r:parameter-plotter:workspace-tab:idle','{"tabId":"idle","active":false}');
  storage.setItem('e2r:parameter-plotter:workspace-tab:closed','{"tabId":"closed","active":true}');
  const result=activeWorkspaceTabs(storage,new Set(['e2r:parameter-plotter:workspace-tab:active']),'self');
  assert.deepEqual(result.active.map(tab=>tab.tabId),['active']);
  assert.deepEqual(result.staleKeys,['e2r:parameter-plotter:workspace-tab:closed']);
});

test('a stale workspace snapshot cannot overwrite a newer tab revision',()=>{
  const storage=new MemoryStorage();
  globalThis.localStorage=storage;
  const initial=JSON.stringify({revision:1});storage.setItem(WORKSPACE_STORAGE_KEY,initial);
  storage.setItem(WORKSPACE_STORAGE_KEY,JSON.stringify({revision:2}));
  const state=fresh({version:'1.0',entities:[],events:[],relations:[]});
  const result=saveIfCurrent(state,initial);
  assert.equal(result.ok,false);
  assert.equal(result.conflict,true);
  assert.equal(storage.getItem(WORKSPACE_STORAGE_KEY),JSON.stringify({revision:2}));
});

test('workspace coordination fails closed when Web Locks are unavailable',async()=>{
  const storage=new MemoryStorage();
  const coordinator=createWorkspaceCoordinator({storage,lockManager:null,windowObject:null,tabId:'offline'});
  const result=await coordinator.withWriteLock(()=>({ok:true}));
  assert.equal(result.ok,false);
  assert.match(result.reason,/cannot safely coordinate/i);
});

test('early warning reports only active same-app peers and ignores unrelated app locks',()=>{
  const storage=new MemoryStorage();
  storage.setItem('e2r:parameter-plotter:workspace-tab:busy','{"tabId":"busy","active":true}');
  storage.setItem('e2r:parameter-plotter:workspace-tab:idle','{"tabId":"idle","active":false}');
  const held=new Set([
    'e2r:parameter-plotter:workspace-tab:busy',
    'e2r:parameter-plotter:workspace-tab:idle',
    'e2r:narrativeline:workspace-tab:other-app',
  ]);
  assert.deepEqual(inspectWorkspacePeerWork(storage,held,'self'),{kind:'work',count:1});
  assert.deepEqual(inspectWorkspacePeerWork(storage,new Set(['e2r:parameter-plotter:workspace-tab:idle']),'self'),{kind:'clear'});
});

test('early warning is uncertain when an active peer lock has no trustworthy status marker',()=>{
  assert.deepEqual(inspectWorkspacePeerWork(new MemoryStorage(),new Set(['e2r:parameter-plotter:workspace-tab:peer']),'self'),{kind:'unknown'});
});

test('coordinator exposes peer status and reflects peer work changes',async()=>{
  const storage=new MemoryStorage(),locks=makeLockManager();
  const first=createWorkspaceCoordinator({storage,lockManager:locks,windowObject:null,tabId:'first'});
  const second=createWorkspaceCoordinator({storage,lockManager:locks,windowObject:null,tabId:'second'});
  await new Promise(resolve=>setTimeout(resolve,0));
  assert.deepEqual(await second.peerWorkStatus(),{kind:'clear'});
  first.setActive(true);
  assert.deepEqual(await second.peerWorkStatus(),{kind:'work',count:1});
  first.setActive(false);
  assert.deepEqual(await second.peerWorkStatus(),{kind:'clear'});
  first.dispose();second.dispose();
});

test('coordinator notifies Home only for ParameterPlotter peer-status changes',async()=>{
  const listeners=new Map();
  const target={addEventListener(name,listener){listeners.set(name,listener);}};
  const coordinator=createWorkspaceCoordinator({storage:new MemoryStorage(),lockManager:makeLockManager(),windowObject:target,tabId:'self'});
  let notifications=0;
  coordinator.subscribe(()=>{notifications++;});
  listeners.get('storage')({key:'e2r:narrativeline:workspace-tab:peer'});
  assert.equal(notifications,0);
  listeners.get('storage')({key:'e2r:parameter-plotter:workspace-tab:peer'});
  assert.equal(notifications,1);
  coordinator.dispose();
});

test('pagehide releases tab coordination and persisted pageshow reacquires it with pending-work status',async()=>{
  const storage=new MemoryStorage(),locks=makeLockManager(),windowTarget=new EventTarget();
  const coordinator=createWorkspaceCoordinator({storage,lockManager:locks,windowObject:windowTarget,tabId:'bfcache'});
  await new Promise(resolve=>setTimeout(resolve,0));
  assert.equal(locks.held.has(coordinator.statusKey),true);
  coordinator.setActive(true);
  assert.equal(JSON.parse(storage.getItem(coordinator.statusKey)).active,true);

  const pagehide=new Event('pagehide');Object.defineProperty(pagehide,'persisted',{value:true});windowTarget.dispatchEvent(pagehide);
  await new Promise(resolve=>setTimeout(resolve,0));
  assert.equal(storage.getItem(coordinator.statusKey),null);
  assert.equal(locks.held.has(coordinator.statusKey),false);

  const pageshow=new Event('pageshow');Object.defineProperty(pageshow,'persisted',{value:true});windowTarget.dispatchEvent(pageshow);
  await new Promise(resolve=>setTimeout(resolve,0));
  assert.equal(locks.held.has(coordinator.statusKey),true);
  assert.equal(JSON.parse(storage.getItem(coordinator.statusKey)).active,true);
  assert.deepEqual(await coordinator.peerWorkStatus(),{kind:'clear'});

  coordinator.dispose();
  await new Promise(resolve=>setTimeout(resolve,0));
  assert.equal(storage.getItem(coordinator.statusKey),null);
  assert.equal(locks.held.has(coordinator.statusKey),false);
});
