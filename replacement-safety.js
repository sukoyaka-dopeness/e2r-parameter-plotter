export function replacementMarkup(request={}){
  const isNew=request.kind==='new-dataset',isSample=request.kind==='sample-dataset',isHandoff=request.kind==='handoff-dataset';
  const title=isNew?'Create a new Dataset?':isSample?'Open sample Dataset?':isHandoff?'Open linked Dataset?':'Open another Dataset?';
  const incoming=isNew?'A new empty E2R Dataset.':isSample?'The Ashen Crown sample Dataset.':isHandoff?(request.datasetTitle||'Dataset from the Hub handoff.'):'E2R Dataset.';
  const confirm=isNew?'Discard and Create Dataset':isSample?'Discard and Open Sample':isHandoff?'Discard and Open Linked Dataset':'Discard and Open Dataset';
  const operation=isNew?'Creating':'Opening';
  return `<div class="confirm-scrim" data-replacement-scrim><section class="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="replacement-title" aria-describedby="replacement-detail"><h2 id="replacement-title">${title}</h2><p id="replacement-detail">${operation} this Dataset replaces the active Dataset and its comparison workspace. Any Dataset changes or unapplied authoring in the current workspace will be discarded.</p><p><strong>Incoming:</strong> ${escapeHtml(incoming)}</p><div class="actions"><button data-cancel-replacement>Cancel</button><button class="danger solid" data-confirm-replacement>${confirm}</button></div></section></div>`;
}

const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
