import test from 'node:test';
import assert from 'node:assert/strict';
import {captureDocumentScroll, restoreDocumentScroll} from './viewport-scroll.js';

test('Quadrant rerender scroll preservation records and restores only document scroll position',()=>{
 const scrollingElement={scrollLeft:12,scrollTop:640};
 const snapshot=captureDocumentScroll({scrollingElement});
 scrollingElement.scrollLeft=0;scrollingElement.scrollTop=0;
 assert.equal(restoreDocumentScroll(snapshot),true);
 assert.deepEqual([scrollingElement.scrollLeft,scrollingElement.scrollTop],[12,640]);
 assert.equal(restoreDocumentScroll(null),false);
 assert.equal(captureDocumentScroll({}),null);
});
