import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {workspaceActionsMarkup} from './workspace-actions-menu.js';

test('Dataset acquisition and Export remain grouped behind a non-primary disclosure',()=>{
  const markup=workspaceActionsMarkup();
  assert.match(markup,/<details class="workspace-more">/);
  assert.match(markup,/<summary class="button workspace-more-trigger" aria-label="More workspace actions" aria-haspopup="menu">More<\/summary>/);
  assert.match(markup,/<div class="workspace-more-panel" role="menu" aria-label="Dataset actions">/);
  const actions=['Open E2R Dataset','Export E2R JSON'];
  const positions=actions.map(action=>markup.indexOf(action));
  assert.ok(positions.every(position=>position>=0));
  assert.deepEqual(positions,[...positions].sort((a,b)=>a-b));
  assert.ok(markup.indexOf('data-action="entities"')<markup.indexOf('data-action="dimensions"'));
  assert.ok(markup.indexOf('data-action="dimensions"')<markup.indexOf('class="workspace-more"'));
  assert.doesNotMatch(markup,/workspace-more[^`]*class="button primary"/);
  assert.match(markup,/<button type="button" role="menuitem" class="workspace-more-item" data-import-trigger aria-label="Open E2R Dataset" aria-controls="dataset-file">Open E2R Dataset<\/button>/);
  assert.ok(markup.indexOf('</details>')<markup.indexOf('id="dataset-file"'));
  assert.match(markup,/id="dataset-file" type="file"[^>]*hidden/);
  assert.doesNotMatch(markup,/Workspace Backup|workspace-file|restore/i);
  assert.match(markup,/<button data-action="entities">Entities<\/button>/);
  assert.match(markup,/<button data-action="dimensions" >Dimensions<\/button>/);
});

test('Open Dataset uses its persistent native file input and closes More before invoking it',async()=>{
  const source=await readFile(new URL('./main.js',import.meta.url),'utf8');
  assert.match(source,/function openDatasetFilePicker\(\)\{closeWorkspaceMore\(\{restoreFocus:true\}\);root\.querySelector\('#dataset-file'\)\?\.click\(\);\}/);
  assert.match(source,/openDatasetFilePicker\(\)/);
  assert.doesNotMatch(source,/workspace-file|workspace-restore|successor-backup|downloadCurrentBackup|readWorkspaceBackup|workspaceBackupFor/);
  assert.match(source,/document\.addEventListener\('click',event=>\{const menu=root\.querySelector\('\.workspace-more'\);if\(menu\?\.open&&!menu\.contains\(event\.target\)\)menu\.open=false;\}\)/);
  assert.match(source,/document\.addEventListener\('toggle',focusWorkspaceMoreOnOpen,true\)/);
  assert.match(source,/document\.addEventListener\('keydown',handleWorkspaceMoreKeydown\)/);
  assert.match(source,/closeWorkspaceMore\(\{restoreFocus:true\}\);exportCurrentDataset\(\)/);
});

test('diagnostic read-only state disables Dataset authoring and Export but retains acquisition',()=>{
  const markup=workspaceActionsMarkup({readOnly:true,authoringUnavailable:true});
  assert.match(markup,/<button type="button" role="menuitem" class="workspace-more-item" data-successor-export-dataset aria-label="Export E2R JSON" disabled>Export E2R JSON<\/button>/);
  assert.match(markup,/<button data-action="dimensions" disabled>Dimensions<\/button>/);
  assert.match(markup,/data-import-trigger/);
  assert.doesNotMatch(markup,/Workspace Backup|workspace-file|restore/i);
});

test('unsupported Candidate authoring disables Dimensions without blocking safe Dataset Export',()=>{
  const markup=workspaceActionsMarkup({readOnly:false,authoringUnavailable:true});
  assert.match(markup,/<button type="button" role="menuitem" class="workspace-more-item" data-successor-export-dataset aria-label="Export E2R JSON" >Export E2R JSON<\/button>/);
  assert.match(markup,/<button data-action="dimensions" disabled>Dimensions<\/button>/);
});
