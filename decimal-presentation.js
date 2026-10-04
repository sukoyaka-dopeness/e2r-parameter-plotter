// Application-local decimal arithmetic for GENERATED values only. Stored/direct
// values remain JS numbers and are never repaired or rounded by these helpers.
const power = n => 10n ** BigInt(n);
function parts(value) {
  const [mantissa, exponent='0']=String(value).toLowerCase().split('e');
  const fraction=mantissa.split('.')[1]?.length||0;
  let integer=BigInt(mantissa.replace('.','')),places=fraction-Number(exponent);
  if(places<0){integer*=power(-places);places=0;}
  return {integer,places};
}
const numberFrom=(integer,places)=>Number(`${integer}e-${places}`);

export function authoredDecimalPlaces(minText,maxText) {
  const count=text=>text.trim().split('.')[1]?.length||0;
  const places=Math.max(count(minText),count(maxText));
  return places>0?places:null; // integer-looking bounds do NOT imply precision 0
}

export function decimalInterpolate(min,max,position) {
  const a=parts(min),b=parts(max),p=parts(position),places=Math.max(a.places,b.places);
  const low=a.integer*power(places-a.places),high=b.integer*power(places-b.places),denominator=power(p.places);
  return numberFrom(low*(denominator-p.integer)+high*p.integer,places+p.places);
}

export function decimalAdd(value,delta) {
  const a=parts(value),b=parts(delta),places=Math.max(a.places,b.places);
  return numberFrom(a.integer*power(places-a.places)+b.integer*power(places-b.places),places);
}

export function hintedRandom(min,max,places,random) {
  // Resource guard only; it is not a portable precision limit.
  if(!Number.isInteger(places)||places<1||places>100)return null;
  const scaled=value=>{const p=parts(value);return p.places<=places
    ? {integer:p.integer*power(places-p.places),remainder:0n}
    : {integer:p.integer/power(p.places-places),remainder:p.integer%power(p.places-places)};};
  const low=scaled(min),high=scaled(max);
  const first=low.integer+(low.remainder>0n?1n:0n),last=high.integer-(high.remainder<0n?1n:0n);
  if(first>last)return null;
  const count=last-first+1n;
  // A 53-bit sample must reach every candidate. Conservative magnitude guard
  // also keeps adjacent decimal ticks distinguishable as stored JS numbers.
  // Do not silently thin an unsafe grid or change its resolution.
  const magnitudeLimit=4503599627370496n;
  if(count>9007199254740992n||first < -magnitudeLimit||last>magnitudeLimit)return null;
  // Select a decimal-grid candidate without a binary multiply of the range.
  const sample=BigInt(Math.min(9007199254740991,Math.floor(random()*9007199254740992)));
  const value=numberFrom(first+sample*count/9007199254740992n,places);
  return Number.isFinite(value)&&value>=min&&value<=max?value:null;
}

export function presentDecimal(value,dimension) {
  if(value===null)return '—';
  if(Object.is(value,-0))value=0;
  const places=dimension?.decimalPlaces;
  if(dimension?.integerOnly===true||!Number.isInteger(places)||places<1||places>100)return String(value);
  const p=parts(value);
  // Pad only. Meaningful extra digits (including legacy tails) stay visible.
  if(p.places>places)return String(value);
  const sign=p.integer<0n?'-':'',digits=(p.integer<0n?-p.integer:p.integer).toString().padStart(p.places+1,'0');
  const whole=p.places?digits.slice(0,-p.places):digits;
  const fraction=p.places?digits.slice(-p.places):'';
  return sign+whole+'.'+fraction.padEnd(places,'0');
}
