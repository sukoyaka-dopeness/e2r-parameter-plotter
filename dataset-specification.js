import {validateDataset} from './vendor/e2r-validator/index.js';
const DIMENSION_ASSESSMENT_ID='draft.github.sukoyaka-dopeness.dimension-assessment';
const DIMENSION_ASSESSMENT_VERSIONS=['0.1.0','0.2.0'];
const SPECIFICATION_ID='draft.github.sukoyaka-dopeness.specification';
function extensionPayloadOccurrences(dataset){
  const occurrences=new Map();let hasSpecification=false;
  const visit=value=>{
    if(!value||typeof value!=='object'||Array.isArray(value)||!value.extensions||typeof value.extensions!=='object'||Array.isArray(value.extensions))return;
    for(const [id,payload] of Object.entries(value.extensions)){
      if(id===SPECIFICATION_ID){hasSpecification=true;continue;}
      const list=occurrences.get(id)||[];list.push({owner:value,payload});occurrences.set(id,list);
    }
  };
  visit(dataset);
  for(const collection of ['entities','events','relations'])for(const item of dataset[collection]||[])visit(item);
  return {occurrences,hasSpecification};
}
export function completeSpecification(dataset){
  const datasetExtensions=dataset?.extensions;
  if(datasetExtensions!==undefined&&(!datasetExtensions||typeof datasetExtensions!=='object'||Array.isArray(datasetExtensions)))return dataset;
  const collected=extensionPayloadOccurrences(dataset);
  if(collected.hasSpecification)return dataset;
  const occurrences=collected.occurrences;
  if(!occurrences.size)return dataset;
  const uses=[];
  for(const [extension,items] of occurrences){
    let version;
    if(extension==='metadata'&&items.every(({owner})=>owner===dataset))version='1.0.0';
    else if(extension===DIMENSION_ASSESSMENT_ID&&items.length===1&&items[0].owner===dataset&&DIMENSION_ASSESSMENT_VERSIONS.includes(items[0].payload?.specVersion))version=items[0].payload.specVersion;
    else return dataset;
    uses.push({extension,version});
  }
  const candidate=structuredClone(dataset);
  candidate.extensions={...(candidate.extensions||{}),[SPECIFICATION_ID]:{specVersion:'0.1.0',uses}};
  return validateDataset(candidate).valid?candidate:dataset;
}

export function createEmptyDataset(){
  return {version:'1.0',entities:[],events:[],relations:[],extensions:{[SPECIFICATION_ID]:{specVersion:'0.1.0',uses:[]}}};
}
