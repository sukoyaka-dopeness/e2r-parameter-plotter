import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh} from './model.js';
import {hasLossSensitiveWork,readWorkspaceBackup,shouldWarnBeforeUnload,workspaceBackupFor} from './workspace-recovery.js';

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
  state.datasetModified=true;
  assert.equal(hasLossSensitiveWork(state),true);
  assert.equal(shouldWarnBeforeUnload(state),false);
  state.pendingDraft=true;
  assert.equal(shouldWarnBeforeUnload(state),true);
  state.pendingDraft=false;state.persistence.status='degraded';
  assert.equal(shouldWarnBeforeUnload(state),true);
});
