export function replacementMarkup(request={}){
  const restore=request.kind==='workspace';
  const noun=restore?'ParameterPlotter Workspace Backup':'E2R Dataset';
  const title=restore?'Restore this workspace?':'Open another Dataset?';
  const detail=restore
    ?'This replaces the active Dataset and its associated workspace. Any Dataset changes or unapplied authoring in the current workspace will be discarded.'
    :'Opening this Dataset replaces the active Dataset and its comparison workspace. Any Dataset changes or unapplied authoring in the current workspace will be discarded.';
  return `<div class="confirm-scrim" data-replacement-scrim><section class="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="replacement-title" aria-describedby="replacement-detail"><h2 id="replacement-title">${title}</h2><p id="replacement-detail">${detail}</p><p><strong>Incoming:</strong> ${noun}. Workspace Backup and E2R Dataset Export are separate files.</p><div class="actions"><button data-cancel-replacement>Cancel</button><button data-backup-current>Download current Workspace Backup (optional)</button><button class="danger solid" data-confirm-replacement>${restore?'Discard and Restore':'Discard and Open Dataset'}</button></div></section></div>`;
}
