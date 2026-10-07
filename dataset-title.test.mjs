import test from 'node:test';
import assert from 'node:assert/strict';
import {applyDatasetTitle} from './dataset-title.js';
import {validateDataset} from './vendor/e2r-validator/index.js';

const candidateExample=()=>({
  version:'1.0',entities:[{id:'entity-a',name:'Entity A'}],events:[],relations:[],
  extensions:{
    'draft.github.sukoyaka-dopeness.dimension-assessment':{
      specVersion:'0.1.0',dimensions:[{id:'impact',name:'Impact',min:-2.7,max:3.6,integerOnly:true}],
      assessments:[{entityId:'entity-a',dimensionId:'impact',value:-2}]
    },
    'draft.github.sukoyaka-dopeness.specification':{
      specVersion:'0.1.0',uses:[{extension:'draft.github.sukoyaka-dopeness.dimension-assessment',version:'0.1.0'}]
    }
  }
});

test('Dataset title adds the required metadata declaration beside an existing Candidate declaration',()=>{
  const dataset=candidateExample();
  const originalCandidate=structuredClone(dataset.extensions['draft.github.sukoyaka-dopeness.dimension-assessment']);
  applyDatasetTitle(dataset,'Browser Preflight Dataset');
  assert.equal(validateDataset(dataset).valid,true);
  assert.equal(dataset.extensions.metadata.title,'Browser Preflight Dataset');
  assert.deepEqual(dataset.extensions['draft.github.sukoyaka-dopeness.dimension-assessment'],originalCandidate);
  assert.deepEqual(dataset.extensions['draft.github.sukoyaka-dopeness.specification'].uses,[
    {extension:'draft.github.sukoyaka-dopeness.dimension-assessment',version:'0.1.0'},
    {extension:'metadata',version:'1.0.0'}
  ]);
  applyDatasetTitle(dataset,'Revised Title');
  assert.equal(dataset.extensions['draft.github.sukoyaka-dopeness.specification'].uses.length,2);
});

test('clearing a title preserves unrelated metadata and declarations',()=>{
  const dataset=candidateExample();
  dataset.extensions.metadata={datasetId:'fixture-id',title:'Old Title'};
  dataset.extensions['draft.github.sukoyaka-dopeness.specification'].uses.push({extension:'metadata',version:'1.0.0'});
  applyDatasetTitle(dataset,'');
  assert.deepEqual(dataset.extensions.metadata,{datasetId:'fixture-id'});
  assert.equal(validateDataset(dataset).valid,true);
});
