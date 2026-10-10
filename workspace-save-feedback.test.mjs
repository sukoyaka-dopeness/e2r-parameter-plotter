import test from 'node:test';
import assert from 'node:assert/strict';
import {workspaceSaveFailureMessage} from './workspace-save-feedback.js';

test('stale revision keeps the specific conflict recovery message',()=>{
  const message='Another ParameterPlotter tab changed the saved workspace. Export any work you need to keep, then reload before continuing.';
  assert.equal(workspaceSaveFailureMessage({ok:false,conflict:true,reason:message},message),message);
  assert.match(workspaceSaveFailureMessage({ok:false,conflict:true,reason:message},message),/reload/);
});

test('known peer work is distinguished from an uncertain coordination failure',()=>{
  const message=workspaceSaveFailureMessage({ok:false,blockedByPeer:true,reason:'peer work'});
  assert.match(message,/Another ParameterPlotter tab has unapplied work/);
  assert.match(message,/kept its changes in memory/);
  assert.match(message,/saved workspace was not replaced/);
  assert.doesNotMatch(message,/could not be verified/);
});

test('unclassified failures retain their actual reason without inventing a cause',()=>{
  const message=workspaceSaveFailureMessage({ok:false,reason:'Storage access was denied.'});
  assert.equal(message,'Storage access was denied.');
  assert.match(workspaceSaveFailureMessage({ok:false},'', 'ja'),/安全性を確認できなかった/);
});
