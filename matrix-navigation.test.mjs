import test from 'node:test';
import assert from 'node:assert/strict';
import {matrixPageAfter} from './matrix-navigation.js';

test('Matrix page arrows wrap in both directions and between middle pages',()=>{
  assert.equal(matrixPageAfter(0,3,-1),2);
  assert.equal(matrixPageAfter(2,3,1),0);
  assert.equal(matrixPageAfter(1,3,1),2);
  assert.equal(matrixPageAfter(1,3,-1),0);
});

test('a single or absent page target stays at page zero without throwing',()=>{
  assert.equal(matrixPageAfter(0,1,1),0);
  assert.equal(matrixPageAfter(0,1,-1),0);
  assert.equal(matrixPageAfter(0,0,1),0);
  assert.equal(matrixPageAfter(Number.NaN,2,1),1);
});
