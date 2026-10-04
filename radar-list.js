export function keepRadarRowVisible(root, dimensionId, step) {
  const list=root.querySelector('.radar-spoke-list');
  const row=[...list?.querySelectorAll('[data-radar-row]')||[]].find(item=>item.dataset.radarRow===dimensionId);
  if(!row)return;
  const listBox=list.getBoundingClientRect(),rowBox=row.getBoundingClientRect();
  if(rowBox.top<listBox.top)list.scrollTop-=listBox.top-rowBox.top+4;
  else if(rowBox.bottom>listBox.bottom)list.scrollTop+=rowBox.bottom-listBox.bottom+4;
  row.querySelector(`[data-radar-move$="|${step}"]`)?.focus({preventScroll:true});
}
