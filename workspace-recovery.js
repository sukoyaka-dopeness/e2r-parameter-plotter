export function hasLossSensitiveWork(state){
  return Boolean(state.datasetModified||state.pendingDraft||state.persistence?.status==='degraded');
}

export function hasPendingAssessmentDraft(root){
  return Boolean(root?.querySelector('input[type="number"][data-value][data-dirty="true"]'));
}

export function shouldWarnBeforeUnload(state){
  return Boolean(state.pendingDraft||state.persistence?.status==='degraded');
}

export function installBeforeUnloadProtection(windowTarget,getState){
  windowTarget.addEventListener('beforeunload',event=>{
    if(!shouldWarnBeforeUnload(getState()))return;
    event.preventDefault();
    event.returnValue='';
  });
}
