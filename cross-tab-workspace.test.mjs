import test from 'node:test';
import assert from 'node:assert/strict';
import {activeWorkspaceTabs,createWorkspaceCoordinator} from './cross-tab-workspace.js';
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
      return Promise.resolve(callback(token)).finally(()=>{if(name!=='e2r:parameter-plotter:workspace-tab:'+name.split(':').at(-1))held.delete(name);});
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
