import {shortId} from './workspace-actions.js';
import {DIMENSION_ASSESSMENT_ID} from './model.js';

export function confirmationMarkup(request,state,esc){
  if(!request)return '';
  const dimension=request.kind==='dimension';
  const item=dimension?state.dimensions.find(d=>d.id===request.id):state.dataset.entities.find(e=>e?.id===request.id);
  if(!item)return '';
  const payload=state.dataset.extensions?.[DIMENSION_ASSESSMENT_ID];
  const dependent=Array.isArray(payload?.assessments)?payload.assessments.filter(a=>dimension?a.dimensionId===request.id:a.entityId===request.id).length:0;
  const title=dimension?'Delete Dimension?':'Delete Entity?';
  const detail=dimension
    ?`This removes ${esc(item.name)} (ID ${esc(shortId(item.id))}) and its ${dependent} dependent Assessment record${dependent===1?'':'s'} from the Dataset in the same change.`
    :`This removes ${esc(item.name||'unnamed Entity')} (ID ${esc(shortId(item.id))}) and its ${dependent} Dimension Assessment record${dependent===1?'':'s'} from the Dataset. Relations are never cascade-deleted.`;
  return `<div class="confirm-scrim" data-cancel-confirmation><section class="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-detail"><h2 id="confirm-title">${title}</h2><p id="confirm-detail">${detail}</p><div class="actions"><button data-cancel-confirmation>Cancel</button><button class="danger solid" data-confirm-delete>Delete ${dimension?'Dimension':'Entity'}</button></div></section></div>`;
}
