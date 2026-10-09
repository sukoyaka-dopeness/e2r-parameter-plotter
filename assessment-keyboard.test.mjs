import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {adjustAssessmentByKeyboard, assessmentKeyboardStep, quadrantArrowAdjustment, quadrantKeyboardHelp, quadrantKeyboardValues, radarKeyboardStepStatus, rejectedKeyboardAdjustment} from './assessment-keyboard.js';
import {fresh, getValue, setValue} from './model.js';

test('Radar and Quadrant share a tenth-of-range step for decimal Dimensions',()=>{
 assert.equal(assessmentKeyboardStep({min:-1,max:1}),0.2);
 assert.equal(assessmentKeyboardStep({min:0,max:100}),10);
 assert.equal(assessmentKeyboardStep({min:0,max:0.7}),0.07);
 assert.equal(adjustAssessmentByKeyboard({min:0,max:12},5,1),6.2);
 assert.equal(adjustAssessmentByKeyboard({min:-8,max:8},-3.1,1),-1.5);
 assert.equal(adjustAssessmentByKeyboard({min:-8,max:8},0,-1),-1.6);
});

test('integer-only keyboard steps use the adopted threshold and nearest integer tenth',()=>{
 assert.equal(assessmentKeyboardStep({min:0,max:12,integerOnly:true}),1);
 assert.equal(assessmentKeyboardStep({min:0,max:100,integerOnly:true}),10);
 assert.equal(assessmentKeyboardStep({min:0,max:25,integerOnly:true}),3);
 const dimension={min:-2.7,max:3.6,integerOnly:true,decimalPlaces:2};
 assert.equal(assessmentKeyboardStep(dimension),1);
 assert.equal(adjustAssessmentByKeyboard(dimension,-2,1),-1);
 assert.equal(adjustAssessmentByKeyboard(dimension,2,-1),1);
 assert.equal(adjustAssessmentByKeyboard(dimension,3,1),null);
 assert.equal(adjustAssessmentByKeyboard({min:0,max:0.8,integerOnly:true},0,1),null);
});

test('keyboard edits reach valid endpoints, stop there, and never repair invalid existing values',()=>{
 const decimal={min:-1,max:1};
 assert.equal(adjustAssessmentByKeyboard(decimal,0.9,1),1);
 assert.equal(adjustAssessmentByKeyboard(decimal,1,1),null);
 assert.equal(adjustAssessmentByKeyboard(decimal,-0.9,-1),-1);
 assert.equal(adjustAssessmentByKeyboard(decimal,-1,-1),null);
 const integer={min:0,max:100,integerOnly:true};
 assert.equal(adjustAssessmentByKeyboard(integer,98,1),100);
 assert.equal(adjustAssessmentByKeyboard(integer,100,1),null);
 assert.equal(adjustAssessmentByKeyboard(integer,-1,1),null);
 assert.equal(adjustAssessmentByKeyboard(integer,101,-1),null);
});

test('Quadrant arrow directions target one selected axis and leave the other axis to its own operation',()=>{
 assert.deepEqual(quadrantArrowAdjustment('ArrowLeft','x','y'),{dimensionId:'x',direction:-1,axis:'X'});
 assert.deepEqual(quadrantArrowAdjustment('ArrowRight','x','y'),{dimensionId:'x',direction:1,axis:'X'});
 assert.deepEqual(quadrantArrowAdjustment('ArrowUp','x','y'),{dimensionId:'y',direction:1,axis:'Y'});
 assert.deepEqual(quadrantArrowAdjustment('ArrowDown','x','y'),{dimensionId:'y',direction:-1,axis:'Y'});
 assert.equal(quadrantArrowAdjustment('Enter','x','y'),null);
});

test('a Quadrant axis edit changes only the targeted recorded value and preserves zero and negative peers',()=>{
 const state=fresh({version:'1.0',entities:[{id:'e',name:'Elara'}],events:[],relations:[]});
 state.dimensions=[{id:'x',min:0,max:12},{id:'y',min:-4,max:6}];
 state.values={e:{x:5,y:-4}};
 const x=quadrantArrowAdjustment('ArrowRight','x','y'),next=adjustAssessmentByKeyboard(state.dimensions[0],getValue(state,'e',x.dimensionId),x.direction);
 assert.equal(next,6.2);assert.equal(setValue(state,'e',x.dimensionId,next),true);
 assert.deepEqual(state.values,{e:{x:6.2,y:-4}});
 const y=quadrantArrowAdjustment('ArrowUp','x','y'),nextY=adjustAssessmentByKeyboard(state.dimensions[1],getValue(state,'e',y.dimensionId),y.direction);
 assert.equal(nextY,-3);assert.equal(setValue(state,'e',y.dimensionId,nextY),true);
 assert.deepEqual(state.values,{e:{x:6.2,y:-3}});
});

test('Quadrant help and value announcements are localized while authored names and values remain literal',()=>{
 assert.match(quadrantKeyboardHelp('en'),/Left\/right adjust X; up\/down adjust Y/);
 assert.match(quadrantKeyboardHelp('ja'),/\u5de6\u53f3\u306fX\u8ef8/);
 assert.equal(quadrantKeyboardValues('en','Elara','Impact',0,'Concord',-4),'Elara. X Impact: 0; Y Concord: -4');
 assert.equal(quadrantKeyboardValues('ja','Elara','Impact',0,'Concord',-4),'Elara\u3002X\u8ef8 Impact: 0\u3001Y\u8ef8 Concord: -4');
 assert.match(rejectedKeyboardAdjustment('en','Elara','X',{min:0,max:12},12),/unchanged.*0 to 12.*Current value: 12/);
 assert.equal(radarKeyboardStepStatus('en','Impact','1.2'),'Impact selected · Arrow keys adjust Primary by 1.2. Secondary stays comparison-only.');
 assert.match(radarKeyboardStepStatus('ja','Impact','1.2'),/1\.2/);
});

test('Radar and Quadrant key routing ignores modified browser shortcuts and restores the edited target focus',async()=>{
 const source=await readFile(new URL('./main.js',import.meta.url),'utf8');
 assert.match(source,/if\(e\.altKey\|\|e\.ctrlKey\|\|e\.metaKey\|\|e\.shiftKey\)return;/);
 assert.match(source,/const point=s\.view==='Quadrant'\?e\.target\.closest\?\.\('\[data-point\]'\):null/);
 assert.match(source,/const id=point\.dataset\.point,\[xDimensionId,yDimensionId\]=s\.quadrant,adjustment=quadrantArrowAdjustment\(e\.key,xDimensionId,yDimensionId\)/);
 assert.match(source,/setValue\(s,id,adjustment\.dimensionId,next\)/);
 assert.match(source,/const pageScroll=captureDocumentScroll\(\);quadrantKeyboardEntity=id;/);
 assert.match(source,/root\.querySelector\(`\[data-point="\$\{CSS\.escape\(id\)\}"\]`\)\?\.focus\(\{preventScroll:true\}\);restoreDocumentScroll\(pageScroll\)/);
 assert.match(source,/if\(e\.altKey\|\|e\.ctrlKey\|\|e\.metaKey\|\|e\.shiftKey\)return;/);
 assert.match(source,/e\.preventDefault\(\);e\.stopImmediatePropagation\(\);/);
 assert.doesNotMatch(source,/0\.05/);
 assert.doesNotMatch(source,/setValue\(s,s\.selected,dim,clamp\(/);
 assert.doesNotMatch(source,/vertex&&\['ArrowUp','ArrowRight','ArrowDown','ArrowLeft'\]\.includes\(e\.key\)/);
});
