import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh} from './model.js';
import {hasLossSensitiveWork,hasLossSensitiveWorkspaceWork,hasPendingAssessmentDraft,hasPendingWorkspaceDraft,installBeforeUnloadProtection,shouldWarnBeforeUnload} from './workspace-recovery.js';

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
  state.persistence.status='saving';
  assert.equal(shouldWarnBeforeUnload(state),true);
});

test('an uncommitted numeric Assessment input is loss-sensitive workspace work',()=>{
  const dirtyInput={};
  const root={querySelector(selector){assert.equal(selector,'input[type="number"][data-value][data-dirty="true"]');return dirtyInput;}};
  assert.equal(hasPendingAssessmentDraft(root),true);
  root.querySelector=()=>null;
  assert.equal(hasPendingAssessmentDraft(root),false);
  assert.equal(hasPendingAssessmentDraft(null),false);
});

test('independent editor drafts remain protected when another draft is reverted or cancelled',()=>{
  const root={querySelector:()=>null};
  const base={stateDraft:false,titleDraft:'Current title',currentTitle:'Current title',entityDraft:null,dimensionDraft:null,root};
  const saved={persistence:{status:'saved'},datasetModified:false,pendingDraft:false};
  const protectedWork=drafts=>hasLossSensitiveWorkspaceWork(saved,drafts);
  assert.equal(protectedWork({...base,titleDraft:'Edited title'}),true);
  assert.equal(protectedWork({...base,titleDraft:'Edited title',entityDraft:{name:'Draft Entity'}}),true);
  assert.equal(protectedWork({...base,titleDraft:'Current title',entityDraft:{name:'Draft Entity'}}),true);
  assert.equal(protectedWork({...base,titleDraft:'Edited title',entityDraft:null}),true);
  assert.equal(protectedWork({...base,titleDraft:'Current title',entityDraft:null,dimensionDraft:{name:'Draft Dimension'}}),true);
  assert.equal(protectedWork({...base,titleDraft:'Current title',dimensionDraft:null}),false);
  assert.equal(protectedWork({...base,titleDraft:'Current title',stateDraft:true}),true);
  assert.equal(hasLossSensitiveWorkspaceWork({...saved,datasetModified:true},base),true);
  assert.equal(hasLossSensitiveWorkspaceWork({...saved,persistence:{status:'degraded'}},base),true);
  const dirtyAssessment={querySelector:()=>({})};
  assert.equal(protectedWork({...base,titleDraft:'Current title',root:dirtyAssessment}),true);
  assert.equal(hasPendingWorkspaceDraft({...base,titleDraft:'Current title'}),false);
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
