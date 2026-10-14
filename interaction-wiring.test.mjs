import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {formAttributeId,rescaleActionFor} from './successor-event-wiring.js';
import {datasetTitleFor} from './dataset-context.js';
import {replacementMarkup} from './replacement-safety.js';
import {translateUiText} from './ui-localize.js';

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

test('backdrop hover feedback is limited to surfaces that dismiss on backdrop activation',async()=>{
  const [main,shell,confirmation,replacement,interactionCss,shellCss]=await Promise.all([
    readFile(new URL('./main.js',import.meta.url),'utf8'),
    readFile(new URL('./application-shell.js',import.meta.url),'utf8'),
    readFile(new URL('./confirmation-dialog.js',import.meta.url),'utf8'),
    readFile(new URL('./replacement-safety.js',import.meta.url),'utf8'),
    readFile(new URL('./second-pass.css',import.meta.url),'utf8'),
    readFile(new URL('./home-screen.css',import.meta.url),'utf8'),
  ]);
  assert.match(main,/drawer-backdrop is-backdrop-dismissible/);
  assert.match(main,/confirm-scrim is-backdrop-dismissible" data-cancel-rescale/);
  assert.match(shell,/credits-scrim is-backdrop-dismissible/);
  assert.doesNotMatch(confirmation,/is-backdrop-dismissible/);
  assert.doesNotMatch(replacement,/is-backdrop-dismissible/);
  assert.match(interactionCss,/\.drawer-backdrop\{[^}]*background:rgba\(8, 6, 13, 0\.28\)/);
  assert.match(interactionCss,/\.drawer-backdrop\.is-backdrop-dismissible:hover\{background:rgba\(8, 6, 13, 0\.34\)\}/);
  assert.match(interactionCss,/\.confirm-scrim\{[^}]*background:rgba\(8, 6, 13, 0\.28\)/);
  assert.match(interactionCss,/\.confirm-scrim\.is-backdrop-dismissible:hover:not\(:has\(> \.confirm-dialog:hover\)\)\{background:rgba\(8, 6, 13, 0\.34\)\}/);
  assert.match(shellCss,/\.credits-scrim \{[^}]*background: rgba\(8, 6, 13, 0\.28\);/);
  assert.match(shellCss,/\.credits-scrim\.is-backdrop-dismissible:hover:not\(:has\(> \.credits-dialog:hover\)\) \{ background: rgba\(8, 6, 13, 0\.34\); \}/);
  assert.match(shellCss,/\.sample-action \{ margin-top: 12px; \}/);
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
  assert.match(source,/installBeforeUnloadProtection\(window,\(\)=>\(\{\.\.\.s,pendingDraft:hasCurrentPendingDraft\(\)\}\)\)/);
  assert.match(source,/homePeerWorkStatus=status;\s*if\(surface==='home'\)\{\s*updateHomePeerWorkStatusView\(\);/);
  assert.match(source,/if\(homePeerWorkStatus\.kind!=='checking'\)\{\s*homePeerWorkStatus=\{kind:'checking'\}/);
  assert.match(source,/homePeerWorkStatusRequest/);
  assert.match(source,/workspaceCoordinator\.subscribe\(refreshHomePeerWorkStatus\)/);
  assert.doesNotMatch(source,/window\.addEventListener\('focus',refreshHomePeerWorkStatus\)/);
  const peerRefresh=source.slice(source.indexOf('function refreshHomePeerWorkStatus'),source.indexOf('workspaceCoordinator.subscribe(refreshHomePeerWorkStatus)'));
  assert.doesNotMatch(peerRefresh,/render\(\)/);
  assert.doesNotMatch(peerRefresh,/focusedAction\|\|'new'/);
  assert.match(source,/homeAcquisitionBlocked\(action,homePeerWorkStatus\.kind\)/);
  assert.doesNotMatch(source,/document\.addEventListener\(['"]beforeunload['"]/);
  assert.match(source,/placeholder="Describe this Entity"/);
  assert.doesNotMatch(source,/placeholder="Describe this temporary Entity"/);
  assert.match(source,/nav class="tabs" aria-label="Views"[^\n]*aria-current="\$\{s\.view===v\?'page':'false'\}"/);
  assert.doesNotMatch(source,/aria-pressed=/);
});

test('Dataset title Apply label is explicit while submit still uses the existing title mutation path',async()=>{
  const source=await readFile(new URL('./main.js',import.meta.url),'utf8');
  const titleEditor=source.slice(source.indexOf("editor.className='dataset-title-editor'"),source.indexOf("root.querySelector('.workspace')",source.indexOf("editor.className='dataset-title-editor'")));
  assert.match(titleEditor,/type="submit"[^>]*>Apply title<\/button>/);
  assert.match(titleEditor,/s\.readOnly\|\|\(datasetTitleDraft\?\?title\)===title\?'disabled':''/);
  const submitHandler=source.slice(source.indexOf("if(form.classList.contains('dataset-title-editor'))"),source.indexOf("if(formId==='entity-form')"));
  assert.match(submitHandler,/transactDatasetMutation\(s,\(\)=>applyDatasetTitle\(s\.dataset,title\)\)/);
  assert.match(submitHandler,/datasetTitleDraft=null;s\.pendingDraft=false/);
});

test('draft input changes republish the derived cross-tab protection state when a draft is cleared',async()=>{
  const source=await readFile(new URL('./main.js',import.meta.url),'utf8');
  const inputHandler=source.slice(source.indexOf("document.addEventListener('input',event=>{"),source.indexOf("},true);",source.indexOf("document.addEventListener('input',event=>{")));
  assert.match(inputHandler,/target\.id==='dataset-title-input'\|\|target\.matches\('#entity-form input,#entity-form textarea'\)\|\|target\.closest\('#dimension-form'\)/);
  assert.match(inputHandler,/workspaceCoordinator\.setActive\(hasCurrentLossSensitiveWork\(\)\)/);
  assert.doesNotMatch(inputHandler,/if\(s\.pendingDraft\)workspaceCoordinator\.setActive\(true\)/);
});

test('peer replacement refusal is rendered on Home and cancellation invalidates pending writes',async()=>{
  const [main,home]=await Promise.all([
    readFile(new URL('./main.js',import.meta.url),'utf8'),
    readFile(new URL('./home-screen.js',import.meta.url),'utf8'),
  ]);
  assert.match(main,/replacementFeedback:replacementRefusal/);
  assert.match(main,/const peerStatus=homePeerWorkStatus/);
  const replacementFlow=main.slice(main.indexOf('async function activateIncoming'));
  assert.ok(replacementFlow.indexOf('if(attemptId!==replacementAttemptId)return {ok:false,cancelled:true}')<replacementFlow.indexOf('if(activeTabs.length)return {ok:false,blockedByPeer:true'));
  assert.match(main,/const kind=result\.blockedByPeer\?'peer-work'/);
  assert.match(main,/replacement=null;replacementRefusal=\{request,kind,reason:/);
  assert.match(main,/function cancelReplacementFeedback\(\)\{replacementAttemptId\+\+/);
  assert.match(home,/safePeerStatus\.kind==='checking'\|\|\(replacementFeedback\?\.kind==='peer-work'&&safePeerStatus\.kind==='work'\)\?'':/);
  assert.match(home,/data-retry-replacement/);
  assert.match(home,/data-cancel-replacement-feedback/);
});

test('degraded Home recovery returns to the retained Workspace without reopening or retrying it',async()=>{
  const main=await readFile(new URL('./main.js',import.meta.url),'utf8');
  const home=await readFile(new URL('./home-screen.js',import.meta.url),'utf8');
  assert.match(main,/const canContinue=s\.workspaceCreated&&s\.persistence\.status==='saved';\s*const canReturnToWorkspace=s\.workspaceCreated&&s\.persistence\.status==='degraded';/);
  assert.match(main,/homeMarkup\(\{canContinue,canReturnToWorkspace,/);
  const recovery=main.slice(main.indexOf("else if(action==='return-workspace')"),main.indexOf("else if(action==='new')",main.indexOf("else if(action==='return-workspace')")));
  assert.match(recovery,/if\(!s\.workspaceCreated\|\|s\.persistence\.status!=='degraded'\)return/);
  assert.match(recovery,/surface='workspace';render\(\)/);
  assert.doesNotMatch(recovery,/receiveDataset|activateIncoming|retryExplicitly|scheduleWorkspaceSave/);
  assert.ok(main.includes("root.querySelector('[data-home-action=\"continue\"], [data-home-action=\"return-workspace\"]')?.focus();"));
  assert.match(home,/canReturnToWorkspace\s*\?/);
  assert.match(home,/data-home-action="return-workspace"/);
});

test('workspace persistence refusal presents one specific status instead of duplicating lifecycle feedback',async()=>{
  const main=await readFile(new URL('./main.js',import.meta.url),'utf8');
  assert.match(main,/blockedByPeer:true,reason:'Another ParameterPlotter tab has work that needs protection/);
  assert.match(main,/The browser was asked to download the E2R JSON\. This app cannot confirm that the download completed/);
  assert.match(main,/ブラウザーに依頼しました。完了はこの画面では確認できないため/);
  assert.match(main,/workspaceSaveFailureMessage\(result,s\.persistence\.message,locale\)/);
  assert.match(main,/if\(!exportNoticePending\)lifecycleNotice='';\s*exportNoticePending=false;\s*render\(\);/);
  assert.match(main,/scheduleWorkspaceSave\(\{exportRequested:true\}\)/);
  assert.match(main,/workspaceWriteGate\.run\(\(\)=>workspaceCoordinator\.withWriteLock/);
  assert.match(main,/if\(result\.ok\)\{expectedWorkspaceRaw=result\.raw;exportNoticePending=false;render\(\);return;\}/);
  assert.match(main,/const refusal=result\.priorRefusal\|\|result;\s*s\.persistence=\{status:'degraded'/);
  assert.match(main,/const persistenceMessage=refusal\?workspaceSaveFailureMessage\(refusal,s\.persistence\.message,locale,\{priorRefusal:true\}\):s\.persistence\.message/);
  assert.match(main,/const notice=s\.persistence\.status==='degraded'\?refusal\?workspaceSaveFailureMessage\(refusal,s\.persistence\.message,locale,\{priorRefusal:true\}\):s\.persistence\.message:''/);
  assert.match(main,/function retryReplacement\(\)\{[^}]*workspaceWriteGate\.retryExplicitly\(\)/);
  assert.match(main,/s\.persistence\.status==='saving'\?'Saving locally/);
  assert.match(translateUiText('Another ParameterPlotter tab changed the saved workspace. This tab did not overwrite it. Export any work you need to keep as E2R JSON and check that the download completed; then reload this tab and choose Continue Editing to open the latest saved workspace.'),/別のParameterPlotterタブで保存済みWorkspaceが更新されました/);
  assert.match(translateUiText('The browser was asked to download the E2R JSON. This app cannot confirm that the download completed, so check that the file is available before relying on it. Saving the browser-local Workspace is a separate operation.'),/ダウンロードをブラウザーに依頼しました/);
});

test('current Dataset context uses the E2R metadata title and an absent-title fallback',()=>{
  assert.equal(datasetTitleFor({extensions:{metadata:{title:'Apollo 11'}}}),'Apollo 11');
  assert.equal(datasetTitleFor({entities:[]}), 'Untitled Dataset');
  assert.equal(datasetTitleFor({extensions:{metadata:{title:'   '}}}),'Untitled Dataset');
});

test('current application and document identity use the Human-selected formal name',async()=>{
  const [html,main,server]=await Promise.all([
    readFile(new URL('./index.html',import.meta.url),'utf8'),
    readFile(new URL('./main.js',import.meta.url),'utf8'),
    readFile(new URL('./serve.mjs',import.meta.url),'utf8'),
  ]);
  assert.match(html,/<title>ParameterPlotter<\/title>/);
  assert.doesNotMatch(html,/working name/i);
  assert.match(main,/<h1>ParameterPlotter<\/h1>/);
  assert.match(main,/document\.title='ParameterPlotter'/);
  assert.doesNotMatch(main,/working name/i);
  assert.match(server,/console\.log\(`ParameterPlotter:/);
  assert.doesNotMatch(server,/working name/i);
});

test('Dataset replacement renders loss warning with Cancel and explicit discard action',()=>{
  const dataset=replacementMarkup();
  assert.match(dataset,/Open another Dataset\?/);
  assert.match(dataset,/Discard and Open Dataset/);
  assert.match(dataset,/data-cancel-replacement/);
  assert.match(dataset,/current workspace will be discarded/);
  assert.doesNotMatch(dataset,/Workspace Backup|Restore|data-backup-current/);
});

test('Home-origin replacements identify New and Sample actions without bypassing loss protection',()=>{
  const fresh=replacementMarkup({kind:'new-dataset'}),sample=replacementMarkup({kind:'sample-dataset'});
  assert.match(fresh,/A new empty E2R Dataset/);
  assert.match(fresh,/Discard and Create Dataset/);
  assert.match(sample,/The Ashen Crown sample Dataset/);
  assert.match(sample,/Discard and Open Sample/);
  for(const html of [fresh,sample]){
    assert.match(html,/data-cancel-replacement/);
    assert.match(html,/Dataset changes or unapplied authoring in the current workspace will be discarded/);
  }
});
