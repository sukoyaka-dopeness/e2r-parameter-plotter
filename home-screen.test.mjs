import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {homeMarkup} from './home-screen.js';
import {creditsMarkup, footerMarkup} from './application-shell.js';
import {DIMENSION_ASSESSMENT_ID,entities,fresh,getValue,label,plottedEntities,quadrantOutOfRangeEntities,validateDataset,waitingCandidates} from './model.js';
import {renderMatrix,renderProfile,renderQuadrant,renderRadar} from './views.js';
import {ashenCrownSampleUrl} from './sample-datasets.js';
import {translateUiText} from './ui-localize.js';

test('Home uses the Human-selected start copy and presents primary Dataset acquisition',()=>{
  const html=homeMarkup();
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


test('Home has no peer warning when no other tab has loss-sensitive work',()=>{
  assert.equal(homeMarkup({peerWorkStatus:{kind:'clear'}}).includes('cross-tab-work-warning'),false);
});

test('Home explains active peer work and recovery in both UI locales',()=>{
  const en=homeMarkup({peerWorkStatus:{kind:'work',count:1},locale:'en'});
  const ja=homeMarkup({peerWorkStatus:{kind:'work',count:1},locale:'ja'});
  assert.match(en,/Another ParameterPlotter tab has unapplied work/);
  assert.match(en,/Apply or cancel its open input before retrying replacement/);
  assert.match(en,/Export any Dataset changes/);
  assert.ok(ja.includes('E2R JSON'));
  assert.doesNotMatch(ja,/Export/);
  assert.notEqual(ja,en);
});

test('Home distinguishes uncertain coordination without claiming peer work exists',()=>{
  const markup=homeMarkup({peerWorkStatus:{kind:'unknown'},locale:'en'});
  assert.match(markup,/could not be checked safely/);
  assert.match(markup,/does not confirm that another tab has work needing protection/);
  assert.match(markup,/is-uncertain/);
});

test('replacement refusal takes priority over the duplicate peer warning and offers retry and cancel',()=>{
  const markup=homeMarkup({peerWorkStatus:{kind:'work',count:1},replacementFeedback:{kind:'peer-work',reason:'Another ParameterPlotter tab has work that needs protection.'},locale:'en'});
  assert.match(markup,/role="alert"/);
  assert.match(markup,/saved workspace was not changed/);
  assert.match(markup,/work that needs protection/);
  assert.match(markup,/data-retry-replacement/);
  assert.match(markup,/data-cancel-replacement-feedback/);
  assert.doesNotMatch(markup,/Details:/);
  assert.equal(markup.includes('class="home-notice cross-tab-work-warning'),false);
});

test('uncertain post-write refusal tells the user to reload without offering a blind retry',()=>{
  const markup=homeMarkup({replacementFeedback:{kind:'write-unverified',reason:'The workspace was written, but its saved revision could not be verified.',canRetry:false},locale:'en'});
  assert.match(markup,/Do not assume either Dataset is current/);
  assert.match(markup,/reload this tab to inspect the saved state/);
  assert.doesNotMatch(markup,/data-retry-replacement/);
  assert.match(markup,/data-cancel-replacement-feedback/);
});

test('stale saved revisions direct the user to reload instead of retrying the same stale candidate',()=>{
  const markup=homeMarkup({replacementFeedback:{kind:'stale-revision',reason:'The saved workspace changed in another tab.',canRetry:false},locale:'en'});
  assert.match(markup,/changes remain in memory/);
  assert.match(markup,/Export any work you need to keep as E2R JSON/);
  assert.match(markup,/check that the download completed/);
  assert.match(markup,/reload this tab and choose Continue Editing to open the latest saved workspace/);
  assert.doesNotMatch(markup,/data-retry-replacement/);
  assert.match(markup,/Close notice/);
  assert.doesNotMatch(markup,/Details:/);
  const japanese=homeMarkup({replacementFeedback:{kind:'stale-revision',reason:'別のタブで保存済みWorkspaceが更新されました。',canRetry:false},locale:'ja'});
  assert.match(japanese,/ダウンロードを確認してから/);
  assert.match(japanese,/「Continue Editing」を選んで最新の保存状態を開いてください/);
});

test('a prior refused workspace write explains the reload boundary without an automatic retry',()=>{
  const markup=homeMarkup({replacementFeedback:{kind:'prior-save-refusal',reason:'Saving stays paused until reload.',canRetry:false},locale:'en'});
  assert.match(markup,/paused after an earlier safety refusal/);
  assert.match(markup,/check the download, then reload and open the saved Workspace/);
  assert.doesNotMatch(markup,/data-retry-replacement/);
  assert.match(markup,/Close notice/);
});
