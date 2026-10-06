export function formAttributeId(form){
  return form.getAttribute('id');
}

export function rescaleActionFor(target,eventTarget=target){
  if(target?.closest('[data-approve-rescale]'))return 'approve';
  if(target?.closest('button[data-cancel-rescale]'))return 'cancel';
  if(eventTarget?.matches('.confirm-scrim[data-cancel-rescale]')&&(eventTarget===target||!target))return 'cancel';
  return null;
}
