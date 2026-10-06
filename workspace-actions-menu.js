export function workspaceActionsMarkup({readOnly=false,authoringUnavailable=readOnly}={}) {
  return `<button data-action="entities">Entities</button>
      <button data-action="dimensions" ${authoringUnavailable?'disabled':''}>Dimensions</button>
      <details class="workspace-more">
    <summary class="button workspace-more-trigger" aria-label="More workspace actions">More</summary>
    <div class="workspace-more-panel" role="group" aria-label="Workspace file actions">
      <button type="button" class="workspace-more-item" data-import-trigger aria-label="Open E2R Dataset" aria-controls="dataset-file">Open E2R Dataset</button>
      <button type="button" class="workspace-more-item" data-workspace-restore-trigger aria-label="Restore Workspace Backup" aria-controls="workspace-file">Restore Workspace Backup</button>
      <button class="workspace-more-item" data-successor-export-dataset aria-label="Export E2R JSON" ${readOnly?'disabled':''}>Export E2R JSON</button>
      <button class="workspace-more-item" data-successor-backup aria-label="Download Workspace Backup">Download Workspace Backup</button>
    </div>
  </details>
      <input id="dataset-file" type="file" accept=".json,.e2r.json,application/json" hidden>
      <input id="workspace-file" type="file" accept=".pp-workspace.json,.json,application/json" hidden>`;
}
