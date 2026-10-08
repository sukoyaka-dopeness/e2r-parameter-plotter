import {entities, setValue, dimensionRange} from './model.js';
import {endpointRangeText} from './endpoint-presentation.js';

export const shortId = id => id.length > 12 ? id.slice(-8) : id;
const same = (a,b) => a.trim().toLocaleLowerCase() === b.trim().toLocaleLowerCase();

export function duplicateDimension(state, draft){
 const matches=state.dimensions.filter(d=>d.id!==draft.id&&same(d.name,draft.name));
 if(!matches.length)return null;
 const candidate=dimensionRange(draft);
 const exact=matches.some(d=>{const range=dimensionRange(d);return same(d.low,draft.low)&&same(d.high,draft.high)&&range.min===candidate.min&&range.max===candidate.max&&same(d.unit||'',draft.unit||'')&&(d.integerOnly===true)===(draft.integerOnly===true);});
 return {exact,matches};
}

export function dimensionDisplayName(state, dimension){
 const names=state.dimensions.filter(d=>same(d.name,dimension.name));
 if(names.length<2)return dimension.name;
 const range=dimensionRange(dimension);
 const detail=`${dimension.name} · ${endpointRangeText(dimension,(value)=>String(value))}${dimension.unit?` · ${dimension.unit}`:''}`;
 return names.some(d=>{const other=dimensionRange(d);return d.id!==dimension.id&&same(d.low,dimension.low)&&same(d.high,dimension.high)&&other.min===range.min&&other.max===range.max&&same(d.unit||'',dimension.unit||'');})?`${detail} · ${shortId(dimension.id)}`:detail;
}

const visiblePrefix = (name, limit) => Array.from(String(name||'').trim().toLocaleLowerCase()).slice(0,limit).join('');
export function visuallyAmbiguous(items, item, limit){
 if(!item)return false;
 const name=String(item.name||'').trim();
 if(!name)return false;
 return items.some(other=>{
  if(other.id===item.id)return false;
  const otherName=String(other.name||'').trim();
  if(!otherName)return false;
  return same(otherName,name)||(Array.from(name).length>limit&&Array.from(otherName).length>limit&&visiblePrefix(otherName,limit)===visiblePrefix(name,limit));
 });
}
export function dimensionNeedsId(state, dimension, surface='pool'){
 return visuallyAmbiguous(state.dimensions,dimension,{matrix:9,radar:13,selector:18,pool:24}[surface]||16);
}

export function radarAxisName(state, dimension){
 if(!dimension)return '';
 return dimensionNeedsId(state,dimension,'radar')?`${dimension.name} · ${shortId(dimension.id)}`:dimension.name;
}

export function entityNeedsId(state, entity, surface='pool'){
 return visuallyAmbiguous(entities(state),entity,{pager:12,plot:9,matrix:13,pool:24,profile:24}[surface]||16);
}

export function deleteDimension(state,id){
 state.dimensions=state.dimensions.filter(d=>d.id!==id);
 Object.values(state.values).forEach(values=>delete values[id]);
 state.quadrant=state.quadrant.map(x=>x===id?null:x);
 state.radar=state.radar.filter(x=>x!==id);
 state.matrix=state.matrix.filter(x=>x!==id);
 state.editDimension=null;
}

export function deleteTemporaryEntity(state,id){
 if(!state.tempEntities.some(e=>e.id===id))return false;
 state.tempEntities=state.tempEntities.filter(e=>e.id!==id);
 delete state.values[id];
 if(state.waiting===id)state.waiting=null;
 if(state.secondary===id)state.secondary=null;
 if(state.selected===id)state.selected=entities(state)[0]?.id||null;
 return true;
}

export function returnToWaiting(state,id){
 if(!entities(state).some(e=>e.id===id))return false;
 state.waiting=id;
 state.selected=id;
 state.quadrant.forEach(d=>setValue(state,id,d,null));
 return true;
}
