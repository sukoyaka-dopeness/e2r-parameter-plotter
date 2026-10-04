export function hasTemporaryWork(state) {
  return Boolean(state.tempEntities?.length || state.dimensions?.length ||
    Object.values(state.values || {}).some(row => Object.keys(row || {}).length));
}

export function replacementMarkup() {
  return `<div class="confirm-scrim" data-cancel-replacement><section class="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="replacement-title"><h2 id="replacement-title">Replace this workspace?</h2><p>Importing another Dataset clears the temporary Entities, dimensions, and values in this tab. This work cannot be exported or recovered after the browser session ends.</p><div class="actions"><button data-cancel-replacement>Keep current workspace</button><button class="danger solid" data-confirm-replacement>Replace workspace</button></div></section></div>`;
}
