import {completeSpecification} from './dataset-specification.js';
const SPECIFICATION_ID='draft.github.sukoyaka-dopeness.specification';

export function getDatasetExportFilename(dataset){
  const title=dataset?.extensions?.metadata?.title;
  const safeTitle=typeof title==='string'?title.trim()
    .replace(/[\p{Cc}<>:"/\\|?*]/gu,'-')
    .replace(/[. -]+$/g,'')
    .trim():'';
  const usableTitle=/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\..*)?$/i.test(safeTitle)?'':safeTitle;
  const filename=`${usableTitle||'e2r-dataset'}.e2r.json`;
  const encoder=new TextEncoder(),bytes=encoder.encode(filename);
  if(bytes.length<=180)return filename;
  let hash=0x811c9dc5;
  for(const byte of bytes)hash=Math.imul(hash^byte,0x01000193)>>>0;
  const trailer=`…-${hash.toString(16).padStart(8,'0')}.e2r.json`;
  const prefixBudget=180-encoder.encode(trailer).length;
  let prefix='';
  for(const character of usableTitle){
    if(encoder.encode(prefix+character).length>prefixBudget)break;
    prefix+=character;
  }
  return prefix+trailer;
}

export function applyDatasetTitle(dataset,title){
  const extensions={...(dataset.extensions??{})},metadata={...(extensions.metadata??{})};
  if(title)metadata.title=title;
  else delete metadata.title;
  if(Object.keys(metadata).length){
    extensions.metadata=metadata;
    const specification=extensions[SPECIFICATION_ID];
    if(specification?.specVersion==='0.1.0'&&Array.isArray(specification.uses)&&
       !specification.uses.some(entry=>entry?.extension==='metadata')){
      extensions[SPECIFICATION_ID]={...specification,uses:[...specification.uses,{extension:'metadata',version:'1.0.0'}]};
    }
  }else {
    delete extensions.metadata;
    const specification=extensions[SPECIFICATION_ID];
    if(specification?.specVersion==='0.1.0'&&Array.isArray(specification.uses)){
      const entries=specification.uses.filter(entry=>entry?.extension==='metadata');
      const nested=[...dataset.entities,...dataset.events,...dataset.relations].some(item=>Object.hasOwn(item.extensions||{},'metadata'));
      if(!nested&&entries.length===1&&entries[0].version==='1.0.0')extensions[SPECIFICATION_ID]={...specification,uses:specification.uses.filter(entry=>entry?.extension!=='metadata')};
    }
  }
  if(Object.keys(extensions).length)dataset.extensions=extensions;
  else delete dataset.extensions;
  if(Object.keys(metadata).length)dataset.extensions=completeSpecification(dataset).extensions;
}
