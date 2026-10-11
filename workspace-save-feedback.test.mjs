import test from 'node:test';
import assert from 'node:assert/strict';
import {workspaceSaveFailureMessage} from './workspace-save-feedback.js';

test('stale revision keeps the specific conflict recovery message',()=>{
  const message='Another ParameterPlotter tab changed the saved workspace. This tab did not overwrite it. Export any work you need to keep as E2R JSON and check that the download completed; then reload this tab and choose Continue Editing to open the latest saved workspace.';
  assert.equal(workspaceSaveFailureMessage({ok:false,conflict:true,reason:message},message),message);
  assert.match(workspaceSaveFailureMessage({ok:false,conflict:true,reason:message},message),/reload/);
  assert.match(message,/check that the download completed/);
  assert.match(message,/saved workspace/);
});

test('known peer work is distinguished from an uncertain coordination failure',()=>{
  const message=workspaceSaveFailureMessage({ok:false,blockedByPeer:true,reason:'peer work'});
  assert.match(message,/Another ParameterPlotter tab has work that needs protection/);
  assert.match(message,/current Dataset remains in memory/);
  assert.match(message,/saved workspace was not replaced/);
  assert.match(message,/export any Dataset changes/);
  assert.doesNotMatch(message,/could not be verified/);
});

test('unclassified failures retain their actual reason without inventing a cause',()=>{
  const message=workspaceSaveFailureMessage({ok:false,reason:'Storage access was denied.'});
  assert.equal(message,'Storage access was denied.');
  assert.match(workspaceSaveFailureMessage({ok:false},'', 'ja'),/安全性を確認できなかった/);
});

test('a later attempt after refusal explains that saving stays paused until reload',()=>{
  const english=workspaceSaveFailureMessage({blockedByPeer:true},'', 'en',{priorRefusal:true});
  assert.match(english,/paused until reload/);
  assert.match(english,/check that the download completed/);
  const japanese=workspaceSaveFailureMessage({blockedByPeer:true},'', 'ja',{priorRefusal:true});
  assert.match(japanese,/Reloadまで停止/);
});
