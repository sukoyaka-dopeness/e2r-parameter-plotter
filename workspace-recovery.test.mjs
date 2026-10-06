import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh} from './model.js';
import {hasLossSensitiveWork,installBeforeUnloadProtection,readWorkspaceBackup,shouldWarnBeforeUnload,workspaceBackupFor} from './workspace-recovery.js';

test('workspace backup is a distinct self-contained artifact carrying the Dataset snapshot',()=>{
  const dataset={version:'1.0',entities:[{id:'e'}],events:[],relations:[]};
  const backup=workspaceBackupFor(fresh(dataset));
  assert.equal(backup.format,'parameterplotter-workspace-backup');
  assert.deepEqual(backup.dataset,dataset);
  assert.throws(()=>readWorkspaceBackup(dataset),/different file/);
  assert.deepEqual(readWorkspaceBackup(backup),{dataset,datasetModified:false,datasetBaseline:JSON.stringify(dataset)});
});

test('replacement guard protects Dataset changes and unprotected/degraded work, not persisted view state',()=>{
  const state=fresh({version:'1.0',entities:[],events:[],relations:[]});
  state.persistence.status='saved';
  assert.equal(hasLossSensitiveWork(state),false);
  assert.equal(shouldWarnBeforeUnload(state),false);
  state.pendingDraft=true;
  assert.equal(state.datasetModified,false);
  assert.equal(shouldWarnBeforeUnload(state),true);
  state.pendingDraft=false;
  state.datasetModified=true;
  assert.equal(hasLossSensitiveWork(state),true);
  assert.equal(shouldWarnBeforeUnload(state),false);
  state.pendingDraft=true;
  assert.equal(shouldWarnBeforeUnload(state),true);
  state.pendingDraft=false;state.persistence.status='degraded';
  assert.equal(shouldWarnBeforeUnload(state),true);
});

test('beforeunload protection is installed on the Window event target for pending drafts only when needed',()=>{
  const state=fresh({version:'1.0',entities:[],events:[],relations:[]});
  state.persistence.status='saved';
  const windowTarget=new EventTarget();
  installBeforeUnloadProtection(windowTarget,()=>state);
  const cleanEvent=new Event('beforeunload',{cancelable:true});
  windowTarget.dispatchEvent(cleanEvent);
  assert.equal(cleanEvent.defaultPrevented,false);
  state.pendingDraft=true;
  const pendingEvent=new Event('beforeunload',{cancelable:true});
  windowTarget.dispatchEvent(pendingEvent);
  assert.equal(pendingEvent.defaultPrevented,true);
});
