// Point values remain fixed. Label placement uses measured browser geometry.
export const placeLabels = points => points;
const overlaps = (a,b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
const area = (a,b) => Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));
const clamp=(value,low,high)=>Math.max(low,Math.min(high,value));
function edgePoint(p,r){
 const choices=[[r.left,clamp(p.y,r.top+2,r.bottom-2)],[r.right,clamp(p.y,r.top+2,r.bottom-2)],[clamp(p.x,r.left+2,r.right-2),r.top],[clamp(p.x,r.left+2,r.right-2),r.bottom]];
 return choices.reduce((best,next)=>Math.hypot(next[0]-p.x,next[1]-p.y)<Math.hypot(best[0]-p.x,best[1]-p.y)?next:best);
}
function segmentDistance(p,end,q){
 const dx=end[0]-p.x,dy=end[1]-p.y,length=dx*dx+dy*dy;
 const t=length?clamp(((q.x-p.x)*dx+(q.y-p.y)*dy)/length,0,1):0;
 return Math.hypot(q.x-p.x-t*dx,q.y-p.y-t*dy);
}
const placements = new Map();
export function layoutPlotLabels(root,{animate=false}={}){
 const plot=root.querySelector('[data-plot]');if(!plot)return;
 const items=[...plot.querySelectorAll('.plot-item')],bounds=plot.getBoundingClientRect();
 const centers=items.map(item=>{const r=item.querySelector('.plot-dot').getBoundingClientRect();return {x:(r.left+r.right)/2,y:(r.top+r.bottom)/2};});
 const occupied=[];
 items.forEach((item,index)=>{
  const label=item.querySelector('.point-label'),line=item.querySelector('.point-connector'),p=centers[index];
  const inset=6;
  label.style.maxWidth=`${Math.max(40,Math.min(130,bounds.width-inset*2))}px`;
  const w=label.offsetWidth,h=label.offsetHeight;
  const candidates=[16,34,52,70,88,106].flatMap(gap=>[[gap,-h/2],[-w-gap,-h/2],[-w/2,-h-gap],[-w/2,gap],[gap,-h-gap],[-w-gap,-h-gap],[gap,gap],[-w-gap,gap]]);
  candidates.push([bounds.left+inset-p.x,bounds.top+inset-p.y],[bounds.right-inset-w-p.x,bounds.top+inset-p.y],[bounds.left+inset-p.x,bounds.bottom-inset-h-p.y],[bounds.right-inset-w-p.x,bounds.bottom-inset-h-p.y]);
  const top=bounds.top+inset,bottom=bounds.bottom-inset-h,left=bounds.left+inset,right=bounds.right-inset-w;
  const ys=Array.from({length:Math.max(1,Math.ceil((bottom-top)/Math.max(18,h+4))+1)},(_,i)=>Math.min(bottom,top+i*Math.max(18,h+4))).sort((a,b)=>Math.abs(a+h/2-p.y)-Math.abs(b+h/2-p.y));
  const xs=Array.from({length:Math.max(1,Math.ceil((right-left)/Math.max(26,w/2))+1)},(_,i)=>Math.min(right,left+i*Math.max(26,w/2))).sort((a,b)=>Math.abs(a+w/2-p.x)-Math.abs(b+w/2-p.x));
  ys.forEach(y=>{candidates.push([left-p.x,y-p.y],[right-p.x,y-p.y]);});
  xs.forEach(x=>{candidates.push([x-p.x,top-p.y],[x-p.x,bottom-p.y]);});
  const previous=placements.get(item.dataset.entity);
  if(previous&&previous.w===w&&previous.h===h)candidates.unshift([previous.dx,previous.dy]);
  let best=null;
  candidates.forEach(([dx,dy],rank)=>{
   const rect={left:p.x+dx,top:p.y+dy,right:p.x+dx+w,bottom:p.y+dy+h};
   if(rect.left<bounds.left+inset||rect.right>bounds.right-inset||rect.top<bounds.top+inset||rect.bottom>bounds.bottom-inset)return;
   const endpoint=edgePoint(p,rect),distance=Math.hypot(endpoint[0]-p.x,endpoint[1]-p.y);
   let score=rank*.03+distance*.35+occupied.reduce((sum,r)=>sum+area(rect,r)*100,0);
   centers.forEach((q,qi)=>{const obstacle={left:q.x-10,top:q.y-10,right:q.x+10,bottom:q.y+10};if(overlaps(rect,obstacle))score+=area(rect,obstacle)*120;if(qi!==index&&segmentDistance(p,endpoint,q)<13)score+=900;});
   occupied.forEach(r=>{if(segmentDistance(p,endpoint,{x:clamp(p.x,r.left,r.right),y:clamp(p.y,r.top,r.bottom)})<4&&overlaps({left:Math.min(p.x,endpoint[0]),right:Math.max(p.x,endpoint[0]),top:Math.min(p.y,endpoint[1]),bottom:Math.max(p.y,endpoint[1])},r))score+=250;});
   if(previous&&previous.w===w&&previous.h===h&&dx===previous.dx&&dy===previous.dy)score-=12;
   if(!best||score<best.score)best={dx,dy,rect,score};
  });
  if(!best){const dx=bounds.left+inset-p.x,dy=bounds.top+inset-p.y;best={dx,dy,rect:{left:p.x+dx,top:p.y+dy,right:p.x+dx+w,bottom:p.y+dy+h}};}
  const changed=label.style.left!==`${best.dx}px`||label.style.top!==`${best.dy}px`;
  if(animate&&changed&&!matchMedia('(prefers-reduced-motion: reduce)').matches){label.classList.add('is-relocating');setTimeout(()=>label.classList.remove('is-relocating'),180);}
  label.style.left=`${best.dx}px`;label.style.top=`${best.dy}px`;occupied.push(best.rect);
  placements.set(item.dataset.entity,{dx:best.dx,dy:best.dy,w,h});
 });
 const sync=()=>items.forEach((item,index)=>{
  if(!item.isConnected)return;
  const label=item.querySelector('.point-label'),line=item.querySelector('.point-connector'),p=centers[index],b=label.getBoundingClientRect();
  const [endX,endY]=edgePoint(p,b);
  const dx=endX-p.x,dy=endY-p.y,dist=Math.hypot(dx,dy);
  line.hidden=dist<24;line.style.width=`${dist}px`;line.style.transform=`rotate(${Math.atan2(dy,dx)}rad)`;
 });
 sync();
 if(animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const until=performance.now()+200;const follow=()=>{sync();if(performance.now()<until&&items[0]?.isConnected)requestAnimationFrame(follow);};requestAnimationFrame(follow);}
}
