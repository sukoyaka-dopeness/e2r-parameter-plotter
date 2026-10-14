export function hasLossSensitiveWork(state){
  return Boolean(state.datasetModified||state.pendingDraft||state.persistence?.status==='degraded');
}

export function hasPendingAssessmentDraft(root){
  return Boolean(root?.querySelector('input[type="number"][data-value][data-dirty="true"]'));
}

export function hasPendingWorkspaceDraft({stateDraft=false,titleDraft,currentTitle,entityDraft,dimensionDraft,root}={}){
  return Boolean(stateDraft||(typeof titleDraft==='string'&&titleDraft!==currentTitle)||entityDraft||dimensionDraft||hasPendingAssessmentDraft(root));
}

export function hasLossSensitiveWorkspaceWork(state,drafts={}){
  return hasLossSensitiveWork({...state,pendingDraft:hasPendingWorkspaceDraft({...drafts,stateDraft:drafts.stateDraft??state?.pendingDraft})});
}

export function shouldWarnBeforeUnload(state){
  return Boolean(state.pendingDraft||['saving','degraded'].includes(state.persistence?.status));
}

export function installBeforeUnloadProtection(windowTarget,getState){
  windowTarget.addEventListener('beforeunload',event=>{
    if(!shouldWarnBeforeUnload(getState()))return;
    event.preventDefault();
    event.returnValue='';
  });
}
