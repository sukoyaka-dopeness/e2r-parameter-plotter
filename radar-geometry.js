const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export const PROTOTYPE_SPOKE_CAP=10;
// Radar radius is a 0..1 presentation position, not a signed value.
export function radarPositionAtPoint(x,y,angle){
 return Math.max(0,Math.min(1,((x-150)*Math.cos(angle)+(y-150)*Math.sin(angle))/105));
}
export function spokeLabels(ids,angles,getName,getId=()=> ''){
 return ids.map((id,i)=>{
  const angle=angles[i];
  const sx=150+Math.cos(angle)*105,sy=150+Math.sin(angle)*105;
  const name=getName(id),short=getId(id);
  return `<line class="radar-label-connector" x1="${sx}" y1="${sy}" x2="${sx}" y2="${sy}"/><foreignObject class="radar-axis-box" data-axis-angle="${angle}" x="0" y="0" width="120" height="120"><div xmlns="http://www.w3.org/1999/xhtml" class="radar-axis-wrap"><span class="radar-spoke-label" title="${esc(name)}${short?` · ID ${esc(short)}`:''}"><span class="radar-label-name">${esc(name)}</span>${short?`<small class="radar-label-id">${esc(short)}</small>`:''}</span></div></foreignObject>`;
 }).join('');
}
export function sizeRadarLabels(root){
 const svg=root.querySelector('svg.radar');if(!svg)return;
 const scale=svg.getBoundingClientRect().width/480;
 if(!scale)return;
 const size=Math.max(8,Math.min(20,12/scale));
 svg.style.setProperty('--vertex-radius',`${4/scale}px`);
 svg.style.setProperty('--vertex-active-radius',`${7/scale}px`);
 svg.style.setProperty('--vertex-hit-radius',`${12/scale}px`);
 svg.querySelectorAll('.radar-spoke-label').forEach(label=>{label.style.fontSize=`${size}px`;});
 placeRadarAxisLabels(svg,scale);
 syncRadarLabelConnectors(svg);
}

const intersection=(a,b)=>Math.max(0,Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y));
function placeRadarAxisLabels(svg,scale){
 const placed=[];
 for(const box of svg.querySelectorAll('.radar-axis-box')){
  box.setAttribute('width','120');box.setAttribute('height','120');
  const angle=Number(box.dataset.axisAngle),cos=Math.cos(angle),sin=Math.sin(angle);
  const side=Math.abs(cos)>=Math.abs(sin)?(cos>=0?'right':'left'):(sin>=0?'bottom':'top');
  const measured=box.querySelector('.radar-spoke-label').getBoundingClientRect();
  const w=Math.min(120,Math.max(18,measured.width/scale+1)),h=Math.min(120,Math.max(18,measured.height/scale+3));
  const anchor={x:150+cos*105,y:150+sin*105};
  let best=null;
  for(const radial of [0,8,16,24,32,40])for(const tangent of [0,-10,10,-20,20,-30,30,-40,40,-50,50]){
   const gap=10+radial;
   const x=side==='right'?anchor.x+gap:side==='left'?anchor.x-gap-w:anchor.x-w/2+tangent;
   const y=side==='bottom'?anchor.y+gap:side==='top'?anchor.y-gap-h:anchor.y-h/2+tangent;
   const rect={x,y,w,h};
   if(x< -85||y< -85||x+w>385||y+h>385)continue;
   const nearX=Math.max(x,Math.min(150,x+w)),nearY=Math.max(y,Math.min(150,y+h));
   if(Math.hypot(nearX-150,nearY-150)<108)continue;
   const overlap=placed.reduce((sum,other)=>sum+intersection({x:x-12,y:y-12,w:w+24,h:h+24},other),0);
   const score=overlap*100+radial*2+Math.abs(tangent);
   if(!best||score<best.score)best={...rect,score};
  }
  if(!best){
   const x=Math.max(-85,Math.min(385-w,anchor.x+cos*20-w/2));
   const y=Math.max(-85,Math.min(385-h,anchor.y+sin*20-h/2));
   best={x,y,w,h};
  }
  box.setAttribute('x',String(best.x));box.setAttribute('y',String(best.y));
  box.setAttribute('width',String(w));box.setAttribute('height',String(h));
  placed.push(best);
 }
}

function syncRadarLabelConnectors(svg){
 const inverse=svg.getScreenCTM()?.inverse();if(!inverse)return;
 const boxes=[...svg.querySelectorAll('.radar-axis-box')];
 boxes.forEach((box,i)=>{
  const line=svg.querySelectorAll('.radar-label-connector')[i],label=box.querySelector('.radar-spoke-label');
  if(!line||!label)return;
  const b=label.getBoundingClientRect(),origin=svg.createSVGPoint();
  origin.x=Number(line.getAttribute('x1'));origin.y=Number(line.getAttribute('y1'));
  const originScreen=origin.matrixTransform(svg.getScreenCTM());
  const edgeX=Math.max(b.left,Math.min(b.right,originScreen.x));
  const edgeY=Math.max(b.top,Math.min(b.bottom,originScreen.y));
  const edges=[[b.left,edgeY],[b.right,edgeY],[edgeX,b.top],[edgeX,b.bottom]];
  const [x,y]=edges.reduce((best,next)=>Math.hypot(next[0]-originScreen.x,next[1]-originScreen.y)<Math.hypot(best[0]-originScreen.x,best[1]-originScreen.y)?next:best);
  const point=svg.createSVGPoint();point.x=x;point.y=y;
  const target=point.matrixTransform(inverse);
  line.setAttribute('x2',String(target.x));line.setAttribute('y2',String(target.y));
 });
}
