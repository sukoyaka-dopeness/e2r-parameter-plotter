// Execute the real ES-module graph in separate DOM contexts. This is DOM
// integration evidence, not browser lifecycle or Human Browser Acceptance.
// node --experimental-vm-modules scripts/verify-single-editor-dom.mjs <jsdom/lib/api.js>
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {resolve,dirname} from 'node:path';
import {createContext,SourceTextModule} from 'node:vm';
import {webcrypto} from 'node:crypto';
import {lockService,MemoryStorage,tick} from '../test-support/workspace-locks.mjs';

if(!process.argv[2])throw Error('Pass an installed jsdom/lib/api.js module path.');
const {JSDOM}=await import(pathToFileURL(resolve(process.argv[2])).href);
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const key='e2r-parameter-plotter-local-workspace-v2';
const sample=JSON.parse(await readFile(resolve(root,'samples/ashen-crown.ja.e2r.json'),'utf8'));
const storage=new MemoryStorage(),locks=lockService();
storage.setItem(key,JSON.stringify({format:'parameterplotter-local-workspace',version:1,dataset:sample,ui:{workspaceCreated:true}}));
let fetches=0;
const eventErrors=[];

async function start(id,{hash='',manager=locks.client(id),fetcher}={}){
  const dom=new JSDOM('<div id="app"></div>',{url:`http://127.0.0.1:45999/${hash}`,pretendToBeVisual:true});
  const window=dom.window,downloads=[];
  window.addEventListener('error',event=>eventErrors.push(event.error));
  Object.defineProperty(window,'localStorage',{value:storage});
  Object.defineProperty(window.navigator,'locks',{value:manager});
  window.scrollTo=()=>{};
  window.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
  const anchorClick=window.HTMLAnchorElement.prototype.click;
  window.HTMLAnchorElement.prototype.click=function(){if(this.hasAttribute('download'))downloads.push({name:this.download,blob:blobs.get(this.href)});else anchorClick.call(this);};
  const blobs=new Map();let blobId=0;
  const BlobURL=class extends URL{};
  BlobURL.createObjectURL=blob=>{const url=`blob:test-${++blobId}`;blobs.set(url,blob);return url;};
  BlobURL.revokeObjectURL=url=>blobs.delete(url);
  const context=createContext({window,document:window.document,navigator:window.navigator,localStorage:storage,
    crypto:webcrypto,structuredClone,console,Node:window.Node,NodeFilter:window.NodeFilter,
    HTMLElement:window.HTMLElement,SVGElement:window.SVGElement,CSS:{escape:value=>String(value)},
    URL:BlobURL,URLSearchParams,Blob,AbortController,TextEncoder,TextDecoder,Event:window.Event,
    requestAnimationFrame:window.requestAnimationFrame.bind(window),cancelAnimationFrame:window.cancelAnimationFrame.bind(window),
    setTimeout,clearTimeout,matchMedia:window.matchMedia,addEventListener:window.addEventListener.bind(window),
    innerWidth:1280,innerHeight:800,fetch:async(...args)=>{fetches++;if(fetcher)return fetcher(...args);return {ok:true,json:async()=>structuredClone(sample),text:async()=>JSON.stringify(sample),url:'https://example.test/dataset.json'};},
  });
  const modules=new Map();
  async function module(path){
    if(!modules.has(path))modules.set(path,readFile(path,'utf8').then(source=>new SourceTextModule(source,{context,identifier:path,
      initializeImportMeta(meta){meta.url=pathToFileURL(path).href;},
    })));
    return modules.get(path);
  }
  const entry=await module(resolve(root,'main.js'));
  await entry.link((specifier,parent)=>module(resolve(dirname(parent.identifier),specifier)));
  await entry.evaluate();await tick();
  return {window,document:window.document,downloads,dom,
    click(selector){const element=window.document.querySelector(selector);assert.ok(element,selector);element.click();},
    leave(){window.dispatchEvent(new window.PageTransitionEvent('pagehide',{persisted:true}));},
  };
}

const a=await start('a',{hash:'#locale=ja'});
function assertWorkspaceBrandFocus(page){
  const heading=page.document.querySelector('header h1.app-brand');
  const link=heading?.querySelector('a[data-go-home]');
  assert.ok(link,'Workspace brand Home link');
  assert.equal(page.document.activeElement,link,'Workspace arrival focuses the actionable brand link');
  assert.equal(heading.hasAttribute('tabindex'),false,'brand heading is not a second focus stop');
}
assert.ok(a.document.querySelector('[data-home-action="continue"]'));
const baseline=storage.getItem(key),readCount=storage.reads.filter(item=>item===key).length;
const b=await start('b',{hash:'#locale=ja&datasetUrl=https%3A%2F%2Fexample.test%2Fdataset.json'});
assert.match(b.document.body.textContent,/別のタブでParameterPlotterを使用/);
assert.equal(b.document.querySelector('[data-home-action],#dataset-file,.workspace'),null);
assert.equal(fetches,0);assert.equal(storage.getItem(key),baseline);
// Only this explicit assertion reads Workspace: B startup did not.
assert.equal(storage.reads.filter(item=>item===key).length,readCount+1);
function verifyCredits(page,ja){
  const footer=page.document.querySelector('.app-footer');
  assert.equal(footer.querySelector('small').textContent,ja?'E2R 評価軸エディター':'E2R Dimension Editor');
  assert.equal(footer.querySelector('[data-open-credits]').textContent,ja?'クレジット':'Credits');
  page.click('[data-open-credits]');
  const dialog=page.document.querySelector('.credits-dialog');assert.ok(dialog);
  assert.equal(dialog.getAttribute('aria-modal'),'true');
  assert.equal(page.document.activeElement,page.document.querySelector('[data-close-credits]'));
  assert.ok(page.document.querySelector('main').inert);
  const links=[...dialog.querySelectorAll('a[href]')];assert.equal(links.length,2);
  assert.ok(links.every(link=>link.target==='_blank'&&link.rel==='noreferrer'));
  const tab=new page.window.KeyboardEvent('keydown',{key:'Tab',bubbles:true,cancelable:true});
  page.document.activeElement.dispatchEvent(tab);assert.equal(tab.defaultPrevented,true);
  assert.equal(page.document.activeElement,links[0]);
  const reverse=new page.window.KeyboardEvent('keydown',{key:'Tab',shiftKey:true,bubbles:true,cancelable:true});
  links[0].dispatchEvent(reverse);assert.equal(page.document.activeElement,page.document.querySelector('[data-close-credits]'));
  page.document.activeElement.dispatchEvent(new page.window.KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));
  assert.equal(page.document.querySelector('.credits-dialog'),null);
  assert.equal(page.document.activeElement,page.document.querySelector('[data-open-credits]'));
  page.click('[data-open-credits]');page.click('[data-close-credits]');
  assert.equal(page.document.querySelector('.credits-dialog'),null);
  page.click('[data-open-credits]');page.click('[data-credits-backdrop]');
  assert.equal(page.document.querySelector('.credits-dialog'),null);
  assert.equal(page.document.querySelector('[data-home-action],#dataset-file,.workspace'),null);
}
verifyCredits(b,true);
b.click('[data-select-locale]');await tick();
assert.match(b.document.body.textContent,/ParameterPlotter is open in another tab/);
verifyCredits(b,false);
assert.equal(storage.getItem(key),baseline);
assert.match(b.window.location.hash,/datasetUrl=/);assert.equal(fetches,0);
console.log('PASS: non-owner startup and locale preserve Workspace and Handoff intent without fetching');

const button=a.document.querySelector('[data-home-action="continue"]');
for(let i=0;i<5;i++)a.window.dispatchEvent(new a.window.Event('focus'));
await tick();assert.equal(a.document.querySelector('[data-home-action="continue"]'),button);
assert.equal(a.document.querySelector('[data-home-action="new"]').getAttribute('aria-disabled'),null);
a.click('[data-home-action="continue"]');
assertWorkspaceBrandFocus(a);
const firstBrandLink=a.document.activeElement;
firstBrandLink.click();
assert.ok(a.document.querySelector('[data-home-action="continue"]'));
assert.equal(a.document.activeElement,a.document.querySelector('[data-home-action="continue"]'));
a.click('[data-home-action="continue"]');
assertWorkspaceBrandFocus(a);
assert.ok(a.document.querySelector('#dataset-title-input'));
assert.equal(a.document.querySelector('#dataset-title-input').value,sample.extensions.metadata.title);
console.log('PASS: focus keeps Home DOM and clear availability; first Continue click opens Workspace');

assert.equal(a.document.querySelector('.persistence-status'),null,'saved state has no duplicate success panel');
const diagnosticBefore=a.document.querySelector('.validator-status')?.textContent;
const title=sample.extensions.metadata.title+' SAVED';
function apply(page,value){const input=page.document.querySelector('#dataset-title-input');input.value=value;input.dispatchEvent(new page.window.Event('input',{bubbles:true}));input.form.dispatchEvent(new page.window.Event('submit',{bubbles:true,cancelable:true}));}
apply(a,title);await tick();await tick();
assert.equal(JSON.parse(storage.getItem(key)).dataset.extensions.metadata.title,title);
assert.equal(a.document.querySelector('.persistence-status'),null);
assert.equal(a.document.querySelector('.lifecycle-notice'),null,'title success is not a large notice');
assert.equal(a.document.querySelector('.workspace-operation-result').textContent,'\u30bf\u30a4\u30c8\u30eb\u3092\u9069\u7528\u3057\u307e\u3057\u305f\u3002');
assert.equal(a.document.querySelector('.workspace-operation-result').getAttribute('role'),'status');
const preferenceBefore=storage.getItem('parameterplotter.locale');
a.click('[data-select-locale]');
assert.equal(a.document.querySelector('.workspace-operation-result').textContent,'Title applied.');
assert.equal(a.document.querySelector('.persistence-status'),null);
a.click('[data-select-locale]');
if(preferenceBefore===null)storage.removeItem('parameterplotter.locale');else storage.setItem('parameterplotter.locale',preferenceBefore);

assert.equal(a.document.querySelector('.validator-status')?.textContent,diagnosticBefore,'diagnostic findings are not hidden or normalized');
console.log('PASS: title Apply saves normally with compact feedback and unchanged diagnostics');

let releaseLegacy;
void locks.client('legacy').request('e2r:parameter-plotter:workspace-tab:legacy',()=>new Promise(resolve=>{releaseLegacy=resolve;}));
await tick();storage.setItem('e2r:parameter-plotter:workspace-tab:legacy',JSON.stringify({tabId:'legacy',active:true}));
const saved=storage.getItem(key),rescueTitle=title+' RESCUE';
apply(a,rescueTitle);await tick();await tick();
assert.match(a.document.body.textContent,/再読み込みまで停止|保存.*拒否|degraded/i);
assert.equal(a.document.querySelector('.persistence-status')?.getAttribute('role'),'alert');
assert.ok(a.document.querySelector('.persistence-status').textContent.length>100,'full refusal recovery instructions remain');
a.click('[data-go-home]');
assert.ok(a.document.querySelector('[data-home-action="return-workspace"]'));
const notice=a.document.querySelector('.home-notice[role="alert"]'),actions=a.document.querySelector('.home-actions');
assert.ok(notice.compareDocumentPosition(actions)&a.window.Node.DOCUMENT_POSITION_FOLLOWING);
a.click('[data-home-action="return-workspace"]');
assertWorkspaceBrandFocus(a);
assert.equal(a.document.querySelector('#dataset-title-input').value,rescueTitle);
// The existing menu's Export action remains the rescue path.
const exportButton=a.document.querySelector('[data-successor-export-dataset]');
assert.ok(exportButton,'Workspace Export button');exportButton.click();await tick();
assert.equal(a.downloads.length,1);
assert.equal(JSON.parse(await a.downloads[0].blob.text()).extensions.metadata.title,rescueTitle);
assert.equal(storage.getItem(key),saved);
const exportNotice=()=>a.document.querySelector('.lifecycle-notice');
const exportPreferenceBefore=storage.getItem('parameterplotter.locale');
assert.match(exportNotice().textContent,/E2R JSONのダウンロードをブラウザーに依頼しました/);
assert.equal(exportNotice().getAttribute('role'),'status');
a.click('[data-select-locale]');
assert.match(exportNotice().textContent,/The browser was asked to download the E2R JSON/);
assert.doesNotMatch(exportNotice().textContent,/E2R JSONのダウンロード/);
a.click('[data-successor-export-dataset]');await tick();
assert.equal(a.downloads.length,2);
assert.match(exportNotice().textContent,/The browser was asked to download the E2R JSON/);
a.click('[data-select-locale]');
assert.match(exportNotice().textContent,/E2R JSONのダウンロードをブラウザーに依頼しました/);
a.click('[data-successor-export-dataset]');await tick();
assert.equal(a.downloads.length,3);
assert.match(exportNotice().textContent,/E2R JSONのダウンロードをブラウザーに依頼しました/);
assert.equal(JSON.parse(await a.downloads[2].blob.text()).extensions.metadata.title,rescueTitle);
assert.equal(storage.getItem(key),saved);
if(exportPreferenceBefore===null)storage.removeItem('parameterplotter.locale');else storage.setItem('parameterplotter.locale',exportPreferenceBefore);
releaseLegacy();await tick();
a.click('[data-successor-export-dataset]');await tick();assert.equal(storage.getItem(key),saved);
console.log('PASS: degraded Return and existing JSON Export preserve memory, saved Workspace and refusal latch');

const pendingNumber=a.document.createElement('input');pendingNumber.type='number';pendingNumber.dataset.value='assessment';pendingNumber.dataset.dirty='true';pendingNumber.value='123.4';
a.document.querySelector('.workspace').append(pendingNumber);
a.leave();await tick();
assert.equal(pendingNumber.value,'123.4');assert.equal(pendingNumber.isConnected,false);
assert.ok(pendingNumber.parentNode,'live form DOM is retained in memory');
const departure=new a.window.Event('beforeunload',{cancelable:true});a.window.dispatchEvent(departure);
assert.equal(departure.defaultPrevented,true,'retained unapplied Assessment still requests departure confirmation');
const c=await start('c');
c.click('[data-home-action="continue"]');
assert.equal(c.document.querySelector('#dataset-title-input').value,title);
for(const name of ['focus','storage'])b.window.dispatchEvent(new b.window.Event(name));
await tick();verifyCredits(b,false);assert.equal(b.document.querySelector('[data-home-action]'),null);assert.equal(fetches,0);
a.window.dispatchEvent(new a.window.PageTransitionEvent('pageshow',{persisted:true}));
assert.match(a.document.body.textContent,/編集セッションは終了/);
assert.equal(a.document.querySelector('[data-home-action],.workspace'),null);
verifyCredits(a,true);
const staleForm=a.document.createElement('form');staleForm.className='dataset-title-editor';
staleForm.innerHTML='<input name="dataset-title" value="STALE">';a.document.body.append(staleForm);
const staleSubmit=new a.window.Event('submit',{bubbles:true,cancelable:true});staleForm.dispatchEvent(staleSubmit);
assert.equal(staleSubmit.defaultPrevented,true);await tick();assert.equal(storage.getItem(key),saved);
console.log('PASS: explicit new load resumes saved baseline; blocked and BFCache documents cannot take over or save');

const offline=await start('offline',{manager:null,hash:'#locale=ja&datasetUrl=https%3A%2F%2Fexample.test%2Fdataset.json'});
if(offline.document.querySelector('[data-resolve-locale="requested"]'))offline.click('[data-resolve-locale="requested"]');
assert.match(offline.document.body.textContent,/編集セッションを安全に開始できません/);
assert.equal(offline.document.querySelector('[data-home-action],.workspace'),null);assert.equal(fetches,0);
console.log('PASS: unsupported coordination is fail closed with no Handoff request');

c.leave();await tick();
const handoff=await start('handoff',{hash:'#datasetUrl=https%3A%2F%2Fexample.test%2Fdataset.json'});
await tick();assert.equal(fetches,1);assert.match(handoff.window.location.hash,/datasetUrl=/);
assert.ok(handoff.document.querySelector('.confirm-dialog')||handoff.document.querySelector('.workspace'));
if(handoff.document.querySelector('[data-confirm-replacement]'))handoff.click('[data-confirm-replacement]');
await tick();await tick();
assert.ok(handoff.document.querySelector('.workspace'));
assertWorkspaceBrandFocus(handoff);
assert.equal(JSON.parse(storage.getItem(key)).dataset.extensions.metadata.title,sample.extensions.metadata.title);
console.log('PASS: a fresh owner can use the unchanged startup Handoff acceptance/replacement path');
handoff.leave();await tick();
let releaseOld;
void locks.client('old-runtime').request('e2r:parameter-plotter:workspace-tab:old-runtime',()=>new Promise(resolve=>{releaseOld=resolve;}));
await tick();storage.setItem('e2r:parameter-plotter:workspace-tab:old-runtime',JSON.stringify({tabId:'old-runtime',active:false}));
const oldRuntimeBlocked=await start('new-runtime');
assert.match(oldRuntimeBlocked.document.body.textContent,/ParameterPlotter is open in another tab/);
assert.equal(oldRuntimeBlocked.document.querySelector('[data-home-action]'),null);
releaseOld();await tick();
assert.equal(oldRuntimeBlocked.document.querySelector('[data-home-action]'),null);
console.log('PASS: a live older runtime blocks startup even with a clean status; no automatic takeover');
const delayedPages=[];
for(const path of ['handoff','sample','file']){
  let complete;
  const response=new Promise(resolve=>{complete=resolve;});
  const old=await start(`delayed-${path}`,{hash:path==='handoff'?'#datasetUrl=https%3A%2F%2Fexample.test%2Fdataset.json':'',fetcher:()=>response});
  const prior=storage.getItem(key);
  if(path==='sample')old.click('[data-home-action="sample"]');
  if(path==='file'){
    const input=old.document.querySelector('#dataset-file');
    Object.defineProperty(input,'files',{value:[{text:()=>response}]});
    input.dispatchEvent(new old.window.Event('change',{bubbles:true}));
  }
  old.leave();await tick();
  const replacementOwner=await start(`replacement-${path}`);
  complete(path==='file'?JSON.stringify(sample):{ok:true,json:async()=>structuredClone(sample),text:async()=>JSON.stringify(sample),url:'https://example.test/dataset.json'});
  await tick();await tick();
  assert.equal(storage.getItem(key),prior);
  assert.equal(old.document.querySelector('.workspace,.confirm-dialog,[data-home-action]'),null);
  assert.ok(replacementOwner.document.querySelector('[data-home-action="continue"]'));
  replacementOwner.leave();await tick();
  delayedPages.push(old,replacementOwner);
  console.log(`PASS: delayed ${path} completion cannot replace data after session end`);
}
storage.removeItem(key);
const generated=await start('generated');
assert.equal(generated.document.querySelector('[data-home-action="continue"]'),null);
generated.click('[data-home-action="new"]');await tick();await tick();
assertWorkspaceBrandFocus(generated);
const specId='draft.github.sukoyaka-dopeness.specification';
assert.deepEqual(JSON.parse(storage.getItem(key)).dataset.extensions[specId],{specVersion:'0.1.0',uses:[]});
apply(generated,'test');await tick();await tick();
const generatedSaved=JSON.parse(storage.getItem(key)).dataset;
assert.deepEqual(generatedSaved.extensions.metadata,{title:'test'});
assert.deepEqual(generatedSaved.extensions[specId].uses,[{extension:'metadata',version:'1.0.0'}]);
assert.equal(generated.document.querySelector('.validator-status'),null);
generated.click('[data-successor-export-dataset]');await tick();
assert.deepEqual(JSON.parse(await generated.downloads[0].blob.text()),generatedSaved);
generated.leave();await tick();
const resumedGenerated=await start('resumed-generated');
resumedGenerated.click('[data-home-action="continue"]');
assert.equal(resumedGenerated.document.querySelector('#dataset-title-input').value,'test');
assert.equal(resumedGenerated.document.querySelector('.validator-status'),null);
apply(resumedGenerated,'');await tick();await tick();
assert.equal(resumedGenerated.document.querySelector('.validator-status'),null);
assert.deepEqual(JSON.parse(storage.getItem(key)).dataset.extensions[specId].uses,[]);
resumedGenerated.leave();await tick();
generated.dom.window.close();resumedGenerated.dom.window.close();
console.log('PASS: actual New/title/save/resume/Export/title-removal lifecycle keeps exact declarations without warnings');
for(const page of [a,b,c,offline,handoff,oldRuntimeBlocked,...delayedPages])page.dom.window.close();
assert.deepEqual(eventErrors,[]);
console.log('12 real-module DOM integration scenarios PASS. No Human/browser profiles or servers were used.');
