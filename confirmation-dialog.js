import {shortId} from './workspace-actions.js';
export function confirmationMarkup(request,state,esc){
 if(!request)return '';
 const dimension=request.kind==='dimension';
 const item=dimension?state.dimensions.find(d=>d.id===request.id):state.tempEntities.find(e=>e.id===request.id);
 if(!item)return '';
 const title=dimension?'Delete dimension?':'Delete temporary Entity?';
 const detail=dimension
  ?`The temporary dimension “${esc(item.name)}” (${esc(item.low)} → ${esc(item.high)}, local ID ${esc(shortId(item.id))}) and all its temporary values will be deleted from this session.`
  :`The temporary Entity “${esc(item.name)}” (ID ${esc(shortId(item.id))}), its values, and its session references will be deleted. The E2R Dataset is unchanged.`;
 return `<div class="confirm-scrim" data-cancel-confirmation><section class="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-detail"><h2 id="confirm-title">${title}</h2><p id="confirm-detail">${detail}</p><div class="actions"><button data-cancel-confirmation>Cancel</button><button class="danger solid" data-confirm-delete>Delete ${dimension?'dimension':'temporary Entity'}</button></div></section></div>`;
}
