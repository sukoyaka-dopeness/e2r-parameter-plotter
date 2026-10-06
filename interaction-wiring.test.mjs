import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {formAttributeId,rescaleActionFor} from './successor-event-wiring.js';
import {datasetTitleFor} from './dataset-context.js';
import {replacementMarkup} from './replacement-safety.js';

test('dimension submit identifies the form attribute even when a named control masks form.id',()=>{
  const form={id:{value:'dimension-id-control'},getAttribute:name=>name==='id'?'dimension-form':null};
  assert.equal(form.id.value,'dimension-id-control');
  assert.equal(formAttributeId(form),'dimension-form');
});

test('Rescale approval wins over the enclosing cancel scrim',()=>{
  const scrim={};
  const approve={closest:selector=>selector==='[data-approve-rescale]'?approve:selector==='.confirm-scrim[data-cancel-rescale]'?scrim:null,matches:()=>false};
  assert.equal(rescaleActionFor(approve,approve),'approve');
});

test('Rescale cancellation is limited to its button or the actual scrim background',()=>{
  const cancelButton={closest:selector=>selector==='button[data-cancel-rescale]'?cancelButton:null,matches:()=>false};
  const scrim={matches:selector=>selector==='.confirm-scrim[data-cancel-rescale]'};
  const dialogText={matches:()=>false};
  assert.equal(rescaleActionFor(cancelButton,cancelButton),'cancel');
  assert.equal(rescaleActionFor(null,scrim),'cancel');
  assert.equal(rescaleActionFor(null,dialogText),null);
});

test('successor entry point wires replacement rendering, form identity, stale-notice clearing, and Rescale routing',async()=>{
  const source=await readFile(new URL('./main.js',import.meta.url),'utf8');
  assert.match(source,/import\s*\{\s*replacementMarkup\s*\}\s*from\s*['"]\.\/replacement-safety\.js['"]/);
  assert.match(source,/formAttributeId\(form\)/);
  assert.match(source,/rescaleActionFor\(target,event\.target\)/);
  assert.match(source,/!target&&!\(rescaleProposal&&event\.target\.matches\('\.confirm-scrim\[data-cancel-rescale\]'\)\)/);
  assert.doesNotMatch(source,/if\s*\(form\.id\s*===\s*['"]dimension-form['"]\)/);
  assert.doesNotMatch(source,/addEventListener\('submit',e=>\{if\(e\.target\.getAttribute\('id'\)!=='dimension-form'/);
  assert.match(source,/applyDimensionAndRescale\(s,next\)/);
  assert.match(source,/s\.pendingDraft=false;\}update\(\);return;\}\s*if\(action==='cancel'\)/);
  assert.match(source,/function clearLifecycleNotice\(\)\{\s*if\(!lifecycleNotice\)return;\s*lifecycleNotice='';\s*root\.querySelector\('\.lifecycle-notice'\)\?\.remove\(\);/);
  assert.match(source,/installBeforeUnloadProtection\(window,\(\)=>s\)/);
  assert.doesNotMatch(source,/document\.addEventListener\(['"]beforeunload['"]/);
  assert.match(source,/placeholder="Describe this Entity"/);
  assert.doesNotMatch(source,/placeholder="Describe this temporary Entity"/);
});

test('current Dataset context uses the E2R metadata title and an absent-title fallback',()=>{
  assert.equal(datasetTitleFor({extensions:{metadata:{title:'Apollo 11'}}}),'Apollo 11');
  assert.equal(datasetTitleFor({entities:[]}), 'Untitled Dataset');
  assert.equal(datasetTitleFor({extensions:{metadata:{title:'   '}}}),'Untitled Dataset');
});

test('Dataset replacement and Workspace Restore render distinct loss warnings and explicit actions',()=>{
  const dataset=replacementMarkup({kind:'dataset'}),workspace=replacementMarkup({kind:'workspace'});
  assert.match(dataset,/Open another Dataset\?/);
  assert.match(dataset,/Discard and Open Dataset/);
  assert.match(workspace,/Restore this workspace\?/);
  assert.match(workspace,/Discard and Restore/);
  for(const markup of [dataset,workspace]){
    assert.match(markup,/data-cancel-replacement/);
    assert.match(markup,/data-backup-current/);
    assert.match(markup,/current workspace will be discarded/);
  }
});
