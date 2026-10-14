// Deterministic exclusive-lock service: queued requests wait, ifAvailable
// requests never queue, and terminating a client releases its browser locks.
export function lockService(){
  const held=new Map(),queues=new Map();
  function finish(name,entry){
    if(held.get(name)!==entry)return;
    held.delete(name);entry.signal?.removeEventListener('abort',entry.abort);
    const queue=queues.get(name)||[];
    if(queue.length)grant(name,queue.shift());
  }
  function grant(name,entry){
    held.set(name,entry);
    Promise.resolve().then(()=>entry.callback({name,mode:'exclusive'})).then(
      result=>{finish(name,entry);entry.resolve(result);},
      error=>{finish(name,entry);entry.reject(error);},
    );
  }
  return {
    held,
    client(clientId){return {
      request(name,optionsOrCallback,callback){
        const options=typeof optionsOrCallback==='function'?{}:optionsOrCallback;
        callback=typeof optionsOrCallback==='function'?optionsOrCallback:callback;
        if(held.has(name)&&options.ifAvailable)return Promise.resolve().then(()=>callback(null));
        return new Promise((resolve,reject)=>{
          const entry={clientId,callback,resolve,reject,signal:options.signal};
          entry.abort=()=>{
            // As in Web Locks, abort cancels a queued request, not a held lock.
            if(held.get(name)===entry)return;
            const queue=queues.get(name)||[],index=queue.indexOf(entry);
            if(index>=0)queue.splice(index,1);
            reject(new DOMException('Request aborted','AbortError'));
          };
          if(options.signal?.aborted){entry.abort();return;}
          options.signal?.addEventListener('abort',entry.abort,{once:true});
          if(!held.has(name))grant(name,entry);
          else{if(!queues.has(name))queues.set(name,[]);queues.get(name).push(entry);}
        });
      },
      async query(){return {held:[...held].map(([name,entry])=>({name,clientId:entry.clientId,mode:'exclusive'}))};},
    };},
    terminate(clientId){
      for(const queue of queues.values()){
        for(let i=queue.length-1;i>=0;i--)if(queue[i].clientId===clientId)queue.splice(i,1);
      }
      for(const [name,entry] of held)if(entry.clientId===clientId)finish(name,entry);
    },
  };
}

export class MemoryStorage{
  values=new Map();
  reads=[];writes=[];
  get length(){return this.values.size;}
  key(index){return [...this.values.keys()][index]??null;}
  getItem(key){this.reads.push(key);return this.values.get(key)??null;}
  setItem(key,value){this.writes.push(key);this.values.set(key,String(value));}
  removeItem(key){this.values.delete(key);}
}
export const tick=()=>new Promise(resolve=>setTimeout(resolve,0));
