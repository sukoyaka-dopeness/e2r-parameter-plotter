import test from 'node:test';
import assert from 'node:assert/strict';
import {randomDimensionValue} from './profile-random.js';

test('whole-number random values stay within integer points in the inclusive Dimension range', () => {
  const dimension = {min: -8.5, max: -2.2, integerOnly:true};
  assert.equal(randomDimensionValue(dimension, () => 0), -8);
  assert.equal(randomDimensionValue(dimension, () => 0.999999), -3);
  assert.ok(Number.isInteger(randomDimensionValue(dimension, () => 0.5)));
});

test('whole-number generation leaves ranges with no safe integer candidate unchanged', () => {
  assert.equal(randomDimensionValue({min: 0.2, max: 0.8, integerOnly:true}), null);
  assert.equal(randomDimensionValue({min: 1e20, max: 1e21, integerOnly:true}), null);
  assert.equal(randomDimensionValue({min: -Number.MAX_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER, integerOnly:true}), null);
});

test('decimal random generation remains range-derived and can return fractional values', () => {
  assert.equal(randomDimensionValue({min: 1, max: 8}, () => 0.5), 4.5);
  assert.equal(randomDimensionValue({min: 0.2, max: 0.8}, () => 0), 0.2);
});
