export const EDITOR_LOCK = 'e2r:parameter-plotter:active-editor';

// Ownership is document-local. A blocked or ended document never queues or
// retries for ownership; only a new load may start another editing session.
export function createSingleActiveEditor({lockManager,windowObject}={}){
  let kind='checking',generation=0,release;
  let settleReady;
  const ready=new Promise(resolve=>{settleReady=resolve;});
  const listeners=new Set();
  const notify=()=>{for(const listener of listeners)listener();};
  function end(next='ended'){
    generation++;
    if(kind==='owner'||kind==='checking')kind=next;
    release?.();
    settleReady(kind);
    notify();
  }
  const initialGeneration=generation;
  if(typeof lockManager?.request!=='function'){
    kind='unavailable';settleReady(kind);
  }else{
    try{
      Promise.resolve(lockManager.request(EDITOR_LOCK,{mode:'exclusive',ifAvailable:true},async lock=>{
        if(generation!==initialGeneration)return;
        if(!lock){kind='blocked';settleReady(kind);notify();return;}
        const hold=new Promise(resolve=>{release=resolve;});
        kind='owner';settleReady(kind);notify();
        await hold;
      })).then(()=>{if(kind==='owner')end('unavailable');},()=>end('unavailable'));
    }catch{end('unavailable');}
  }
  windowObject?.addEventListener('pagehide',()=>end());
  return {
    ready,
    get kind(){return kind;},
    get owns(){return kind==='owner';},
    capture(){return kind==='owner'?generation:null;},
    isCurrent(token){return token!==null&&kind==='owner'&&token===generation;},
    end,
    subscribe(listener){listeners.add(listener);return ()=>listeners.delete(listener);},
  };
}

// Install before the application's authoring handlers. This also stops events
// from stale/detached controls and pointer drags resumed after page suspension.
export function installEditorEventGuard(target,editor,presentation={}){
  const guard=event=>{
    if(editor.owns)return;
    if(event.type==='keydown'&&presentation.keydown){
      presentation.keydown(event);
      if(event.cancelBubble)return;
    }
    if(event.target?.closest?.('[data-select-locale],[data-resolve-locale],[data-open-credits],[data-close-credits],.credits-dialog a[href],[data-credits-backdrop]')){
      if(event.type!=='click')event.stopImmediatePropagation();
      return;
    }
    if((event.type==='keydown'||event.type==='keyup')&&(
      ['Tab','Escape','F5','PageUp','PageDown','Home','End','ArrowUp','ArrowDown',' '].includes(event.key)||
      ((event.ctrlKey||event.metaKey)&&event.key?.toLowerCase()==='r')||
      (event.altKey&&['ArrowLeft','ArrowRight'].includes(event.key))
    )){event.stopImmediatePropagation();return;}
    event.preventDefault();event.stopImmediatePropagation();
  };
  for(const name of ['click','dblclick','keydown','keyup','beforeinput','input','change','submit','pointerdown','pointermove','pointerup','pointercancel','mousedown','mousemove','mouseup','touchstart','touchmove','touchend','dragstart','dragover','drop']){
    target.addEventListener(name,guard,{capture:true,passive:false});
  }
}
