import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {workspaceActionsMarkup} from './workspace-actions-menu.js';

test('workspace file and lifecycle actions are grouped behind a non-primary disclosure',()=>{
  const markup=workspaceActionsMarkup();
  assert.match(markup,/<details class="workspace-more">/);
  assert.match(markup,/<summary class="button workspace-more-trigger" aria-label="More workspace actions">More<\/summary>/);
  const actions=['Open E2R Dataset','Restore Workspace Backup','Export E2R JSON','Download Workspace Backup'];
  const positions=actions.map(action=>markup.indexOf(action));
  assert.ok(positions.every(position=>position>=0));
  assert.deepEqual(positions,[...positions].sort((a,b)=>a-b));
  assert.ok(markup.indexOf('data-action="entities"')<markup.indexOf('data-action="dimensions"'));
  assert.ok(markup.indexOf('data-action="dimensions"')<markup.indexOf('class="workspace-more"'));
  assert.doesNotMatch(markup,/workspace-more[^`]*class="button primary"/);
  assert.match(markup,/<button type="button" class="workspace-more-item" data-import-trigger aria-label="Open E2R Dataset" aria-controls="dataset-file">Open E2R Dataset<\/button>/);
  assert.match(markup,/<button type="button" class="workspace-more-item" data-workspace-restore-trigger aria-label="Restore Workspace Backup" aria-controls="workspace-file">Restore Workspace Backup<\/button>/);
  assert.ok(markup.indexOf('</details>')<markup.indexOf('id="dataset-file"'));
  assert.ok(markup.indexOf('</details>')<markup.indexOf('id="workspace-file"'));
  assert.match(markup,/id="dataset-file" type="file"[^>]*hidden/);
  assert.match(markup,/id="workspace-file" type="file"[^>]*hidden/);
  assert.match(markup,/<button data-action="entities">Entities<\/button>/);
  assert.match(markup,/<button data-action="dimensions" >Dimensions<\/button>/);
});

test('open and restore actions use persistent native file inputs and close More before invoking them',async()=>{
  const source=await readFile(new URL('./main.js',import.meta.url),'utf8');
  assert.match(source,/function openWorkspaceFilePicker\(inputId\)\{closeWorkspaceMore\(\{restoreFocus:true\}\);root\.querySelector\(`#\$\{inputId\}`\)\?\.click\(\);\}/);
  assert.match(source,/openWorkspaceFilePicker\('dataset-file'\)/);
  assert.match(source,/openWorkspaceFilePicker\('workspace-file'\)/);
  assert.match(source,/document\.addEventListener\('click',event=>\{const menu=root\.querySelector\('\.workspace-more'\);if\(menu\?\.open&&!menu\.contains\(event\.target\)\)menu\.open=false;\}\)/);
  assert.match(source,/document\.addEventListener\('keydown',event=>\{if\(event\.key!=='Escape'\)return;const menu=root\.querySelector\('\.workspace-more'\);if\(menu\?\.open\)\{event\.preventDefault\(\);menu\.open=false;menu\.querySelector\('summary'\)\?\.focus\(\);\}\}\)/);
});

test('diagnostic read-only state disables Dataset authoring and Export but retains acquisition and backup actions',()=>{
  const markup=workspaceActionsMarkup({readOnly:true,authoringUnavailable:true});
  assert.match(markup,/<button class="workspace-more-item" data-successor-export-dataset aria-label="Export E2R JSON" disabled>Export E2R JSON<\/button>/);
  assert.match(markup,/<button data-action="dimensions" disabled>Dimensions<\/button>/);
  assert.match(markup,/data-import-trigger/);
  assert.match(markup,/data-workspace-restore-trigger/);
  assert.match(markup,/data-successor-backup/);
});

test('unsupported Candidate authoring disables Dimensions without blocking safe Dataset Export',()=>{
  const markup=workspaceActionsMarkup({readOnly:false,authoringUnavailable:true});
  assert.match(markup,/<button class="workspace-more-item" data-successor-export-dataset aria-label="Export E2R JSON" >Export E2R JSON<\/button>/);
  assert.match(markup,/<button data-action="dimensions" disabled>Dimensions<\/button>/);
});
