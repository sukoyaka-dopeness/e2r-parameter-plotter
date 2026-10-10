const TAB_PREFIX = 'e2r:parameter-plotter:workspace-tab:';
const WRITE_LOCK = 'e2r:parameter-plotter:workspace-write';

export function inspectWorkspacePeerWork(storage, heldLockNames, ownTabId) {
  try {
    const peerLocks=[...heldLockNames].filter(name=>name.startsWith(TAB_PREFIX)&&name!==`${TAB_PREFIX}${ownTabId}`);
    let count=0;
    for(const lockName of peerLocks){
      let record;
      try{record=JSON.parse(storage.getItem(lockName)??'null');}catch{return {kind:'unknown'};}
      if(!record||record.tabId!==lockName.slice(TAB_PREFIX.length)||typeof record.active!=='boolean')return {kind:'unknown'};
      if(record.active)count++;
    }
    return count?{kind:'work',count}:{kind:'clear'};
  }catch{return {kind:'unknown'};}
}

export function activeWorkspaceTabs(storage, heldLockNames, ownTabId) {
  const active = [];
  const staleKeys = [];
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (!key?.startsWith(TAB_PREFIX)) continue;
    let record;
    try { record = JSON.parse(storage.getItem(key)); } catch { staleKeys.push(key); continue; }
    if (!record?.active || record.tabId === ownTabId) continue;
    if (heldLockNames.has(`${TAB_PREFIX}${record.tabId}`)) active.push(record);
    else staleKeys.push(key);
  }
  return { active, staleKeys };
}

export function createWorkspaceCoordinator({ storage, lockManager, windowObject, tabId = crypto.randomUUID() }) {
  const statusKey = `${TAB_PREFIX}${tabId}`;
  let active = false;
  let releaseTabLock;
  let tabLockHeld = false;
  let coordinationError = '';
  let resolveReady;
  let ready;
  const listeners=new Set();
  const notify=()=>{for(const listener of listeners)listener();};
  function acquireTabLock(){
    if(!lockManager){coordinationError='This browser cannot safely coordinate workspace changes across tabs.';ready=Promise.resolve(false);return;}
    ready=new Promise(resolve=>{resolveReady=resolve;});
    const hold=new Promise(resolve=>{releaseTabLock=resolve;});
    lockManager.request(`${TAB_PREFIX}${tabId}`,async lock=>{
      if(!lock){resolveReady(false);return;}
      tabLockHeld=true;writeStatus();resolveReady(true);
      await hold;tabLockHeld=false;
    }).catch(error=>{
      coordinationError=error?.message||'Browser tab coordination is unavailable.';
      resolveReady(false);
    });
  }
  acquireTabLock();

  function writeStatus() {
    try { storage.setItem(statusKey, JSON.stringify({ tabId, active, updatedAt: Date.now() })); }
    catch (error) { coordinationError = error?.message || 'Browser workspace status could not be shared across tabs.'; }
  }

  function setActive(value) {
    active = Boolean(value);
    writeStatus();
  }

  async function withWriteLock(operation) {
    if (!lockManager || coordinationError) return { ok: false, reason: coordinationError || 'Cross-tab safety could not be verified.' };
    const readyResult = await ready;
    if (!readyResult || !tabLockHeld) return { ok: false, reason: 'This tab could not register its workspace safely.' };
    try {
      return await lockManager.request(WRITE_LOCK, { mode: 'exclusive' }, async lock => {
        if (!lock) return { ok: false, reason: 'Another tab is changing this workspace. Retry after it finishes.' };
        const query = await lockManager.query();
        const heldNames = new Set((query?.held || []).map(item => item.name));
        const tabs = activeWorkspaceTabs(storage, heldNames, tabId);
        for (const key of tabs.staleKeys) {
          try { storage.removeItem(key); } catch {}
        }
        return operation({ activeTabs: tabs.active });
      });
    } catch (error) {
      return { ok: false, reason: error?.message || 'Cross-tab safety could not be verified.' };
    }
  }

  function dispose(event) {
    try { storage.removeItem(statusKey); } catch {}
    releaseTabLock?.();
    tabLockHeld=false;
  }

  function handleStorage(event){
    if(event.key!==null&&!event.key?.startsWith(TAB_PREFIX))return;
    notify();
  }

  windowObject?.addEventListener('pagehide', dispose);
  windowObject?.addEventListener('pageshow', event => { if (event.persisted) {coordinationError='';acquireTabLock();} });
  windowObject?.addEventListener('storage',handleStorage);
  windowObject?.addEventListener('focus',notify);

  return {
    tabId, setActive, withWriteLock, dispose, statusKey,
    async peerWorkStatus(){
      if(!lockManager||coordinationError)return {kind:'unknown'};
      try{
        const query=await lockManager.query();
        if(coordinationError)return {kind:'unknown'};
        const held=new Set((query?.held||[]).map(item=>item.name).filter(Boolean));
        return inspectWorkspacePeerWork(storage,held,tabId);
      }catch{return {kind:'unknown'};}
    },
    subscribe(listener){listeners.add(listener);return ()=>{listeners.delete(listener);};},
  };
}
