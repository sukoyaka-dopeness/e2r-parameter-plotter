import {DIMENSION_ASSESSMENT_ID,transactDatasetMutation,uid,rangePosition,valueAtRangePosition} from './model.js';

export function dimensionAssessmentPayload(dataset){
  const value=dataset.extensions?.[DIMENSION_ASSESSMENT_ID];
  return value?.specVersion==='0.1.0'&&Array.isArray(value.dimensions)&&Array.isArray(value.assessments)?value:null;
}

export function candidateAuthoringAvailable(state){
  return !state.readOnly&&!state.candidateUnsupported;
}

export function createDatasetEntity(state,{name,description}){
  if(state.readOnly)return {ok:false,reason:'This Dataset is in diagnostic read-only inspection.'};
  let id;
  do{id=uid();}while([...state.dataset.entities,...state.dataset.events,...state.dataset.relations].some(item=>item?.id===id));
  const entity={id};
  if(typeof name==='string'&&name.trim()!=='')entity.name=name;
  if(typeof description==='string'&&description.trim()!=='')entity.description=description;
  return transactDatasetMutation(state,()=>{state.dataset.entities.push(entity);state.selected=id;});
}

export function editDatasetEntity(state,id,{name,description}){
  const entity=state.dataset.entities.find(item=>item?.id===id);
  if(!entity)return {ok:false,reason:'The Dataset Entity no longer exists.'};
  return transactDatasetMutation(state,()=>{
    const target=state.dataset.entities.find(item=>item?.id===id);
    for(const [field,value] of [['name',name],['description',description]]){
      if(typeof value!=='string')continue;
      if(value.trim()==='')delete target[field];
      else target[field]=value;
    }
  });
}

export function incidentRelations(dataset,entityId){
  return dataset.relations.filter(relation=>relation&&typeof relation==='object'&&(relation.sourceId===entityId||relation.targetId===entityId));
}

export function entityDeleteEligibility(state,id){
  const blockers=incidentRelations(state.dataset,id);
  if(blockers.length)return {allowed:false,reason:'Resolve every incident Relation before deleting this Entity.',relations:blockers};
  if(state.validation?.diagnostics?.some(item=>item.severity==='warning'&&item.code==='unknown_extension')){
    return {allowed:false,reason:'An unrecognized Extension may refer to this Entity. Deletion is unavailable because its references cannot be verified safely.'};
  }
  if(state.candidateUnsupported)return {allowed:false,reason:'This workspace contains an unsupported Dimension Assessment version. Entity deletion is unavailable because dependent records cannot be inspected safely.'};
  return {allowed:!state.readOnly,reason:state.readOnly?'This Dataset is in diagnostic read-only inspection.':''};
}

export function deleteDatasetEntity(state,id){
  const eligibility=entityDeleteEligibility(state,id);
  if(!eligibility.allowed)return {ok:false,...eligibility};
  return transactDatasetMutation(state,()=>{
    state.dataset.entities=state.dataset.entities.filter(entity=>entity?.id!==id);
    if(state.values[id])delete state.values[id];
    if(state.selected===id)state.selected=state.dataset.entities[0]?.id||null;
    if(state.secondary===id)state.secondary=null;
    if(state.waiting===id)state.waiting=null;
  });
}

export function deleteDatasetDimension(state,id){
  if(!candidateAuthoringAvailable(state))return {ok:false,reason:'Dimension Assessment authoring is unavailable for this Dataset.'};
  if(!state.dimensions.some(dimension=>dimension.id===id))return {ok:false,reason:'The Dimension no longer exists.'};
  return transactDatasetMutation(state,()=>{
    state.dimensions=state.dimensions.filter(dimension=>dimension.id!==id);
    for(const values of Object.values(state.values))delete values[id];
    state.quadrant=state.quadrant.map(dimensionId=>dimensionId===id?null:dimensionId);
    state.radar=state.radar.filter(dimensionId=>dimensionId!==id);
    state.matrix=state.matrix.filter(dimensionId=>dimensionId!==id);
  });
}

export function rescaledAssessmentValue(value,oldDimension,newDimension){
  const position=rangePosition(oldDimension,value);
  if(position===null)return null;
  const projected=valueAtRangePosition(newDimension,position);
  if(!newDimension.integerOnly)return projected;
  const first=Math.ceil(newDimension.min),last=Math.floor(newDimension.max);
  if(first>last)return null;
  const rounded=Math.sign(projected)*Math.floor(Math.abs(projected)+0.5);
  return Math.max(first,Math.min(last,rounded));
}

export function applyDimensionAndRescale(state,nextDimension,rescaledValues=null){
  if(!candidateAuthoringAvailable(state))return {ok:false,reason:'Dimension Assessment authoring is unavailable for this Dataset.'};
  return transactDatasetMutation(state,()=>{
    const index=state.dimensions.findIndex(item=>item.id===nextDimension.id);
    if(index<0)state.dimensions.push({...nextDimension});else state.dimensions[index]={...nextDimension};
    if(rescaledValues)for(const [entityId,value] of Object.entries(rescaledValues)){state.values[entityId]||={};state.values[entityId][nextDimension.id]=value;}
    if(!state.matrix.includes(nextDimension.id))state.matrix.push(nextDimension.id);
  });
}

export function applyAssessment(state,entityId,dimensionId,value){
  if(!candidateAuthoringAvailable(state))return {ok:false,reason:'Dimension Assessment authoring is unavailable for this Dataset.'};
  return transactDatasetMutation(state,()=>{
    const values=state.values[entityId]||{};
    if(value===null||value==='')delete values[dimensionId];
    else values[dimensionId]=Number(value);
    if(Object.keys(values).length)state.values[entityId]=values;else delete state.values[entityId];
  });
}
