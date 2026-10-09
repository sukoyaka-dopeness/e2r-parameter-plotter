import test from 'node:test';
import assert from 'node:assert/strict';
import {captureDocumentScroll, restoreDocumentScroll, revealInDocument} from './viewport-scroll.js';

test('Quadrant rerender scroll preservation records and restores only document scroll position',()=>{
 const scrollingElement={scrollLeft:12,scrollTop:640};
 const snapshot=captureDocumentScroll({scrollingElement});
 scrollingElement.scrollLeft=0;scrollingElement.scrollTop=0;
 assert.equal(restoreDocumentScroll(snapshot),true);
 assert.deepEqual([scrollingElement.scrollLeft,scrollingElement.scrollTop],[12,640]);
 assert.equal(restoreDocumentScroll(null),false);
 assert.equal(captureDocumentScroll({}),null);
});

function revealFixture({left,top,width=30,height=30,scrollLeft=0,scrollTop=0,viewportWidth=390,viewportHeight=700,scrollWidth=1400,scrollHeight=1800}){
 const scrollingElement={scrollLeft,scrollTop,scrollWidth,scrollHeight};
 const documentObject={scrollingElement,documentElement:{clientWidth:viewportWidth,clientHeight:viewportHeight,scrollWidth,scrollHeight}};
 const element={getBoundingClientRect:()=>({left:left-scrollingElement.scrollLeft,top:top-scrollingElement.scrollTop,right:left-scrollingElement.scrollLeft+width,bottom:top-scrollingElement.scrollTop+height,width,height})};
 return {scrollingElement,documentObject,element};
}

test('Quadrant point inside the viewport stays still; a clipped point scrolls only the required document distance',()=>{
 const visible=revealFixture({left:160,top:520,scrollTop:300});
 assert.deepEqual(revealInDocument(visible.element,visible.documentObject),{left:0,top:0});
 assert.equal(visible.scrollingElement.scrollTop,300);

 const below=revealFixture({left:160,top:1030,scrollTop:300});
 assert.deepEqual(revealInDocument(below.element,below.documentObject),{left:0,top:84});
 assert.equal(below.scrollingElement.scrollTop,384);
 assert.deepEqual(revealInDocument(below.element,below.documentObject),{left:0,top:0});
});

test('Quadrant point at viewport edges is brought into view without oscillation or full-plot scrolling',()=>{
 const above=revealFixture({left:160,top:305,scrollTop:300});
 assert.deepEqual(revealInDocument(above.element,above.documentObject),{left:0,top:-19});
 assert.equal(above.scrollingElement.scrollTop,281);

 const beside=revealFixture({left:910,top:600,scrollLeft:120,scrollTop:300});
 assert.deepEqual(revealInDocument(beside.element,beside.documentObject),{left:454,top:0});
 assert.equal(beside.scrollingElement.scrollLeft,574);
});

test('Quadrant reveal respects document scroll limits and does nothing when no value update is made',()=>{
 const bottom=revealFixture({left:160,top:1790,scrollTop:1100,scrollHeight:1800});
 assert.deepEqual(revealInDocument(bottom.element,bottom.documentObject),{left:0,top:0});
 assert.equal(bottom.scrollingElement.scrollTop,1100);
});
