import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh, readDataset, setValue} from './model.js';

test('temporary comparison values do not write into the imported E2R Dataset', () => {
  const dataset={
    version:'1.0',
    entities:[{id:'entity-1',name:'Read-only source Entity'}],
    events:[],
    relations:[],
  };
  const original=JSON.stringify(dataset);
  const state=fresh(readDataset(dataset));
  state.dimensions.push({id:'local-dimension',name:'Local Dimension',min:0,max:10});

  assert.equal(setValue(state,'entity-1','local-dimension',4.25),true);
  assert.equal(JSON.stringify(dataset),original);
  assert.deepEqual(state.values,{'entity-1':{'local-dimension':4.25}});
});

test('Dataset validation reads the Core object arrays without modifying their records', () => {
  const dataset={
    version:'1.0',
    entities:[{id:'entity-1',name:'Source Entity'}],
    events:[{id:'event-1'}],
    relations:[{id:'relation-1'}],
  };
  const original=JSON.stringify(dataset);

  assert.equal(readDataset(dataset),dataset);
  assert.equal(JSON.stringify(dataset),original);
});
