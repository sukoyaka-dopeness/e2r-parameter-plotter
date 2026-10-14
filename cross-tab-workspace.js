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

export function createWorkspaceCoordinator({ storage, lockManager, windowObject, ownership, tabId = crypto.randomUUID() }) {
  const statusKey = `${TAB_PREFIX}${tabId}`;
  let active = false;
  let releaseTabLock;
  let tabLockHeld = false;
  let coordinationError = '';
  let resolveReady;
  let ready;
  let registration=0;
  const pendingWrites=new Set();
  const listeners=new Set();
  const notify=()=>{for(const listener of listeners)listener();};
  function acquireTabLock(){
    if(ownership&&!ownership.owns){ready=Promise.resolve(false);return;}
    if(!lockManager){coordinationError='This browser cannot safely coordinate workspace changes across tabs.';ready=Promise.resolve(false);return;}
    ready=new Promise(resolve=>{resolveReady=resolve;});
    const finishReady=resolveReady;
    const hold=new Promise(resolve=>{releaseTabLock=resolve;});
    const currentRegistration=++registration;
    lockManager.request(`${TAB_PREFIX}${tabId}`,async lock=>{
      if(currentRegistration!==registration){finishReady(false);return;}
      if(!lock){finishReady(false);return;}
      tabLockHeld=true;writeStatus();finishReady(true);
      await hold;if(currentRegistration===registration)tabLockHeld=false;
    }).catch(error=>{
      coordinationError=error?.message||'Browser tab coordination is unavailable.';
      finishReady(false);
    });
  }
  acquireTabLock();

  function writeStatus() {
    if(!tabLockHeld||(ownership&&!ownership.owns))return;
    try { storage.setItem(statusKey, JSON.stringify({ tabId, active, updatedAt: Date.now() })); }
    catch (error) { coordinationError = error?.message || 'Browser workspace status could not be shared across tabs.'; }
  }

  function setActive(value) {
    active = Boolean(value);
    writeStatus();
  }

  async function withWriteLock(operation) {
    const ownerToken=ownership?.capture();
    const currentRegistration=registration;
    const permitted=()=>currentRegistration===registration&&tabLockHeld&&(!ownership||ownership.isCurrent(ownerToken));
    if(ownership&&!ownership.isCurrent(ownerToken))return {ok:false,cancelled:true};
    if (!lockManager || coordinationError) return { ok: false, reason: coordinationError || 'Cross-tab safety could not be verified.' };
    const readyResult = await ready;
    if (!readyResult || !permitted()) return { ok: false, cancelled:true, reason: 'This tab could not register its workspace safely.' };
    const controller=new AbortController();
    let cancelQuery;
    const cancelled=new Promise(resolve=>{cancelQuery=()=>resolve({cancelled:true});});
    const cancel=()=>{controller.abort();cancelQuery();};
    pendingWrites.add(cancel);
    try {
      return await lockManager.request(WRITE_LOCK, { mode: 'exclusive',signal:controller.signal }, async lock => {
        if (!lock) return { ok: false, reason: 'Another tab is changing this workspace. Retry after it finishes.' };
        if(!permitted())return {ok:false,cancelled:true};
        // Ending a frozen document must not leave a held write lock waiting
        // for a query task that may never resume in that document.
        const outcome=await Promise.race([lockManager.query().then(query=>({query})),cancelled]);
        // Ownership may end while the write lock or query is pending. The
        // generation check fences the actual synchronous persistence callback.
        if(outcome.cancelled||!permitted())return {ok:false,cancelled:true};
        const query=outcome.query;
        const heldNames = new Set((query?.held || []).map(item => item.name));
        const tabs = activeWorkspaceTabs(storage, heldNames, tabId);
        for (const key of tabs.staleKeys) {
          try { storage.removeItem(key); } catch {}
        }
        const peerTabs=[...heldNames].filter(name=>name.startsWith(TAB_PREFIX)&&name!==statusKey);
        return operation({ activeTabs: tabs.active, peerTabs });
      });
    } catch (error) {
      if(!permitted())return {ok:false,cancelled:true};
      return { ok: false, reason: error?.message || 'Cross-tab safety could not be verified.' };
    }finally{pendingWrites.delete(cancel);}
  }

  function dispose(event) {
    registration++;
    resolveReady?.(false);
    for(const cancel of pendingWrites)cancel();
    try { storage.removeItem(statusKey); } catch {}
    releaseTabLock?.();
    tabLockHeld=false;
  }

  function handleStorage(event){
    if(event.key!==null&&!event.key?.startsWith(TAB_PREFIX))return;
    notify();
  }

  windowObject?.addEventListener('pagehide', dispose);
  windowObject?.addEventListener('pageshow', event => { if (event.persisted&&!ownership) {coordinationError='';acquireTabLock();} });
  windowObject?.addEventListener('storage',handleStorage);
  ownership?.subscribe(()=>{if(!ownership.owns)dispose();});
  // A held editor lock remains authoritative on focus restoration. Legacy
  // coordinators still recheck on focus; owner-mode Home avoids transient churn.
  if(!ownership)windowObject?.addEventListener('focus',notify);

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
