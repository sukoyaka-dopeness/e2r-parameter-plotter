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
