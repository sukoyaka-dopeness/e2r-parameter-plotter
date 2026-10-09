import {load, save, fresh, readDataset, uid, getValue, setValue, label, fmt, clamp, entities, plottedEntities, waitingCandidates, validateDataset, datasetForWorkspace, exportBaseline, transactDatasetMutation} from './model.js';
import {renderProfile, renderQuadrant, renderRadar, renderMatrix} from './views.js';
import {dimensionRange, rangePosition, valueAtRangePosition, quadrantOutOfRangeEntities} from './model.js';
import {layoutPlotLabels} from './plot-labels.js';
import {shortId, duplicateDimension, dimensionDisplayName, dimensionNeedsId, radarAxisName, entityNeedsId, deleteDimension, deleteTemporaryEntity, returnToWaiting} from './workspace-actions.js';
import {endpointRangeText} from './endpoint-presentation.js';
import {numericError, showNumericError} from './field-validation.js';
import {parseFiniteDecimal} from './field-validation.js';
import {confirmationMarkup} from './confirmation-dialog.js';
import {sizeRadarLabels, PROTOTYPE_SPOKE_CAP, radarPositionAtPoint} from './radar-geometry.js';
import {startQuadrantPointDrag} from './quadrant-drag.js';
import {keepRadarRowVisible} from './radar-list.js';
import {containDrawerFocus, focusDrawer} from './drawer-focus.js';
import {hasLossSensitiveWork, installBeforeUnloadProtection} from './workspace-recovery.js';
import {replacementMarkup} from './replacement-safety.js';
import {randomDimensionValue} from './profile-random.js';
import {candidateAuthoringAvailable, createDatasetEntity, editDatasetEntity, entityDeleteEligibility, deleteDatasetEntity, deleteDatasetDimension, rescaledAssessmentValue, applyDimensionAndRescale, upgradeDimensionAssessment} from './successor-domain.js';
import {acceptsDimensionValue, authoredValueAtPosition, matrixEntities, reorderMatrixRow} from './model.js';
import {formAttributeId, rescaleActionFor} from './successor-event-wiring.js';
import {workspaceActionsMarkup} from './workspace-actions-menu.js';
import {homeMarkup} from './home-screen.js';
import {footerMarkup, creditsMarkup} from './application-shell.js';
import {requestedLocale, readSavedLocale, readTemporaryLocale, resolveLocale, chooseTemporaryLocale, chooseSavedLocale, localeFragment} from './locale-preference.js';
import {localeControlMarkup, localeConflictMarkup} from './locale-shell.js';
import {localizeUi} from './ui-localize.js';
import {applyDatasetTitle} from './dataset-title.js';
import {revealWithinScrollport} from './drawer-visibility.js';
import {headerNavigationFocusRequest, restoreHeaderNavigationFocus} from './view-header-focus.js';
import {matrixPageAfter} from './matrix-navigation.js';
import {adjustAssessmentByKeyboard, assessmentKeyboardStep, keyboardEditUnavailable, quadrantArrowAdjustment, quadrantKeyboardHelp, quadrantKeyboardValues, quadrantPointSelectionFromClick, radarKeyboardStepStatus, rejectedKeyboardAdjustment} from './assessment-keyboard.js';
import {captureDocumentScroll, restoreDocumentScroll, revealInDocument} from './viewport-scroll.js';
import {placePlotContextMenuAfterTrigger, closePlotContextMenu} from './plot-context-menu-focus.js';
const localeRequest=requestedLocale(window.location.hash);
const savedLocale=readSavedLocale(window.localStorage);
const initialLocale=resolveLocale({requested:localeRequest,saved:savedLocale,temporary:readTemporaryLocale(window.sessionStorage),browserLanguage:window.navigator.language});
let locale=initialLocale.locale;
let localeConflict=initialLocale.conflict;
let s = load();
let surface = 'home';
let homeError = '';
let datasetTitleDraft = null;
let creditsOpen = false;
let pagerDirection = 0;
let radarSelectedDimension = null;
let quadrantKeyboardEntity = null;
let closingDrawer = null;
let closeTimer = null;
let dimensionQuery = '';
let contextMenu = null;
let confirmation = null;
let dimensionWarning = null;
let dimensionError = null;
let dimensionDraft = null;
let candidateUpgradeConfirmation = false;
let fileError = '';
let matrixError = '';
let matrixFocus = null;
let entityMenu = null;
let editEntityId = null;
let drawerOpener = null;
let drawerOpenerLocation = 'header';
let replacement = null;
let radarScroll = 0;
let matrixDragId = null;
let matrixRowDragId = null;
let profileRandomNotice = '';
let lifecycleNotice = '';
let entityDeleteNotice = null;
let entityFormError = null;
let rescaleProposal = null;
const root = document.querySelector('#app');
const esc = x => String(x ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const name = id => { const list=entities(s),i=list.findIndex(e=>e.id===id); return i<0?'Select Entity':label(list[i],i); };
function options(items, current, first='Choose…') { return `<option value="">${first}</option>`+items.map(x=>`<option value="${esc(x.id)}" ${x.id===current?'selected':''}>${esc(x.name)}</option>`).join(''); }
function dimensionOptions(current, exclude=[]) { return options(s.dimensions.filter(x=>!exclude.includes(x.id)).map(d=>({...d,name:dimensionDisplayName(s,d)})),current); }
function entityOptions(current, exclude=[]) { return options(entities(s).filter(x=>!exclude.includes(x.id)).map((x,i)=>({id:x.id,name:x.name||`Entity ${i+1}`})),current); }
const api={esc,name,options,dimensionOptions,entityOptions,get:(e,d)=>getValue(s,e,d),fmt, state:()=>s,entities:()=>entities(s),plotted:()=>plottedEntities(s),waitingCandidates:()=>waitingCandidates(s),matrixError:()=>matrixError,randomNotice:()=>profileRandomNotice,quadrantKeyboardHelp:()=>quadrantKeyboardHelp(locale),quadrantKeyboardStatus:()=>{const id=quadrantKeyboardEntity,[x,y]=s.quadrant,xd=s.dimensions.find(d=>d.id===x),yd=s.dimensions.find(d=>d.id===y);return id&&xd&&yd&&plottedEntities(s).some(entity=>entity.id===id)?quadrantKeyboardValues(locale,name(id),xd.name,fmt(getValue(s,id,x),xd),yd.name,fmt(getValue(s,id,y),yd)):'';},entityId:(id,surface)=>entityNeedsId(s,entities(s).find(e=>e.id===id),surface)?shortId(id):'',dimensionId:(id,surface)=>dimensionNeedsId(s,s.dimensions.find(d=>d.id===id),surface)?shortId(id):'',dimensionName:id=>dimensionDisplayName(s,s.dimensions.find(d=>d.id===id)),axisName:id=>radarAxisName(s,s.dimensions.find(d=>d.id===id))};
function render() {
  Object.assign(api,{quadrantOutOfRange:()=>quadrantOutOfRangeEntities(s),dimension:id=>s.dimensions.find(d=>d.id===id),rangeMidpoint:id=>valueAtRangePosition(s.dimensions.find(d=>d.id===id),0.5)});
  const oldRadarList=root.querySelector('.radar-spoke-list');if(oldRadarList)radarScroll=oldRadarList.scrollTop;
  if(s.waiting&&!waitingCandidates(s).some(e=>e.id===s.waiting))s.waiting=null;
  const allEntities=entities(s),showEntity=s.poolOpen||closingDrawer==='entity',showDimension=s.dimensionOpen||closingDrawer==='dimension';
  root.innerHTML=`<header><div><p class="eyebrow">E2R · SINGLE-USER COMPARISON WORKSPACE</p><h1>ParameterPlotter</h1><p class="sub">Compare Entities with dimensions you define. Dataset stays read-only.</p>${fileError?`<p class="field-error" role="alert">${esc(fileError)}</p>`:''}</div><div class="header-actions"><label class="button primary" data-import-trigger tabindex="0" role="button">Import E2R Dataset<input id="dataset-file" type="file" accept=".json,.e2r.json,application/json" hidden></label><button data-action="entities">Entities</button><button data-action="dimensions">Dimensions</button></div></header>
  <main><div class="topline"><div><strong>${allEntities.length?`${allEntities.length} ${allEntities.length===1?'Dataset Entity':'Dataset Entities'} available`:'No Dataset Entities available'}</strong><span> · ${s.dimensions.length} ${s.dimensions.length===1?'Dimension':'Dimensions'}</span></div><span>Comparison values are Dataset Assessments</span></div>
  <nav class="tabs" aria-label="Views">${['Profile','Radar','Quadrant','Matrix'].map(v=>`<button class="${s.view===v?'active':''}" aria-current="${s.view===v?'page':'false'}" data-view="${v}">${v}</button>`).join('')}</nav><label class="view-select">View <select id="view-select">${['Profile','Radar','Quadrant','Matrix'].map(v=>`<option value="${v}" ${s.view===v?'selected':''}>${v}</option>`).join('')}</select></label>
  <section class="workspace">${!allEntities.length?`<div class="empty"><h2>Start with an E2R Dataset</h2><p>Open a Dataset or create a Dataset Entity. No Assessment is inferred.</p><button data-action="entities">Open Entity Pool</button></div>`:s.view==='Profile'?renderProfile(api):s.view==='Quadrant'?renderQuadrant(api):s.view==='Radar'?renderRadar(api):renderMatrix(api)}</section></main>
  ${showEntity||showDimension?`<button class="drawer-backdrop is-backdrop-dismissible ${closingDrawer?'is-closing':''}" data-action="close-drawers" aria-label="Close panel" tabindex="-1"></button>`:''}
  ${showEntity?`<aside class="drawer ${closingDrawer==='entity'?'is-closing':'is-open'}" role="dialog" aria-modal="true" aria-label="Entity Pool"><div class="drawer-head"><h2>Entity Pool</h2><button data-action="close-pool">Close</button></div><p>Dataset Entities and session-only Entities can be compared together.</p><div class="pool-action"><button class="primary" data-action="add-entity">Add temporary Entity</button></div>${s.entityFormOpen?`<form id="entity-form" class="drawer-form" autocomplete="off"><h3>${editEntityId?'Edit temporary Entity':'Temporary Entity'}</h3><label>Name<input name="temporary-entity-name" autocomplete="off" required maxlength="80" placeholder="Entity name" value="${esc(s.tempEntities.find(e=>e.id===editEntityId)?.name||'')}"></label><label>Description (optional)<textarea name="temporary-entity-description" autocomplete="off" rows="3" placeholder="Describe this Entity">${esc(s.tempEntities.find(e=>e.id===editEntityId)?.description||'')}</textarea></label><div class="actions"><button class="primary" type="submit">${editEntityId?'Save Entity':'Create Entity'}</button><button type="button" data-action="cancel-entity-form">Cancel</button></div></form>`:''}<label class="pool-search">Search Entity list<input id="entity-search" placeholder="Filter by name" aria-label="Search Entities"></label><div id="entity-list" class="item-list"></div></aside>`:''}
  ${showDimension?`<aside class="drawer dimension-drawer ${closingDrawer==='dimension'?'is-closing':'is-open'}" role="dialog" aria-modal="true" aria-label="Dimension Pool"><div class="drawer-head"><div><h2>Dimension Pool</h2></div><button data-action="close-dimensions">Close</button></div><div class="pool-action"><button class="primary" data-action="add-dimension">Add dimension</button></div>${s.dimensionFormOpen?`<form id="dimension-form" class="drawer-form" autocomplete="off"><h3>${s.editDimension?'Edit dimension':'New dimension'}</h3><input type="hidden" name="id" value="${esc(s.editDimension||'')}"><label>Name<input name="dimension-name" autocomplete="off" required maxlength="80"></label><div class="field-pair"><label>Low label<input name="dimension-low" autocomplete="off" required maxlength="80"></label><label>High label<input name="dimension-high" autocomplete="off" required maxlength="80"></label></div>${dimensionWarning?`<div class="duplicate-warning" role="alert"><strong>${dimensionWarning.exact?'Possible exact duplicate':'Same name exists'}</strong><p>${dimensionWarning.exact?'A dimension already has this name and the same low/high labels.':'A dimension already has this name. Compare its low/high labels before continuing.'}</p><button type="submit" data-confirm-duplicate class="primary">${s.editDimension?'Save anyway':'Create anyway'}</button></div>`:''}<div class="actions"><button type="submit" class="primary">Save dimension</button><button type="button" data-action="cancel-dimension-form">Cancel</button></div></form>`:''}<label class="pool-search">Search Dimension list<input id="dimension-search" value="${esc(dimensionQuery)}" placeholder="Filter by name or labels" aria-label="Search dimensions"></label><div id="dimension-list" class="item-list dimension-list"></div></aside>`:''}
  ${contextMenu&&s.view==='Quadrant'?`<div class="plot-context-menu" role="menu" aria-label="Entity actions" style="left:${Math.min(contextMenu.x,innerWidth-190)}px;top:${Math.min(contextMenu.y,innerHeight-110)}px"><p>${esc(name(contextMenu.id))}</p><button role="menuitem" data-context-action="profile">Open Profile</button><button role="menuitem" data-context-action="waiting">Return to waiting</button></div>`:''}
  ${confirmationMarkup(confirmation,s,esc)}${replacement?replacementMarkup(replacement):''}`;
  if(showEntity) renderEntityList(); if(showDimension) {renderDimensionList(); fillDimensionForm();}
  layoutPlotLabels(root);
  sizeRadarLabels(root);
  if(s.view==='Radar'&&radarSelectedDimension){const vertex=root.querySelector(`[data-vertex="${CSS.escape(radarSelectedDimension)}"]`);if(vertex)vertex.classList.add('is-selected');else radarSelectedDimension=null;}
  const radarList=root.querySelector('.radar-spoke-list');if(radarList)radarList.scrollTop=radarScroll;
  document.documentElement.classList.toggle('drawer-modal-open',Boolean(s.poolOpen||s.dimensionOpen||closingDrawer));
  root.querySelectorAll('header,main').forEach(el=>el.inert=Boolean(s.poolOpen||s.dimensionOpen||closingDrawer||confirmation||replacement));
  if(confirmation){root.querySelectorAll('header,main,.drawer,.drawer-backdrop').forEach(el=>el.inert=true);root.querySelector('[data-cancel-confirmation]:not(.confirm-scrim)')?.focus();}
  else if(replacement){root.querySelectorAll('header,main,.drawer,.drawer-backdrop').forEach(el=>el.inert=true);root.querySelector('[data-cancel-replacement]:not(.confirm-scrim)')?.focus();}
  else if((s.poolOpen||s.dimensionOpen)&&!root.querySelector('.drawer.is-open')?.contains(document.activeElement))focusDrawer(root);
  if(matrixFocus&&s.view==='Matrix'&&Date.now()<matrixFocus.until){const row=[...root.querySelectorAll('[data-matrix-row]')].find(x=>x.dataset.matrixRow===matrixFocus.id)||root.querySelector('[data-matrix-empty]');if(row){row.classList.add('row-target');row.scrollIntoView({block:'center'});row.focus({preventScroll:true});}}
  if(pagerDirection){const content=root.querySelector('[data-entity-content]');if(content)content.classList.add(pagerDirection>0?'page-next':'page-previous');pagerDirection=0;}
}
function renderEntityList(){const q=(document.querySelector('#entity-search')?.value||'').toLowerCase(),plotted=new Set(plottedEntities(s).map(e=>e.id));document.querySelector('#entity-list').innerHTML=entities(s).map((e,i)=>({e,i})).filter(({e,i})=>[label(e,i),String(e.description||''),e.id].some(x=>x.toLowerCase().includes(q))).map(({e,i})=>`<div class="list-row entity-row"><button class="entity-choice" data-choose-entity="${esc(e.id)}" ${s.view==='Quadrant'&&plotted.has(e.id)?'disabled':''}><span class="entity-row-title"><strong>${esc(label(e,i))}</strong><small class="temp-badge">${e.temporary?'Temporary':'Dataset'}</small></span>${e.description?`<small>${esc(e.description)}</small>`:''}${entityNeedsId(s,e,'pool')?`<small>ID ${esc(shortId(e.id))}</small>`:''}<small>${s.view==='Quadrant'&&plotted.has(e.id)?'Plotted':s.selected===e.id?'Selected':''}</small></button><button class="entity-more" data-entity-menu="${esc(e.id)}" aria-label="Actions for ${esc(label(e,i))}" aria-expanded="${entityMenu===e.id}">⋯</button>${entityMenu===e.id?`<div class="entity-actions">${e.temporary?`<button data-edit-entity="${esc(e.id)}">Edit temporary Entity</button><button disabled title="Dataset is read-only">Add to Dataset · unavailable</button><button class="danger" data-delete-entity="${esc(e.id)}">Delete temporary Entity</button>`:`<button data-open-profile="${esc(e.id)}">Open Profile</button><button disabled title="Dataset deletion semantics are undecided">Delete from Dataset · unavailable</button>`}</div>`:''}</div>`).join('')||'<p>No matches</p>';}
function renderDimensionList(){const q=dimensionQuery.toLowerCase();document.querySelector('#dimension-list').innerHTML=s.dimensions.filter(d=>[d.name,d.low,d.high].some(x=>x.toLowerCase().includes(q))).map(d=>`<div class="list-row"><span><strong>${esc(d.name)}</strong><small>${esc(d.low)} → ${esc(d.high)}</small>${dimensionNeedsId(s,d,'pool')?`<small>ID ${esc(shortId(d.id))}</small>`:''}</span><button data-edit-dimension="${esc(d.id)}">Edit</button><button class="danger" data-delete-dimension="${esc(d.id)}">Delete</button></div>`).join('')||`<p>${s.dimensions.length?'No matching dimensions':'No dimensions yet'}</p>`;}
function fillDimensionForm(){const f=document.querySelector('#dimension-form'),d=dimensionDraft||s.dimensions.find(x=>x.id===s.editDimension);if(!d||!f)return;f.elements.namedItem('dimension-name').value=d.name;f.elements.namedItem('dimension-low').value=d.low;f.elements.namedItem('dimension-high').value=d.high;}
function update(){save(s);render();}
function openConfirmation(kind,id){confirmation={kind,id};render();}
function cancelConfirmation(){const prior=confirmation;confirmation=null;render();if(prior){const key=prior.kind==='dimension'?'deleteDimension':'entityMenu';[...root.querySelectorAll(`[data-${key.replace(/[A-Z]/g,x=>'-'+x.toLowerCase())}]`)].find(x=>x.dataset[key]===prior.id)?.focus();}}
function trapDialogTab(event,selector){
  const controls=[...root.querySelectorAll(`${selector} button:not([disabled])`)];
  const first=controls[0],last=controls.at(-1);
  if(!first)return;
  if(!root.querySelector(selector).contains(document.activeElement)){event.preventDefault();first.focus();}
  else if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
}
function commitNumeric(input){
 const error=numericError(input.value,input.validity.badInput);
 if(error){showNumericError(input,error);input.focus();return false;}
 showNumericError(input,null);
 if(input.dataset.dirty!=='true'){input.blur();return true;}
 const [entity,dimension]=input.dataset.value.split('|');setValue(s,entity,dimension,input.value);update();return true;
}
function focusMatrixRow(id){s.selected=id;matrixFocus={id,until:Date.now()+1800};closeDrawers();setTimeout(()=>{matrixFocus=null;root.querySelector('.row-target')?.classList.remove('row-target');},1800);}
function closeDrawers(){
  if(closingDrawer)return;
  entityMenu=null;
  closingDrawer=s.poolOpen?'entity':s.dimensionOpen?'dimension':null;
  if(!closingDrawer)return;
  s.poolOpen=false;s.dimensionOpen=false;s.dimensionFormOpen=false;s.entityFormOpen=false;s.editDimension=null;editEntityId=null;
  update();
  clearTimeout(closeTimer);
  const openerAction=drawerOpener?.dataset?.action;
  closeTimer=setTimeout(()=>{closingDrawer=null;render();const restored=openerAction?root.querySelector(`${drawerOpenerLocation} [data-action="${CSS.escape(openerAction)}"]`):null;(restored||root.querySelector('[data-action="entities"]'))?.focus();drawerOpener=null;},matchMedia('(prefers-reduced-motion: reduce)').matches?0:180);
}
function openDrawer(kind,opener){clearTimeout(closeTimer);closingDrawer=null;drawerOpener=opener||document.activeElement;drawerOpenerLocation=drawerOpener.closest('main')?'main':'header';s.poolOpen=kind==='entity';s.dimensionOpen=kind==='dimension';update();focusDrawer(root);}
document.addEventListener('click',e=>{
  if(replacement){if(e.target.closest('[data-cancel-replacement]')){replacement=null;render();root.querySelector('.workspace-more-trigger')?.focus();return;}if(e.target.closest('[data-confirm-replacement]')){s=fresh(replacement);replacement=null;fileError='';matrixError='';update();return;}return;}
  if(e.target.matches('[data-cancel-confirmation]')){cancelConfirmation();return;}
  const b=e.target.closest('button,[data-action]');if(!b)return;
  const keyboardPointId=quadrantPointSelectionFromClick(e);
  if(keyboardPointId){const scrollSnapshot=captureDocumentScroll(document);s.selected=keyboardPointId;update();root.querySelector(`[data-point="${CSS.escape(keyboardPointId)}"]`)?.focus({preventScroll:true});restoreDocumentScroll(scrollSnapshot);return;}
  if(b.dataset.entityMenu){const id=b.dataset.entityMenu;entityMenu=entityMenu===id?null:id;renderEntityList();const selector=`[data-entity-menu="${CSS.escape(id)}"]`,opener=root.querySelector(selector);opener?.focus({preventScroll:true});if(entityMenu===id){requestAnimationFrame(()=>{if(entityMenu!==id)return;const currentOpener=root.querySelector(selector),actions=currentOpener?.closest('.entity-row')?.querySelector('.entity-actions'),list=actions?.closest('.item-list'),drawer=actions?.closest('.drawer');if(!actions?.isConnected)return;revealWithinScrollport(actions,list);revealWithinScrollport(actions,drawer);});}return;}
  if(b.dataset.openProfile){s.selected=b.dataset.openProfile;s.view='Profile';entityMenu=null;closeDrawers();return;}
  if(b.dataset.confirmDelete!==undefined&&confirmation){const {kind,id}=confirmation;confirmation=null;if(kind==='dimension')deleteDimension(s,id);else {deleteTemporaryEntity(s,id);entityMenu=null;if(matrixFocus?.id===id)matrixFocus=null;if(contextMenu?.id===id)contextMenu=null;}update();return;}
  if(b.dataset.contextAction){const id=contextMenu?.id,action=b.dataset.contextAction;contextMenu=null;if(!id)return;s.selected=id;if(action==='profile')s.view='Profile';else returnToWaiting(s,id);update();return;}
  if(contextMenu)contextMenu=null;
  if(b.dataset.view){s.view=b.dataset.view;update();return;}
  if(b.dataset.chooseEntity){if(s.view==='Quadrant'&&!waitingCandidates(s).some(e=>e.id===b.dataset.chooseEntity))return;if(s.view==='Matrix'){focusMatrixRow(b.dataset.chooseEntity);return;}if(s.view==='Radar'&&s.selected!==b.dataset.chooseEntity){const list=entities(s),from=list.findIndex(x=>x.id===s.selected),to=list.findIndex(x=>x.id===b.dataset.chooseEntity);pagerDirection=to>=from?1:-1;radarSelectedDimension=null;}s.selected=b.dataset.chooseEntity;if(s.view==='Quadrant')s.waiting=b.dataset.chooseEntity;closeDrawers();return;}
  if(b.dataset.selectEntity){s.selected=b.dataset.selectEntity;update();return;}
  if(b.dataset.editDimension){dimensionWarning=null;dimensionDraft=null;s.editDimension=b.dataset.editDimension;s.dimensionFormOpen=true;render();document.querySelector('#dimension-form [name=dimension-name]')?.focus();return;}
  if(b.dataset.editEntity){if(!s.tempEntities.some(x=>x.id===b.dataset.editEntity))return;editEntityId=b.dataset.editEntity;s.entityFormOpen=true;entityMenu=null;render();root.querySelector('#entity-form [name=temporary-entity-name]')?.focus();return;}
  if(b.dataset.deleteDimension){openConfirmation('dimension',b.dataset.deleteDimension);return;}
  if(b.dataset.deleteEntity){openConfirmation('entity',b.dataset.deleteEntity);return;}
  if(b.dataset.valueClear){profileRandomNotice='';const [entity,dim]=b.dataset.valueClear.split('|');setValue(s,entity,dim,null);update();return;}
  if(b.dataset.random){const card=b.dataset.random==='card',ids=card?s.dimensions.map(d=>d.id):[b.dataset.random];let count=0;for(const id of ids)if(!card||getValue(s,s.selected,id)===null){setValue(s,s.selected,id,Math.round((Math.random()*2-1)*100)/100);count++;}update();if(count){const button=[...root.querySelectorAll('[data-random]')].find(x=>x.dataset.random===b.dataset.random);button?.focus({preventScroll:true});if(button&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const face=button.querySelector('.dice-face');if(face){face.textContent='\u2682';face.classList.add('is-rolling');setTimeout(()=>{if(face.isConnected){face.textContent='\u2684';face.classList.remove('is-rolling');}},180);}}}return;}
  if(b.dataset.matrixPage){const focusRequest=headerNavigationFocusRequest(b,e),scrollSnapshot=focusRequest?captureDocumentScroll(document):null,nav=b.closest('.matrix-nav'),step=Number(b.dataset.matrixPage);s.matrixPage=nav?matrixPageAfter(s.matrixPage,Number(nav.dataset.matrixPageCount),step):Math.max(0,s.matrixPage+step);update();restoreHeaderNavigationFocus(root,focusRequest,{scrollSnapshot,documentObject:document});return;}
  if(b.dataset.primaryStep){const focusRequest=headerNavigationFocusRequest(b,e),scrollSnapshot=focusRequest?captureDocumentScroll(document):null,list=entities(s),i=list.findIndex(x=>x.id===s.selected),n=list.length;pagerDirection=Number(b.dataset.primaryStep);s.selected=list[(i+pagerDirection+n)%n]?.id;if(s.view==='Radar')radarSelectedDimension=null;update();restoreHeaderNavigationFocus(root,focusRequest,{scrollSnapshot,documentObject:document});return;}
  if(b.dataset.waitingStep){const focusRequest=headerNavigationFocusRequest(b,e),scrollSnapshot=focusRequest?captureDocumentScroll(document):null,list=waitingCandidates(s),i=list.findIndex(x=>x.id===s.waiting),step=Number(b.dataset.waitingStep);if(list.length){s.waiting=list[i<0?(step>0?0:list.length-1):(i+step+list.length)%list.length].id;s.selected=s.waiting;update();restoreHeaderNavigationFocus(root,focusRequest,{scrollSnapshot,documentObject:document});}return;}
  if(b.dataset.radarRemove){s.radar.splice(Number(b.dataset.radarRemove),1);update();return;}
  if(b.dataset.radarMove){const [i,step]=b.dataset.radarMove.split('|').map(Number),j=i+step;if(j>=0&&j<s.radar.length){const id=s.radar[i];[s.radar[i],s.radar[j]]=[s.radar[j],s.radar[i]];update();keepRadarRowVisible(root,id,step);}return;}
  if(b.dataset.action){const action=b.dataset.action;if(action==='entities'||action==='dimensions'){openDrawer(action==='entities'?'entity':'dimension',b);return;}if(['close-pool','close-dimensions','close-drawers'].includes(action)){closeDrawers();return;}switch(action){case 'add-entity':editEntityId=null;s.entityFormOpen=true;break;case 'cancel-entity-form':editEntityId=null;s.entityFormOpen=false;break;case 'add-dimension':dimensionQuery='';dimensionWarning=null;dimensionDraft=null;s.editDimension=null;s.dimensionFormOpen=true;break;case 'cancel-dimension-form':dimensionWarning=null;dimensionDraft=null;s.editDimension=null;s.dimensionFormOpen=false;break;case 'clear-waiting':s.waiting=null;break;case 'return-waiting':returnToWaiting(s,b.dataset.entity);break;}update();if(action==='add-dimension'||action==='add-entity')document.querySelector('#dimension-form [name=dimension-name],#entity-form [name=temporary-entity-name]')?.focus();}
});
document.addEventListener('change',async e=>{
  const t=e.target;
  if(t.id==='dataset-file'){const file=t.files?.[0];if(!file)return;try{const data=readDataset(JSON.parse(await file.text()));t.value='';if(hasTemporaryWork(s)){replacement=data;render();}else{s=fresh(data);fileError='';matrixError='';update();}}catch(err){fileError=err.message;render();}return;}
  if(t.id==='view-select'){s.view=t.value;update();return;}
  if(t.dataset.value){if(t.type==='number')commitNumeric(t);else {const [en,dim]=t.dataset.value.split('|');setValue(s,en,dim,t.value);update();}return;}
  if(t.dataset.quadrantAxis){s.quadrant[Number(t.dataset.quadrantAxis)]=t.value||null;update();return;}
  if(t.id==='radar-add-dimension'){if(t.value&&!s.radar.includes(t.value)&&s.radar.length<PROTOTYPE_SPOKE_CAP)s.radar.push(t.value);update();return;}
  if(t.id==='secondary'){s.secondary=t.value||null;update();return;}
  if(t.dataset.matrixColumn){const i=Number(t.dataset.matrixColumn);if(s.matrix.includes(t.value)&&t.value){matrixError='This dimension is already selected in another column.';render();return;}matrixError='';s.matrix[i]=t.value||null;update();return;}
});
document.addEventListener('submit',e=>{if(e.target.getAttribute('id')!=='entity-form')return;e.preventDefault();const value=e.target.elements.namedItem('temporary-entity-name').value.trim(),description=e.target.elements.namedItem('temporary-entity-description').value.trim();if(!value)return;if(editEntityId){const entity=s.tempEntities.find(x=>x.id===editEntityId);if(!entity)return;entity.name=value;if(description)entity.description=description;else delete entity.description;editEntityId=null;}else{let id;do{id='temp:'+uid();}while(entities(s).some(x=>x.id===id));s.tempEntities.push({id,name:value,...(description?{description}:{}),temporary:true});s.selected=id;if(s.view==='Quadrant')s.waiting=id;}s.entityFormOpen=false;update();});
document.addEventListener('keydown',e=>{
  if(replacement){if(e.key==='Escape'){e.preventDefault();replacement=null;render();root.querySelector('.workspace-more-trigger')?.focus();}else if(e.key==='Tab')trapDialogTab(e,'.confirm-dialog');return;}
  if(confirmation){if(e.key==='Escape'){e.preventDefault();cancelConfirmation();return;}if(e.key==='Tab'){const buttons=[...root.querySelectorAll('.confirm-dialog button')],first=buttons[0],last=buttons.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}return;}
  if(e.key==='Escape'&&contextMenu){e.preventDefault();const previous=contextMenu;contextMenu=null;closePlotContextMenu(root,previous,{restoreFocus:true});return;}
  if(e.key==='Escape'&&(s.poolOpen||s.dimensionOpen)){e.preventDefault();closeDrawers();return;}
  if(s.poolOpen||s.dimensionOpen){containDrawerFocus(e,root);return;}
  if(e.target.closest?.('[data-import-trigger]')&&['Enter',' '].includes(e.key)){e.preventDefault();e.stopImmediatePropagation();openDatasetFilePicker();return;}
  if(e.altKey&&['ArrowLeft','ArrowRight'].includes(e.key)&&e.target.matches('[data-matrix-move]')){e.preventDefault();const i=Number(e.target.dataset.matrixMove),j=i+(e.key==='ArrowLeft'?-1:1);if(j>=0&&j<s.matrix.length){[s.matrix[i],s.matrix[j]]=[s.matrix[j],s.matrix[i]];update();root.querySelector(`[data-matrix-move="${j}"]`)?.focus();}return;}
  if(e.key==='Enter'&&e.target.matches('input[type=number][data-value]')){e.preventDefault();commitNumeric(e.target);return;}
});
document.addEventListener('focusin',e=>{
  if(contextMenu){const menu=root.querySelector('.plot-context-menu');if(menu&&!menu.contains(e.target)){contextMenu=null;menu.remove();}}
  const point=e.target.closest?.('[data-point]');if(point&&point.dataset.point!==quadrantKeyboardEntity){quadrantKeyboardEntity=null;const status=root.querySelector('[data-quadrant-keyboard-status]');if(status)status.textContent='';}
  const vertex=e.target.closest?.('[data-vertex]');if(vertex){radarSelectedDimension=vertex.dataset.vertex;root.querySelectorAll('.vertex-hit.is-selected').forEach(x=>x.classList.remove('is-selected'));vertex.classList.add('is-selected');const guide=root.querySelector('.radar-chart>.small');if(guide){const dimension=s.dimensions.find(d=>d.id===radarSelectedDimension);guide.textContent=radarKeyboardStepStatus(locale,dimension?.name||'vertex',fmt(assessmentKeyboardStep(dimension),dimension));}}
  if(confirmation||replacement||!(s.poolOpen||s.dimensionOpen))return;
  const drawer=root.querySelector('.drawer.is-open');
  if(drawer&&!drawer.contains(e.target))focusDrawer(root);
});
document.addEventListener('input',e=>{const t=e.target;if(t.id==='entity-search')renderEntityList();if(t.id==='dimension-search'){dimensionQuery=t.value;renderDimensionList();}if(t.closest('#dimension-form')&&dimensionWarning){dimensionWarning=null;t.closest('form').querySelector('.duplicate-warning')?.remove();}if(t.matches('input[type=number][data-value]')){t.dataset.dirty='true';showNumericError(t,numericError(t.value,t.validity.badInput));}if(t.matches('input[type=range].range-missing'))t.classList.remove('range-missing');if(t.matches('input[type=range][data-value]')){const [en,dim]=t.dataset.value.split('|');setValue(s,en,dim,t.value);save(s);const card=t.closest('.dimension-card');const numeric=card?.querySelector('input[type=number]'),readout=card?.querySelector(':scope > small');if(numeric){numeric.value=fmt(getValue(s,en,dim));numeric.title='Stored value '+getValue(s,en,dim);numeric.dataset.dirty='false';}if(readout)readout.textContent='Temporary value '+fmt(getValue(s,en,dim));}});
function clearMatrixDrop(){root.querySelector('.matrix-insertion-indicator')?.classList.remove('is-visible');}
function matrixInsertionAt(event,col){
  if(!matrixDragId||!col)return null;
  const from=s.matrix.indexOf(matrixDragId),target=Number(col.dataset.dropColumn);
  if(from<0||target<0||target>=s.matrix.length||s.matrix[target]===matrixDragId)return null;
  const rect=col.getBoundingClientRect(),after=event.clientX>=rect.left+rect.width/2;
  const insertion=target+(after?1:0),finalIndex=insertion-(from<insertion?1:0);
  if(finalIndex===from)return null;
  return {finalIndex,x:after?rect.right:rect.left,top:rect.top,height:rect.height};
}
function showMatrixInsertion(event,col){
  const point=matrixInsertionAt(event,col),wrap=col?.closest('.matrix-wrap'),indicator=wrap?.querySelector('.matrix-insertion-indicator');
  if(!point||!wrap||!indicator){clearMatrixDrop();return null;}
  indicator.style.left=`${point.x}px`;
  indicator.style.top=`${point.top}px`;
  indicator.style.height=`${point.height}px`;indicator.classList.add('is-visible');
  return point.finalIndex;
}
document.addEventListener('dragstart',e=>{const id=e.target.dataset.dragEntity||e.target.dataset.dragDimension;if(id)e.dataTransfer.setData(e.target.dataset.dragEntity?'entity':'dimension',id);matrixDragId=e.target.dataset.dragDimension||null;});
document.addEventListener('dragend',()=>{matrixDragId=null;clearMatrixDrop();});
document.addEventListener('contextmenu',e=>{const item=e.target.closest('.plot-item');if(!item||s.view!=='Quadrant')return;e.preventDefault();const trigger=e.target.closest('[data-point],[data-select-entity]');contextMenu={id:item.dataset.entity,x:e.clientX,y:e.clientY,trigger:trigger?.hasAttribute('data-select-entity')?'label':'point'};render();root.querySelector('.plot-context-menu button')?.focus();});
document.addEventListener('dragover',e=>{const col=e.target.closest('[data-drop-column]');if(matrixDragId&&col){if(showMatrixInsertion(e,col)!==null)e.preventDefault();return;}if(matrixDragId)clearMatrixDrop();if(e.target.closest('[data-plot],[data-waiting]'))e.preventDefault();});
document.addEventListener('drop',e=>{const plot=e.target.closest('[data-plot]'),wait=e.target.closest('[data-waiting]'),col=e.target.closest('[data-drop-column]');if(plot){clearMatrixDrop();matrixDragId=null;e.preventDefault();const id=e.dataTransfer.getData('entity');if(id)placeOnPlot(id,e,plot);}if(wait){clearMatrixDrop();matrixDragId=null;e.preventDefault();const id=e.dataTransfer.getData('entity');if(id&&plottedEntities(s).some(entity=>entity.id===id))openConfirmation('axisClear',id);}if(col){e.preventDefault();const id=e.dataTransfer.getData('dimension'),to=showMatrixInsertion(e,col),from=s.matrix.indexOf(id);clearMatrixDrop();matrixDragId=null;if(from>=0&&to!==null&&from!==to){s.matrix.splice(from,1);s.matrix.splice(to,0,id);update();}}});
function placeOnPlot(id,e,plot){
 const [x,y]=s.quadrant,xd=s.dimensions.find(d=>d.id===x),yd=s.dimensions.find(d=>d.id===y);
 if(!xd||!yd||x===y)return;
 const rect=plot.getBoundingClientRect(),px=clamp(2*(e.clientX-rect.left)/rect.width-1),py=clamp(1-2*(e.clientY-rect.top)/rect.height);
 const xv=authoredValueAtPosition(xd,(px+1)/2),yv=authoredValueAtPosition(yd,(py+1)/2);
 if(!acceptsDimensionValue(xd,xv)||!acceptsDimensionValue(yd,yv)){
  update();const guide=root.querySelector('.plot-foot .small');
  if(guide)guide.textContent='Values unchanged: a selected integer-only Dimension has no safely generated integer candidate in range.';
  return;
 }
 const result=transactDatasetMutation(s,()=>{s.values[id]||={};s.values[id][x]=xv;s.values[id][y]=yv;s.selected=id;if(s.waiting===id)s.waiting=null;});
 if(!result.ok){lifecycleNotice=result.reason;update();return;}
 update();
}
document.addEventListener('click',e=>{const plot=e.target.closest('[data-plot]');if(plot&&s.waiting&&!e.target.closest('.plot-item'))placeOnPlot(s.waiting,e,plot);});
document.addEventListener('click',e=>{if(contextMenu&&!e.target.closest('.plot-context-menu')){contextMenu=null;root.querySelector('.plot-context-menu')?.remove();}});
document.addEventListener('pointerdown',e=>{
  const point=e.target.closest('[data-point]'),vertex=e.target.closest('[data-vertex]');
  if(point){
    const id=point.dataset.point,plot=point.closest('[data-plot]');
    startQuadrantPointDrag(e,{point,plot,waiting:root.querySelector('[data-waiting]'),onPlace:x=>placeOnPlot(id,x,plot),onReturn:()=>{openConfirmation('axisClear',id);},onSelect:()=>{s.selected=id;update();}});
  }
  if(vertex){
    if(e.button!==0||!e.isPrimary)return;
    const id=s.selected,dim=vertex.dataset.vertex,svg=vertex.closest('svg'),angle=Number(vertex.dataset.angle),dims=s.radar;
    const startX=e.clientX,startY=e.clientY,pointerId=e.pointerId;
    let dragging=false;
    radarSelectedDimension=dim;
    vertex.focus({preventScroll:true});
    const value=x=>{const p=svg.createSVGPoint();p.x=x.clientX;p.y=x.clientY;const q=p.matrixTransform(svg.getScreenCTM().inverse());return clamp((((q.x-150)*Math.cos(angle)+(q.y-150)*Math.sin(angle))/105)*2-1);};
    const paint=v=>{
      const radius=(v+1)*105/2;
      vertex.setAttribute('cx',String(150+Math.cos(angle)*radius));
      vertex.setAttribute('cy',String(150+Math.sin(angle)*radius));
      const visual=vertex.nextElementSibling;
      if(visual?.classList.contains('vertex')){visual.setAttribute('cx',vertex.getAttribute('cx'));visual.setAttribute('cy',vertex.getAttribute('cy'));}
      const polygon=svg.querySelector('.primary-poly');
      if(polygon)polygon.setAttribute('points',dims.map((d,i)=>{const a=-Math.PI/2+i*2*Math.PI/dims.length,n=d===dim?v:getValue(s,id,d),r=(n+1)*105/2;return `${150+Math.cos(a)*r},${150+Math.sin(a)*r}`;}).join(' '));
      const readout=document.querySelector(`[data-radar-value="${CSS.escape(dim)}"]`);
      if(readout)readout.textContent=fmt(v,s.dimensions.find(d=>d.id===dim))+(s.secondary&&s.secondary!==id?` · ${fmt(getValue(s,s.secondary,dim),s.dimensions.find(d=>d.id===dim))}`:'');
    };
    const cleanup=()=>{vertex.onpointermove=null;vertex.onpointerup=null;vertex.onpointercancel=null;vertex.classList.remove('dragging');if(vertex.hasPointerCapture?.(pointerId))vertex.releasePointerCapture(pointerId);};
    vertex.setPointerCapture(pointerId);
    vertex.onpointermove=x=>{if(x.pointerId!==pointerId||!x.buttons)return;if(!dragging&&Math.hypot(x.clientX-startX,x.clientY-startY)>5){dragging=true;vertex.classList.add('dragging');}if(dragging)paint(value(x));};
    vertex.onpointerup=x=>{if(x.pointerId!==pointerId)return;cleanup();if(dragging){setValue(s,id,dim,value(x));update();root.querySelector(`[data-vertex="${CSS.escape(dim)}"]`)?.focus({preventScroll:true});}};
    vertex.onpointercancel=x=>{if(x.pointerId===pointerId)cleanup();};
  }
});
function clearMatrixRowDrop(){root.querySelector('.matrix-row-insertion-indicator')?.classList.remove('is-visible');}
function matrixRowInsertionAt(event,row){
  if(!matrixRowDragId||!row)return null;
  const order=matrixEntities(s),from=order.findIndex(e=>e.id===matrixRowDragId),target=order.findIndex(e=>e.id===row.dataset.matrixRow);
  if(from<0||target<0)return null;
  const rect=row.getBoundingClientRect(),after=event.clientY>=rect.top+rect.height/2;
  const insertion=target+(after?1:0),to=insertion-(from<insertion?1:0);
  return to===from?null:{insertion,y:after?rect.bottom:rect.top};
}
function showMatrixRowInsertion(event,row){
  const point=matrixRowInsertionAt(event,row),wrap=row?.closest('.matrix-wrap'),indicator=wrap?.querySelector('.matrix-row-insertion-indicator');
  if(!point||!indicator){clearMatrixRowDrop();return null;}
  const rect=wrap.getBoundingClientRect(),left=Math.max(0,rect.left),right=Math.min(innerWidth,rect.right);
  indicator.style.left=`${left}px`;indicator.style.top=`${point.y}px`;
  indicator.style.width=`${Math.max(0,right-left)}px`;indicator.classList.add('is-visible');return point.insertion;
}
function moveMatrixRow(id,insertion){
  const wrap=root.querySelector('.matrix-wrap'),top=wrap?.scrollTop,left=wrap?.scrollLeft,pageX=window.scrollX,pageY=window.scrollY;
  if(!reorderMatrixRow(s,id,insertion))return false;
  update();
  const next=root.querySelector('.matrix-wrap');if(next){next.scrollTop=top;next.scrollLeft=left;}
  window.scrollTo(pageX,pageY);
  const handle=root.querySelector(`[data-matrix-row-handle="${CSS.escape(id)}"]`);
  handle?.focus({preventScroll:true});handle?.scrollIntoView({block:'nearest',inline:'nearest'});
  const index=matrixEntities(s).findIndex(e=>e.id===id),announcement=root.querySelector('.matrix-row-announcement');
  if(announcement)announcement.textContent=`${name(id)} moved to Matrix row ${index+1} of ${matrixEntities(s).length}.`;
  return true;
}
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&matrixRowDragId){matrixRowDragId=null;clearMatrixRowDrop();}
  if(!e.altKey||!['ArrowUp','ArrowDown'].includes(e.key)||!e.target.matches('[data-matrix-row-handle]'))return;
  e.preventDefault();const id=e.target.dataset.matrixRowHandle,order=matrixEntities(s),index=order.findIndex(x=>x.id===id),step=e.key==='ArrowUp'?-1:1;
  if(index>=0&&index+step>=0&&index+step<order.length)moveMatrixRow(id,index+(step>0?2:-1));
});
document.addEventListener('dragstart',e=>{
  const id=e.target.dataset.dragMatrixRow;if(!id)return;
  matrixRowDragId=id;e.dataTransfer.setData('matrix-row',id);e.dataTransfer.effectAllowed='move';
});
document.addEventListener('dragover',e=>{
  if(!matrixRowDragId)return;
  const row=e.target.closest('[data-matrix-row]');
  if(showMatrixRowInsertion(e,row)!==null){e.preventDefault();e.dataTransfer.dropEffect='move';}
});
document.addEventListener('drop',e=>{
  if(!matrixRowDragId)return;
  const id=matrixRowDragId,row=e.target.closest('[data-matrix-row]'),insertion=matrixRowInsertionAt(e,row)?.insertion;
  matrixRowDragId=null;clearMatrixRowDrop();
  if(insertion!==undefined&&e.dataTransfer.getData('matrix-row')===id){e.preventDefault();moveMatrixRow(id,insertion);}
});
document.addEventListener('dragend',()=>{matrixRowDragId=null;clearMatrixRowDrop();});
document.addEventListener('scroll',clearMatrixRowDrop,true);
addEventListener('resize',clearMatrixRowDrop);
// Visual feedback only; row/column payloads, insertion and commit paths stay separate.
function clearMatrixGripFeedback(){root.querySelectorAll('.matrix-grip.is-dragging').forEach(handle=>handle.classList.remove('is-dragging'));}
document.addEventListener('dragstart',e=>{e.target.closest('.matrix-grip')?.classList.add('is-dragging');});
document.addEventListener('dragend',clearMatrixGripFeedback);
document.addEventListener('drop',clearMatrixGripFeedback);
document.addEventListener('keydown',e=>{if(e.key==='Escape')clearMatrixGripFeedback();});
render();
addEventListener('resize',()=>{if(s.view==='Matrix')render();else if(s.view==='Quadrant')layoutPlotLabels(root,{animate:true});else if(s.view==='Radar')sizeRadarLabels(root);});

// Range and value-policy controls stay application-local. Older Dimensions
// without explicit bounds use the read-time legacy range without rewriting data.
function dimensionBounds(id){return dimensionRange(s.dimensions.find(d=>d.id===id));}
function buildDimensionFields(){
 const form=root.querySelector('#dimension-form');if(!form)return;
 const id=form.elements.namedItem('id').value,dimension=s.dimensions.find(d=>d.id===id),range=dimensionRange(dimension);
 const pair=document.createElement('div');pair.className='field-pair p2-range-fields';
 for(const [name,value,label] of [['dimension-min',dimensionDraft?.minInput??(dimension?(dimension.minInput??String(range.min)):''),'MIN'],['dimension-max',dimensionDraft?.maxInput??(dimension?(dimension.maxInput??String(range.max)):''),'MAX']]){
  const field=document.createElement('label');field.textContent=label;
  const input=document.createElement('input');input.name=name;input.type='number';input.inputMode='decimal';input.step='any';input.required=true;input.value=value;input.setAttribute('aria-describedby','p2-range-help');field.append(input);pair.append(field);
 }
 const help=document.createElement('small');help.id='p2-range-help';help.textContent='Enter finite decimal values with MIN < MAX. New Dimensions have no default. Explicit fractional digits (including trailing zeros) give a local random/display hint; the larger endpoint count is used. Without fractional digits, random uses a 2-place grid only. Direct entry is not constrained by either random scale. Generation/padding supports up to 100 places; unsafe grids are unavailable. A P1 Dimension without explicit bounds uses the legacy −1..+1 range.';
 const unitLabel=document.createElement('label');unitLabel.textContent='Unit (optional free text)';
 const unit=document.createElement('input');unit.name='dimension-unit';unit.type='text';unit.maxLength=240;unit.autocomplete='off';unit.placeholder='Symbol or descriptive phrase';unit.value=dimensionDraft?.unit??dimension?.unit??'';
 const unitHelp=document.createElement('small');unitHelp.textContent='Application-local input limit: 240 characters. No conversion or parsing.';unitLabel.append(unit,unitHelp);
 const integerLabel=document.createElement('label');integerLabel.className='dimension-integer-option';
 const integer=document.createElement('input');integer.name='dimension-integer-only';integer.type='checkbox';integer.checked=(dimensionDraft?.integerOnly??dimension?.integerOnly)===true;
 integerLabel.append(integer,document.createTextNode('Integer values only (this temporary Dimension)'));
 const integerHelp=document.createElement('small');integerHelp.textContent='Applies to all new value edits. Existing decimals are retained and marked until corrected; no automatic rounding.';
 const actions=form.querySelector('.actions');form.insertBefore(pair,actions);form.insertBefore(help,actions);form.insertBefore(unitLabel,actions);form.insertBefore(integerLabel,actions);form.insertBefore(integerHelp,actions);
 if(dimensionError){const error=document.createElement('p');error.className='field-error';error.setAttribute('role','alert');error.textContent=dimensionError;form.insertBefore(error,actions);}
}

renderDimensionList=function(){
 const q=dimensionQuery.toLowerCase();
 const matches=s.dimensions.filter(d=>[d.name,d.low,d.high,String(d.min??-1),String(d.max??1),String(d.unit||'')].some(x=>x.toLowerCase().includes(q)));
 document.querySelector('#dimension-list').innerHTML=matches.map(d=>{
  const range=dimensionRange(d),outside=Object.values(s.values).filter(values=>values&&values[d.id]!==undefined&&!acceptsDimensionValue(d,values[d.id])).length;
   return `<div class="list-row dimension-list-row"><span><strong>${esc(d.name)}</strong><small>${esc(endpointRangeText(d))}</small>${d.unit?`<small class="dimension-unit" title="Unit: ${esc(d.unit)}">Unit: ${esc(d.unit)}</small>`:''}${d.integerOnly===true?'<small>Integer values only</small>':''}${range.legacy?'<small>Legacy P1 range (−1..+1)</small>':''}${outside?`<small class="out-of-range-flag">${outside} stored ${outside===1?'value violates':'values violate'} range/value policy</small>`:''}${dimensionNeedsId(s,d,'pool')?`<small>ID ${esc(shortId(d.id))}</small>`:''}</span><button data-edit-dimension="${esc(d.id)}">Edit</button><button class="danger" data-delete-dimension="${esc(d.id)}">Delete</button></div>`;
 }).join('')||`<p>${s.dimensions.length?'No matching dimensions':'No dimensions yet'}</p>`;
};

commitNumeric=function(input){
 const [entity,dimensionId]=input.dataset.value.split('|'),dimension=s.dimensions.find(d=>d.id===dimensionId),error=numericError(input.value,input.validity.badInput,dimension);
 if(error){showNumericError(input,error);input.focus();return false;}
 showNumericError(input,null);
 if(input.dataset.dirty!=='true'){input.blur();return true;}
  if(!setValue(s,entity,dimensionId,input.value)){showNumericError(input,numericError(input.value,false,dimension));return false;}
  profileRandomNotice='';const matrixWrap=s.view==='Matrix'?input.closest('.matrix-wrap'):null,matrixScrollTop=matrixWrap?.scrollTop,pageX=window.scrollX,pageY=window.scrollY;
  update();
  if(matrixWrap){const nextWrap=root.querySelector('.matrix-wrap');if(nextWrap)nextWrap.scrollTop=matrixScrollTop;window.scrollTo(pageX,pageY);}
  return true;
};

// Direct numeric edits use the selected Dimension's range and preserve a
// rejected draft without changing the stored application-local value.
document.addEventListener('input',e=>{
 const input=e.target;
 if(input.matches('input[type=number][data-value]')){
  const dimension=s.dimensions.find(d=>d.id===input.dataset.value.split('|')[1]);input.dataset.dirty='true';
  showNumericError(input,numericError(input.value,input.validity.badInput,dimension));e.stopImmediatePropagation();return;
 }
 if(input.matches('input[type=range][data-value]')){
  e.stopImmediatePropagation();const [entity,dimension]=input.dataset.value.split('|');if(!setValue(s,entity,dimension,input.value))return;
  save(s);const card=input.closest('.dimension-card'),numeric=card?.querySelector('input[type=number]'),readout=card?.querySelector('.value-status');
  if(numeric){numeric.value=fmt(getValue(s,entity,dimension),s.dimensions.find(d=>d.id===dimension));numeric.title='Stored value '+getValue(s,entity,dimension);numeric.dataset.dirty='false';}
 if(readout)readout.textContent='Recorded assessment '+fmt(getValue(s,entity,dimension),s.dimensions.find(d=>d.id===dimension));e.stopImmediatePropagation();
 }
},true);

document.addEventListener('click',e=>{
 const button=e.target.closest('[data-random]');if(!button)return;
 e.preventDefault();e.stopImmediatePropagation();const card=button.dataset.random==='card',ids=card?s.dimensions.map(d=>d.id):[button.dataset.random];let count=0,skipped=0;
 for(const id of ids)if(!card||getValue(s,s.selected,id)===null){const value=randomDimensionValue(s.dimensions.find(d=>d.id===id));if(value===null){skipped++;continue;}if(setValue(s,s.selected,id,value))count++;}
 profileRandomNotice=skipped?(count?`Generated ${count} random value${count===1?'':'s'}; skipped ${skipped} Dimension${skipped===1?'':'s'} without a safely generated value under its integer/decimal-grid policy in range.`:'No safely generated value under its integer/decimal-grid policy is available in this range; no value changed.'):'';
 update();if(count){const current=[...root.querySelectorAll('[data-random]')].find(x=>x.dataset.random===button.dataset.random);current?.focus({preventScroll:true});if(current&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const face=current.querySelector('.dice-face');if(face){face.textContent='\u2682';face.classList.add('is-rolling');setTimeout(()=>{if(face.isConnected){face.textContent='\u2684';face.classList.remove('is-rolling');}},180);}}}
},true);

document.addEventListener('keydown',e=>{
 if(e.altKey||e.ctrlKey||e.metaKey||e.shiftKey)return;
 const vertex=e.target.closest?.('[data-vertex]');
 const point=s.view==='Quadrant'?e.target.closest?.('[data-point]'):null;
 if(!['ArrowUp','ArrowRight','ArrowDown','ArrowLeft'].includes(e.key)||(!vertex&&!point))return;
 e.preventDefault();e.stopImmediatePropagation();
 if(vertex){
  const dim=vertex.dataset.vertex,dimension=s.dimensions.find(d=>d.id===dim),direction=['ArrowUp','ArrowRight'].includes(e.key)?1:-1,current=getValue(s,s.selected,dim),range=dimensionBounds(dim),next=adjustAssessmentByKeyboard(dimension,current,direction);
  if(next===null){const guide=root.querySelector('.radar-chart>.small');if(guide){guide.textContent=`Value unchanged · this Dimension accepts ${dimension.integerOnly===true?'integers from ':''}${fmt(range.min)} to ${fmt(range.max)}. The recorded value remains in session data.`;localizeUi(guide,locale);}return;}
  if(!setValue(s,s.selected,dim,next)){const guide=root.querySelector('.radar-chart>.small');if(guide)guide.textContent=keyboardEditUnavailable(locale,name(s.selected),dimension.name);return;}
  radarSelectedDimension=dim;update();root.querySelector(`[data-vertex="${CSS.escape(dim)}"]`)?.focus();return;
 }
 const id=point.dataset.point,[xDimensionId,yDimensionId]=s.quadrant,adjustment=quadrantArrowAdjustment(e.key,xDimensionId,yDimensionId),dimension=s.dimensions.find(d=>d.id===adjustment?.dimensionId);
 if(!adjustment||!dimension)return;
 const current=getValue(s,id,adjustment.dimensionId),next=adjustAssessmentByKeyboard(dimension,current,adjustment.direction);
 if(next===null){const status=root.querySelector('[data-quadrant-keyboard-status]');if(status)status.textContent=rejectedKeyboardAdjustment(locale,name(id),adjustment.axis,dimension,current);return;}
 if(!setValue(s,id,adjustment.dimensionId,next)){const status=root.querySelector('[data-quadrant-keyboard-status]');if(status)status.textContent=keyboardEditUnavailable(locale,name(id),adjustment.axis);return;}
 const pageScroll=captureDocumentScroll();quadrantKeyboardEntity=id;
 update();const restoredPoint=root.querySelector(`[data-point="${CSS.escape(id)}"]`);restoredPoint?.focus({preventScroll:true});restoreDocumentScroll(pageScroll);if(restoredPoint)revealInDocument(restoredPoint);
},true);

document.addEventListener('pointerdown',e=>{
 const vertex=e.target.closest?.('[data-vertex]');if(!vertex)return;
 if(e.button!==0||!e.isPrimary)return;e.stopImmediatePropagation();
 const id=s.selected,dim=vertex.dataset.vertex,dimension=s.dimensions.find(d=>d.id===dim),svg=vertex.closest('svg'),angle=Number(vertex.dataset.angle),dims=s.radar,startX=e.clientX,startY=e.clientY,pointerId=e.pointerId;let dragging=false;
 radarSelectedDimension=dim;vertex.focus({preventScroll:true});
 const valueAtPointer=event=>{const point=svg.createSVGPoint();point.x=event.clientX;point.y=event.clientY;const q=point.matrixTransform(svg.getScreenCTM().inverse());return authoredValueAtPosition(dimension,radarPositionAtPoint(q.x,q.y,angle));};
 const paint=value=>{if(value===null)return;const radius=rangePosition(dimension,value)*105;vertex.setAttribute('cx',String(150+Math.cos(angle)*radius));vertex.setAttribute('cy',String(150+Math.sin(angle)*radius));const visual=vertex.nextElementSibling;if(visual?.classList.contains('vertex')){visual.setAttribute('cx',vertex.getAttribute('cx'));visual.setAttribute('cy',vertex.getAttribute('cy'));}const polygon=svg.querySelector('.primary-poly');if(polygon&&dims.every(d=>acceptsDimensionValue(s.dimensions.find(item=>item.id===d),d===dim?value:getValue(s,id,d))))polygon.setAttribute('points',dims.map((d,i)=>{const a=-Math.PI/2+i*2*Math.PI/dims.length,n=d===dim?value:getValue(s,id,d),r=rangePosition(s.dimensions.find(item=>item.id===d),n)*105;return `${150+Math.cos(a)*r},${150+Math.sin(a)*r}`;}).join(' '));const readout=root.querySelector(`[data-radar-value="${CSS.escape(dim)}"]`);if(readout)readout.textContent=`Primary ${fmt(value,dimension)}${dimension.unit?` · Unit: ${dimension.unit}`:''}${s.secondary&&s.secondary!==id?` · Secondary ${fmt(getValue(s,s.secondary,dim),s.dimensions.find(d=>d.id===dim))}`:''}`;};
 const cleanup=()=>{vertex.onpointermove=null;vertex.onpointerup=null;vertex.onpointercancel=null;vertex.classList.remove('dragging');if(vertex.hasPointerCapture?.(pointerId))vertex.releasePointerCapture(pointerId);};
 vertex.setPointerCapture(pointerId);
 vertex.onpointermove=event=>{if(event.pointerId!==pointerId||!event.buttons)return;if(!dragging&&Math.hypot(event.clientX-startX,event.clientY-startY)>5){dragging=true;vertex.classList.add('dragging');}if(dragging)paint(valueAtPointer(event));};
 vertex.onpointerup=event=>{if(event.pointerId!==pointerId)return;cleanup();if(dragging){const value=valueAtPointer(event);if(value!==null)setValue(s,id,dim,value);update();root.querySelector(`[data-vertex="${CSS.escape(dim)}"]`)?.focus({preventScroll:true});}};
 vertex.onpointercancel=event=>{if(event.pointerId===pointerId)cleanup();};
},true);

document.addEventListener('input',e=>{
 const form=e.target.closest?.('#dimension-form');if(!form)return;
 if(dimensionWarning){dimensionWarning=null;form.querySelector('.duplicate-warning')?.remove();}
 if(dimensionError){dimensionError=null;form.querySelector('[role=alert].field-error')?.remove();}
},true);
document.addEventListener('click',e=>{if(e.target.closest('[data-action="add-dimension"],[data-action="cancel-dimension-form"],[data-edit-dimension]')){dimensionWarning=null;dimensionDraft=null;dimensionError=null;}},true);

// Candidate successor shell. The accepted Prototype remains a separate historical
// source; this runtime consumes the portable Candidate and persists a distinct workspace.
let pendingEntityDraft=null;
const runtimeHeader=()=>`<button data-go-home>Home</button>`;
renderEntityList=function(){
 const q=(root.querySelector('#entity-search')?.value||'').toLocaleLowerCase();
 const rows=s.dataset.entities.map((entity,index)=>({entity,index})).filter(({entity,index})=>entity&&typeof entity==='object'&&[label(entity,index),String(entity.description||''),String(entity.id||'')].some(text=>text.toLocaleLowerCase().includes(q)));
 root.querySelector('#entity-list').innerHTML=rows.map(({entity:e,index:i})=>{
  const id=e.id||`inspection:entities:${i}`,eligibility=entityDeleteEligibility(s,id),expanded=entityMenu===id;
  return `<div class="list-row entity-row"><button class="entity-choice" data-choose-entity="${esc(id)}" ${s.view==='Quadrant'&&plottedEntities(s).some(item=>item.id===id)?'disabled':''}><span class="entity-row-title"><strong>${esc(label(e,i))}</strong><small class="temp-badge">Dataset</small></span>${e.description?`<small>${esc(e.description)}</small>`:''}${entityNeedsId(s,e,'pool')?`<small>ID ${esc(e.id)}</small>`:''}<small>${s.selected===id?'Selected':''}</small></button><button class="entity-more" data-entity-menu="${esc(id)}" aria-label="Actions for ${esc(label(e,i))}" aria-expanded="${expanded}">⋯</button>${expanded?`<div class="entity-actions"><button data-edit-entity="${esc(id)}" ${s.readOnly?'disabled':''}>Edit Entity</button><button class="danger" data-delete-entity="${esc(id)}" ${s.readOnly?'disabled':''}>Delete</button>${entityDeleteNotice?.id===id?`<small role="status">${esc(entityDeleteNotice.reason)}</small>`:''}</div>`:''}</div>`;
 }).join('')||'<p>No matching Dataset Entities.</p>';localizeUi(root.querySelector('#entity-list'),locale);
};
renderDimensionList=function(){
 const q=dimensionQuery.toLocaleLowerCase(),allowed=candidateAuthoringAvailable(s);
 root.querySelector('#dimension-list').innerHTML=s.dimensions.filter(d=>[d.name,d.low,d.high,String(d.min),String(d.max),String(d.unit||''),String(d.description||'')].some(text=>text.toLocaleLowerCase().includes(q))).map(d=>`<div class="list-row dimension-list-row"><span><strong>${esc(d.name)}</strong><small>${esc(endpointRangeText(d))}</small>${d.description?`<small class="dimension-description">${esc(d.description)}</small>`:''}${d.unit!==undefined?`<small class="dimension-unit">${esc(d.unit)}</small>`:''}${d.integerOnly===true?'<small>Integer values only</small>':''}${dimensionNeedsId(s,d,'pool')?`<small>ID ${esc(shortId(d.id))}</small>`:''}</span><button data-edit-dimension="${esc(d.id)}" ${allowed?'':'disabled'}>Edit</button><button class="danger" data-delete-dimension="${esc(d.id)}" ${allowed?'':'disabled'}>Delete</button></div>`).join('')||`<p>${s.dimensions.length?'No matching Dimensions':'No Dimensions yet.'}</p>`;localizeUi(root.querySelector('#dimension-list'),locale);
};
function localEntityName(id){const index=s.dataset.entities.findIndex(entity=>entity?.id===id);return index<0?'Entity':label(s.dataset.entities[index],index);}
function diagnosticMarkup(){
 const diagnostics=s.validation?.diagnostics||[];if(!diagnostics.length&&!s.candidateUnsupported)return '';
 const severity=s.readOnly?'error':'warning',title=s.readOnly?'Diagnostic read-only inspection':'Validator warnings';
 return `<section class="validator-status ${severity}" aria-label="${title}"><strong>${title}</strong><p>${s.readOnly?'This Dataset has Validator errors. Authoring and E2R export are unavailable. No repair or normalization was applied.':'Warnings do not by themselves block supported authoring or export. Unsupported content is preserved; operations that cannot be checked safely are unavailable.'}</p><ul>${diagnostics.map(item=>`<li><code>${esc(item.code)}</code> · ${esc(item.path||'/')} · ${esc(item.severity)}</li>`).join('')}</ul>${s.candidateUnsupported?'<p>Dimension Assessment version is unsupported here; its payload remains opaque and unchanged.</p>':''}</section>`;
}
function relationBlockerMarkup(){
 if(!entityDeleteNotice)return '';
 const relations=entityDeleteNotice.relations||[];
 const detail=relations.length?`<ul>${relations.map(relation=>`<li><strong>${esc(relation.name||relation.type||'Relation')}</strong> · ID ${esc(relation.id||'missing ID')} · ${esc(relation.sourceId||'unknown source')} → ${esc(relation.targetId||'unknown target')}</li>`).join('')}</ul><p>Resolve these Relations in a Relation-owning application before deleting the Entity. ParameterPlotter does not delete or edit Relations.</p>`:`<p>${esc(entityDeleteNotice.reason)}</p>`;
 return `<div class="confirm-scrim" data-close-entity-delete-notice><section class="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="entity-block-title"><h2 id="entity-block-title">Entity deletion unavailable</h2><p>${esc(entityDeleteNotice.reason)}</p>${detail}<div class="actions"><button data-close-entity-delete-notice>Close</button></div></section></div>`;
}
function rescaleMarkup(){
 if(!rescaleProposal)return '';
 const rows=Object.entries(rescaleProposal.values).map(([entityId,value])=>`<li>${esc(localEntityName(entityId))}: ${fmt(getValue(s,entityId,rescaleProposal.dimension.id))} \u2192 ${fmt(value,rescaleProposal.dimension)}</li>`).join('');
 return `<div class="confirm-scrim is-backdrop-dismissible" data-cancel-rescale><section class="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="rescale-title"><h2 id="rescale-title">Review Assessment rescale</h2><p>Changing these bounds makes existing Assessments invalid. Review this linear rescale; nothing changes in the Dataset until you approve it.</p><ul>${rows}</ul><div class="actions"><button data-cancel-rescale>Back to Dimension edit</button><button class="primary" data-approve-rescale>Apply reviewed rescale</button></div></section></div>`;
}
function currentReplacementMarkup(){return replacement?replacementMarkup(replacement):'';}
function renderHome(){
 const notice=s.persistence.status==='degraded'?s.persistence.message:'';
 root.innerHTML=homeMarkup({canContinue:s.workspaceCreated&&s.persistence.status==='saved',notice,sampleError:homeError})+footerMarkup()+(creditsOpen?creditsMarkup():'')+currentReplacementMarkup();
 document.title='ParameterPlotter';
 root.className='app-frame home-page';
 root.querySelectorAll('header,main,footer').forEach(element=>element.inert=Boolean(replacement));
 if(creditsOpen)root.querySelectorAll('header,main,footer').forEach(element=>element.inert=true);
 if(creditsOpen)root.querySelector('[data-close-credits]')?.focus();
 if(replacement)root.querySelector('[data-cancel-replacement]')?.focus();
}
const baseRender=render;
render=function(){
 if(surface==='home'){renderHome();return;}
 baseRender();
 root.insertAdjacentHTML('beforeend',footerMarkup()+(creditsOpen?creditsMarkup():''));
 root.className='app-frame workspace-page';
 root.querySelector(':scope > header')?.classList.add('app-header');
 root.querySelector(':scope > header h1')?.classList.add('app-brand');
 const brand=root.querySelector(':scope > header h1.app-brand');if(brand)brand.innerHTML='<a href="#home" data-go-home>ParameterPlotter</a>';
 root.querySelector(':scope > header .header-actions')?.classList.add('shell-header-actions');
 root.querySelectorAll(':scope > header .eyebrow, :scope > header .sub')?.forEach(element=>element.hidden=true);
 root.querySelectorAll('header,main,footer').forEach(element=>element.inert=Boolean(creditsOpen));
 if(creditsOpen)root.querySelector('[data-close-credits]')?.focus();
 document.title='ParameterPlotter';
 const eyebrow=root.querySelector('header .eyebrow');if(eyebrow)eyebrow.textContent='E2R | SINGLE-USER DATASET COMPARISON';
 const subtitle=root.querySelector('header .sub');if(subtitle)subtitle.textContent='Author E2R Entities and Dimension Assessments. Browser-local persistence is separate from E2R Dataset Export.';
 const actions=root.querySelector('.header-actions');if(actions)actions.innerHTML=runtimeHeader();
 const main=root.querySelector(':scope > main'),toolbar=document.createElement('nav');toolbar.className='workspace-action-bar';toolbar.setAttribute('aria-label','Workspace actions');toolbar.innerHTML=workspaceActionsMarkup({readOnly:s.readOnly,authoringUnavailable:s.readOnly||s.candidateUnsupported});
 const topline=root.querySelector('.topline');if(topline){const assessmentCount=s.dimensions.reduce((count,dimension)=>count+Object.values(s.values).filter(values=>typeof values?.[dimension.id]==='number').length,0);topline.innerHTML=`<div class="dataset-context"><span>${s.dataset.entities.length} Dataset ${s.dataset.entities.length===1?'Entity':'Entities'} · ${s.dimensions.length} Dimension${s.dimensions.length===1?'':'s'} · ${assessmentCount} Assessment${assessmentCount===1?'':'s'}</span></div><span>Dataset: ${s.datasetModified?'Changes not exported':'Matches last Export baseline'} · Browser workspace: ${s.persistence.status==='saved'?'Saved locally':'Degraded / unsaved'}</span>`;}
 const title=s.dataset.extensions?.metadata?.title??'',editor=document.createElement('form');editor.className='dataset-title-editor';editor.innerHTML=`<label for="dataset-title-input">Dataset title</label><div class="dataset-title-editor-controls"><input id="dataset-title-input" name="dataset-title" type="text" value="${esc(datasetTitleDraft??title)}" ${s.readOnly?'disabled':''}><button type="submit" ${s.readOnly||(datasetTitleDraft??title)===title?'disabled':''}>Apply</button></div>`;
 let status=root.querySelector('.successor-status');if(!status){status=document.createElement('section');status.className='successor-status';}
 if(status)status.innerHTML=`<div class="persistence-status" role="status"><strong>${s.persistence.status==='saved'?'Workspace saved in this browser':'Browser-local workspace degraded / unsaved'}</strong>${s.persistence.message?`<p>${esc(s.persistence.message)}</p>`:'<p>To save an E2R Dataset file, use Export E2R JSON.</p>'}</div><p class="pending-draft-status" role="status"${s.pendingDraft?'':' hidden'}>Unapplied authoring changes are not in the saved browser workspace. Apply or cancel this draft before leaving.</p>${lifecycleNotice?`<p class="lifecycle-notice" role="status">${esc(lifecycleNotice)}</p>`:''}${diagnosticMarkup()}`;
 main?.prepend(editor,toolbar,status);
 const entityDrawer=root.querySelector('.drawer[aria-label="Entity Pool"]');if(entityDrawer){const p=entityDrawer.querySelector(':scope > p');if(p)p.textContent='Entities are edited directly in this Dataset. Dimensions and values are saved in the Dataset and included in exports.';const action=entityDrawer.querySelector('.pool-action button');if(action){action.textContent='Add Entity';action.disabled=s.readOnly;action.dataset.action='add-entity';}}
 const entityForm=root.querySelector('#entity-form');if(entityForm){const heading=entityForm.querySelector('h3');if(heading)heading.textContent=editEntityId?'Edit Entity':'New Entity';const nameInput=entityForm.elements.namedItem('temporary-entity-name'),description=entityForm.elements.namedItem('temporary-entity-description'),entity=s.dataset.entities.find(item=>item?.id===editEntityId);nameInput.name='dataset-entity-name';nameInput.removeAttribute('required');nameInput.removeAttribute('maxlength');nameInput.placeholder='Optional Entity name';description.name='dataset-entity-description';nameInput.value=pendingEntityDraft?.editId===editEntityId?pendingEntityDraft.name:(entity?.name??'');description.value=pendingEntityDraft?.editId===editEntityId?pendingEntityDraft.description:(entity?.description??'');const nameLabel=nameInput.closest('label'),descriptionLabel=description.closest('label');if(nameLabel)nameLabel.firstChild.textContent='Name (optional)';if(descriptionLabel)descriptionLabel.firstChild.textContent='Description (optional)';if(entityFormError){const error=document.createElement('p');error.className='field-error';error.setAttribute('role','alert');error.textContent=entityFormError;entityForm.insertBefore(error,entityForm.querySelector('.actions'));}}
 const dimensionDrawer=root.querySelector('.dimension-drawer');if(dimensionDrawer){const h2=dimensionDrawer.querySelector('h2');if(h2)h2.textContent='Dimension Pool';const add=dimensionDrawer.querySelector('[data-action="add-dimension"]');if(add)add.disabled=!candidateAuthoringAvailable(s);const search=root.querySelector('#dimension-search');if(search)search.placeholder='Filter by name, labels, range, or unit';}
 const payload=s.dataset.extensions?.['draft.github.sukoyaka-dopeness.dimension-assessment'];
 if(dimensionDrawer&&payload?.specVersion==='0.1.0')dimensionDrawer.querySelector('.pool-action')?.insertAdjacentHTML('afterend',`<section class="candidate-upgrade"><p>Upgrade to Candidate 0.2.0 to add optional Dimension descriptions. Existing Dimensions and Assessments will be preserved.</p><button type="button" data-upgrade-candidate>Upgrade to 0.2.0</button></section>`);
 buildDimensionFields();
 const form=root.querySelector('#dimension-form');if(form){const heading=form.querySelector('h3');if(heading)heading.textContent=s.editDimension?'Edit Dimension':'New Dimension';for(const name of ['dimension-low','dimension-high']){const input=form.elements.namedItem(name);if(input){input.removeAttribute('required');input.disabled=!form.elements.namedItem('dimension-labels-enabled')?.checked;}}const labelToggle=form.elements.namedItem('dimension-labels-enabled');if(labelToggle)labelToggle.checked=Boolean(dimensionDraft?.endpointLabelsPresent??s.dimensions.find(d=>d.id===s.editDimension)?.endpointLabelsPresent);const unitToggle=form.elements.namedItem('dimension-unit-enabled');if(unitToggle)unitToggle.checked=Boolean(dimensionDraft?.unitPresent??s.dimensions.find(d=>d.id===s.editDimension)?.unitPresent);const unit=form.elements.namedItem('dimension-unit');if(unit)unit.disabled=!unitToggle?.checked;const current=dimensionDraft||s.dimensions.find(d=>d.id===s.editDimension);if(current){form.elements.namedItem('dimension-name').value=current.name;form.elements.namedItem('dimension-low').value=current.low;form.elements.namedItem('dimension-high').value=current.high;form.elements.namedItem('dimension-min').value=current.minInput??String(current.min);form.elements.namedItem('dimension-max').value=current.maxInput??String(current.max);form.elements.namedItem('dimension-unit').value=current.unit??'';form.elements.namedItem('dimension-integer-only').checked=current.integerOnly===true;}const description=form.elements.namedItem('dimension-description');if(description)description.value=dimensionDraft?.description??current?.description??'';}
 root.querySelectorAll('.confirm-scrim[data-replacement-scrim],.confirm-scrim[data-close-entity-delete-notice],.confirm-scrim[data-cancel-rescale]').forEach(node=>node.remove());
 if(replacement)root.insertAdjacentHTML('beforeend',currentReplacementMarkup());
 if(entityDeleteNotice)root.insertAdjacentHTML('beforeend',relationBlockerMarkup());
 if(rescaleProposal)root.insertAdjacentHTML('beforeend',rescaleMarkup());
 if(candidateUpgradeConfirmation)root.insertAdjacentHTML('beforeend',`<div class="confirm-scrim" data-upgrade-scrim><section class="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="candidate-upgrade-title"><h2 id="candidate-upgrade-title">Upgrade Dimension Assessment?</h2><p>Upgrade this Dataset's Dimension Assessment payload from 0.1.0 to 0.2.0. Existing Dimensions, Assessments, IDs, values, and other Dataset content will be preserved. No descriptions will be generated.</p><div class="actions"><button type="button" data-cancel-candidate-upgrade>Cancel</button><button class="primary" type="button" data-confirm-candidate-upgrade>Upgrade to 0.2.0</button></div></section></div>`);
 if(confirmation?.kind==='axisClear'){root.querySelector('.confirm-scrim:not([data-cancel-replacement])')?.remove();root.insertAdjacentHTML('beforeend',`<div class="confirm-scrim" data-cancel-confirmation><section class="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="axis-clear-title"><h2 id="axis-clear-title">Clear plotted Assessments?</h2><p>This removes ${s.quadrant.filter(Boolean).length} selected X/Y Assessment record${s.quadrant.filter(Boolean).length===1?'':'s'} for ${esc(localEntityName(confirmation.id))} from the Dataset. It does not delete the Entity or Relations.</p><div class="actions"><button data-cancel-confirmation>Cancel</button><button class="danger solid" data-confirm-delete>Clear Assessments</button></div></section></div>`);}
 if(confirmation||replacement||entityDeleteNotice||rescaleProposal)root.querySelector('.confirm-dialog button:not([disabled])')?.focus();
 if(candidateUpgradeConfirmation){root.querySelectorAll('header,main,footer,.drawer,.drawer-backdrop').forEach(element=>element.inert=true);root.querySelector('[data-cancel-candidate-upgrade]')?.focus();}
 if(contextMenu)placePlotContextMenuAfterTrigger(root,contextMenu);
};

function showFileError(message){if(surface==='home'){homeError=message;fileError='';}else fileError=message;lifecycleNotice='';render();}
function downloadJson(filename,value){
 try{const blob=new Blob([JSON.stringify(value,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),anchor=document.createElement('a');anchor.href=url;anchor.download=filename;anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);return true;}catch(error){lifecycleNotice=`Download could not be handed off: ${error?.message||'browser download unavailable'}`;render();return false;}
}
function startReplacement(kind,incoming){const homeFocus={ 'new-dataset':'new','sample-dataset':'sample','dataset':'open' };replacement={kind,state:incoming,returnSurface:surface,returnFocus:surface==='home'?homeFocus[kind]:null};render();root.querySelector('[data-cancel-replacement]')?.focus();}
function cancelReplacement(){const request=replacement;replacement=null;surface=request?.returnSurface||'workspace';render();if(surface==='home'&&request?.returnFocus)root.querySelector(`[data-home-action="${request.returnFocus}"]`)?.focus();else if(surface==='workspace')root.querySelector('.workspace-more-trigger')?.focus();}
function receiveDataset(kind,dataset){
 const incoming=fresh(readDataset(dataset),{ui:{workspaceCreated:true}});
 if(hasLossSensitiveWork(s))startReplacement(kind,incoming);
 else{replacement={kind,state:incoming,returnSurface:surface};activateIncoming();}
}
function activateIncoming(){
 if(!replacement)return;
 const request=replacement;replacement=null;surface='workspace';s=request.state;s.workspaceCreated=true;fileError='';homeError='';matrixError='';entityMenu=null;confirmation=null;entityDeleteNotice=null;rescaleProposal=null;pendingEntityDraft=null;dimensionDraft=null;datasetTitleDraft=null;s.pendingDraft=false;
 save(s);
 lifecycleNotice=s.persistence.status==='degraded'?'The Dataset was opened in memory, but the browser-local copy was not replaced. It remains unsaved and may be lost on reload or browser close.':'';
 render();
 const heading=root.querySelector('header h1');if(heading){heading.tabIndex=-1;heading.focus();}
}
function importSelectedFile(file){
 closeWorkspaceMore();
 if(!file)return;
 (async()=>{try{receiveDataset('dataset',JSON.parse(await file.text()));}catch(error){homeError=error?.message||'The selected file could not be opened.';showFileError(homeError);}})();
}
async function openAshenCrownSample(){
 homeError='';
 try{const response=await fetch('./samples/ashen-crown.en.e2r.json');if(!response.ok)throw Error(`The sample Dataset could not be loaded (${response.status}).`);receiveDataset('sample-dataset',await response.json());}
 catch(error){homeError=error?.message||'The sample Dataset could not be opened.';render();}
}
function exportCurrentDataset(){
 if(s.readOnly){lifecycleNotice='E2R Dataset Export is unavailable during diagnostic read-only inspection.';render();return;}
 const dataset=datasetForWorkspace(s),validation=validateDataset(dataset);s.validation=validation;
 if(!validation.valid){s.readOnly=true;lifecycleNotice='Export blocked: Validator errors remain. No repair or normalization was applied.';render();return;}
 if(!downloadJson('parameterplotter-dataset.e2r.json',dataset))return;
 exportBaseline(s);save(s);lifecycleNotice='E2R JSON download was handed to the browser. This Dataset snapshot is now the clean Export baseline; keep the downloaded file yourself. Browser-local persistence is unchanged.';render();
}
function relationDeletionFeedback(id){
 const result=entityDeleteEligibility(s,id);if(!result.allowed){entityDeleteNotice={id,reason:result.reason,relations:result.relations||[]};render();root.querySelector('.confirm-dialog button')?.focus();return;}
 openConfirmation('entity',id);
}
function clearLifecycleNotice(){
  if(!lifecycleNotice)return;
  lifecycleNotice='';
  root.querySelector('.lifecycle-notice')?.remove();
}
function closeWorkspaceMore({restoreFocus=false}={}){const menu=root.querySelector('.workspace-more');if(!menu?.open)return;menu.open=false;if(restoreFocus)menu.querySelector('summary')?.focus();}
function openDatasetFilePicker(){closeWorkspaceMore({restoreFocus:true});root.querySelector('#dataset-file')?.click();}
function captureSuccessorClick(event){
 if(localeConflict&&event.target.matches('[data-locale-backdrop]')){event.preventDefault();event.stopImmediatePropagation();localeConflict=false;chooseTemporaryLocale(window.sessionStorage,localeRequest.locale,locale);render();return;}
 const localeTarget=event.target.closest('[data-select-locale],[data-resolve-locale]');
 if(localeTarget?.dataset.selectLocale){event.preventDefault();event.stopImmediatePropagation();locale=localeTarget.dataset.selectLocale;localeConflict=false;chooseSavedLocale(window.localStorage,locale,window.sessionStorage);window.history.replaceState(window.history.state,'',window.location.pathname+window.location.search+localeFragment(window.location.hash,locale));render();return;}
 if(localeTarget?.dataset.resolveLocale){event.preventDefault();event.stopImmediatePropagation();locale=localeTarget.dataset.resolveLocale==='requested'?localeRequest.locale:savedLocale;localeConflict=false;chooseTemporaryLocale(window.sessionStorage,localeRequest.locale,locale);render();return;}
 if(localeConflict){event.preventDefault();event.stopImmediatePropagation();return;}
 if(creditsOpen){
  if(event.target.closest('[data-close-credits]')||event.target.matches('[data-credits-backdrop]')){event.preventDefault();event.stopImmediatePropagation();creditsOpen=false;render();root.querySelector('.credits-button')?.focus();}
  return;
 }
 const target=event.target.closest('button,[data-action],[data-go-home],label');if(!target&&!(rescaleProposal&&event.target.matches('.confirm-scrim[data-cancel-rescale]'))&&!(candidateUpgradeConfirmation&&event.target.matches('[data-upgrade-scrim]')))return;
 if(target?.closest('[data-upgrade-candidate]')){event.preventDefault();event.stopImmediatePropagation();candidateUpgradeConfirmation=true;render();root.querySelector('[data-cancel-candidate-upgrade]')?.focus();return;}
 if(candidateUpgradeConfirmation){if(target?.closest('[data-cancel-candidate-upgrade]')||event.target.matches('[data-upgrade-scrim]')){event.preventDefault();event.stopImmediatePropagation();candidateUpgradeConfirmation=false;render();root.querySelector('[data-upgrade-candidate]')?.focus();return;}if(target?.closest('[data-confirm-candidate-upgrade]')){event.preventDefault();event.stopImmediatePropagation();const result=upgradeDimensionAssessment(s);candidateUpgradeConfirmation=false;lifecycleNotice=result.ok?'Dimension Assessment upgraded to Candidate 0.2.0. Existing Dataset values were preserved.':result.reason;update();return;}event.preventDefault();event.stopImmediatePropagation();return;}
 if(target?.closest('[data-open-credits]')){event.preventDefault();event.stopImmediatePropagation();creditsOpen=true;render();root.querySelector('[data-close-credits]')?.focus();return;}
 clearLifecycleNotice();
  if(replacement){if(target?.closest('[data-cancel-replacement]')){event.preventDefault();event.stopImmediatePropagation();cancelReplacement();return;}if(target?.closest('[data-confirm-replacement]')){event.preventDefault();event.stopImmediatePropagation();activateIncoming();return;}return;}
 if(surface==='home'){
  const action=target?.dataset.homeAction;
  if(action){event.preventDefault();event.stopImmediatePropagation();if(action==='continue'){surface='workspace';render();const heading=root.querySelector('header h1');if(heading){heading.tabIndex=-1;heading.focus();}}else if(action==='new')receiveDataset('new-dataset',{version:'1.0',entities:[],events:[],relations:[]});else if(action==='open')openDatasetFilePicker();else if(action==='sample')openAshenCrownSample();}
  return;
 }
  if(target.closest('[data-go-home]')){event.preventDefault();event.stopImmediatePropagation();surface='home';homeError='';render();root.querySelector('[data-home-action="continue"]')?.focus();return;}
 if(entityDeleteNotice&&target.closest('[data-close-entity-delete-notice]')){event.preventDefault();event.stopImmediatePropagation();entityDeleteNotice=null;render();return;}
 if(rescaleProposal){const action=rescaleActionFor(target,event.target);if(action==='approve'){event.preventDefault();event.stopImmediatePropagation();const proposal=rescaleProposal;rescaleProposal=null;const result=applyDimensionAndRescale(s,proposal.dimension,proposal.values);if(!result.ok)dimensionError=result.reason;else{s.dimensionFormOpen=false;s.editDimension=null;dimensionDraft=null;s.pendingDraft=false;}update();return;}if(action==='cancel'){event.preventDefault();event.stopImmediatePropagation();rescaleProposal=null;render();root.querySelector('#dimension-form [name="dimension-name"]')?.focus();return;}return;}
  if(target.closest('[data-successor-export-dataset]')){event.preventDefault();event.stopImmediatePropagation();closeWorkspaceMore();exportCurrentDataset();return;}
  if(target.closest('[data-import-trigger]')){event.preventDefault();event.stopImmediatePropagation();openDatasetFilePicker();return;}
 if(target.closest('[data-edit-entity]')){event.preventDefault();event.stopImmediatePropagation();const id=target.closest('[data-edit-entity]').dataset.editEntity;entityFormError=null;editEntityId=id;entityMenu=null;s.entityFormOpen=true;pendingEntityDraft={editId:id,name:s.dataset.entities.find(item=>item?.id===id)?.name??'',description:s.dataset.entities.find(item=>item?.id===id)?.description??''};render();root.querySelector('#entity-form [name="dataset-entity-name"]')?.focus();return;}
 if(target.closest('[data-delete-entity]')){event.preventDefault();event.stopImmediatePropagation();relationDeletionFeedback(target.closest('[data-delete-entity]').dataset.deleteEntity);return;}
 if(target.closest('[data-edit-dimension]')){event.preventDefault();event.stopImmediatePropagation();dimensionDraft=null;dimensionError=null;dimensionWarning=null;s.editDimension=target.closest('[data-edit-dimension]').dataset.editDimension;s.dimensionFormOpen=true;render();root.querySelector('#dimension-form [name="dimension-name"]')?.focus();return;}
 if(target.closest('[data-delete-dimension]')){event.preventDefault();event.stopImmediatePropagation();const id=target.closest('[data-delete-dimension]').dataset.deleteDimension;if(candidateAuthoringAvailable(s))openConfirmation('dimension',id);return;}
 if(target.dataset.action==='add-entity'){event.preventDefault();event.stopImmediatePropagation();entityFormError=null;editEntityId=null;s.entityFormOpen=true;entityMenu=null;pendingEntityDraft={editId:null,name:'',description:''};render();root.querySelector('#entity-form [name="dataset-entity-name"]')?.focus();return;}
 if(target.dataset.action==='cancel-entity-form'){event.preventDefault();event.stopImmediatePropagation();entityFormError=null;s.entityFormOpen=false;editEntityId=null;pendingEntityDraft=null;s.pendingDraft=false;render();return;}
 if(target.dataset.action==='add-dimension'){event.preventDefault();event.stopImmediatePropagation();if(!candidateAuthoringAvailable(s))return;dimensionQuery='';dimensionDraft=null;dimensionError=null;s.editDimension=null;s.dimensionFormOpen=true;render();root.querySelector('#dimension-form [name="dimension-name"]')?.focus();return;}
 if(target.dataset.action==='cancel-dimension-form'){event.preventDefault();event.stopImmediatePropagation();dimensionDraft=null;dimensionError=null;s.pendingDraft=false;s.dimensionFormOpen=false;s.editDimension=null;render();return;}
 if(target.dataset.action==='clear-axis-assessments'){event.preventDefault();event.stopImmediatePropagation();openConfirmation('axisClear',target.dataset.entity);return;}
 if(target.matches('[data-cancel-confirmation]')){event.preventDefault();event.stopImmediatePropagation();cancelConfirmation();return;}
 if(target.hasAttribute('data-confirm-delete')&&confirmation){event.preventDefault();event.stopImmediatePropagation();const request=confirmation;confirmation=null;
   if(request.kind==='dimension'){
     const result=deleteDatasetDimension(s,request.id);
     if(result.ok)lifecycleNotice='Dimension and its dependent Assessments were removed in one Dataset change.';
     else dimensionError=result.reason;
   }else if(request.kind==='entity'){const result=deleteDatasetEntity(s,request.id);if(!result.ok)entityDeleteNotice={id:request.id,...result};}
   else if(request.kind==='axisClear'){
     const result=transactDatasetMutation(s,()=>{for(const dimensionId of s.quadrant)if(dimensionId&&s.values[request.id])delete s.values[request.id][dimensionId];if(s.values[request.id]&&!Object.keys(s.values[request.id]).length)delete s.values[request.id];});
     if(!result.ok)lifecycleNotice=result.reason;
   }
   update();return;
 }
 if(target.dataset.contextAction==='waiting'){event.preventDefault();event.stopImmediatePropagation();const id=contextMenu?.id;contextMenu=null;openConfirmation('axisClear',id);return;}
 if(target.dataset.action==='return-waiting'){event.preventDefault();event.stopImmediatePropagation();openConfirmation('axisClear',target.dataset.entity);return;}
}
document.addEventListener('click',captureSuccessorClick,true);
document.addEventListener('keydown',event=>{
 if(!candidateUpgradeConfirmation)return;
 if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();candidateUpgradeConfirmation=false;render();root.querySelector('[data-upgrade-candidate]')?.focus();return;}
 if(event.key==='Tab'){event.stopImmediatePropagation();trapDialogTab(event,'[data-upgrade-scrim] .confirm-dialog');return;}
 event.stopImmediatePropagation();
},true);
document.addEventListener('keydown',event=>{
 if(localeConflict){if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();localeConflict=false;chooseTemporaryLocale(window.sessionStorage,localeRequest.locale,locale);render();return;}if(event.key==='Tab'){event.stopImmediatePropagation();trapDialogTab(event,'.locale-conflict-scrim .confirm-dialog');return;}event.stopImmediatePropagation();return;}
 if(!creditsOpen)return;
 event.stopImmediatePropagation();
 if(event.key==='Escape'){
  event.preventDefault();creditsOpen=false;render();root.querySelector('.credits-button')?.focus();return;
 }
 if(event.key!=='Tab')return;
 const dialog=root.querySelector('.credits-dialog');
 const items=[...root.querySelectorAll('.credits-dialog a[href],.credits-dialog button:not([disabled])')];
 if(!items.length){event.preventDefault();dialog?.focus();return;}
 const first=items[0],last=items.at(-1);
 if(event.shiftKey&&(document.activeElement===first||!dialog?.contains(document.activeElement))){event.preventDefault();last.focus();}
 else if(!event.shiftKey&&(document.activeElement===last||!dialog?.contains(document.activeElement))){event.preventDefault();first.focus();}
},true);
document.addEventListener('click',event=>{const menu=root.querySelector('.workspace-more');if(menu?.open&&!menu.contains(event.target))menu.open=false;});
document.addEventListener('keydown',event=>{if(event.key!=='Escape')return;const menu=root.querySelector('.workspace-more');if(menu?.open){event.preventDefault();menu.open=false;menu.querySelector('summary')?.focus();}});
document.addEventListener('submit',event=>{
 const form=event.target,formId=formAttributeId(form);if(form.classList.contains('dataset-title-editor')){event.preventDefault();event.stopImmediatePropagation();const draft=form.elements.namedItem('dataset-title').value,title=draft.trim();const result=transactDatasetMutation(s,()=>applyDatasetTitle(s.dataset,title));if(result.ok){datasetTitleDraft=null;s.pendingDraft=false;lifecycleNotice='Dataset title applied. E2R JSON Export is a separate step.';update();}else{datasetTitleDraft=draft;lifecycleNotice=result.reason;render();root.querySelector('#dataset-title-input')?.focus();}return;}if(formId==='entity-form'){
   event.preventDefault();event.stopImmediatePropagation();const name=form.elements.namedItem('dataset-entity-name').value,description=form.elements.namedItem('dataset-entity-description').value;
   const result=editEntityId?editDatasetEntity(s,editEntityId,{name,description}):createDatasetEntity(s,{name,description});
   if(!result.ok){entityFormError=result.reason;render();root.querySelector('#entity-form [name="dataset-entity-name"]')?.focus();return;}
   entityFormError=null;s.entityFormOpen=false;editEntityId=null;pendingEntityDraft=null;s.pendingDraft=false;entityMenu=null;lifecycleNotice='Dataset Entity change applied. It is part of the Dataset and is not exported until E2R JSON Export.';update();return;
 }
 if(formId!=='dimension-form')return;
 event.preventDefault();event.stopImmediatePropagation();if(!candidateAuthoringAvailable(s))return;
 const field=name=>form.elements.namedItem(name),min=parseFiniteDecimal(field('dimension-min').value,field('dimension-min').validity.badInput),max=parseFiniteDecimal(field('dimension-max').value,field('dimension-max').validity.badInput);
 const previous=s.dimensions.find(item=>item.id===field('id').value),enabled=field('dimension-labels-enabled').checked,unitPresent=field('dimension-unit-enabled').checked,integer=field('dimension-integer-only').checked;
 const descriptionField=field('dimension-description'),description=descriptionField?.value??'';
 if(description!==''&&!/\S/u.test(description)){dimensionError='Enter a description with at least one non-whitespace character, or leave it blank.';dimensionDraft={...(previous||{}),id:previous?.id||uid(),name:field('dimension-name').value,low:field('dimension-low').value,high:field('dimension-high').value,minInput:field('dimension-min').value,maxInput:field('dimension-max').value,endpointLabelsPresent:enabled,unit:field('dimension-unit').value,unitPresent,integerOnly:integer,description};render();root.querySelector('[name="dimension-description"]')?.focus();return;}
 if(min===null||max===null||!(min<max)){dimensionError='Enter finite numeric MIN and MAX values with MIN < MAX.';dimensionDraft={...(previous||{}),id:previous?.id||uid(),name:field('dimension-name').value,low:field('dimension-low').value,high:field('dimension-high').value,minInput:field('dimension-min').value,maxInput:field('dimension-max').value,endpointLabelsPresent:enabled,unit:field('dimension-unit').value,unitPresent,integerOnly:integer,...(descriptionField?{description}:{})};render();root.querySelector('[name="dimension-min"]')?.focus();return;}
 const next={id:previous?.id||uid(),name:field('dimension-name').value,low:field('dimension-low').value,high:field('dimension-high').value,endpointLabelsPresent:enabled,min,max,minInput:field('dimension-min').value,maxInput:field('dimension-max').value,unit:field('dimension-unit').value,unitPresent,integerOnly:integer,integerOnlyPresent:Boolean(previous?.integerOnlyPresent||integer),...(description!==''?{description}:{})};
 if(integer&&Math.ceil(min)>Math.floor(max)){dimensionError='This integer-only range has no valid integer candidate.';dimensionDraft=next;render();root.querySelector('[name="dimension-min"]')?.focus();return;}
 const affected=previous?Object.entries(s.values).flatMap(([entityId,values])=>{const value=values?.[previous.id];return typeof value==='number'&&!acceptsDimensionValue(next,value)?[{entityId,value}]:[]}):[];
 if(affected.length){const projected={};for(const {entityId,value} of affected){const candidate=rescaledAssessmentValue(value,previous,next);if(candidate===null||!acceptsDimensionValue(next,candidate)){dimensionError='Rescale cannot produce valid Assessments for this range. Nothing changed.';dimensionDraft=next;render();return;}projected[entityId]=candidate;}dimensionDraft=next;rescaleProposal={dimension:next,values:projected};render();root.querySelector('[data-approve-rescale]')?.focus();return;}
 const result=applyDimensionAndRescale(s,next);if(!result.ok){dimensionError=result.reason;dimensionDraft=next;render();return;}
 s.dimensionFormOpen=false;s.editDimension=null;dimensionDraft=null;dimensionError=null;s.pendingDraft=false;lifecycleNotice='Dimension change applied to the Dataset. E2R JSON Export is a separate step.';update();
},true);
document.addEventListener('change',event=>{
 clearLifecycleNotice();
 const target=event.target;
 if(target.id==='dataset-file'){const file=target.files?.[0];target.value='';importSelectedFile(file);event.stopImmediatePropagation();return;}
},true);
document.addEventListener('input',event=>{
 clearLifecycleNotice();
 const target=event.target;
 if(target.id==='dataset-title-input'){datasetTitleDraft=target.value;s.pendingDraft=datasetTitleDraft!==(s.dataset.extensions?.metadata?.title??'');target.form?.querySelector('button[type="submit"]')?.toggleAttribute('disabled',!s.pendingDraft);root.querySelector('.pending-draft-status')?.toggleAttribute('hidden',!s.pendingDraft);}
 if(target.matches('#entity-form input,#entity-form textarea')){s.pendingDraft=true;pendingEntityDraft={editId:editEntityId,name:root.querySelector('#entity-form [name="dataset-entity-name"]')?.value||'',description:root.querySelector('#entity-form [name="dataset-entity-description"]')?.value||''};}
 if(target.closest('#dimension-form')){s.pendingDraft=true;const form=target.closest('#dimension-form'),field=name=>form.elements.namedItem(name);dimensionDraft={id:field('id').value||undefined,name:field('dimension-name').value,low:field('dimension-low').value,high:field('dimension-high').value,minInput:field('dimension-min')?.value||'',maxInput:field('dimension-max')?.value||'',unit:field('dimension-unit')?.value||'',unitPresent:Boolean(field('dimension-unit-enabled')?.checked),endpointLabelsPresent:Boolean(field('dimension-labels-enabled')?.checked),integerOnly:Boolean(field('dimension-integer-only')?.checked),...(field('dimension-description')?{description:field('dimension-description').value}:{})};for(const name of ['dimension-low','dimension-high']){const input=field(name);if(input)input.disabled=!field('dimension-labels-enabled')?.checked;}const unit=field('dimension-unit');if(unit)unit.disabled=!field('dimension-unit-enabled')?.checked;}
 if(s.pendingDraft)root.querySelector('.pending-draft-status')?.removeAttribute('hidden');
},true);
installBeforeUnloadProtection(window,()=>s);
document.addEventListener('keydown',event=>{
 if(replacement||entityDeleteNotice||rescaleProposal){if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();if(replacement){cancelReplacement();return;}if(entityDeleteNotice)entityDeleteNotice=null;if(rescaleProposal)rescaleProposal=null;render();}else if(event.key==='Tab')trapDialogTab(event,'.confirm-dialog');}
},true);

// Wire endpoint-label and unit presence without normalizing the text itself.
const originalBuildDimensionFields=buildDimensionFields;
buildDimensionFields=function(){
 originalBuildDimensionFields();const form=root.querySelector('#dimension-form');if(!form)return;
 const insertBefore=form.querySelector('.actions');
 const currentPayload=s.dataset.extensions?.['draft.github.sukoyaka-dopeness.dimension-assessment'];
 if((!currentPayload||currentPayload.specVersion==='0.2.0')&&!form.elements.namedItem('dimension-description')){const label=document.createElement('label');label.className='dimension-description-field';label.append(document.createTextNode('Description (optional)'));const textarea=document.createElement('textarea');textarea.name='dimension-description';textarea.rows=3;textarea.placeholder='Describe this Dimension';textarea.autocomplete='off';label.append(textarea);const help=document.createElement('small');help.textContent='Plain text included in the Dataset. Line breaks are preserved.';label.append(help);form.insertBefore(label,insertBefore);}
 if(!form.elements.namedItem('dimension-labels-enabled')){const toggle=document.createElement('label');toggle.className='dimension-optional-toggle';const input=document.createElement('input');input.type='checkbox';input.name='dimension-labels-enabled';toggle.append(input,document.createTextNode('Include both endpoint labels'));form.insertBefore(toggle,insertBefore);}
 if(!form.elements.namedItem('dimension-unit-enabled')){const toggle=document.createElement('label');toggle.className='dimension-optional-toggle';const input=document.createElement('input');input.type='checkbox';input.name='dimension-unit-enabled';toggle.append(input,document.createTextNode('Include unit text'));form.insertBefore(toggle,insertBefore);}
 const help=root.querySelector('#p2-range-help');if(help)help.textContent='Enter finite numeric bounds with MIN < MAX. Endpoint labels and unit are optional text. Integer-only Dimensions need at least one integer in range. Assessments that would become invalid require a reviewed Rescale before this change is applied.';
 const integerLabel=form.querySelector('.dimension-integer-option');if(integerLabel)integerLabel.lastChild.textContent='Integer values only';
 const integerHelp=[...form.querySelectorAll('small')].find(el=>el.textContent.includes('Existing decimals'));if(integerHelp)integerHelp.textContent='Assessment values must remain valid for this Dimension. Existing records are never silently rounded or removed.';
};
const initialBuild=buildDimensionFields;
const originalRender=render;
render=function(){
 originalRender();
 document.documentElement.lang=locale;
 const appHeader=root.querySelector(':scope > header');
 if(appHeader)(appHeader.querySelector('.header-actions')||appHeader).insertAdjacentHTML('beforeend',localeControlMarkup(locale));
 if(localeConflict){root.insertAdjacentHTML('beforeend',localeConflictMarkup(locale,localeRequest.locale));root.querySelectorAll(':scope > header,:scope > main,:scope > footer').forEach(element=>element.inert=true);root.querySelector('[data-resolve-locale="saved"]')?.focus();}
 const eyebrow=root.querySelector('header .eyebrow');if(eyebrow)eyebrow.textContent='E2R | SINGLE-USER DATASET COMPARISON';
 document.title='ParameterPlotter';
 const search=root.querySelector('#dimension-search');if(search)search.placeholder='Filter by name, labels, range, or unit';
 localizeUi(root,locale);
};
render();
