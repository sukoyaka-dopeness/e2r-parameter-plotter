import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {homeAcquisitionBlocked,homeMarkup,updateHomePeerWorkStatus} from './home-screen.js';
import {creditsMarkup, footerMarkup} from './application-shell.js';
import {DIMENSION_ASSESSMENT_ID,entities,fresh,getValue,label,plottedEntities,quadrantOutOfRangeEntities,validateDataset,waitingCandidates} from './model.js';
import {renderMatrix,renderProfile,renderQuadrant,renderRadar} from './views.js';
import {ashenCrownSampleUrl} from './sample-datasets.js';
import {translateUiText} from './ui-localize.js';

test('Home uses the Human-selected start copy and presents primary Dataset acquisition',()=>{
  const html=homeMarkup({peerWorkStatus:{kind:'clear'}});
  assert.match(html,/<h1 id="home-title">Get Started<\/h1>/);
  assert.match(html,/<p class="home-intro">Compare E2R Entities across Dimensions\.<\/p>/);
  assert.doesNotMatch(html,/Continue Editing/);
  assert.match(html,/New Dataset[\s\S]*Open E2R Dataset[\s\S]*Open Sample Dataset · The Ashen Crown/);
  assert.doesNotMatch(html,/Choose a workspace|Browser-local recovery keeps work available|Export E2R JSON when you need a portable Dataset file|home-footnote/);
  assert.match(html,/<button data-home-action="open">Open E2R Dataset<\/button>[\s\S]*<div class="sample-action"><button data-home-action="sample">/);
  assert.doesNotMatch(html,/home-panel|class="primary"/);
  assert.match(html,/app-header home-header/);
});

test('Home offers Continue Editing only when caller confirms recoverable local work',()=>{
  const html=homeMarkup({canContinue:true});
  assert.match(html,/<h1 id="home-title">Get Started<\/h1>/);
  assert.match(html,/<p class="home-intro">Compare E2R Entities across Dimensions\.<\/p>/);
  assert.match(html,/Continue Editing[\s\S]*New Dataset/);
  assert.doesNotMatch(html,/Browser-local recovery keeps work available|Export E2R JSON when you need a portable Dataset file|home-footnote/);
});

test('Home keeps acquisition choices visible but unavailable until peer safety is clear',()=>{
  for(const kind of ['work','unknown']){
    for(const locale of ['en','ja']){
      const markup=homeMarkup({peerWorkStatus:{kind,count:1},locale});
      for(const action of ['new','open','sample']){
        assert.match(markup,new RegExp(`<button data-home-action="${action}"[^>]*aria-disabled="true"[^>]*aria-describedby="home-acquisition-status"`));
      }
      assert.match(markup,/id="home-acquisition-status"/);
      assert.match(markup,/data-home-action="recheck-peer-work"/);
      assert.match(markup,/New Dataset|新しいデータセット/);
      assert.match(markup,/Open E2R Dataset|E2Rデータセットを開く/);
      assert.match(markup,/Open Sample Dataset|サンプルデータセットを開く/);
    }
  }
  for(const locale of ['en','ja']){
    const checking=homeMarkup({peerWorkStatus:{kind:'checking'},locale});
    assert.match(checking,/data-home-action="new"[^>]*aria-disabled="true"[^>]*aria-describedby="home-acquisition-status"/);
    assert.match(checking,/home-peer-work-checking-visually-hidden[^>]*role="status"/);
    assert.doesNotMatch(checking,/data-home-action="recheck-peer-work"/);
  }
  const clear=homeMarkup({peerWorkStatus:{kind:'clear'}});
  for(const action of ['new','open','sample']){
    assert.match(clear,new RegExp(`<button data-home-action="${action}">`));
    assert.doesNotMatch(clear,new RegExp(`<button data-home-action="${action}"[^>]*aria-disabled`));
  }
});

test('peer work blocks only Dataset acquisition, never local Continue or Return actions',()=>{
  for(const status of ['work','checking','unknown']){
    for(const action of ['new','open','sample'])assert.equal(homeAcquisitionBlocked(action,status),true);
    assert.equal(homeAcquisitionBlocked('continue',status),false);
    assert.equal(homeAcquisitionBlocked('return-workspace',status),false);
  }
  for(const action of ['new','open','sample','continue','return-workspace'])assert.equal(homeAcquisitionBlocked(action,'clear'),false);
});

test('asynchronous peer status updates preserve the Continue button node while changing acquisition availability',()=>{
  class Element {
    attributes=new Map();innerHTML='';
    setAttribute(name,value){this.attributes.set(name,String(value));}
    removeAttribute(name){this.attributes.delete(name);}
    getAttribute(name){return this.attributes.get(name)??null;}
  }
  const continueButton=new Element(),newButton=new Element(),openButton=new Element(),sampleButton=new Element(),statusRegion=new Element();
  const nodes=new Map([
    ['[data-home-peer-status]',statusRegion],
    ['[data-home-action="continue"]',continueButton],
    ['[data-home-action="new"]',newButton],
    ['[data-home-action="open"]',openButton],
    ['[data-home-action="sample"]',sampleButton],
  ]);
  const root={querySelector:selector=>nodes.get(selector)??null};
  updateHomePeerWorkStatus(root,{peerWorkStatus:{kind:'checking'},locale:'en'});
  assert.equal(nodes.get('[data-home-action="continue"]'),continueButton);
  assert.match(statusRegion.innerHTML,/Checking whether another ParameterPlotter tab has work to protect/);
  assert.match(statusRegion.innerHTML,/home-peer-work-checking-visually-hidden/);
  for(const button of [newButton,openButton,sampleButton])assert.equal(button.getAttribute('aria-disabled'),'true');
  updateHomePeerWorkStatus(root,{peerWorkStatus:{kind:'clear'},locale:'en'});
  assert.equal(nodes.get('[data-home-action="continue"]'),continueButton);
  assert.equal(statusRegion.innerHTML,'');
  for(const button of [newButton,openButton,sampleButton])assert.equal(button.getAttribute('aria-disabled'),null);
});

test('Home keeps checking accessible without visually flashing a transient notice',()=>{
  const en=homeMarkup({peerWorkStatus:{kind:'checking'},locale:'en'});
  const ja=homeMarkup({peerWorkStatus:{kind:'checking'},locale:'ja'});
  assert.match(en,/Checking whether another ParameterPlotter tab has work to protect/);
  assert.match(en,/unavailable until the safety check finishes/);
  assert.match(en,/home-peer-work-checking-visually-hidden/);
  assert.doesNotMatch(en,/data-home-action="recheck-peer-work"/);
  assert.match(ja,/別のParameterPlotterタブの作業状態を確認しています/);
  assert.match(ja,/確認が終わるまでDatasetの取得・置換はできません/);
  assert.match(ja,/home-peer-work-checking-visually-hidden/);
  assert.equal(translateUiText('Check other tabs again'),'他のタブを再確認');
});

test('clear Home has no reserved peer-status gap and safety status precedes its actions',async()=>{
  const markup=homeMarkup({canContinue:true,peerWorkStatus:{kind:'clear'},locale:'en'});
  const checking=homeMarkup({canContinue:true,peerWorkStatus:{kind:'checking'},locale:'en'});
  const css=await readFile(new URL('./home-screen.css',import.meta.url),'utf8');
  assert.match(markup,/class="home-peer-status-slot" data-home-peer-status/);
  assert.match(markup,/home-peer-status-slot[\s\S]*home-actions/);
  assert.match(css,/\.home-peer-status-slot:empty\s*\{\s*display:\s*none;/);
  assert.match(css,/\.home-peer-work-checking-visually-hidden\s*\{[^}]*position:\s*absolute;[^}]*clip:/);
  assert.match(checking,/home-peer-work-checking-visually-hidden[\s\S]*home-actions/);
});

test('Continue and degraded Workspace recovery stay available while acquisitions are guarded',()=>{
  const continuing=homeMarkup({canContinue:true,peerWorkStatus:{kind:'work'}});
  const returning=homeMarkup({canReturnToWorkspace:true,peerWorkStatus:{kind:'unknown'}});
  assert.match(continuing,/<button data-home-action="continue">Continue Editing<\/button>/);
  assert.match(returning,/<button data-home-action="return-workspace">Return to Workspace<\/button>/);
  for(const markup of [continuing,returning]){
    assert.match(markup,/data-home-action="new"[^>]*aria-disabled="true"/);
    assert.doesNotMatch(markup,/data-home-action="continue"[^>]*aria-disabled|data-home-action="return-workspace"[^>]*aria-disabled/);
  }
});

test('Home offers a distinct return action for an available degraded Workspace in both locales',()=>{
  const english=homeMarkup({canReturnToWorkspace:true,notice:'Saving is paused.',locale:'en'});
  assert.match(english,/<button data-home-action="return-workspace">Return to Workspace<\/button>/);
  assert.match(english,/Saving is paused\./);
  assert.doesNotMatch(english,/data-home-action="continue"|Export E2R JSON/);

  const japanese=homeMarkup({canReturnToWorkspace:true,notice:'保存停止中です。',locale:'ja'});
  assert.match(japanese,/<button data-home-action="return-workspace">Workspaceに戻る<\/button>/);
  assert.match(japanese,/保存停止中です。/);
  assert.doesNotMatch(japanese,/data-home-action="continue"|Export E2R JSON/);
});

test('Home does not offer workspace recovery when no in-memory Workspace is available',()=>{
  const initial=homeMarkup({canReturnToWorkspace:false,locale:'en'});
  const degradedWithoutWorkspace=homeMarkup({canReturnToWorkspace:false,notice:'Saved workspace could not be read.',locale:'en'});
  assert.doesNotMatch(initial,/return-workspace|Return to Workspace|Continue Editing/);
  assert.doesNotMatch(degradedWithoutWorkspace,/return-workspace|Return to Workspace|Continue Editing/);
  assert.match(degradedWithoutWorkspace,/Saved workspace could not be read\./);
});

test('Application shell provides a shared Footer and a bounded Credits dialog',async()=>{
  const footer=footerMarkup(),dialog=creditsMarkup();
  assert.match(footer,/E2R comparison editor[\s\S]*data-open-credits/);
  assert.match(dialog,/role="dialog" aria-modal="true"/);
  assert.match(dialog,/Application: ParameterPlotter/);
  assert.match(dialog,/Creator: sukoyaka-dopeness/);
  assert.match(dialog,/With gratitude to all the AI systems that contributed to this project\./);
  assert.doesNotMatch(dialog,/working name/);
  assert.doesNotMatch(dialog,/First release|Updated|acknowledg/i);
  assert.doesNotMatch(dialog,/<dl|<dt|<dd/);
  assert.match(dialog,/sukoyaka-dopeness/);
  assert.match(dialog,/data-close-credits/);
  assert.match(dialog,/data-credits-backdrop/);
  assert.match(dialog,/e2r-parameter-plotter/);
  const source=await readFile(new URL('./main.js',import.meta.url),'utf8');
  assert.match(source,/if\(creditsOpen\)[\s\S]*data-close-credits/);
  assert.match(source,/if\(event.key==='Escape'\)[\s\S]*creditsOpen=false/);
  assert.match(source,/const items=\[\.\.\.root.querySelectorAll\('\.credits-dialog/);
  assert.match(source,/toggleAttribute\('inert',creditsOpen\)|forEach\(element=>element.inert=true\)/);
});

test('Home uses the white application surface while the workspace remains distinct',async()=>{
  const css=await readFile(new URL('./home-screen.css',import.meta.url),'utf8');
  const base=await readFile(new URL('./style.css',import.meta.url),'utf8');
  assert.match(css,/\.home-page\s*\{\s*background:\s*#fff;?\s*\}/);
  assert.match(css,/\.workspace-page\s*\{\s*background:\s*#f5f6f8;?\s*\}/);
  assert.match(base,/:root\{font:18px\/145%/);
  assert.match(css,/\.app-footer\s*\{[^}]*font-size:\s*18px;[^}]*line-height:\s*145%/s);
  assert.match(css,/\.app-footer small\s*\{[^}]*font-size:\s*15px;[^}]*line-height:\s*inherit/s);
  assert.match(css,/\.app-footer \.credits-button,[\s\S]*\.credits-actions button\s*\{[^}]*min-height:\s*36px;[^}]*padding:\s*5px 9px;[^}]*border-radius:\s*4px;[^}]*font-size:\s*15px;[^}]*line-height:\s*120%/);
  assert.match(css,/\.home-actions button\s*\{[^}]*min-height:\s*40px;[^}]*font-size:\s*16px/);
  assert.match(css,/\.home-actions button\[aria-disabled="true"\]\s*\{[^}]*border-color:\s*#e5e4e7;[^}]*background:\s*#fff;[^}]*color:\s*#08060d;[^}]*opacity:\s*\.45/s);
  assert.match(css,/\.home-actions button\s*\{[^}]*transition:\s*opacity 140ms ease-out/s);
  assert.match(css,/\.home-actions button\[aria-disabled="true"\]:hover\s*\{[^}]*border-color:\s*#e5e4e7;[^}]*background:\s*#fff/s);
  assert.match(base,/button:disabled\{opacity:\.45;cursor:default\}/);
  assert.match(css,/\.dataset-title-editor button\s*\{[^}]*border:\s*1px solid #e5e4e7;[^}]*background:\s*#fff;[^}]*color:\s*#08060d/s);
  assert.match(css,/\.credits-dialog\s*\{[^}]*width:\s*min\(100%, 28rem\);[^}]*padding:\s*16px;[^}]*border-radius:\s*6px/);
  assert.match(css,/\.credits-metadata p\s*\{\s*margin:\s*0;?\s*\}/);
  assert.doesNotMatch(css,/@media \(max-width: 600px\)[\s\S]*\.app-footer \.credits-button/);
  assert.match(css,/@media \(max-width: 1024px\) \{ :root \{ font-size: 16px; \} \}/);
});

test('Home chooses the bundled Ashen Crown language matching the current UI locale',()=>{
  assert.equal(ashenCrownSampleUrl('en'),'./samples/ashen-crown.en.e2r.json');
  assert.equal(ashenCrownSampleUrl('ja'),'./samples/ashen-crown.ja.e2r.json');
  assert.equal(ashenCrownSampleUrl('unexpected'),'./samples/ashen-crown.en.e2r.json');
});

test('Ashen Crown Home sample label follows the approved JA product name without changing Dataset content',async()=>{
  assert.match(homeMarkup(),/Open Sample Dataset · The Ashen Crown/);
  assert.equal(translateUiText('Open Sample Dataset · The Ashen Crown'),'サンプルデータセットを開く · 灰冠の王国');
  const japanese=JSON.parse(await readFile(new URL('./samples/ashen-crown.ja.e2r.json',import.meta.url),'utf8'));
  assert.equal(japanese.extensions.metadata.title,'灰冠の王国');
});

test('English and Japanese Markdown guides distinguish recorded zero from unassessed data',async()=>{
  const [english,japanese]=await Promise.all([
    readFile(new URL('./docs/user-guide-en.md',import.meta.url),'utf8'),
    readFile(new URL('./docs/user-guide-ja.md',import.meta.url),'utf8'),
  ]);
  assert.match(english,/A recorded \*\*0\*\* is different from no Assessment/);
  assert.match(japanese,/明示的な \*\*0\*\* と、評価が未記録であることは別/);
  assert.match(english,/\[ユーザーガイド\]\(user-guide-ja\.md\)/);
  assert.match(japanese,/\[User guide\]\(user-guide-en\.md\)/);
});

test('bundled Ashen Crown EN and JA samples match the canonical Candidate 0.2.0 payload',async()=>{
  const bytes=await readFile(new URL('./samples/ashen-crown.en.e2r.json',import.meta.url));
  const dataset=JSON.parse(bytes.toString('utf8'));
  const jaBytes=await readFile(new URL('./samples/ashen-crown.ja.e2r.json',import.meta.url));
  const japanese=JSON.parse(jaBytes.toString('utf8'));
  assert.equal(createHash('sha256').update(bytes).digest('hex'),'044187116106ce27178eb2457df8f0dad3ee68d6bb656800bede68900e306552');
  assert.equal(createHash('sha256').update(jaBytes).digest('hex'),'745d3d293cc07cd84e076090d8f152deea69c5818f535f2cf9e9cbc51c65ec2f');
  assert.equal(dataset.extensions.metadata.title,'The Ashen Crown');
  assert.equal(dataset.entities.length,10);
  assert.equal(dataset.events.length,12);
  assert.equal(dataset.relations.length,57);
  const payload=dataset.extensions[DIMENSION_ASSESSMENT_ID];
  assert.equal(payload.specVersion,'0.2.0');
  assert.equal(payload.dimensions.length,7);
  assert.equal(payload.assessments.length,70);
  assert.equal(payload.dimensions.every(d=>d.integerOnly===true&&typeof d.description==='string'),true);
  assert.equal(payload.assessments.some(a=>a.value===0),true);
  assert.equal(payload.assessments.find(a=>a.entityId==='darius'&&a.dimensionId==='ashen.concord')?.value,-4);
  const declarations=dataset.extensions['draft.github.sukoyaka-dopeness.specification'].uses.filter(x=>x.extension===DIMENSION_ASSESSMENT_ID);
  assert.deepEqual(declarations,[{extension:DIMENSION_ASSESSMENT_ID,version:'0.2.0'}]);
  assert.equal(validateDataset(dataset).valid,true);
  assert.equal(validateDataset(japanese).valid,true);
  const payloadFor=sample=>sample.extensions[DIMENSION_ASSESSMENT_ID];
  const enPayload=payloadFor(dataset),jaPayload=payloadFor(japanese);
  assert.equal(enPayload.specVersion,'0.2.0');
  assert.equal(jaPayload.specVersion,'0.2.0');
  assert.equal(enPayload.dimensions.length,7);
  assert.equal(jaPayload.dimensions.length,7);
  assert.equal(enPayload.assessments.length,70);
  assert.equal(jaPayload.assessments.length,70);
  assert.deepEqual(jaPayload.dimensions.map(({id,min,max,integerOnly})=>({id,min,max,integerOnly})),enPayload.dimensions.map(({id,min,max,integerOnly})=>({id,min,max,integerOnly})));
  assert.deepEqual(jaPayload.assessments,enPayload.assessments);
  for(const sample of [dataset,japanese]){
    const declarations=sample.extensions['draft.github.sukoyaka-dopeness.specification'].uses.filter(x=>x.extension===DIMENSION_ASSESSMENT_ID);
    assert.deepEqual(declarations,[{extension:DIMENSION_ASSESSMENT_ID,version:'0.2.0'}]);
  }
  assert.deepEqual(japanese.entities.map(entity=>entity.id),dataset.entities.map(entity=>entity.id));
  assert.deepEqual(japanese.events.map(event=>event.id),dataset.events.map(event=>event.id));
  assert.deepEqual(japanese.relations.map(({id,sourceId,targetId})=>({id,sourceId,targetId})),dataset.relations.map(({id,sourceId,targetId})=>({id,sourceId,targetId})));
  assert.equal(japanese.extensions.metadata.datasetId,'ashen-crown-ja-v1');
  assert.equal(dataset.extensions.metadata.datasetId,'ashen-crown-en-v1');
});

test('bundled Ashen Crown Dimensions and Assessments render in all four views',async()=>{
  const dataset=JSON.parse(await readFile(new URL('./samples/ashen-crown.en.e2r.json',import.meta.url),'utf8'));
  const s=fresh(dataset);
  s.selected='elara';
  const allEntities=()=>entities(s);
  const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const options=(items,current,first='Choose…')=>`<option value="">${first}</option>`+items.map(x=>`<option value="${escape(x.id)}" ${x.id===current?'selected':''}>${escape(x.name)}</option>`).join('');
  const api={
    name:id=>{const list=allEntities(),i=list.findIndex(e=>e.id===id);return i<0?'Select Entity':label(list[i],i);},
    options,
    dimensionOptions:(current,exclude=[])=>options(s.dimensions.filter(d=>!exclude.includes(d.id)).map(d=>({...d,name:d.name})),current),
    entityOptions:(current,exclude=[])=>options(allEntities().filter(e=>!exclude.includes(e.id)).map((e,i)=>({id:e.id,name:e.name||`Entity ${i+1}`})),current),
    get:(entityId,dimensionId)=>getValue(s,entityId,dimensionId),
    fmt:value=>String(value),state:()=>s,entities:allEntities,plotted:()=>plottedEntities(s),waitingCandidates:()=>waitingCandidates(s),
    matrixError:()=>null,randomNotice:()=>'',entityId:()=>'',dimensionId:()=>'',dimensionName:id=>s.dimensions.find(d=>d.id===id)?.name||'',axisName:id=>s.dimensions.find(d=>d.id===id)?.name||'',
    dimension:id=>s.dimensions.find(d=>d.id===id),quadrantOutOfRange:()=>quadrantOutOfRangeEntities(s),
  };
  s.view='Profile';
  const profile=renderProfile(api);
  assert.match(profile,/Command Authority/);
  assert.match(profile,/value="6"/);
  s.view='Radar';s.radar=['ashen.command','ashen.combat','ashen.concord'];s.secondary='darius';
  const radar=renderRadar(api);
  assert.match(radar,/<polygon class="primary-poly"/);
  assert.match(radar,/data-vertex="ashen.concord"/);
  s.view='Quadrant';s.quadrant=['ashen.combat','ashen.concord'];
  const quadrant=renderQuadrant(api);
  assert.match(quadrant,/data-entity="darius"/);
  assert.match(quadrant,/-4/);
  const previousInnerWidth=globalThis.innerWidth;
  globalThis.innerWidth=1280;
  try{
    s.view='Matrix';s.matrix=s.dimensions.map(d=>d.id);s.matrixPage=0;
    const firstPage=renderMatrix(api);
    assert.match(firstPage,/Information Leverage/);
    assert.match(firstPage,/value="0"/);
    s.matrixPage=1;
    const concordPage=renderMatrix(api);
    assert.match(concordPage,/Contribution to Concord/);
    assert.match(concordPage,/data-value="darius\|ashen\.concord"/);
    assert.match(concordPage,/value="-4"/);
  }finally{
    if(previousInnerWidth===undefined)delete globalThis.innerWidth;else globalThis.innerWidth=previousInnerWidth;
  }
});

test('Home entry uses native Dataset file acquisition and a bundled sample path',async()=>{
  const source=await readFile(new URL('./main.js',import.meta.url),'utf8');
  assert.match(source,/let surface = 'home'/);
  assert.match(source,/fetch\(ashenCrownSampleUrl\(locale\)\)/);
  assert.match(source,/data-home-action="\$\{request\.returnFocus\}"/);
  assert.match(source,/data-go-home/);
  assert.match(source,/else if\(action==='open'\)openDatasetFilePicker\(\)/);
});

test('Home click handling blocks acquisition unless peer-work status is clear and retains the write gate',async()=>{
  const main=await readFile(new URL('./main.js',import.meta.url),'utf8');
  assert.match(main,/homeAcquisitionBlocked\(action,homePeerWorkStatus\.kind\)/);
  assert.match(main,/if\(action==='recheck-peer-work'\)\{if\(homePeerWorkStatus\.kind!=='checking'\)void refreshHomePeerWorkStatus\(\);return;\}/);
  const homeClick=main.slice(main.indexOf("if(surface==='home'){"),main.indexOf("if(target.closest('[data-go-home]')"));
  const continueAction=homeClick.slice(homeClick.indexOf("if(action==='continue')"),homeClick.indexOf("else if(action==='return-workspace')"));
  assert.match(continueAction,/surface='workspace';render\(\)/);
  assert.doesNotMatch(continueAction,/receiveDataset|activateIncoming|scheduleWorkspaceSave|workspaceWriteGate/);
  assert.match(main,/if\(activeTabs\.length\)return \{ok:false,blockedByPeer:true/);
  assert.match(main,/workspaceWriteGate\.run\(\(\)=>workspaceCoordinator\.withWriteLock/);
});



test('Home has no peer warning when no other tab has loss-sensitive work',()=>{
  assert.equal(homeMarkup({peerWorkStatus:{kind:'clear'}}).includes('cross-tab-work-warning'),false);
});

test('Home explains active peer work and recovery in both UI locales',()=>{
  const en=homeMarkup({peerWorkStatus:{kind:'work',count:1},locale:'en'});
  const ja=homeMarkup({peerWorkStatus:{kind:'work',count:1},locale:'ja'});
  assert.match(en,/Another ParameterPlotter tab has unapplied work/);
  assert.match(en,/Apply or cancel its open input before retrying replacement/);
  assert.match(en,/Export any Dataset changes/);
  assert.ok(ja.includes('\u5225\u306eParameterPlotter\u30bf\u30d6\u306b\u672a\u9069\u7528\u306e\u4f5c\u696d\u304c\u3042\u308a\u307e\u3059'));
  assert.ok(ja.includes('E2R JSON\u3068\u3057\u3066\u66f8\u304d\u51fa\u3057\u3066\u304f\u3060\u3055\u3044'));
  assert.doesNotMatch(ja,/Export/);
  assert.notEqual(ja,en);
});

test('Home distinguishes uncertain coordination without claiming peer work exists',()=>{
  const markup=homeMarkup({peerWorkStatus:{kind:'unknown'},locale:'en'});
  assert.match(markup,/could not be checked safely/);
  assert.match(markup,/does not confirm that another tab has work needing protection/);
  assert.match(markup,/Choose Check other tabs again to retry the check/);
  assert.match(markup,/is-uncertain/);
  assert.match(markup,/data-home-action="new"[^>]*aria-disabled="true"/);
  const japanese=homeMarkup({peerWorkStatus:{kind:'unknown'},locale:'ja'});
  assert.match(japanese,/別タブに保護が必要な作業があると確認されたわけではありません/);
  assert.match(japanese,/「他のタブを再確認」からもう一度確認できます/);
  assert.match(japanese,/data-home-action="recheck-peer-work">他のタブを再確認/);
  const missing=homeMarkup({peerWorkStatus:null,locale:'en'});
  assert.match(missing,/could not be checked safely/);
  assert.match(missing,/aria-describedby="home-acquisition-status"/);
});

test('Home keeps peer work and save-stop notices distinct without repeating recovery copy',()=>{
  const markup=homeMarkup({peerWorkStatus:{kind:'work'},peerWorkSaveStopped:true,notice:'Peer save was stopped.',locale:'ja'});
  assert.ok(markup.includes('\u5225\u306eParameterPlotter\u30bf\u30d6\u306b\u672a\u9069\u7528\u306e\u4f5c\u696d\u304c\u3042\u308a\u307e\u3059'));
  assert.ok(markup.includes('\u73fe\u5728\u306eDataset\u306f\u3053\u306e\u30bf\u30d6\u306e\u30e1\u30e2\u30ea\u306b\u4fdd\u6301'));
  assert.doesNotMatch(markup,/Export/);
  assert.equal((markup.match(/role="status"/g)||[]).length,1);
  assert.equal((markup.match(/role="alert"/g)||[]).length,1);
});

test('a stopped save remains visible after peer work clears without claiming it is still active',()=>{
  const markup=homeMarkup({peerWorkStatus:{kind:'clear'},peerWorkSaveStopped:true,locale:'ja'});
  assert.doesNotMatch(markup,/cross-tab-work-warning/);
  assert.match(markup,/前回のWorkspace保存はクロスタブの安全確認で拒否され/);
  assert.match(markup,/再読み込みまで停止しています/);
  assert.match(markup,/現在のDatasetはこのタブのメモリに保持され/);
  assert.match(markup,/E2R JSONとして書き出し/);
  assert.doesNotMatch(markup,/別のParameterPlotterタブに保護が必要な作業があります/);
});

test('Workspace safety notices can wrap at normal and narrow widths',async()=>{
  const css=await readFile(new URL('./first-slice.css',import.meta.url),'utf8');
  assert.match(css,/\.successor-status\s*\{[^}]*min-width:\s*0/s);
  assert.match(css,/\.persistence-status,[\s\S]*?overflow-wrap:\s*anywhere;[\s\S]*?white-space:\s*normal;/);
  assert.match(css,/@media \(max-width:\s*720px\)[\s\S]*?\.persistence-status,[\s\S]*?\.lifecycle-notice\s*\{[^}]*padding:/);
});

test('replacement refusal keeps its dedicated alert and removes the duplicate ordinary peer notice',()=>{
  const markup=homeMarkup({peerWorkStatus:{kind:'work',count:1},replacementFeedback:{kind:'peer-work',reason:'Another ParameterPlotter tab has work that needs protection.'},locale:'en'});
  assert.match(markup,/role="alert"/);
  assert.match(markup,/saved workspace was not changed/);
  assert.equal(markup.includes('class="home-notice cross-tab-work-warning'),false);
});

test('uncertain post-write refusal tells the user to reload without offering a blind retry',()=>{
  const markup=homeMarkup({replacementFeedback:{kind:'write-unverified',reason:'The workspace was written, but its saved revision could not be verified.',canRetry:false},locale:'en'});
  assert.match(markup,/Do not assume either Dataset is current/);
  assert.match(markup,/Export any work you need to keep as E2R JSON/);
  assert.match(markup,/verify the download before reloading/);
  assert.doesNotMatch(markup,/data-retry-replacement/);
  assert.match(markup,/data-cancel-replacement-feedback[^>]*>Close notice</);
  assert.doesNotMatch(markup,/Cancel replacement/);
});

test('unknown replacement reason remains available in both Home locales',()=>{
  const reason='Browser tab coordination is unavailable.';
  const feedback={kind:'unknown',reason,canRetry:true};
  const english=homeMarkup({replacementFeedback:feedback,locale:'en'});
  const japanese=homeMarkup({replacementFeedback:feedback,locale:'ja'});
  assert.match(english,/Details:<\/strong> Browser tab coordination is unavailable\./);
  assert.match(japanese,/詳細:<\/strong> Browser tab coordination is unavailable\./);
  assert.match(japanese,/クロスタブの安全性を確認できなかった/);
});

test('stale revision notice is localized and directs the user to the latest saved workspace',()=>{
  const en=homeMarkup({replacementFeedback:{kind:'stale-revision',reason:'revision conflict',canRetry:false},locale:'en'});
  assert.match(en,/changes remain in memory/);
  assert.match(en,/saved workspace was not overwritten/);
  assert.match(en,/Export any work you need to keep as E2R JSON/);
  assert.match(en,/verify the download/);
  assert.match(en,/reload this tab and choose Continue Editing to open the latest saved workspace/);
  assert.doesNotMatch(en,/data-retry-replacement/);
  assert.match(en,/data-cancel-replacement-feedback[^>]*>Close notice</);
  assert.doesNotMatch(en,/Details:/);

  const ja=homeMarkup({replacementFeedback:{kind:'stale-revision',reason:'revision conflict',canRetry:false},locale:'ja'});
  assert.match(ja,/\u30e1\u30e2\u30ea\u306b\u4fdd\u6301/);
  assert.match(ja,/\u4e0a\u66f8\u304d\u3055\u308c\u3066\u3044\u307e\u305b\u3093/);
  assert.match(ja,/E2R JSON\u3068\u3057\u3066\u66f8\u304d\u51fa\u3057/);
  assert.match(ja,/\u30c0\u30a6\u30f3\u30ed\u30fc\u30c9\u3092\u78ba\u8a8d/);
  assert.match(ja,/\u518d\u8aad\u307f\u8fbc\u307f/);
  assert.match(ja,/\u6700\u65b0\u306eWorkspace/);
  assert.match(ja,/data-cancel-replacement-feedback[^>]*>\u901a\u77e5\u3092\u9589\u3058\u308b</);
  assert.doesNotMatch(ja,/data-retry-replacement|Export|Continue Editing/);
});

test('prior refusal feedback hides only its duplicate persistence notice and keeps later state visible',()=>{
  const notice='Workspace saving in this tab remains paused after an earlier safety refusal.';
  const markup=homeMarkup({notice,peerWorkSaveStopped:true,replacementFeedback:{kind:'prior-save-refusal',reason:'Saving stays paused until reload.',canRetry:false},locale:'en'});
  assert.equal((markup.match(/role="alert"/g)||[]).length,1);
  assert.equal((markup.match(/Workspace saving in this tab remains paused after an earlier safety refusal/g)||[]).length,1);
  assert.match(markup,/remains paused after an earlier safety refusal/);
  assert.match(markup,/Export any Dataset work you need as E2R JSON/);
  assert.match(markup,/check the download/);
  assert.match(markup,/reload and open the saved Workspace/);
  assert.doesNotMatch(markup,/data-retry-replacement/);
  assert.match(markup,/data-cancel-replacement-feedback[^>]*>Close notice</);
  assert.doesNotMatch(markup,/Cancel replacement/);
  const afterClose=homeMarkup({notice,peerWorkStatus:{kind:'work'},locale:'en'});
  assert.match(afterClose,/Workspace saving in this tab remains paused after an earlier safety refusal/);
  assert.match(afterClose,/cross-tab-work-warning/);
});

test('stale-revision feedback does not hide a separate persistence notice',()=>{
  const markup=homeMarkup({notice:'Independent save-state notice.',replacementFeedback:{kind:'stale-revision',reason:'revision changed',canRetry:false},locale:'en'});
  assert.match(markup,/Independent save-state notice/);
});
