import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,load,save} from './model.js';

class MemoryStorage {
  values=new Map();
  getItem(key){return this.values.get(key)??null;}
  setItem(key,value){this.values.set(key,String(value));}
}

test('first startup has no recoverable workspace and does not persist an empty bootstrap',()=>{
  globalThis.localStorage=new MemoryStorage();
  const state=load();
  assert.equal(state.workspaceCreated,false);
  assert.equal(state.persistence.status,'unsaved');
  assert.equal(localStorage.values.size,0);
});

test('an explicitly created empty Dataset is recoverable after browser-local save',()=>{
  globalThis.localStorage=new MemoryStorage();
  const state=fresh({version:'1.0',entities:[],events:[],relations:[]},{ui:{workspaceCreated:true}});
  assert.equal(save(state),true);
  assert.equal(load().workspaceCreated,true);
  assert.equal(load().persistence.status,'saved');
});

test('older saved workspaces with Dataset content remain eligible for Continue Editing',()=>{
  globalThis.localStorage=new MemoryStorage();
  const state=fresh({version:'1.0',entities:[{id:'e1',name:'Saved'}],events:[],relations:[]});
  const stored={format:'parameterplotter-local-workspace',version:1,dataset:state.dataset,ui:{}};
  localStorage.setItem('e2r-parameter-plotter-local-workspace-v2',JSON.stringify(stored));
  assert.equal(load().workspaceCreated,true);
});

test('saved opaque Dataset content is still recoverable without interpreting its semantics',()=>{
  globalThis.localStorage=new MemoryStorage();
  const stored={format:'parameterplotter-local-workspace',version:1,dataset:{version:'1.0',entities:[],events:[],relations:[],extensions:{'future.example/opaque':{value:7}}},ui:{}};
  localStorage.setItem('e2r-parameter-plotter-local-workspace-v2',JSON.stringify(stored));
  assert.equal(load().workspaceCreated,true);
});

test('legacy empty bootstrap storage is not mistaken for recoverable user work',()=>{
  globalThis.localStorage=new MemoryStorage();
  const stored={format:'parameterplotter-local-workspace',version:1,dataset:{version:'1.0',entities:[],events:[],relations:[]},ui:{}};
  localStorage.setItem('e2r-parameter-plotter-local-workspace-v2',JSON.stringify(stored));
  assert.equal(load().workspaceCreated,false);
});
