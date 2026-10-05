import test from 'node:test';
import assert from 'node:assert/strict';
import {dimensionRange, inDimensionRange, rangePosition, valueAtRangePosition, setValue, getValue, fmt, load, fresh} from './model.js';
import {parseFiniteDecimal, numericError} from './field-validation.js';

test('unbounded Prototype 1 Dimensions use a read-only legacy range', () => {
  const legacy = {id: 'legacy'};
  assert.deepEqual(dimensionRange(legacy), {min: -1, max: 1, legacy: true});
  assert.deepEqual(legacy, {id: 'legacy'});
  assert.equal(inDimensionRange(legacy, 0), true);
  assert.equal(inDimensionRange(legacy, 1.01), false);
});

test('successor load starts a new workspace instead of importing a Candidate B session', () => {
  const prior = globalThis.localStorage, session=globalThis.sessionStorage, values=new Map();
  globalThis.localStorage={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,String(value)),removeItem:key=>values.delete(key)};
  globalThis.sessionStorage={getItem:()=>JSON.stringify({dimensions:[{id:'legacy',name:'Legacy',low:'Low',high:'High'}],tempEntities:[{id:'t'}]})};
  try {
    const state = load();
    assert.deepEqual(state.dimensions,[]);
    assert.deepEqual(state.dataset.entities,[]);
  } finally {
    if (prior === undefined) delete globalThis.localStorage; else globalThis.localStorage = prior;
    if (session === undefined) delete globalThis.sessionStorage; else globalThis.sessionStorage = session;
  }
});

test('arbitrary negative, positive, asymmetric, and extreme finite ranges map to derived positions', () => {
  for (const [min, max] of [[-9, -2], [1, 8], [-4, 9], [1e-300, 8e-300], [1e200, 1e301], [-Number.MAX_VALUE, Number.MAX_VALUE]]) {
    const dimension = {min, max};
    assert.equal(rangePosition(dimension, min), 0);
    assert.equal(rangePosition(dimension, max), 1);
    const midpoint = valueAtRangePosition(dimension, 0.5);
    assert.ok(inDimensionRange(dimension, midpoint));
    assert.ok(Math.abs(rangePosition(dimension, midpoint) - 0.5) < 1e-12);
  }
  assert.equal(rangePosition({min: 1, max: 8}, 0), null);
  assert.equal(valueAtRangePosition({min: -4, max: 9}, 0.5), 2.5);
});

test('recorded values accept range endpoints and zero, reject out-of-range values, and clear to null', () => {
  const state = fresh({version:'1.0',entities:[{id:'e'}],events:[],relations:[]});
  state.dimensions=[{id: 'd', min: -4, max: 9}];
  assert.equal(setValue(state, 'e', 'd', -4), true);
  assert.equal(getValue(state, 'e', 'd'), -4);
  assert.equal(setValue(state, 'e', 'd', 0), true);
  assert.equal(getValue(state, 'e', 'd'), 0);
  assert.equal(setValue(state, 'e', 'd', 9), true);
  assert.equal(setValue(state, 'e', 'd', 9.01), false);
  assert.equal(getValue(state, 'e', 'd'), 9);
  assert.equal(setValue(state, 'e', 'd', null), true);
  assert.equal(getValue(state, 'e', 'd'), null);
});

test('finite decimal editing accepts endpoints and rejects notation, nonfinite, and range violations', () => {
  const dimension = {min: 1, max: 8};
  assert.equal(parseFiniteDecimal('1'), 1);
  assert.equal(parseFiniteDecimal('8'), 8);
  assert.equal(parseFiniteDecimal('1e3'), null);
  assert.equal(parseFiniteDecimal('Infinity'), null);
  assert.equal(numericError('1', false, dimension), null);
  assert.equal(numericError('8', false, dimension), null);
  assert.match(numericError('0.99', false, dimension), /outside this range/);
  assert.match(numericError('1e3', false, dimension), /finite decimal/);
});

test('value formatting retains precision and keeps explicit zero distinct from missing', () => {
  assert.equal(fmt(0), '0');
  assert.equal(fmt(null), '—');
  assert.equal(fmt(0.123456789), '0.123456789');
  assert.equal(fmt(1e-200), String(1e-200));
});
