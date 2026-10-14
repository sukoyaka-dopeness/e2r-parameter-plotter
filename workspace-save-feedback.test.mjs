import test from 'node:test';
import assert from 'node:assert/strict';
import {workspaceCoordinationFailureMessage, workspaceSaveFailureMessage} from './workspace-save-feedback.js';

test('stale revision retains its caller-provided conflict guidance',()=>{
  const message='Another ParameterPlotter tab changed the saved workspace. This tab did not overwrite it. Export any work you need to keep as E2R JSON and check that the download completed; then reload this tab and choose Continue Editing to open the latest saved workspace.';
  assert.equal(workspaceSaveFailureMessage({ok:false,conflict:true,reason:message},message),message);
  assert.equal(workspaceSaveFailureMessage({ok:false,conflict:true,reason:message},message,'ja'),message);
});

test('current peer work remains distinct from an uncertain coordination failure in both locales',()=>{
  const english=workspaceSaveFailureMessage({ok:false,blockedByPeer:true,reason:'peer work'},'','en');
  assert.match(english,/Another ParameterPlotter tab has work that needs protection/);
  assert.match(english,/current Dataset remains in memory/);
  assert.match(english,/saved workspace was not replaced/);
  assert.match(english,/Apply or cancel open input/);
  assert.match(english,/export any Dataset changes/i);
  assert.doesNotMatch(english,/could not be verified/);
  const japanese=workspaceSaveFailureMessage({ok:false,blockedByPeer:true,reason:'peer work'},'','ja');
  assert.match(japanese,/別のParameterPlotterタブに保護が必要な作業があります/);
  assert.match(japanese,/現在のDatasetはメモリに保持/);
  assert.match(japanese,/保存済みWorkspaceは置き換えられていません/);
  assert.match(japanese,/入力を適用または取り消し/);
  assert.match(japanese,/再試行/);
  assert.doesNotMatch(japanese,/安全性を確認できなかった/);
});

test('unclassified failures preserve the same supplied diagnostic detail in both locales',()=>{
  const english=workspaceSaveFailureMessage({ok:false,reason:'Storage access was denied.'},'','en');
  assert.equal(english,'Storage access was denied.');
  const japanese=workspaceSaveFailureMessage({ok:false,reason:'Storage access was denied.'},'','ja');
  assert.equal(japanese,english);
  const genericJapanese=workspaceSaveFailureMessage({ok:false},'', 'ja');
  assert.match(genericJapanese,/クロスタブの安全性を確認できなかった/);
  assert.match(genericJapanese,/このタブを再読み込み/);
  assert.doesNotMatch(genericJapanese,/Export/);
});

test('scheduled coordination failures preserve the detail beside localized recovery guidance',()=>{
  const reason='Browser tab coordination is unavailable.';
  const english=workspaceCoordinationFailureMessage(reason,'en');
  const japanese=workspaceCoordinationFailureMessage(reason,'ja');
  assert.match(english,/Workspace saving stopped because cross-tab safety could not be verified/);
  assert.match(japanese,/クロスタブの安全性を確認できなかった/);
  assert.ok(english.endsWith(reason));
  assert.ok(japanese.endsWith(reason));
  assert.equal(workspaceCoordinationFailureMessage('','ja'),workspaceSaveFailureMessage({},'','ja'));
});

test('a later attempt after refusal explains that saving stays paused until reload',()=>{
  const english=workspaceSaveFailureMessage({blockedByPeer:true},'', 'en',{priorRefusal:true});
  assert.match(english,/paused until reload/);
  assert.match(english,/verify the download/);
  const japanese=workspaceSaveFailureMessage({blockedByPeer:true},'', 'ja',{priorRefusal:true});
  assert.match(japanese,/再読み込みまで停止/);
  assert.match(japanese,/E2R JSONとして書き出し/);
  assert.doesNotMatch(japanese,/Export|Reload/);
});

test('a latched peer refusal describes the peer work as the past reason for the save stop',()=>{
  const refusal={ok:false,blockedByPeer:true,reason:'peer work at refusal'};
  const english=workspaceSaveFailureMessage(refusal,'','en',{priorRefusal:true});
  assert.match(english,/remains paused until reload/);
  assert.match(english,/had work that needed protection when the earlier save was refused/);
  assert.match(english,/current Dataset remains in memory/);
  assert.doesNotMatch(english,/another tab has work/);
  const japanese=workspaceSaveFailureMessage(refusal,'','ja',{priorRefusal:true});
  assert.match(japanese,/前回の保存時に別のParameterPlotterタブに保護が必要な作業があった/);
  assert.match(japanese,/再読み込みまで停止/);
  assert.match(japanese,/現在のDatasetはこのタブのメモリに保持/);
  assert.match(japanese,/E2R JSONとして書き出し/);
  assert.doesNotMatch(japanese,/Export|別のタブに作業があります/);
});

test('a latched stale-revision refusal remains specific and localized',()=>{
  const refusal={ok:false,conflict:true,reason:'changed revision'};
  const english=workspaceSaveFailureMessage(refusal,'','en',{priorRefusal:true});
  assert.match(english,/saved Workspace changed before an earlier save/);
  assert.match(english,/paused until reload/);
  const japanese=workspaceSaveFailureMessage(refusal,'','ja',{priorRefusal:true});
  assert.match(japanese,/再読み込みまで停止/);
  assert.match(japanese,/Dataset/);
  assert.match(japanese,/Workspace/);
  assert.match(japanese,/最新/);
  assert.match(japanese,/E2R JSON/);
  assert.doesNotMatch(japanese,/Export|Reload/);
});
