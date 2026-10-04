import test from 'node:test';
import assert from 'node:assert/strict';
import {authoredDecimalPlaces,decimalInterpolate,decimalAdd,presentDecimal} from './decimal-presentation.js';
import {randomDimensionValue} from './profile-random.js';
import {acceptsDimensionValue,fmt,valueAtRangePosition} from './model.js';

test('authored trailing zeros are hints; integer-looking endpoints are not precision zero',()=>{
  assert.equal(authoredDecimalPlaces('-1.00','+1.00'),2);
  assert.equal(authoredDecimalPlaces('-1.0','+1.000'),3);
  assert.equal(authoredDecimalPlaces('0.0001','0.0009'),4);
  assert.equal(authoredDecimalPlaces('-1','1'),null);
});
test('generated interpolation and keyboard addition avoid binary tails without rounding direct values',()=>{
  assert.equal(decimalInterpolate(-1,1,0.49),-0.02);
  assert.equal(valueAtRangePosition({min:-1,max:1},0.49),-0.02);
  assert.equal(decimalAdd(0.1,0.05),0.15);
  assert.equal(decimalInterpolate(0.0001,0.0009,0.5),0.0005);
  assert.equal(fmt(-0.020000000000000018),'-0.020000000000000018');
  assert.equal(fmt(1.2345678901234567),'1.2345678901234567');
});
test('random fallback and hints reach every grid candidate without changing input or display precision',()=>{
  for(const d of [{min:0,max:10},{min:-1,max:1},{min:-1,max:1,decimalPlaces:3},{min:.0001,max:.0009,decimalPlaces:4}]){
    const places=d.decimalPlaces??2,scale=10**places;
    const first=Math.round(d.min*scale),last=Math.round(d.max*scale),count=last-first+1;
    const seen=new Set();
    for(let i=0;i<count;i++)seen.add(randomDimensionValue(d,()=> (i+.5)/count));
    assert.equal(seen.size,count);
    for(let i=first;i<=last;i++)assert.ok(seen.has(Number(`${i}e-${places}`)));
  }
  assert.equal(randomDimensionValue({min:.001,max:.009},()=>.5),null);
  assert.equal(randomDimensionValue({min:-1e20,max:1e20,decimalPlaces:2}),null);
  assert.equal(randomDimensionValue({min:1e14,max:1e14+1,decimalPlaces:2}),null);
  assert.equal(randomDimensionValue({min:-45035996273704.96,max:45035996273704.96,decimalPlaces:2}),null);
  const integerDimension={min:-2.7,max:3.6,integerOnly:true,decimalPlaces:3};
  for(let i=0;i<6;i++)assert.equal(randomDimensionValue(integerDimension,()=> (i+.5)/6),i-2);
  assert.equal(fmt(1.2345678901234567,{min:0,max:10}),'1.2345678901234567');
  assert.equal(fmt(3,{min:0,max:10}),'3');
  assert.ok(acceptsDimensionValue({min:0,max:10},2.7531));
});
test('hinted random chooses in-range grid values independently of integer policy',()=>{
  for(const d of [{min:-1,max:1,decimalPlaces:2},{min:-1,max:1,decimalPlaces:3},{min:.0001,max:.0009,decimalPlaces:4},{min:-.007,max:-.002,decimalPlaces:3}]){
    for(let n=0;n<100;n++){const value=randomDimensionValue(d,()=>n/100);assert.ok(acceptsDimensionValue(d,value));assert.equal(Number(value.toFixed(d.decimalPlaces)),value);}
  }
  assert.equal(randomDimensionValue({min:-1,max:1,decimalPlaces:2,integerOnly:true},()=>.5),0);
  assert.equal(randomDimensionValue({min:.2,max:.8,decimalPlaces:2,integerOnly:true}),null);
  assert.equal(randomDimensionValue({min:-1,max:1},()=>.495),-.01);
});
test('presentation pads representable digits but never truncates records or creates input constraints',()=>{
  const d={min:-1,max:1,decimalPlaces:3};
  assert.equal(presentDecimal(.02,d),'0.020');
  assert.equal(presentDecimal(.12345,d),'0.12345');
  assert.equal(presentDecimal(-.020000000000000018,d),'-0.020000000000000018');
  assert.ok(acceptsDimensionValue(d,.12345));
  assert.equal(presentDecimal(0,d),'0.000');
  assert.equal(presentDecimal(null,d),'—');
  assert.equal(presentDecimal(1,{...d,integerOnly:true}),'1');
  assert.equal(presentDecimal(.0001,{...d,decimalPlaces:4}),'0.0001');
  assert.equal(presentDecimal(.02,{...d,decimalPlaces:101}),'0.02');
});
