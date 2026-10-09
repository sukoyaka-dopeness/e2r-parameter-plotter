export function workspaceActionsMarkup({readOnly=false,authoringUnavailable=readOnly}={}) {
  return `<button data-action="entities">Entities</button>
      <button data-action="dimensions" ${authoringUnavailable?'disabled':''}>Dimensions</button>
      <details class="workspace-more">
    <summary class="button workspace-more-trigger" aria-label="More workspace actions" aria-haspopup="menu">More</summary>
    <div class="workspace-more-panel" role="menu" aria-label="Dataset actions">
      <button type="button" role="menuitem" class="workspace-more-item" data-import-trigger aria-label="Open E2R Dataset" aria-controls="dataset-file">Open E2R Dataset</button>
      <button type="button" role="menuitem" class="workspace-more-item" data-successor-export-dataset aria-label="Export E2R JSON" ${readOnly?'disabled':''}>Export E2R JSON</button>
    </div>
  </details>
      <input id="dataset-file" type="file" accept=".json,.e2r.json,application/json" hidden>`;
}
