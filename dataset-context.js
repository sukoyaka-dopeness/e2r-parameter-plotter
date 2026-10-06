export function datasetTitleFor(dataset){
  const title=dataset?.extensions?.metadata?.title;
  return typeof title==='string'&&title.trim()?title:'Untitled Dataset';
}
