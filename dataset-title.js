const SPECIFICATION_ID='draft.github.sukoyaka-dopeness.specification';

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
  }else delete extensions.metadata;
  if(Object.keys(extensions).length)dataset.extensions=extensions;
  else delete dataset.extensions;
}
