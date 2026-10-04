import {decimalInterpolate, presentDecimal} from './decimal-presentation.js';
const KEY = 'e2r-parameter-plotter-workspace-v1';
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
export const entities = state => [...state.dataset.entities, ...(state.tempEntities || [])];

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
  if (value.entities.some(e => !e || typeof e.id !== 'string' || !e.id)) throw Error('Each Entity needs a nonempty ID.');
  const ids = [...value.entities, ...value.events, ...value.relations].map(x => x?.id);
  if (ids.some(x => typeof x !== 'string' || !x) || new Set(ids).size !== ids.length) throw Error('Core Object IDs must be present and unique.');
  return value;
}

export function fresh(dataset) {
  return {dataset, tempEntities: [], dimensions: [], values: {}, selected: dataset.entities[0]?.id || null, view: 'Profile', poolOpen: false, dimensionOpen: false, waiting: null, quadrant: [null,null], radar: [], secondary: null, matrix: [], matrixPage: 0};
}

export function load() {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw);
      readDataset(s.dataset);
      if (Array.isArray(s.dimensions) && s.values && typeof s.values === 'object') {
        s.tempEntities ||= [];
        s.radar=Array.isArray(s.radar)?[...new Set(s.radar.filter(id=>s.dimensions.some(d=>d.id===id)))]:[];
        delete s.radarCount;
        s.poolOpen=false;s.dimensionOpen=false;s.dimensionFormOpen=false;s.entityFormOpen=false;s.editDimension=null;
        return s;
      }
    }
  } catch {}
  return fresh({version:'1.0',entities:[],events:[],relations:[]});
}

export function save(s) { try { sessionStorage.setItem(KEY, JSON.stringify(s)); } catch {} }
export function getValue(s, entityId, dimensionId) { const v = s.values[entityId]?.[dimensionId]; return typeof v === 'number' && Number.isFinite(v) ? v : null; }

export function setValue(s, entityId, dimensionId, value) {
  if (!entityId || !dimensionId) return false;
  if (value === null || value === '') {
    if (s.values[entityId]) delete s.values[entityId][dimensionId];
    return true;
  }
  const dimension=s.dimensions.find(d=>d.id===dimensionId),n=Number(value);
  if (!dimension || !acceptsDimensionValue(dimension,n)) return false;
  s.values[entityId] ||= {};
  s.values[entityId][dimensionId] = n;
  return true;
}

export const fmt = (v,dimension) => presentDecimal(v,dimension);
