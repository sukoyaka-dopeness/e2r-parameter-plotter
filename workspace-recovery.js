import {datasetForWorkspace,readDataset} from './model.js';

export const WORKSPACE_BACKUP_FORMAT='parameterplotter-workspace-backup';
export const WORKSPACE_BACKUP_VERSION=1;

export function workspaceBackupFor(state){
  return {format:WORKSPACE_BACKUP_FORMAT,version:WORKSPACE_BACKUP_VERSION,dataset:datasetForWorkspace(state),workspace:{datasetModified:state.datasetModified,datasetBaseline:state.datasetBaseline}};
}

export function readWorkspaceBackup(value){
  if(value?.format!==WORKSPACE_BACKUP_FORMAT||value.version!==WORKSPACE_BACKUP_VERSION)throw Error('This is not a supported ParameterPlotter Workspace Backup. An E2R Dataset export is a different file.');
  const dataset=readDataset(value.dataset);
  if(value.workspace!==undefined&&(typeof value.workspace!=='object'||value.workspace===null||typeof value.workspace.datasetModified!=='boolean'||typeof value.workspace.datasetBaseline!=='string'))throw Error('The Workspace Backup recovery status is incomplete. Current workspace was not changed.');
  return {dataset,datasetModified:value.workspace?.datasetModified??true,datasetBaseline:value.workspace?.datasetBaseline??''};
}

export function hasLossSensitiveWork(state){
  return Boolean(state.datasetModified||state.pendingDraft||state.persistence?.status==='degraded');
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
