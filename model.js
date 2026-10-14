import {completeSpecification} from './dataset-specification.js';
import {decimalInterpolate, presentDecimal} from './decimal-presentation.js';
import {validateDataset} from './vendor/e2r-validator/index.js';
export {validateDataset};
export const DIMENSION_ASSESSMENT_ID='draft.github.sukoyaka-dopeness.dimension-assessment';
export const DIMENSION_ASSESSMENT_VERSION='0.2.0';
export const DIMENSION_ASSESSMENT_VERSIONS=Object.freeze(['0.1.0','0.2.0']);
const KEY = 'e2r-parameter-plotter-local-workspace-v2';
export const WORKSPACE_STORAGE_KEY = KEY;
export const uid = () => crypto.randomUUID();
export const clamp = v => Math.max(-1, Math.min(1, v));

// Dimensions without explicit P2 bounds remain on the P1 range only as a
// read-time compatibility path. The fallback never mutates session data.
export const dimensionRange = dimension => ({
  min: Number.isFinite(dimension?.min) ? dimension.min : -1,
  max: Number.isFinite(dimension?.max) ? dimension.max : 1,
  legacy: !Number.isFinite(dimension?.min) || !Number.isFinite(dimension?.max),
});

export const inDimensionRange = (dimension, value) => {
  const {min,max}=dimensionRange(dimension);
  return Number.isFinite(value) && value >= min && value <= max;
};

export const acceptsDimensionValue = (dimension, value) =>
  inDimensionRange(dimension,value) && (dimension?.integerOnly !== true || Number.isInteger(value));

export function dimensionValueIssue(dimension,value) {
  if (!inDimensionRange(dimension,value)) return 'outside range';
  return dimension?.integerOnly === true && !Number.isInteger(value) ? 'violates integer-only constraint' : null;
}

export function integerCandidates(dimension) {
  const {min,max}=dimensionRange(dimension),first=Math.ceil(min),last=Math.floor(max),count=last-first+1;
  return Number.isSafeInteger(first)&&Number.isSafeInteger(last)&&Number.isSafeInteger(count)&&count>0 ? {first,last,count} : null;
}

// Pointer/slider candidate selection only: never repair a recorded value.
export function authoredValueAtPosition(dimension,position) {
  const value=valueAtRangePosition(dimension,position);
  if (dimension?.integerOnly !== true) return value;
  const candidates=integerCandidates(dimension);
  return candidates ? Math.max(candidates.first,Math.min(candidates.last,Math.round(value))) : null;
}

export function rangePosition(dimension, value) {
  if (!acceptsDimensionValue(dimension,value)) return null;
  const {min,max}=dimensionRange(dimension),span=max-min;
  if (Number.isFinite(span)) return (value-min)/span;
  const scale=Math.max(Math.abs(min),Math.abs(max),Math.abs(value));
  return ((value/scale)-(min/scale))/((max/scale)-(min/scale));
}

export function valueAtRangePosition(dimension, position) {
  const {min,max}=dimensionRange(dimension),p=Math.max(0,Math.min(1,position));
  return decimalInterpolate(min,max,p);
}

export const label = (entity, index) => entity.name?.trim() || `Entity ${index + 1}`;
export const entities = state => state.dataset.entities.map((entity,index)=>{
  if(entity&&typeof entity==='object'&&!Array.isArray(entity))return entity.id?entity:{...entity,id:`inspection:entities:${index}`,inspectionOnly:true};
  return {id:`inspection:entities:${index}`,name:`Invalid Entity ${index+1}`,inspectionOnly:true};
});

// Matrix presentation only. Reading an older session never adds or repairs data.
export function matrixEntities(state) {
  const available=entities(state),byId=new Map(available.map(e=>[e.id,e]));
  const ids=Array.isArray(state.matrixRows)?state.matrixRows:[],seen=new Set();
  return [...ids,...available.map(e=>e.id)].flatMap(id=>{
    if(seen.has(id)||!byId.has(id))return [];
    seen.add(id);return [byId.get(id)];
  });
}

// insertion is a boundary in the displayed order BEFORE removing the source.
export function reorderMatrixRow(state,id,insertion) {
  const order=matrixEntities(state).map(e=>e.id),from=order.indexOf(id);
  if(from<0||!Number.isInteger(insertion)||insertion<0||insertion>order.length)return false;
  const to=insertion-(from<insertion?1:0);
  if(to===from)return false;
  order.splice(from,1);order.splice(to,0,id);state.matrixRows=order;return true;
}

export const plottedEntities = state => {
  const [x,y] = state.quadrant;
  const xDimension=state.dimensions.find(d=>d.id===x),yDimension=state.dimensions.find(d=>d.id===y);
  return xDimension && yDimension && x !== y
    ? entities(state).filter(e => acceptsDimensionValue(xDimension,getValue(state,e.id,x)) && acceptsDimensionValue(yDimension,getValue(state,e.id,y)))
    : [];
};

export const quadrantOutOfRangeEntities = state => {
  const axes=state.quadrant.map(id=>state.dimensions.find(d=>d.id===id));
  if(!axes[0]||!axes[1]||axes[0].id===axes[1].id)return [];
  return entities(state).flatMap(entity=>axes.flatMap(dimension=>{
    const value=getValue(state,entity.id,dimension.id);
    return value!==null&&!acceptsDimensionValue(dimension,value)?[{entity,dimension,value}]:[];
  }));
};

export const waitingCandidates = state => {
  const plotted = new Set(plottedEntities(state).map(e => e.id));
  const outOfRange = new Set(quadrantOutOfRangeEntities(state).map(x=>x.entity.id));
  return entities(state).filter(e => !plotted.has(e.id) && !outOfRange.has(e.id));
};

export function readDataset(value) {
  if (!value || typeof value.version !== 'string' || !Array.isArray(value.entities) || !Array.isArray(value.events) || !Array.isArray(value.relations)) throw Error('Expected an E2R Dataset with version, entities, events, and relations.');
  return value;
}

function candidateOf(dataset){return dataset.extensions&&typeof dataset.extensions==='object'&&!Array.isArray(dataset.extensions)?dataset.extensions[DIMENSION_ASSESSMENT_ID]:undefined;}
function hasRecoverableDatasetContent(dataset){
  if(['entities','events','relations'].some(key=>Array.isArray(dataset?.[key])&&dataset[key].length>0))return true;
  if(dataset?.extensions&&typeof dataset.extensions==='object'&&Object.keys(dataset.extensions).length>0)return true;
  return Object.keys(dataset||{}).some(key=>!['version','entities','events','relations','extensions'].includes(key));
}
function hydrate(dataset,ui={}){
  const payload=candidateOf(dataset),supported=DIMENSION_ASSESSMENT_VERSIONS.includes(payload?.specVersion)&&Array.isArray(payload.dimensions)&&Array.isArray(payload.assessments);
  const dimensions=supported?payload.dimensions.flatMap(d=>d&&typeof d==='object'&&!Array.isArray(d)?[{id:d.id,name:d.name,low:d.lowLabel??'',high:d.highLabel??'',endpointLabelsPresent:Object.hasOwn(d,'lowLabel'),min:d.min,max:d.max,integerOnlyPresent:Object.hasOwn(d,'integerOnly'),unitPresent:Object.hasOwn(d,'unit'),...('integerOnly'in d?{integerOnly:d.integerOnly}:{}),...('unit'in d?{unit:d.unit}:{}),...(payload.specVersion==='0.2.0'&&typeof d.description==='string'?{description:d.description}:{})}]:[]):[];
  const values={};
  if(supported)for(const assessment of payload.assessments){if(!assessment||typeof assessment!=='object'||typeof assessment.entityId!=='string'||typeof assessment.dimensionId!=='string')continue;values[assessment.entityId]||={};values[assessment.entityId][assessment.dimensionId]=assessment.value;}
  const list=entities({dataset}),validIds=new Set(list.map(e=>e.id));
  return {
    dataset,dimensions,values,tempEntities:[],candidateUnsupported:Boolean(payload&&!supported),readOnly:false,
    workspaceCreated:Boolean(ui.workspaceCreated)||hasRecoverableDatasetContent(dataset),
    selected:validIds.has(ui.selected)?ui.selected:(list[0]?.id||null),view:['Profile','Radar','Quadrant','Matrix'].includes(ui.view)?ui.view:'Profile',
    poolOpen:false,dimensionOpen:false,dimensionFormOpen:false,entityFormOpen:false,editDimension:null,
    waiting:validIds.has(ui.waiting)?ui.waiting:null,quadrant:Array.isArray(ui.quadrant)?[...ui.quadrant.slice(0,2)]:[null,null],
    radar:Array.isArray(ui.radar)?[...ui.radar]:[],secondary:validIds.has(ui.secondary)?ui.secondary:null,
    matrix:Array.isArray(ui.matrix)?[...ui.matrix]:dimensions.map(d=>d.id),matrixRows:Array.isArray(ui.matrixRows)?[...ui.matrixRows]:[],matrixPage:Number.isInteger(ui.matrixPage)?ui.matrixPage:0,
    datasetModified:Boolean(ui.datasetModified),datasetBaseline:typeof ui.datasetBaseline==='string'?ui.datasetBaseline:JSON.stringify(dataset),
    pendingDraft:false,persistence:{status:'unsaved',message:''},validation:validateDataset(dataset),
  };
}

function attachValidation(s){s.validation=validateDataset(s.dataset);s.readOnly=!s.validation.valid;return s;}
export function fresh(dataset,{ui={},datasetModified=false}={}){
  readDataset(dataset);
  return attachValidation(hydrate(structuredClone(dataset),{...ui,datasetModified}));
}

function assessmentRecords(values){return Object.entries(values||{}).flatMap(([entityId,byDimension])=>Object.entries(byDimension||{}).filter(([,value])=>typeof value==='number'&&Number.isFinite(value)).map(([dimensionId,value])=>({entityId,dimensionId,value})));}
export function datasetForWorkspace(s){
  const dataset=structuredClone(s.dataset);
  if(s.readOnly)return dataset;
  const existing=candidateOf(dataset),hasState=s.dimensions.length>0||assessmentRecords(s.values).length>0;
  if(!hasState&&!existing)return dataset;
  if(existing&&existing.specVersion!=='0.1.0'&&existing.specVersion!=='0.2.0')return dataset;
  const version=existing?.specVersion||DIMENSION_ASSESSMENT_VERSION;
  const dimensionData=s.dimensions.map(d=>({id:d.id,name:d.name,min:d.min,max:d.max,...(('integerOnlyPresent'in d?d.integerOnlyPresent:('integerOnly'in d))?{integerOnly:Boolean(d.integerOnly)}:{}),...((d.unitPresent||(d.unit!==undefined&&d.unit!==''))?{unit:d.unit??''}:{}),...((d.endpointLabelsPresent||(d.low!==undefined&&d.high!==undefined&&d.low!==''&&d.high!==''))?{lowLabel:d.low??'',highLabel:d.high??''}:{}),...(version==='0.2.0'&&typeof d.description==='string'&&/\S/u.test(d.description)?{description:d.description}:{})}));
  const extensions=dataset.extensions&&typeof dataset.extensions==='object'&&!Array.isArray(dataset.extensions)?dataset.extensions:{};
  dataset.extensions={...extensions,[DIMENSION_ASSESSMENT_ID]:{specVersion:version,dimensions:dimensionData,assessments:assessmentRecords(s.values)}};
  const spec=dataset.extensions['draft.github.sukoyaka-dopeness.specification'];
  if(spec&&spec.specVersion==='0.1.0'&&Array.isArray(spec.uses)){
    const declarations=spec.uses.filter(entry=>entry?.extension===DIMENSION_ASSESSMENT_ID);
    if(!declarations.length)dataset.extensions['draft.github.sukoyaka-dopeness.specification']={...spec,uses:[...spec.uses,{extension:DIMENSION_ASSESSMENT_ID,version}]};
    else if(declarations.length===1&&declarations[0].version!==version)dataset.extensions['draft.github.sukoyaka-dopeness.specification']={...spec,uses:spec.uses.map(entry=>entry?.extension===DIMENSION_ASSESSMENT_ID?{...entry,version}:entry)};
  }
  return dataset;
}
export function datasetForExport(s){return completeSpecification(datasetForWorkspace(s));}
function serializableWorkspace(s,dataset=datasetForWorkspace(s)){
  return JSON.stringify({format:'parameterplotter-local-workspace',version:1,dataset,ui:{workspaceCreated:s.workspaceCreated,selected:s.selected,view:s.view,waiting:s.waiting,quadrant:s.quadrant,radar:s.radar,secondary:s.secondary,matrix:s.matrix,matrixRows:s.matrixRows,matrixPage:s.matrixPage,datasetModified:s.datasetModified,datasetBaseline:s.datasetBaseline}});
}
export function save(s){
  s.workspaceCreated=true;
  const dataset=datasetForWorkspace(s),validation=validateDataset(dataset);
  if(!validation.valid&&!s.readOnly){s.validation=validation;s.readOnly=true;s.persistence={status:'degraded',message:'The current Dataset no longer passes Validator checks. It remains available for read-only inspection.'};return false;}
  const data=serializableWorkspace(s,dataset);
  try{
    if(s.preserveStoredCopy)throw Error('A prior browser workspace could not be read and has been left untouched. Explicitly open another E2R Dataset to replace the active in-memory inspection.');
    localStorage.setItem(KEY,data);
    s.dataset=dataset;s.validation=validation;s.preserveStoredCopy=false;s.persistence={status:'saved',message:''};
    return true;
  }catch(error){s.dataset=dataset;s.validation=validation;s.persistence={status:'degraded',message:`Browser-local persistence failed. This active workspace is unsaved and may be lost on reload or when the browser closes. ${error?.message||''}`.trim()};return false;}
}
export function saveIfCurrent(s, expectedRaw){
  let current;
  try { current = localStorage.getItem(KEY); }
  catch(error){
    s.persistence={status:'degraded',message:`Browser-local persistence could not be checked safely. This tab did not replace the saved workspace. ${error?.message||''}`.trim()};
    return {ok:false,reason:s.persistence.message};
  }
  if(current!==expectedRaw){
    s.persistence={status:'degraded',message:'Another ParameterPlotter tab changed the saved workspace. This tab did not overwrite it. Export any work you need to keep as E2R JSON and check that the download completed; then reload this tab and choose Continue Editing to open the latest saved workspace.'};
    return {ok:false,conflict:true,reason:s.persistence.message};
  }
  const ok=save(s);
  if(!ok)return {ok:false,reason:s.persistence.message};
  try { return {ok:true,raw:localStorage.getItem(KEY)}; }
  catch(error){
    s.persistence={status:'degraded',message:`The workspace was written, but its saved revision could not be verified. This tab will stop further writes until it is reloaded. ${error?.message||''}`.trim()};
    return {ok:false,reason:s.persistence.message};
  }
}
export function load(){
  try{
    const raw=localStorage.getItem(KEY);
    if(raw){const stored=JSON.parse(raw);if(stored?.format!=='parameterplotter-local-workspace'||stored.version!==1)throw Error('The saved ParameterPlotter workspace has an unsupported format.');const state=fresh(stored.dataset,{ui:stored.ui||{},datasetModified:stored.ui?.datasetModified});state.datasetBaseline=stored.ui?.datasetBaseline||JSON.stringify(stored.dataset);state.persistence={status:'saved',message:''};return state;}
    return fresh({version:'1.0',entities:[],events:[],relations:[]});
  }catch(error){const state=fresh({version:'1.0',entities:[],events:[],relations:[]});state.preserveStoredCopy=true;state.persistence={status:'degraded',message:`Saved browser workspace could not be read and was left untouched. Explicitly open another E2R Dataset to replace the active in-memory inspection. ${error?.message||''}`.trim()};return state;}
}
export function exportBaseline(s){s.dataset=datasetForWorkspace(s);s.datasetBaseline=JSON.stringify(s.dataset);s.datasetModified=false;}
export function markDatasetModified(s){s.datasetModified=true;}
export function transactDatasetMutation(s,mutator){
  if(s.readOnly)return {ok:false,reason:'This Dataset is in diagnostic read-only inspection.'};
  const before={};
  for(const key of ['dataset','dimensions','values','datasetModified','selected','secondary','waiting','quadrant','radar','matrix','matrixRows'])before[key]=structuredClone(s[key]);
  try{mutator();}catch(error){Object.assign(s,before);return {ok:false,reason:error?.message||'The Dataset change could not be prepared.'};}
  let dataset=datasetForWorkspace(s);
  if(candidateOf(dataset)&&JSON.stringify(candidateOf(dataset))!==JSON.stringify(candidateOf(before.dataset))){
    dataset=completeSpecification(dataset);
  }
  const validation=validateDataset(dataset);
  if(!validation.valid){Object.assign(s,before);return {ok:false,reason:'The change would fail Validator checks and was not applied.',diagnostics:validation.diagnostics};}
  s.dataset=dataset;s.validation=validation;s.datasetModified=true;return {ok:true};
}
export function getValue(s, entityId, dimensionId) { const v = s.values[entityId]?.[dimensionId]; return typeof v === 'number' && Number.isFinite(v) ? v : null; }

function completeAssessmentEditDeclaration(s){
  const dataset=datasetForWorkspace(s),completed=completeSpecification(dataset);
  if(completed!==dataset){s.dataset=completed;s.validation=validateDataset(completed);}
}
export function setValue(s, entityId, dimensionId, value) {
  if (!entityId || !dimensionId || s.readOnly || s.candidateUnsupported || !entities(s).some(entity=>entity.id===entityId) || !s.dimensions.some(dimension=>dimension.id===dimensionId)) return false;
  if (value === null || value === '') {
    if(s.values[entityId])delete s.values[entityId][dimensionId];
    completeAssessmentEditDeclaration(s);s.datasetModified=true;return true;
  }
  const dimension=s.dimensions.find(d=>d.id===dimensionId),n=Number(value);
  if (!dimension || !acceptsDimensionValue(dimension,n)) return false;
  s.values[entityId] ||= {};s.values[entityId][dimensionId]=n;
  completeAssessmentEditDeclaration(s);s.datasetModified=true;return true;
}

export const fmt = (v,dimension) => presentDecimal(v,dimension);
