const inside=(x,y,rect,pad=0)=>rect&&x>=rect.left-pad&&x<=rect.right+pad&&y>=rect.top-pad&&y<=rect.bottom+pad;

export function startQuadrantPointDrag(event,{point,plot,waiting,onPlace,onReturn,onSelect}){
 if(event.button!==0||!event.isPrimary)return false;
 event.preventDefault();
 const item=point.closest('.plot-item'),pointerId=event.pointerId,startX=event.clientX,startY=event.clientY;
 const name=item.querySelector('.point-label')?.textContent?.trim()||'Entity';
 let moved=false,preview=null;
 const overWaiting=e=>inside(e.clientX,e.clientY,waiting?.getBoundingClientRect(),20);
 const showPreview=(e,ready)=>{
  if(!preview){
   preview=document.createElement('div');preview.className='entity-drag-preview';preview.setAttribute('aria-hidden','true');
   const marker=document.createElement('span');marker.className='entity-drag-preview-dot';
   const title=document.createElement('strong');title.textContent=name;
   const hint=document.createElement('small');
   preview.append(marker,title,hint);document.body.append(preview);
  }
  const outside=!inside(e.clientX,e.clientY,plot.getBoundingClientRect());
  preview.hidden=!outside;
  preview.classList.toggle('ready',ready);
  preview.querySelector('small').textContent=ready?'Release to wait':'Drag to waiting';
  preview.style.left=`${Math.min(e.clientX+14,innerWidth-preview.offsetWidth-8)}px`;
  preview.style.top=`${Math.min(e.clientY+14,innerHeight-preview.offsetHeight-8)}px`;
 };
 const cleanup=()=>{
  window.removeEventListener('pointermove',move,true);
  window.removeEventListener('pointerup',up,true);
  window.removeEventListener('pointercancel',cancel,true);
  point.classList.remove('dragging');
  waiting?.classList.remove('drop-ready');
  document.body.classList.remove('quadrant-dragging');
  preview?.remove();
  if(point.hasPointerCapture?.(pointerId))point.releasePointerCapture(pointerId);
 };
 const move=e=>{
  if(e.pointerId!==pointerId)return;
  moved ||= Math.hypot(e.clientX-startX,e.clientY-startY)>4;
  if(!moved)return;
  point.classList.add('dragging');document.body.classList.add('quadrant-dragging');
  const ready=overWaiting(e);
  waiting?.classList.toggle('drop-ready',ready);
  showPreview(e,ready);
  const rect=plot.getBoundingClientRect();
  item.style.left=`${Math.max(0,Math.min(100,100*(e.clientX-rect.left)/rect.width))}%`;
  item.style.top=`${Math.max(0,Math.min(100,100*(e.clientY-rect.top)/rect.height))}%`;
 };
 const up=e=>{
  if(e.pointerId!==pointerId)return;
  const returning=moved&&overWaiting(e);
  cleanup();
  if(returning)onReturn();
  else if(moved)onPlace(e);
  else onSelect();
 };
 const cancel=e=>{if(e.pointerId!==pointerId)return;cleanup();onSelect();};
 window.addEventListener('pointermove',move,true);
 window.addEventListener('pointerup',up,true);
 window.addEventListener('pointercancel',cancel,true);
 point.setPointerCapture?.(pointerId);
 return true;
}
