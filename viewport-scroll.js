// Capture only the document scrollport so a targeted view rerender can restore
// the user's page position without affecting nested controls elsewhere.
export function captureDocumentScroll(documentObject=document) {
  const element=documentObject?.scrollingElement;
  return element?{element,left:element.scrollLeft,top:element.scrollTop}:null;
}

export function restoreDocumentScroll(snapshot) {
  if(!snapshot?.element)return false;
  snapshot.element.scrollLeft=snapshot.left;
  snapshot.element.scrollTop=snapshot.top;
  return true;
}

// Keep a focused Quadrant point in view, moving the document only when the
// point would be clipped or too close to a viewport edge.
export function revealInDocument(element, documentObject=document, margin=24) {
  const scrollingElement=documentObject?.scrollingElement,viewport=documentObject?.documentElement;
  if(!element?.getBoundingClientRect||!scrollingElement||!viewport?.clientWidth||!viewport?.clientHeight)return null;
  const rect=element.getBoundingClientRect(),gap=Math.max(0,Number.isFinite(margin)?margin:0);
  const insetX=Math.min(gap,Math.max(0,(viewport.clientWidth-rect.width)/2));
  const insetY=Math.min(gap,Math.max(0,(viewport.clientHeight-rect.height)/2));
  const deltaX=rect.left<insetX?rect.left-insetX:rect.right>viewport.clientWidth-insetX?rect.right-(viewport.clientWidth-insetX):0;
  const deltaY=rect.top<insetY?rect.top-insetY:rect.bottom>viewport.clientHeight-insetY?rect.bottom-(viewport.clientHeight-insetY):0;
  const maxLeft=Math.max(0,(scrollingElement.scrollWidth||viewport.scrollWidth||viewport.clientWidth)-viewport.clientWidth);
  const maxTop=Math.max(0,(scrollingElement.scrollHeight||viewport.scrollHeight||viewport.clientHeight)-viewport.clientHeight);
  const left=Math.max(0,Math.min(maxLeft,scrollingElement.scrollLeft+deltaX));
  const top=Math.max(0,Math.min(maxTop,scrollingElement.scrollTop+deltaY));
  if(left===scrollingElement.scrollLeft&&top===scrollingElement.scrollTop)return {left:0,top:0};
  const moved={left:left-scrollingElement.scrollLeft,top:top-scrollingElement.scrollTop};
  scrollingElement.scrollLeft=left;scrollingElement.scrollTop=top;
  return moved;
}
